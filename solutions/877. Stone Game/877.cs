// Approach: Same minimax interval DP as Predict the Winner. dp[j] for interval
// [i, j] is the best score gap (current picker minus opponent) under optimal play.
// Expand by length; each end pick yields pile value minus the opponent's gap on the
// leftover segment. Alice wins on the full array when the gap is strictly positive.
// Complexity: O(n^2) time and O(n) space.
public class Solution
{
    public bool StoneGame(int[] piles)
    {
        int n = piles.Length;
        int[] dp = (int[])piles.Clone();

        for (int d = 1; d < n; ++d)
            for (int j = n - 1; j - d >= 0; --j)
            {
                int i = j - d;
                dp[j] = Math.Max(piles[i] - dp[j], piles[j] - dp[j - 1]);
            }

        return dp[n - 1] > 0;
    }
}
