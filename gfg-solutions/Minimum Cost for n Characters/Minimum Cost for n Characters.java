// Approach: dp[x] = min cost to build x identical characters. Extend by one
// (dp[x-1] + i), or copy from half (dp[x/2] + c when even). For odd x, copy
// from floor or ceil half and pay one insert or one delete to fix the length.
// Complexity: O(n) time and O(n) extra space.

class Solution {

    public int minCost(int n, int i, int d, int c) {
        int[] dp = new int[n + 1];
        dp[0] = 0;

        for (int x = 1; x <= n; x++) {
            dp[x] = dp[x - 1] + i;

            if (x % 2 == 0) {
                dp[x] = Math.min(dp[x], dp[x / 2] + c);
            } else {
                dp[x] = Math.min(dp[x], dp[x / 2] + c + i);
                dp[x] = Math.min(dp[x], dp[x / 2 + 1] + c + d);
            }
        }

        return dp[n];
    }
}
