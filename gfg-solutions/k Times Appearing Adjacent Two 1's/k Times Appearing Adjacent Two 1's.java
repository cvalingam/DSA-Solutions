// Approach: DP on length i, last bit (0/1), and count of adjacent "11" substrings so far.
// Append 0: no new pair. Append 1 after 0: no new pair. Append 1 after 1: increment pair count.
// Time: O(n * k) Space: O(n * k)

class Solution {

    public int countStrings(int n, int k) {
        int[][][] dp = new int[n + 1][2][k + 1];
        dp[1][0][0] = dp[1][1][0] = 1;
        int mod = 1000000007;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j <= k; j++) {
                dp[i + 1][0][j] = (dp[i + 1][0][j] + dp[i][0][j]) % mod;
                dp[i + 1][1][j] = (dp[i + 1][1][j] + dp[i][0][j]) % mod;
                dp[i + 1][0][j] = (dp[i + 1][0][j] + dp[i][1][j]) % mod;
                if (j + 1 <= k) {
                    dp[i + 1][1][j + 1] = (dp[i + 1][1][j + 1] + dp[i][1][j]) % mod;
                }
            }
        }
        
        return (dp[n][0][k] + dp[n][1][k]) % mod;
    }
}
