// Approach: gain[i] counts other items whose factor is a multiple of
// factor_i (factor frequencies + multiples). The first gain[i] copies of i
// are value-2 marginal units; later copies are value 1. Keep only value-2
// units with price < 2 * minPrice, sort those batches by price, take them
// greedily, then spend leftover budget on cheapest value-1 copies.
// Time: O(n log n) Space: O(n)

public class Solution
{
    public int MaximumSaleItems(int[][] items, int budget)
    {
        int maxF = 0;
        long minP = long.MaxValue;
        foreach (int[] item in items)
        {
            if (item[0] > maxF)
                maxF = item[0];
            if (item[1] < minP)
                minP = item[1];
        }

        int[] freq = new int[maxF + 1];
        foreach (int[] item in items)
            ++freq[item[0]];

        int[] total = new int[maxF + 1];
        for (int i = 1; i <= maxF; ++i)
        {
            if (freq[i] == 0)
                continue;
            for (int j = i; j <= maxF; j += i)
                total[i] += freq[j];
        }

        var bonusByPrice = new Dictionary<int, long>();
        long limit = 2 * minP;
        foreach (int[] item in items)
        {
            int price = item[1];
            if (price >= limit)
                continue;
            int gifts = total[item[0]] - 1;
            if (gifts <= 0)
                continue;
            bonusByPrice[price] = bonusByPrice.GetValueOrDefault(price) + gifts;
        }

        var prices = new List<int>(bonusByPrice.Keys);
        prices.Sort();

        long rem = budget;
        long ans = 0;
        foreach (int p in prices)
        {
            if (rem < p)
                break;
            long take = Math.Min(rem / p, bonusByPrice[p]);
            ans += take * 2;
            rem -= take * p;
        }

        ans += rem / minP;
        return (int)ans;
    }
}
