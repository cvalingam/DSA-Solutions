// Approach: Count length-n sequences with values in 1..m where each adjacent
// pair (a, b) satisfies a divides b or b divides a. Memoize on (filled length,
// last value); from last, try every next i that is compatible (or any i if last
// is the sentinel 0). A sequence is valid once filled length reaches n.
// Time: O(n*m^2) Space: O(n*m)
class Solution {

    private int solve(int n, int m, int len, int last, int[][] dp) {
        if (len == n) {
            return 1;
        }

        if (dp[len][last] != -1) {
            return dp[len][last];
        }

        int ans = 0;
        for (int i = 1; i <= m; i++) {
            if (last == 0 || i % last == 0 || last % i == 0) {
                ans += solve(n, m, len + 1, i, dp);
            }
        }

        return dp[len][last] = ans;
    }

    public int count(int n, int m) {
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                dp[i][j] = -1;
            }
        }
        return solve(n, m, 0, 0, dp);
    }
}
