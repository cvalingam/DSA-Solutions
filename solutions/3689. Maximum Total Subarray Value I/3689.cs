// Approach: The best value of any subarray is bounded by the global maximum minus the
// global minimum. Since k subarrays can reuse/overlap the optimal range, multiply that
// single best value by k.
// Time: O(n) Space: O(1)

public class Solution
{
    public long MaxTotalValue(int[] nums, int k)
    {
        int mx = int.MinValue, mn = int.MaxValue;
        foreach (int x in nums)
        {
            mx = Math.Max(mx, x);
            mn = Math.Min(mn, x);
        }
        return (long)k * (mx - mn);
    }
}
