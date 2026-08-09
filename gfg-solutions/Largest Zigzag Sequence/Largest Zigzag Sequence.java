// Approach: Pick one cell per row top to bottom; consecutive picks must use
// different columns. dp[i][j] = mat[i][j] + max(dp[i-1][k] for k != j). Maintain
// the top two values of the previous row (and the column of the largest) so each
 // row fills in O(n) instead of O(n^2) per cell.
// Time: O(n^2) Space: O(n^2)
class Solution {

    public int zigzagSequence(int[][] mat) {
        int n = mat.length;
        int[][] dp = new int[n][n];

        for (int j = 0; j < n; j++) {
            dp[0][j] = mat[0][j];
        }

        for (int i = 1; i < n; i++) {
            int max1 = -1, max2 = -1, col1 = -1;
            for (int k = 0; k < n; k++) {
                if (dp[i - 1][k] > max1) {
                    max2 = max1;
                    max1 = dp[i - 1][k];
                    col1 = k;
                } else if (dp[i - 1][k] > max2) {
                    max2 = dp[i - 1][k];
                }
            }

            for (int j = 0; j < n; j++) {
                dp[i][j] = mat[i][j] + (j != col1 ? max1 : max2);
            }
        }

        int maxSum = Integer.MIN_VALUE;
        for (int j = 0; j < n; j++) {
            maxSum = Math.max(maxSum, dp[n - 1][j]);
        }
        return maxSum;
    }
}
