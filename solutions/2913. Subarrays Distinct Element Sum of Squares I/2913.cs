// Approach: Sweep the right end r and let c[l] be the distinct count of
// nums[l..r]. Adding nums[r] raises c[l] by 1 for every l after the previous
// occurrence of nums[r]. Since (c + 1)^2 - c^2 = 2c + 1, the sum of squares
// over all l grows by 2 * (sum of c over that range) + (range length). So only
// range add and range sum are needed, which two Fenwick trees answer
// iteratively. The running sum of squares is the total for subarrays ending at
// r, and those totals add up to the answer.
// Time: O(n log n) Space: O(n + V), where V is the number of distinct values

public class Solution
{
    private long[] b1;
    private long[] b2;
    private int size;

    public int SumCounts(IList<int> nums)
    {
        const int kMod = 1_000_000_007;
        int n = nums.Count;
        size = n;
        b1 = new long[n + 1];
        b2 = new long[n + 1];
        var lastSeen = new Dictionary<int, int>();

        long squares = 0;
        long ans = 0;
        for (int r = 1; r <= n; r++)
        {
            int l = lastSeen.TryGetValue(nums[r - 1], out int prev) ? prev + 1 : 1;
            lastSeen[nums[r - 1]] = r;
            squares += 2 * (Prefix(r) - Prefix(l - 1)) + (r - l + 1);
            Add(l, 1);
            Add(r + 1, -1);
            ans = (ans + squares) % kMod;
        }
        return (int)ans;
    }

    private void Add(int i, long x)
    {
        long shifted = x * (i - 1);
        for (; i <= size; i += i & -i)
        {
            b1[i] += x;
            b2[i] += shifted;
        }
    }

    private long Prefix(int i)
    {
        long s1 = 0, s2 = 0;
        for (int j = i; j > 0; j -= j & -j)
        {
            s1 += b1[j];
            s2 += b2[j];
        }
        return s1 * i - s2;
    }
}
