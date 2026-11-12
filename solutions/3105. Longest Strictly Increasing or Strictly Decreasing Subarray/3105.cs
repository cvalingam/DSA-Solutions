// Approach: Walk the array once while keeping the length of the current
// strictly increasing run and the current strictly decreasing run. A rise
// extends the increasing run and resets the decreasing one, a fall does the
// opposite, and an equal pair resets both. The answer is the longest run
// seen. Every element must be read, so the bound is already tight.
// Time: O(n) Space: O(1)

public class Solution
{
    public int LongestMonotonicSubarray(int[] nums)
    {
        int ans = 1;
        int increasing = 1;
        int decreasing = 1;

        for (int i = 1; i < nums.Length; ++i)
        {
            if (nums[i] > nums[i - 1])
            {
                increasing += 1;
                decreasing = 1;
            }
            else if (nums[i] < nums[i - 1])
            {
                decreasing += 1;
                increasing = 1;
            }
            else
            {
                increasing = 1;
                decreasing = 1;
            }
            ans = Math.Max(ans, Math.Max(increasing, decreasing));
        }

        return ans;
    }
}