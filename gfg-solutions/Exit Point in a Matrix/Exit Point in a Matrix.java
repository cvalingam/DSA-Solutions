// Approach: Simulate ray movement from (0,0). On a 1, move in the current direction and turn
// clockwise; on a 0, keep the previous direction. The exit cell is the last in-bounds position.
// Time: O(n * m) Space: O(1)

import java.util.*;

class Solution {

    public List<Integer> exitPoint(int[][] mat) {
        int tempExitRow = -1;
        int tempExitCol = -1;

        int currRow = 0;
        int currCol = 0;

        int n = mat.length;
        int m = mat[0].length;

        int[][] clockDir = {{1, 0}, {0, -1}, {-1, 0}, {0, 1}};

        int i = 0;

        while (currRow >= 0 && currRow < n && currCol >= 0 && currCol < m) {
            tempExitRow = currRow;
            tempExitCol = currCol;

            if (mat[currRow][currCol] == 0) {
                int k = (i - 1 + 4) % 4;
                currRow += clockDir[k][0];
                currCol += clockDir[k][1];
            } else {
                mat[currRow][currCol] = 0;
                currRow += clockDir[i][0];
                currCol += clockDir[i][1];
                i = (i + 1) % 4;
            }
        }
        List<Integer> exitCell = new ArrayList<>();
        exitCell.add(tempExitRow);
        exitCell.add(tempExitCol);

        return exitCell;
    }
}
