// Approach: At each step you can climb 1 or 2 stairs, so the number of ways to reach step n
// is the sum of ways to reach step n-1 and step n-2 - exactly the Fibonacci recurrence.
// Use two rolling variables (prev2, prev1) instead of an array to avoid O(n) extra space.
// Initialize prev2 = 1 (one way to stand at ground) and prev1 = 1 (one way to reach step 1).
// Iterate from step 2 to n: cur = prev1 + prev2, then shift: prev2 = prev1, prev1 = cur.
// The sequence is 1, 1, 2, 3, 5, 8, 13 ... identical to Fibonacci numbers.
// Time: O(n) Space: O(1)

public class Solution
{
    public int ClimbStairs(int n)
    {
        // int[] dp = new int[n + 1];
        // Array.Fill(dp, -1);
        // return topDown(n, dp);
        // return tabulation(n);
        return tabulationoptimized(n);
    }

    private int topDown(int ind, int[] dp)
    {
        if (ind < 0)
            return 0;

        if (ind == 0)
            return 1;

        if (dp[ind] != -1)
            return dp[ind];

        return dp[ind] = topDown(ind - 1, dp) + topDown(ind - 2, dp);
    }

    private int tabulation(int n)
    {
        int[] dp = new int[n + 1];
        dp[0] = 1;

        for (int ind = 1; ind <= n; ind++)
        {
            int firstStep = dp[ind - 1];
            int secondStep = 0;
            if (ind - 2 >= 0)
                secondStep = dp[ind - 2];

            dp[ind] = firstStep + secondStep;
        }

        return dp[n];
    }

    private int tabulationoptimized(int n)
    {
        int prev1 = 2;
        int prev0 = 1;
        int curr = 0;

        if (n <= 2)
            return Math.Max(1, n);

        for (int ind = 2; ind < n; ind++)
        {
            curr = prev1 + prev0;
            prev0 = prev1;
            prev1 = curr;
        }

        return curr;
    }
}