// Approach: Sort, then process each value once. For num you may keep it as num
// (extend a chain ending at num - 1) or raise it to num + 1 (extend a chain
// ending at num). Store the best length ending at each key in a map, and update
// the num + 1 entry before the num entry so the same element is not reused.
// Time: O(n log n) Space: O(n)

public class Solution
{
    public int MaxSelectedElements(int[] nums)
    {
        int ans = 0;
        var dp = new Dictionary<int, int>();

        Array.Sort(nums);

        foreach (int num in nums)
        {
            dp[num + 1] = dp.GetValueOrDefault(num, 0) + 1;
            dp[num] = dp.GetValueOrDefault(num - 1, 0) + 1;
            ans = Math.Max(ans, Math.Max(dp[num], dp[num + 1]));
        }

        return ans;
    }
}
