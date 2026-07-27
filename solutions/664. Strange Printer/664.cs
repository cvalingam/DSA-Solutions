// Approach: Interval DP - dp[i][j] = min turns to print s[i..j]; if s[k]==s[i]
// for some k in (i,j], we can extend the first print to cover position k for free.
// Time: O(n³) Space: O(n²)

public class Solution
{
    public int StrangePrinter(string s)
    {
        int n = s.Length;
        int[][] dp = new int[n][];

        for (int i = 0; i < n; i++)
        {
            int[] row = new int[n];
            Array.Fill(row, -1);
            dp[i] = row;
        }

        return topDown(s, 0, n - 1, dp);
    }

    private int topDown(string s, int i, int j, int[][] dp)
    {
        if (i > j)
            return 0;

        if (dp[i][j] != -1)
            return dp[i][j];

        dp[i][j] = topDown(s, i + 1, j, dp) + 1;

        for (int k = i + 1; k <= j; k++)
        {
            if (s[k] == s[i])
            {
                int val = topDown(s, i, k - 1, dp) + topDown(s, k + 1, j, dp);
                dp[i][j] = Math.Min(dp[i][j], val);
            }
        }

        return dp[i][j];
    }
}