// Approach: Only a down step spends a move; left, right, and up are free.
// 0-1 BFS from (r, c) stores the fewest downs to each cell. For a cell at
// row i, ups = downs + (startRow - i) by net vertical displacement. Count
// cells with downs <= d and ups <= u.
// Complexity: O(n * m) time and O(n * m) space.

import java.util.*;

class Solution {

    public int numberOfCells(int r, int c, int u, int d, char[][] mat) {
        int n = mat.length;
        int m = mat[0].length;

        if (mat[r][c] == '#') {
            return 0;
        }

        int[][] dist = new int[n][m];

        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], Integer.MAX_VALUE);
        }

        Deque<int[]> dq = new ArrayDeque<>();

        dist[r][c] = 0;
        dq.addFirst(new int[]{r, c});

        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        while (!dq.isEmpty()) {
            int[] cur = dq.pollFirst();
            int x = cur[0];
            int y = cur[1];

            for (int k = 0; k < 4; k++) {
                int nx = x + dr[k];
                int ny = y + dc[k];

                if (nx < 0 || nx >= n || ny < 0 || ny >= m) {
                    continue;
                }

                if (mat[nx][ny] == '#') {
                    continue;
                }

                int cost = (nx > x) ? 1 : 0;

                if (dist[x][y] + cost < dist[nx][ny]) {
                    dist[nx][ny] = dist[x][y] + cost;

                    if (cost == 0) {
                        dq.addFirst(new int[]{nx, ny});
                    } else {
                        dq.addLast(new int[]{nx, ny});
                    }
                }
            }
        }

        int ans = 0;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (mat[i][j] == '#') {
                    continue;
                }

                if (dist[i][j] == Integer.MAX_VALUE) {
                    continue;
                }

                int downMoves = dist[i][j];
                int upMoves = downMoves + r - i;

                if (downMoves <= d && upMoves <= u) {
                    ans++;
                }
            }
        }

        return ans;
    }
}
