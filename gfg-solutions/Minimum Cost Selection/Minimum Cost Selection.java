// Approach: Paint-house DP with 3 choices per row. dp[j] = min cost to paint
// row i with color j, using a different color on row i-1. Roll three states per
// row instead of a full table.
// Complexity: O(n) time and O(1) extra space (n = number of rows).

class Solution {

    public int minCost(int[][] mat) {
        int prev0 = mat[0][0];
        int prev1 = mat[0][1];
        int prev2 = mat[0][2];

        for (int i = 1; i < mat.length; i++) {
            int curr0 = mat[i][0] + Math.min(prev1, prev2);
            int curr1 = mat[i][1] + Math.min(prev0, prev2);
            int curr2 = mat[i][2] + Math.min(prev0, prev1);

            prev0 = curr0;
            prev1 = curr1;
            prev2 = curr2;
        }

        return Math.min(prev0, Math.min(prev1, prev2));
    }
}
