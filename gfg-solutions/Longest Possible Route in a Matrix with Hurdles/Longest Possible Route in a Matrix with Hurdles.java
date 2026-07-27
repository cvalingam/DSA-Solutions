// Approach: DFS + backtracking - explore all 4-direction paths on free cells (1), mark
// visited to avoid cycles, unmark on return. Track max edge count when destination is reached.
// Time: O(4^(r*c)) worst case Space: O(r*c)

class Solution {

    private int maxEdges;
    private int rows;
    private int cols;
    private static final int[] dx = {-1, 1, 0, 0};
    private static final int[] dy = {0, 0, -1, 1};

    public int longestPath(int[][] mat, int xs, int ys, int xd, int yd) {
        rows = mat.length;
        cols = mat[0].length;

        // Edge case: start and destination are the same
        if (xs == xd && ys == yd) {
            return mat[xs][ys] == 1 ? 0 : -1;
        }

        // If start or destination is blocked
        if (mat[xs][ys] == 0 || mat[xd][yd] == 0) {
            return -1;
        }

        maxEdges = -1;
        boolean[][] visited = new boolean[rows][cols];

        // Start DFS, initial path length (nodes) = 1
        dfs(mat, xs, ys, xd, yd, 1, visited);

        // Return edges (nodes - 1)
        return maxEdges == -1 ? -1 : maxEdges;
    }

    private void dfs(int[][] mat, int x, int y, int xd, int yd, int currentNodes, boolean[][] visited) {
        if (x == xd && y == yd) {
            int edges = currentNodes - 1;
            if (edges > maxEdges) {
                maxEdges = edges;
            }
            return;
        }

        visited[x][y] = true;

        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i];
            int ny = y + dy[i];

            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols
                    && mat[nx][ny] == 1 && !visited[nx][ny]) {
                dfs(mat, nx, ny, xd, yd, currentNodes + 1, visited);
            }
        }

        // Backtrack
        visited[x][y] = false;
    }
}
