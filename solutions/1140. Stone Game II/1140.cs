// Approach: Bottom-up game DP. suffix[i] = sum(piles[i..n)). dp[i][m] = max
// stones the current player gets from piles[i..] with parameter M = m. Take
// X in 1..2m piles; opponent then gets dp[i+X][max(m,X)], so you keep
// suffix[i] - that amount. If 2m covers the rest of the array, take everything.
// Cap m at (n+1)/2: larger M never changes the answer once 2M >= remaining.
// Complexity: O(n^3) time (typical for this DP), O(n^2) space.
public class Solution
{
    public int StoneGameII(int[] piles)
    {
        int n = piles.Length;
        int[] suffix = new int[n];
        suffix[n - 1] = piles[n - 1];
        for (int i = n - 2; i >= 0; --i)
            suffix[i] = suffix[i + 1] + piles[i];

        // mMax is enough: once 2*m >= remaining piles, base case applies.
        int mMax = (n + 1) / 2;
        int[,] dp = new int[n, mMax + 1];

        for (int i = n - 1; i >= 0; --i)
        {
            int remaining = n - i;
            for (int m = 1; m <= mMax; ++m)
            {
                if (2 * m >= remaining)
                {
                    dp[i, m] = suffix[i];
                    continue;
                }

                int best = 0;
                int takeLimit = 2 * m;
                for (int x = 1; x <= takeLimit; ++x)
                {
                    int nextM = Math.Max(m, x);
                    if (nextM > mMax)
                        nextM = mMax;
                    best = Math.Max(best, suffix[i] - dp[i + x, nextM]);
                }
                dp[i, m] = best;
            }
        }

        return dp[0, 1];
    }
}
