// Approach: 1D DP - dp[j] = ways to form s2[0..j-1] as a subsequence of the s1 prefix processed so far.
// When characters match, dp[j] += dp[j-1] (take the match or skip). Iterate j backwards per s1 char.
// Time: O(n * m) Space: O(m)

class Solution {

    static int mod = 1000000007;

    public static int countWays(String s1, String s2) {
        int n = s1.length(), m = s2.length();
        // Base case: dp[0] = 1 represents an empty s2, which has 1 subsequence match
        int[] dp = new int[m + 1];
        dp[0] = 1;
        // Process s1 characters one by one
        for (int i = 1; i <= n; i++) {
            char charS1 = s1.charAt(i - 1);
            // Traverse backwards to use values from the previous 'i' iteration
            for (int j = m; j >= 1; j--) {

                if (charS1 == s2.charAt(j - 1)) {
                    dp[j] = (dp[j] + dp[j - 1]) % mod;
                }
                // 'else' condition is implicit since dp[j] keeps its previous row value
            }
        }

        return dp[m];
    }
}
