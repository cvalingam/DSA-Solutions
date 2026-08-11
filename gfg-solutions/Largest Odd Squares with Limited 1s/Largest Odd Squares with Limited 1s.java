// Approach: Build a 2D prefix sum of mat so any axis-aligned square sum is O(1).
// For each query center (r, c), the largest feasible odd side is 2*radius+1 where
// ones in the square stay <= k. Ones are non-decreasing as radius grows, so binary
// search the max radius in range, then map to side length (or -1 if even 1x1 fails).
// Time: O(n*m + Q*log(min(n,m))) Space: O(n*m)
import java.util.*;

class Solution {

    ArrayList<Integer> largestSquare(int[][] mat, int[][] queries, int k) {
        int n = mat.length;
        int m = mat[0].length;

        int[][] psum = new int[n + 1][m + 1];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                psum[i + 1][j + 1] =
                    mat[i][j] + psum[i][j + 1] + psum[i + 1][j] - psum[i][j];
            }
        }

        ArrayList<Integer> ans = new ArrayList<>(queries.length);

        for (int[] query : queries) {
            int row = query[0];
            int col = query[1];

            if (mat[row][col] > k) {
                ans.add(-1);
                continue;
            }

            int lo = 0;
            int hi = Math.min(Math.min(row, n - 1 - row), Math.min(col, m - 1 - col));
            int best = 0;

            while (lo <= hi) {
                int mid = (lo + hi) >>> 1;
                if (squareOnes(psum, row, col, mid) <= k) {
                    best = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }

            ans.add(2 * best + 1);
        }

        return ans;
    }

    private int squareOnes(int[][] psum, int row, int col, int radius) {
        int r1 = row - radius;
        int c1 = col - radius;
        int r2 = row + radius;
        int c2 = col + radius;
        return psum[r2 + 1][c2 + 1] - psum[r1][c2 + 1] - psum[r2 + 1][c1] + psum[r1][c1];
    }
}
