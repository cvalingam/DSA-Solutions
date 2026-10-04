// Approach: Each 1-cell adds 4 sides. Every shared side between two
// neighboring 1-cells hides one side from each, so it removes 2. Checking
// only the cell above and the cell to the left counts each shared side once.
// No recursion and no changes to the input.
// Complexity: O(n * m) time, O(1) extra space.
class Solution {
    static int findPerimeter(int[][] mat) {
        int perimeter = 0;
        for (int i = 0; i < mat.length; i++) {
            int[] row = mat[i];
            for (int j = 0; j < row.length; j++) {
                if (row[j] != 1)
                    continue;
                perimeter += 4;
                if (i > 0 && mat[i - 1][j] == 1)
                    perimeter -= 2;
                if (j > 0 && row[j - 1] == 1)
                    perimeter -= 2;
            }
        }
        return perimeter;
    }
}
