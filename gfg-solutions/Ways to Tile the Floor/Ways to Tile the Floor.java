// Approach: Process rows top to bottom. If i < m, only horizontal tiles fit (one way).
// At i = m: all-horizontal or all-vertical gives 2 ways. For i > m: extend with one
// horizontal row (dp[i-1]) or add a vertical strip block of height m (dp[i-m]).
// Time: O(n) Space: O(n)

class Solution {

    public int countWays(int n, int m) {
        int mod = 1_000_000_007;
        int[] dp = new int[n + 1];

        for (int i = 1; i <= n; i++) {
            if (i > m) {
                dp[i] = (dp[i - 1] + dp[i - m]) % mod;
            } else if (i < m) {
                dp[i] = 1;
            } else {
                dp[i] = 2;
            }
        }

        return dp[n];
    }
}
