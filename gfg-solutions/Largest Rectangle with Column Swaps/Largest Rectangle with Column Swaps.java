// Approach: Consecutive-1 heights per column with each row as the bottom.
// Column swaps mean any order of those heights is allowed, so for minimum
// height h the width is the count of columns with height >= h. Counting sort
// over 0..n builds that in linear time; track max h * width.
// Complexity: O(n * (m + n)) time and O(m + n) extra space.

class Solution {

    public int maxArea(int[][] mat) {
        int n = mat.length;
        int m = mat[0].length;
        int[] heights = new int[m];
        int[] freq = new int[n + 1];
        int result = 0;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                heights[j] = mat[i][j] == 1 ? heights[j] + 1 : 0;
            }

            for (int h = 0; h <= n; h++) {
                freq[h] = 0;
            }
            for (int h : heights) {
                freq[h]++;
            }

            int width = 0;
            for (int h = n; h >= 1; h--) {
                width += freq[h];
                if (width > 0) {
                    result = Math.max(result, h * width);
                }
            }
        }

        return result;
    }
}
