// Approach: Precompute cost[i][j] as the fewest changes that make s[i..j] a
// semi-palindrome: try every proper divisor d of the length and count
// mismatches along each residue class stepped by d. Then dp[i][j] is the
// fewest changes to split s[i:] into j semi-palindromes, taking the best
// first cut s[i..l]. Each part needs length at least 2, so later cuts leave
// room for the remaining parts.
// Time: O(n^3) Space: O(n^2)

public class Solution
{
    public int MinimumChanges(string s, int k)
    {
        int n = s.Length;
        List<int>[] factors = GetFactors(n);
        int[,] cost = GetCost(s, n, factors);
        int[,] dp = new int[n + 1, k + 1];

        for (int i = 0; i <= n; ++i)
            for (int j = 0; j <= k; ++j)
                dp[i, j] = n;
        dp[n, 0] = 0;

        for (int i = n - 1; i >= 0; --i)
        {
            for (int j = 1; j <= k; ++j)
            {
                // Leave at least 2 characters for each of the remaining j - 1 parts.
                int maxL = n - 1 - 2 * (j - 1);
                for (int l = i + 1; l <= maxL; ++l)
                    dp[i, j] = Math.Min(dp[i, j], dp[l + 1, j - 1] + cost[i, l]);
            }
        }

        return dp[0, k];
    }

    private static List<int>[] GetFactors(int n)
    {
        var factors = new List<int>[n + 1];
        for (int i = 1; i <= n; ++i)
            factors[i] = new List<int> { 1 };
        for (int d = 2; d < n; ++d)
            for (int i = d * 2; i <= n; i += d)
                factors[i].Add(d);
        return factors;
    }

    private static int[,] GetCost(string s, int n, List<int>[] factors)
    {
        int[,] cost = new int[n, n];
        for (int i = 0; i < n; ++i)
        {
            for (int j = i + 1; j < n; ++j)
            {
                int length = j - i + 1;
                int minCost = length;
                foreach (int d in factors[length])
                    minCost = Math.Min(minCost, ChangeCost(s, i, j, d));
                cost[i, j] = minCost;
            }
        }
        return cost;
    }

    private static int ChangeCost(string s, int i, int j, int d)
    {
        int cost = 0;
        for (int offset = 0; offset < d; ++offset)
        {
            int l = i + offset;
            int r = j - d + 1 + offset;
            while (l < r)
            {
                if (s[l] != s[r])
                    ++cost;
                l += d;
                r -= d;
            }
        }
        return cost;
    }
}
