// Approach: For every length in [l, r], slide a fixed window across nums and
// keep the smallest window sum that is still positive. Integer sums cannot
// beat 1, so the search stops as soon as that value appears. With n at most
// 100 the quadratic scan is already the tight practical bound.
// Time: O(n · (r - l + 1)) Space: O(1)

public class Solution
{
    public int MinimumSumSubarray(IList<int> nums, int l, int r)
    {
        int n = nums.Count;
        int ans = int.MaxValue;

        for (int windowSize = l; windowSize <= r; ++windowSize)
        {
            int sum = 0;
            for (int i = 0; i < windowSize; ++i)
                sum += nums[i];
            if (sum > 0)
                ans = Math.Min(ans, sum);

            for (int i = windowSize; i < n; ++i)
            {
                sum += nums[i] - nums[i - windowSize];
                if (sum > 0)
                    ans = Math.Min(ans, sum);
            }

            if (ans == 1)
                return 1;
        }

        return ans == int.MaxValue ? -1 : ans;
    }
}
