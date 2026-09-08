// Approach: From each cell matching word[0], try all 8 straight directions with
// offset arrays. Walk while characters match. Record the start once per cell.
// Complexity: O(m * n * L) time and O(1) extra space, L = word length.
import java.util.*;

class Solution {

    private static final int[] DR = {-1, -1, -1, 0, 0, 1, 1, 1};
    private static final int[] DC = {-1, 0, 1, -1, 1, -1, 0, 1};

    private boolean matches(char[][] mat, String word, int r, int c, int dr, int dc) {
        int n = mat.length;
        int m = mat[0].length;

        for (int k = 0; k < word.length(); k++) {
            if (r < 0 || r >= n || c < 0 || c >= m || mat[r][c] != word.charAt(k)) {
                return false;
            }
            r += dr;
            c += dc;
        }
        return true;
    }

    public ArrayList<ArrayList<Integer>> searchWord(char[][] mat, String word) {
        ArrayList<ArrayList<Integer>> result = new ArrayList<>();
        if (word.isEmpty()) {
            return result;
        }

        int n = mat.length;
        int m = mat[0].length;
        char first = word.charAt(0);

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (mat[i][j] != first) {
                    continue;
                }
                for (int d = 0; d < 8; d++) {
                    if (matches(mat, word, i, j, DR[d], DC[d])) {
                        result.add(new ArrayList<>(Arrays.asList(i, j)));
                        break;
                    }
                }
            }
        }
        return result;
    }
}
