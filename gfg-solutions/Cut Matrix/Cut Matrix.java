class Solution {
    // Approach: Count ways to cut the matrix into k pieces so each piece has at
    // least one filled cell. Build a bottom-right suffix sum of filled cells.
    // Let dp[rem][r][c] be ways to cut the submatrix starting at (r,c) into rem
    // pieces. Base rem=1 is 1 iff the suffix is non-empty. For rem>1, binary-search
    // the first horizontal/vertical cut that peels off at least one filled cell,
    // then sum remaining (rem-1)-piece answers with row/column suffix sums of dp.
    // Complexity: O(k·n·m·log(max(n,m))) time and O(k·n·m) space.
    public int findWays(int[][] matrix, int k) {
        int n = matrix.length;
        int m = matrix[0].length;
        int MOD = 1000000007;

        int[][] suff = new int[n + 1][m + 1];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) {
                suff[i][j] = matrix[i][j] + suff[i + 1][j] + suff[i][j + 1] - suff[i + 1][j + 1];
            }
        }

        int[][][] dp = new int[k + 1][n][m];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < m; c++) {
                if (suff[r][c] > 0) {
                    dp[1][r][c] = 1;
                }
            }
        }

        for (int rem = 2; rem <= k; rem++) {
            int[][] dpSumRow = new int[n + 1][m];
            int[][] dpSumCol = new int[n][m + 1];

            for (int r = n - 1; r >= 0; r--) {
                for (int c = m - 1; c >= 0; c--) {
                    dpSumRow[r][c] = (dp[rem - 1][r][c] + dpSumRow[r + 1][c]) % MOD;
                    dpSumCol[r][c] = (dp[rem - 1][r][c] + dpSumCol[r][c + 1]) % MOD;
                }
            }

            for (int r = 0; r < n; r++) {
                for (int c = 0; c < m; c++) {
                    if (suff[r][c] == 0) 
                        continue;
                    long totalWays = 0;
                    int next_r = findNextRow(suff, r, c, n);
                    if (next_r < n) {
                        totalWays = (totalWays + dpSumRow[next_r][c]) % MOD;
                    }
                    
                    int next_c = findNextCol(suff, r, c, m);
                    if (next_c < m) {
                        totalWays = (totalWays + dpSumCol[r][next_c]) % MOD;
                    }

                    dp[rem][r][c] = (int) totalWays;
                }
            }
        }
        return dp[k][0][0];
    }

    private int findNextRow(int[][] suff, int r, int c, int n) {
        int low = r + 1, high = n, ans = n;
        int target = suff[r][c];
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (suff[mid][c] < target) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }

    private int findNextCol(int[][] suff, int r, int c, int m) {
        int low = c + 1, high = m, ans = m;
        int target = suff[r][c];
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (suff[r][mid] < target) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
}