// Approach: Sliding window. Expand r; track frequencies. When nums[r] appears
// more than k times, advance l until that count is <= k. Window length r-l+1
// is always valid; track the maximum. Skip removing zeroed keys - unused
// entries are harmless and saves dictionary churn.
// Complexity: O(n) time and O(min(n, U)) space (U = distinct values in the window).
public class Solution
{
    public int MaxSubarrayLength(int[] nums, int k)
    {
        var freq = new Dictionary<int, int>();
        int l = 0, ans = 0;

        for (int r = 0; r < nums.Length; r++)
        {
            freq.TryGetValue(nums[r], out int count);
            freq[nums[r]] = count + 1;

            while (freq[nums[r]] > k)
            {
                freq[nums[l]]--;
                l++;
            }

            ans = Math.Max(ans, r - l + 1);
        }

        return ans;
    }
}
