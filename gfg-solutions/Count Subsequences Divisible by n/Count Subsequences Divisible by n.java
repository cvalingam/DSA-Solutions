// Approach: dp[r] = number of non-empty subsequences whose decimal value is
// congruent to r (mod n). For each digit, either skip it (copy dp), append it
// to every existing subsequence (r -> (10*r + d) % n), or start a new one-
// digit subsequence. Answer is dp[0] mod 1e9+7.
// Complexity: O(|s| * n) time and O(n) extra space.

class Solution {

    public int countSubsequences(String s, int n) {
        final int MOD = 1_000_000_007;
        long[] dp = new long[n];
        long[] next = new long[n];

        for (int i = 0; i < s.length(); i++) {
            int d = s.charAt(i) - '0';
            System.arraycopy(dp, 0, next, 0, n);

            for (int r = 0; r < n; r++) {
                long ways = dp[r];
                if (ways == 0) {
                    continue;
                }
                int nr = (int) ((r * 10L + d) % n);
                next[nr] = (next[nr] + ways) % MOD;
            }

            int dr = d % n;
            next[dr] = (next[dr] + 1) % MOD;

            long[] tmp = dp;
            dp = next;
            next = tmp;
        }

        return (int) dp[0];
    }
}
