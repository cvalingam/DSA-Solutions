// Approach: Binary search the answer x. Count how many distinct amounts <= mid
// via inclusion-exclusion over coin-subset LCMs (add odd subsets, subtract even).
// Precompute each subset's LCM once with a +/- sign.
// Complexity: O(2^n * n + 2^n * log(k * minCoin)) time, O(2^n) space.
public class Solution
{
    public long FindKthSmallest(int[] coins, int k)
    {
        long[] signedLcms = BuildSignedLcms(coins);
        long lo = 1;
        long hi = (long)k * coins.Min();

        while (lo < hi)
        {
            long mid = lo + (hi - lo) / 2;
            if (CountUpTo(signedLcms, mid) >= k)
                hi = mid;
            else
                lo = mid + 1;
        }

        return lo;
    }

    private long CountUpTo(long[] signedLcms, long m)
    {
        long res = 0;
        foreach (long signed in signedLcms)
        {
            long lcm = Math.Abs(signed);
            if (lcm > m)
                continue;
            res += m / lcm * Math.Sign(signed);
        }
        return res;
    }

    private long[] BuildSignedLcms(int[] coins)
    {
        int n = coins.Length;
        int maxMask = 1 << n;
        var list = new List<long>(maxMask - 1);

        for (int mask = 1; mask < maxMask; mask++)
        {
            long lcm = 1;
            int bits = 0;
            for (int i = 0; i < n; i++)
            {
                if ((mask & (1 << i)) == 0)
                    continue;
                bits++;
                lcm = Lcm(lcm, coins[i]);
            }
            list.Add((bits & 1) == 1 ? lcm : -lcm);
        }

        return list.ToArray();
    }

    private long Lcm(long a, long b) => a / Gcd(a, b) * b;

    private long Gcd(long a, long b)
    {
        while (b != 0)
        {
            long t = a % b;
            a = b;
            b = t;
        }
        return a;
    }
}
