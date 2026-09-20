// Approach: Precompute consecutive 'X' counts ending at each cell leftward
// (hor) and upward (ver). For every bottom-right corner, try side lengths
// from min(hor, ver) down to the best so far; a side-k square is valid when
// the left vertical and top horizontal borders also have length >= k.
// Complexity: O(n^3) time, O(n^2) space (standard for bordered squares).
class Solution {
    public int largestSubsquare(char[][] mat) {
        int n = mat.length;
        if (n == 0)
            return 0;
        int m = mat[0].length;

        int[][] hor = new int[n][m];
        int[][] ver = new int[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (mat[i][j] != 'X')
                    continue;
                hor[i][j] = (j > 0 ? hor[i][j - 1] : 0) + 1;
                ver[i][j] = (i > 0 ? ver[i - 1][j] : 0) + 1;
            }
        }

        int best = 0;
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) {
                int size = Math.min(hor[i][j], ver[i][j]);
                while (size > best) {
                    // left vertical border and top horizontal border
                    if (ver[i][j - size + 1] >= size && hor[i - size + 1][j] >= size) {
                        best = size;
                        break;
                    }
                    size--;
                }
            }
        }
        return best;
    }
}
