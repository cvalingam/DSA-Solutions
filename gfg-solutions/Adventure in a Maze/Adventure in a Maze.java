// Approach: From each cell, 1 = right only, 2 = down only, 3 = both. DP from
// the destination: paths[j] / best[j] hold ways and max path sum for the row
// below (then the current row). Process bottom-up, right-to-left so "right"
// neighbors are already in the new row and "down" neighbors stay in the old
// row - O(n) extra memory instead of full n x n tables.
// Complexity: O(n^2) time and O(n) space.

import java.util.*;

class Solution {

    static final int MOD = 1_000_000_007;

    public ArrayList<Integer> findWays(int[][] grid) {
        int n = grid.length;
        long[] paths = new long[n];
        int[] best = new int[n];

        // Bottom row: can only move right toward the exit.
        paths[n - 1] = 1;
        best[n - 1] = grid[n - 1][n - 1];
        for (int j = n - 2; j >= 0; j--) {
            int g = grid[n - 1][j];
            if ((g == 1 || g == 3) && paths[j + 1] > 0) {
                paths[j] = paths[j + 1];
                best[j] = g + best[j + 1];
            }
        }

        for (int i = n - 2; i >= 0; i--) {
            long[] nextPaths = new long[n];
            int[] nextBest = new int[n];

            for (int j = n - 1; j >= 0; j--) {
                int g = grid[i][j];
                long cnt = 0;
                int mx = -1;

                if ((g == 1 || g == 3) && j + 1 < n && nextPaths[j + 1] > 0) {
                    cnt = nextPaths[j + 1];
                    mx = g + nextBest[j + 1];
                }
                if ((g == 2 || g == 3) && paths[j] > 0) {
                    cnt = (cnt + paths[j]) % MOD;
                    mx = Math.max(mx, g + best[j]);
                }

                nextPaths[j] = cnt;
                if (mx != -1) {
                    nextBest[j] = mx;
                }
            }

            paths = nextPaths;
            best = nextBest;
        }

        ArrayList<Integer> ans = new ArrayList<>(2);
        ans.add((int) (paths[0] % MOD));
        ans.add(best[0]);
        return ans;
    }
}
