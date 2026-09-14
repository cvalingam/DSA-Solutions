// Approach: Mark landmines and their 4-neighbors unsafe. Multi-source BFS from
// every safe cell in column 0; first time we reach column m-1 is the shortest.
// Mark visited by clearing isSafe on enqueue.
// Complexity: O(n * m) time and O(n * m) extra space.
import java.util.*;

class Solution {

    public static int shortestPath(int[][] mat) {
        int n = mat.length;
        if (n == 0) {
            return -1;
        }
        int m = mat[0].length;
        int[] dx = {-1, 1, 0, 0};
        int[] dy = {0, 0, -1, 1};

        boolean[][] safe = new boolean[n][m];
        for (int i = 0; i < n; i++) {
            Arrays.fill(safe[i], true);
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (mat[i][j] != 0) {
                    continue;
                }
                safe[i][j] = false;
                for (int k = 0; k < 4; k++) {
                    int ni = i + dx[k];
                    int nj = j + dy[k];
                    if (ni >= 0 && ni < n && nj >= 0 && nj < m) {
                        safe[ni][nj] = false;
                    }
                }
            }
        }

        Queue<int[]> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (safe[i][0]) {
                safe[i][0] = false;
                q.offer(new int[]{i, 0});
            }
        }

        int dist = 1;
        while (!q.isEmpty()) {
            int size = q.size();
            while (size-- > 0) {
                int[] cur = q.poll();
                int r = cur[0];
                int c = cur[1];
                if (c == m - 1) {
                    return dist;
                }
                for (int k = 0; k < 4; k++) {
                    int nr = r + dx[k];
                    int nc = c + dy[k];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < m && safe[nr][nc]) {
                        safe[nr][nc] = false;
                        q.offer(new int[]{nr, nc});
                    }
                }
            }
            dist++;
        }

        return -1;
    }
}
