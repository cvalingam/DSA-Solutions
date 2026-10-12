// Approach: The operation moves set bits between numbers without changing how
// many times each bit appears. Squares reward concentration, so greedily pack
// bits into as few numbers as possible. Count each bit; the j-th built number
// (0-indexed) has bit b exactly when more than j inputs had it. Sum the
// squares of the first k built numbers, stopping early once they become 0.
// Time: O(n log M + k log M) Space: O(log M)

public class Solution
{
    public int MaxSum(IList<int> nums, int k)
    {
        const int MOD = 1_000_000_007;
        const int BITS = 30;
        int[] count = new int[BITS];
        int maxCount = 0;

        foreach (int num in nums)
        {
            uint x = (uint)num;
            while (x != 0)
            {
                int b = System.Numerics.BitOperations.TrailingZeroCount(x);
                if (++count[b] > maxCount)
                    maxCount = count[b];
                x &= x - 1;
            }
        }

        long ans = 0;
        int limit = Math.Min(k, maxCount);
        for (int j = 0; j < limit; j++)
        {
            long value = 0;
            for (int b = 0; b < BITS; b++)
                if (count[b] > j)
                    value |= 1L << b;
            ans = (ans + value * value) % MOD;
        }
        return (int)ans;
    }
}
