// Approach: Treat each cell as a node with an edge to every strictly larger
// neighbor. That graph has no cycles, and the longest increasing path is the
// number of layers in a topological peel. Cells with no smaller neighbor
// form the first layer. Removing a layer lowers the count of smaller
// neighbors for the cells it touches, and cells reaching zero form the next
// layer. The queue is iterative, so a long path cannot overflow the stack.
// Complexity: O(n * m) time, O(n * m) extra space.
class Solution {
    private static final int[] DR = { -1, 1, 0, 0 };
    private static final int[] DC = { 0, 0, -1, 1 };

    public int longIncPath(int[][] matrix, int n, int m) {
        int total = n * m;
        int[] smaller = new int[total];
        int[] queue = new int[total];
        int tail = 0;

        for (int r = 0; r < n; r++) {
            for (int c = 0; c < m; c++) {
                int v = matrix[r][c];
                int cnt = 0;
                for (int d = 0; d < 4; d++) {
                    int nr = r + DR[d];
                    int nc = c + DC[d];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < m && matrix[nr][nc] < v)
                        cnt++;
                }
                smaller[r * m + c] = cnt;
                if (cnt == 0)
                    queue[tail++] = r * m + c;
            }
        }

        int head = 0;
        int layers = 0;
        while (head < tail) {
            layers++;
            int end = tail;
            while (head < end) {
                int cell = queue[head++];
                int r = cell / m;
                int c = cell % m;
                int v = matrix[r][c];
                for (int d = 0; d < 4; d++) {
                    int nr = r + DR[d];
                    int nc = c + DC[d];
                    if (nr < 0 || nr >= n || nc < 0 || nc >= m || matrix[nr][nc] <= v)
                        continue;
                    int id = nr * m + nc;
                    if (--smaller[id] == 0)
                        queue[tail++] = id;
                }
            }
        }
        return layers;
    }
}
