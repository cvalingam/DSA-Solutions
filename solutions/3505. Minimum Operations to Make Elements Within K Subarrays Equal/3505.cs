// Approach: The cheapest way to equalize a window of length x is to move
// every value to its median. Values are ranked, and two Fenwick trees track
// the count and the sum at each rank inside the sliding window. Binary
// lifting on the count tree finds the median rank, so each window cost is
// a logarithmic update. Two rolling rows then choose k non overlapping
// windows. Products that build a cost stay in 64 bit integers.
// Time: O(n log n + n * k) Space: O(n)

public class Solution
{
    private const long Inf = long.MaxValue / 4;

    public long MinOperations(int[] nums, int x, int k)
    {
        int n = nums.Length;
        int[] values = (int[])nums.Clone();
        Array.Sort(values);
        int unique = 0;
        for (int i = 0; i < n; i++)
        {
            if (unique == 0 || values[i] != values[unique - 1])
                values[unique++] = values[i];
        }

        int[] ranks = new int[n];
        for (int i = 0; i < n; i++)
            ranks[i] = Array.BinarySearch(values, 0, unique, nums[i]) + 1;

        int[] counts = new int[unique + 1];
        long[] sums = new long[unique + 1];
        long total = 0;
        for (int i = 0; i < x; i++)
        {
            Add(counts, sums, ranks[i], nums[i], 1);
            total += nums[i];
        }

        int jump = 1;
        while ((jump << 1) <= unique)
            jump <<= 1;

        int windowCount = n - x + 1;
        long[] costs = new long[windowCount];
        for (int left = 0; left < windowCount; left++)
        {
            int rank = FindMedian(counts, sums, (x + 1) >> 1, jump, out int belowCount, out long belowSum);
            long median = values[rank - 1];
            int rightCount = x - belowCount;
            long rightSum = total - belowSum;
            costs[left] = median * belowCount - belowSum + rightSum - median * rightCount;

            if (left + 1 < windowCount)
            {
                Add(counts, sums, ranks[left], nums[left], -1);
                Add(counts, sums, ranks[left + x], nums[left + x], 1);
                total += (long)nums[left + x] - nums[left];
            }
        }

        long[] prev = new long[n + 1];
        long[] curr = new long[n + 1];
        for (int group = 1; group <= k; group++)
        {
            curr[0] = Inf;
            for (int i = 1; i <= n; i++)
            {
                long best = curr[i - 1];
                if (i >= x)
                    best = Math.Min(best, prev[i - x] + costs[i - x]);
                curr[i] = best;
            }
            (prev, curr) = (curr, prev);
        }
        return prev[n];
    }

    private static void Add(int[] counts, long[] sums, int index, int value, int delta)
    {
        while (index < counts.Length)
        {
            counts[index] += delta;
            sums[index] += (long)value * delta;
            index += index & -index;
        }
    }

    private static int FindMedian(int[] counts, long[] sums, int target, int jump, out int belowCount, out long belowSum)
    {
        int index = 0;
        belowCount = 0;
        belowSum = 0;
        while (jump > 0)
        {
            int next = index + jump;
            if (next < counts.Length && belowCount + counts[next] < target)
            {
                index = next;
                belowCount += counts[next];
                belowSum += sums[next];
            }
            jump >>= 1;
        }
        return index + 1;
    }
}
