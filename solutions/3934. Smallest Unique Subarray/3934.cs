// Approach: A unique subarray of length L implies one exists for every larger
// length, so binary search on L. Prefix double hashes make each window O(1);
// for a fixed L count all window hashes and accept if any frequency is 1.
// Powers and prefixes are built once outside the search.
// Time: O(n log n) Space: O(n)

public class Solution
{
    private const long Mod1 = 1_000_000_007L;
    private const long Mod2 = 1_000_000_009L;
    private const long Base1 = 100003L;
    private const long Base2 = 100019L;

    public int SmallestUniqueSubarray(int[] nums)
    {
        int n = nums.Length;
        long[] pow1 = new long[n + 1];
        long[] pow2 = new long[n + 1];
        long[] pref1 = new long[n + 1];
        long[] pref2 = new long[n + 1];

        pow1[0] = pow2[0] = 1;
        for (int i = 0; i < n; i++)
        {
            pow1[i + 1] = pow1[i] * Base1 % Mod1;
            pow2[i + 1] = pow2[i] * Base2 % Mod2;
            pref1[i + 1] = (pref1[i] * Base1 + nums[i]) % Mod1;
            pref2[i + 1] = (pref2[i] * Base2 + nums[i]) % Mod2;
        }

        int lo = 1, hi = n;
        while (lo < hi)
        {
            int mid = lo + (hi - lo) / 2;
            if (HasUnique(mid, n, pow1, pow2, pref1, pref2))
                hi = mid;
            else
                lo = mid + 1;
        }

        return lo;
    }

    private static bool HasUnique(int len, int n, long[] pow1, long[] pow2,
                                  long[] pref1, long[] pref2)
    {
        var freq = new Dictionary<(long, long), int>();

        for (int i = 0; i + len <= n; i++)
        {
            long h1 = pref1[i + len] - pref1[i] * pow1[len] % Mod1;
            if (h1 < 0)
                h1 += Mod1;
            long h2 = pref2[i + len] - pref2[i] * pow2[len] % Mod2;
            if (h2 < 0)
                h2 += Mod2;

            var key = (h1, h2);
            freq[key] = freq.GetValueOrDefault(key) + 1;
        }

        foreach (int c in freq.Values)
        {
            if (c == 1)
                return true;
        }

        return false;
    }
}
