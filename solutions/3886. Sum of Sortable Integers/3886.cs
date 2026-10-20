// Approach: k is sortable when every block of length k is a cyclic shift of a
// non-decreasing sequence and the blocks' value ranges nest in order. A block
// is such a shift iff it has at most one strict circular descent. After each
// block is rotated into sorted order, the concatenation is globally sorted iff
// at every block start the max of the prefix before it is <= the min of the
// suffix from there. Prefetch prefix maxima, suffix minima, and linear descent
// counts so each block is checked in O(1) while enumerating the divisors of n.
// Time: O(n + d(n) * (n/k avg)) = O(n) Space: O(n)

public class Solution
{
    public int SortableIntegers(int[] nums)
    {
        int n = nums.Length;
        int[] prefMax = new int[n + 1];
        for (int i = 0; i < n; i++)
            prefMax[i + 1] = Math.Max(prefMax[i], nums[i]);

        int[] suffMin = new int[n + 1];
        suffMin[n] = int.MaxValue;
        for (int i = n - 1; i >= 0; i--)
            suffMin[i] = Math.Min(nums[i], suffMin[i + 1]);

        int[] prefDrop = new int[n];
        for (int i = 1; i < n; i++)
            prefDrop[i] = prefDrop[i - 1] + (nums[i - 1] > nums[i] ? 1 : 0);

        int ans = 0;
        for (int d = 1; d <= n / d; d++)
        {
            if (n % d != 0)
                continue;
            if (Check(nums, prefMax, suffMin, prefDrop, d))
                ans += d;
            int other = n / d;
            if (other != d && Check(nums, prefMax, suffMin, prefDrop, other))
                ans += other;
        }
        return ans;
    }

    private static bool Check(int[] nums, int[] prefMax, int[] suffMin, int[] prefDrop, int k)
    {
        int n = nums.Length;
        for (int start = 0; start < n; start += k)
        {
            int end = start + k - 1;
            int drops = prefDrop[end] - prefDrop[start];
            if (nums[end] > nums[start])
                drops++;
            if (drops > 1 || prefMax[start] > suffMin[start])
                return false;
        }
        return true;
    }
}
