// Approach: Breadth first search from the knight over board squares. Each
// square is one int (row * n + col) in a flat array queue, so no objects are
// allocated. Levels are processed as a block, and the first time a move lands
// on the target, the current level + 1 is the minimum. If the queue empties
// first, the target is unreachable (small boards like n = 3 have such squares).
// Complexity: O(n^2) time, O(n^2) extra space.
class Solution {
    private static final int[] DX = { 1, 2, 2, 1, -1, -2, -2, -1 };
    private static final int[] DY = { 2, 1, -1, -2, -2, -1, 1, 2 };

    public int minStepToReachTarget(int knightPos[], int targetPos[], int n) {
        int kx = knightPos[0] - 1;
        int ky = knightPos[1] - 1;
        int tx = targetPos[0] - 1;
        int ty = targetPos[1] - 1;
        if (kx == tx && ky == ty)
            return 0;

        boolean[] seen = new boolean[n * n];
        int[] queue = new int[n * n];
        int head = 0;
        int tail = 0;
        queue[tail++] = kx * n + ky;
        seen[kx * n + ky] = true;

        for (int steps = 1; head < tail; steps++) {
            int levelEnd = tail;
            while (head < levelEnd) {
                int cell = queue[head++];
                int cx = cell / n;
                int cy = cell % n;
                for (int d = 0; d < 8; d++) {
                    int nx = cx + DX[d];
                    int ny = cy + DY[d];
                    if (nx < 0 || ny < 0 || nx >= n || ny >= n)
                        continue;
                    if (nx == tx && ny == ty)
                        return steps;
                    int id = nx * n + ny;
                    if (!seen[id]) {
                        seen[id] = true;
                        queue[tail++] = id;
                    }
                }
            }
        }
        return -1;
    }
}
