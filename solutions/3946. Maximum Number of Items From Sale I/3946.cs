// Approach: A first purchase of type i yields that copy plus one free copy of
// every type whose factor is a multiple of factor_i. Later copies only spend
// leftover budget on the cheapest price. Model first purchases as a 0-1
// knapsack (cost = price, value = multiples count). Precompute those counts
// with a multiples sieve over factor frequencies, then for each spend s add
// floor((budget - s) / minPrice).
// Time: O(R log R + n * budget) Space: O(R + budget)

public class Solution
{
    public int MaximumSaleItems(int[][] items, int budget)
    {
        int maxF = 0;
        int mn = int.MaxValue;
        foreach (int[] item in items)
        {
            if (item[0] > maxF)
                maxF = item[0];
            if (item[1] < mn)
                mn = item[1];
        }

        int[] freq = new int[maxF + 1];
        foreach (int[] item in items)
            ++freq[item[0]];

        int[] total = new int[maxF + 1];
        for (int i = 1; i <= maxF; ++i)
        {
            for (int j = i; j <= maxF; j += i)
                total[i] += freq[j];
        }

        int[] dp = new int[budget + 1];
        foreach (int[] item in items)
        {
            int price = item[1];
            int cnt = total[item[0]];
            for (int j = budget; j >= price; --j)
                dp[j] = Math.Max(dp[j], dp[j - price] + cnt);
        }

        int ans = 0;
        for (int i = 0; i <= budget; ++i)
            ans = Math.Max(ans, dp[i] + (budget - i) / mn);

        return ans;
    }
}
