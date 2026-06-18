// Approach: For each 0-cell, count how many of its four orthogonal neighbors are 1.
// Each adjacent 1 contributes one to the total coverage. Sum over all zeros in the matrix.
// Time: O(n*m) Space: O(1)
class Solution {

    public int FindCoverage(int[][] matrix) {
        int cnt = 0;
        int n = matrix.length;
        int m = matrix[0].length;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (matrix[i][j] == 0) {
                    if (j > 0 && matrix[i][j - 1] == 1) {
                        cnt++;
                    }

                    if (i < n - 1 && matrix[i + 1][j] == 1) {
                        cnt++;
                    }

                    if (j < m - 1 && matrix[i][j + 1] == 1) {
                        cnt++;
                    }

                    if (i > 0 && matrix[i - 1][j] == 1) {
                        cnt++;
                    }
                }
            }
        }

        return cnt;
    }
}
