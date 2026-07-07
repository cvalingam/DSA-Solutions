// Approach: Collect blocked row/col indices, add boundaries 0 and n+1 / m+1, sort, and take
// the maximum gap between consecutive blockers in each dimension. Answer = maxRowGap * maxColGap.
// Time: O(k log k) Space: O(k)  (k = number of blocked cells)

import java.util.*;

class Solution {

    public int largestArea(int n, int m, int[][] arr) {
        List<Integer> blockedRows = new ArrayList<>();
        List<Integer> blockedCols = new ArrayList<>();

        for (int[] cell : arr) {
            blockedRows.add(cell[0]);
            blockedCols.add(cell[1]);
        }

        // Add boundaries (0 and n+1 for rows, 0 and m+1 for cols)
        blockedRows.add(0);
        blockedRows.add(n + 1);
        blockedCols.add(0);
        blockedCols.add(m + 1);

        // Sort them
        Collections.sort(blockedRows);
        Collections.sort(blockedCols);

        // Find maximum gap in rows
        int maxRowGap = 0;
        for (int i = 1; i < blockedRows.size(); i++) {
            maxRowGap = Math.max(maxRowGap, blockedRows.get(i) - blockedRows.get(i - 1) - 1);
        }

        // Find maximum gap in columns
        int maxColGap = 0;
        for (int i = 1; i < blockedCols.size(); i++) {
            maxColGap = Math.max(maxColGap, blockedCols.get(i) - blockedCols.get(i - 1) - 1);
        }

        // Largest rectangle area
        return maxRowGap * maxColGap;
    }
}
