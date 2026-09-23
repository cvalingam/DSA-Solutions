// Approach: Removing a prefix and a suffix that sum to x is the same as
// keeping a middle subarray that sums to total - x. Because every nums[i]
// is positive, a sliding window finds the longest such middle. The answer
// is n minus that length, or -1 when no window hits the target.
// Complexity: O(n) time, O(1) extra space.
public class Solution
{
    public int MinOperations(int[] nums, int x)
    {
        int n = nums.Length;
        int total = 0;
        for (int i = 0; i < n; i++)
            total += nums[i];

        int target = total - x;
        if (target < 0)
            return -1;
        if (target == 0)
            return n;

        int maxLen = -1;
        int sum = 0;
        for (int l = 0, r = 0; r < n; r++)
        {
            sum += nums[r];
            while (sum > target)
                sum -= nums[l++];
            if (sum == target)
                maxLen = Math.Max(maxLen, r - l + 1);
        }

        return maxLen == -1 ? -1 : n - maxLen;
    }
}
