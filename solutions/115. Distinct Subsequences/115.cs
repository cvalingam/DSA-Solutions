// Approach: dp[j] = ways to form t[0..j-1] using processed prefix of s. When
// s[i] matches t[j-1], extend prior matches (dp[j-1]) or skip s[i] (dp[j]).
// Scan j right to left so dp[j-1] still holds the previous row.
// Complexity: O(m * n) time and O(n) extra space.
public class Solution
{
    public int NumDistinct(string s, string t)
    {
        int m = s.Length;
        int n = t.Length;
        if (n > m)
            return 0;

        int[] dp = new int[n + 1];
        dp[0] = 1;

        for (int i = 1; i <= m; i++)
        {
            for (int j = n; j >= 1; j--)
            {
                if (s[i - 1] == t[j - 1])
                    dp[j] += dp[j - 1];
            }
        }

        return dp[n];
    }
}
