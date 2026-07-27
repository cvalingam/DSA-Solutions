// Approach: Precompute canReach[r][c] via DP (decreasing r+c). Greedily pick the first
// valid move (shortest jump, right before down) that still reaches the destination - same
// path as ordered backtracking but O(n^2 * maxJump) instead of exponential.
// Time: O(n^2 * maxJump) Space: O(n^2)

import java.util.*;

class Solution {

    public ArrayList<ArrayList<Integer>> shortestDist(int[][] mat) {
        int n = mat.length;
        if (mat[0][0] == 0) {
            return noPath();
        }

        boolean[][] canReach = new boolean[n][n];
        canReach[n - 1][n - 1] = true;

        for (int sum = 2 * n - 3; sum >= 0; sum--) {
            for (int r = 0; r < n; r++) {
                int c = sum - r;
                if (c < 0 || c >= n || mat[r][c] == 0) {
                    continue;
                }

                int maxJump = mat[r][c];
                for (int jump = 1; jump <= maxJump; jump++) {
                    int right = c + jump;
                    if (right < n && mat[r][right] != 0 && canReach[r][right]) {
                        canReach[r][c] = true;
                        break;
                    }
                    int down = r + jump;
                    if (down < n && mat[down][c] != 0 && canReach[down][c]) {
                        canReach[r][c] = true;
                        break;
                    }
                }
            }
        }

        if (!canReach[0][0]) {
            return noPath();
        }

        int[][] path = new int[n][n];
        path[0][0] = 1;
        int r = 0, c = 0;

        while (r != n - 1 || c != n - 1) {
            boolean moved = false;
            int maxJump = mat[r][c];

            for (int jump = 1; jump <= maxJump; jump++) {
                int right = c + jump;
                if (right < n && mat[r][right] != 0 && canReach[r][right]) {
                    c = right;
                    path[r][c] = 1;
                    moved = true;
                    break;
                }
                int down = r + jump;
                if (down < n && mat[down][c] != 0 && canReach[down][c]) {
                    r = down;
                    path[r][c] = 1;
                    moved = true;
                    break;
                }
            }

            if (!moved) {
                return noPath();
            }
        }

        return toList(path);
    }

    private ArrayList<ArrayList<Integer>> noPath() {
        ArrayList<ArrayList<Integer>> res = new ArrayList<>();
        ArrayList<Integer> row = new ArrayList<>();
        row.add(-1);
        res.add(row);
        return res;
    }

    private ArrayList<ArrayList<Integer>> toList(int[][] path) {
        ArrayList<ArrayList<Integer>> result = new ArrayList<>();
        for (int[] row : path) {
            ArrayList<Integer> list = new ArrayList<>();
            for (int x : row) {
                list.add(x);
            }
            result.add(list);
        }
        return result;
    }
}
