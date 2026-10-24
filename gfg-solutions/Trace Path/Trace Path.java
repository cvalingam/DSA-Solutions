// Approach: The commands fix the shape of the path, and the start cell only
// shifts that shape. Track the row and column offsets of every position,
// including the start. The path fits in the grid exactly when the row span
// is at most n and the column span is at most m.
// Complexity: O(|s|) time, O(1) extra space.
class Solution {
    public boolean isPossible(int n, int m, String s) {
        int row = 0, col = 0;
        int minRow = 0, maxRow = 0, minCol = 0, maxCol = 0;
        for (int i = 0; i < s.length(); i++) {
            switch (s.charAt(i)) {
                case 'L': col--; break;
                case 'R': col++; break;
                case 'D': row--; break;
                default: row++; break;
            }
            if (row < minRow) minRow = row;
            else if (row > maxRow) maxRow = row;
            if (col < minCol) minCol = col;
            else if (col > maxCol) maxCol = col;
        }
        return maxRow - minRow < n && maxCol - minCol < m;
    }
}
