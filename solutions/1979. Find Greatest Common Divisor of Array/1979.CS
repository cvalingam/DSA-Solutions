public class Solution
{
    // Approach: Return gcd of the array's minimum and maximum values (not the
    // GCD of every element). Scan once for min and max, then run the Euclidean
    // algorithm with remainder swaps until one side reaches zero.
    // Complexity: O(n + log M) time and O(1) space, where M = max(nums).
    public int FindGCD(int[] nums)
    {
        int max = nums[0], min = nums[0];
        for (int i = 1; i < nums.Length; i++)
        {
            min = Math.Min(min, nums[i]);
            max = Math.Max(max, nums[i]);
        }

        while (min > 0 && max > 0)
        {
            if (max > min)
                max = max % min;
            else
                min = min % max;
        }

        return Math.Max(min, max);
    }
}