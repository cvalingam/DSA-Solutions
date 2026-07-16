// Approach: DP memoization — helper(n, sum) = ways to fill n remaining digits with digit-sum
// sum. Try digits 0–9; when only 1 digit left (MSD), skip 0 to ban leading zeros. Return -1 if 0.
// Time: O(n * sum) Space: O(n * sum)

class Solution {

    public int countWays(int n, int sum) {
        int[][] dp = new int[n + 1][sum + 1];
        // fill dp array with -1
        for (int i = 0; i < n + 1; i++) {
            for (int j = 0; j < sum + 1; j++) {
                dp[i][j] = -1;
            }
        }
        int res = helper(n, sum, dp);
        return res == 0 ? -1 : res;
    }

    private int helper(int n, int sum, int[][] dp) {

        if (n == 0) {
            if (sum == 0) {
                return 1;
            }
            return 0;
        }

        if (sum < 0) {
            return 0;
        }

        if (dp[n][sum] != -1) {
            return dp[n][sum];
        }

        int res = 0;

        for (int j = 0; j <= 9; j++) {
            // n-digit number cannot have leading zeros
            if (n == 1 && j == 0) {
                continue;
            }
            res = res + helper(n - 1, sum - j, dp);
        }

        return dp[n][sum] = res;

    }
};
