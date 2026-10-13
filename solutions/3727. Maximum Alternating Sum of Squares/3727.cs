// Approach: After rearranging, n / 2 squares are subtracted and the rest are
// added, so subtract the n / 2 smallest squares. That gives the total of all
// squares minus twice the sum of the smallest half. A square only depends on
// |x|, so counting absolute values replaces the sort, and walking the counts
// from 0 upward collects the smallest half.
// Time: O(n + V) Space: O(V), where V is the largest |nums[i]|

public class Solution
{
    public long MaxAlternatingSum(int[] nums)
    {
        int maxAbs = 0;
        long total = 0;
        foreach (int x in nums)
        {
            int a = x < 0 ? -x : x;
            if (a > maxAbs)
                maxAbs = a;
            total += (long)a * a;
        }

        int[] count = new int[maxAbs + 1];
        foreach (int x in nums)
            count[x < 0 ? -x : x]++;

        long smallest = 0;
        int need = nums.Length / 2;
        for (int v = 0; need > 0; v++)
        {
            int take = Math.Min(count[v], need);
            smallest += (long)take * v * v;
            need -= take;
        }
        return total - 2 * smallest;
    }
}
