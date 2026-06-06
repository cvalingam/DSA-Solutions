// Approach: Single pass with running prefix sums. Keep leftSum (elements before i) and rightSum
// (elements after i); at each index subtract nums[i] from rightSum before computing the answer,
// then add nums[i] to leftSum.
// Time: O(n) Space: O(1) excluding the output array

public class Solution
{
    public int[] LeftRightDifference(int[] nums)
    {
        int[] ans = new int[nums.Length];
        int leftSum = 0;
        int rightSum = nums.Sum();

        for (int i = 0; i < nums.Length; ++i)
        {
            rightSum -= nums[i];
            ans[i] = Math.Abs(leftSum - rightSum);
            leftSum += nums[i];
        }

        return ans;
    }
}