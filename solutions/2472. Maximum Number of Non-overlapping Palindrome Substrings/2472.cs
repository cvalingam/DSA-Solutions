// Approach: Only palindromes of length k or k+1 matter: any longer one
// contains a shorter valid palindrome, which is never worse for maximizing
// count. DP[i] = best using s[0..i). Rolling hashes make each check O(1).
// Complexity: O(n) time and O(n) extra space.
public class Solution
{
    private const long Mod = 1_000_000_007L;
    private const long Base = 131L;

    public int MaxPalindromes(string s, int k)
    {
        int n = s.Length;
        long[] pow = new long[n + 1];
        long[] pref = new long[n + 1];
        long[] suff = new long[n + 1];

        pow[0] = 1;
        for (int i = 0; i < n; i++)
        {
            pow[i + 1] = pow[i] * Base % Mod;
            pref[i + 1] = (pref[i] * Base + s[i]) % Mod;
            suff[i + 1] = (suff[i] * Base + s[n - 1 - i]) % Mod;
        }

        int[] dp = new int[n + 1];
        for (int i = k; i <= n; i++)
        {
            dp[i] = dp[i - 1];
            if (IsPalindrome(pref, suff, pow, n, i - k, i - 1))
                dp[i] = Math.Max(dp[i], 1 + dp[i - k]);
            if (IsPalindrome(pref, suff, pow, n, i - k - 1, i - 1))
                dp[i] = Math.Max(dp[i], 1 + dp[i - k - 1]);
        }

        return dp[n];
    }

    private static bool IsPalindrome(long[] pref, long[] suff, long[] pow, int n, int l, int r)
    {
        if (l < 0)
            return false;
        return GetHash(pref, pow, l, r) == GetHash(suff, pow, n - 1 - r, n - 1 - l);
    }

    private static long GetHash(long[] h, long[] pow, int l, int r)
    {
        long val = (h[r + 1] - h[l] * pow[r - l + 1]) % Mod;
        return val < 0 ? val + Mod : val;
    }
}
