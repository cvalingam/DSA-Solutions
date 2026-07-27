// Approach: DP - dp[i] = true if valid partition exists for first i elements (check 2/3-element windows).
// Time: O(n) Space: O(n)

public class Solution
{
    public bool ValidPartition(int[] nums)
    {
        int n = nums.Length;
        // dp[i] := true if there's a valid partition for the first i numbers
        bool[] dp = new bool[n + 1];
        dp[0] = true;
        dp[2] = n >= 2 && nums[0] == nums[1];

        for (int i = 3; i <= n; ++i)
        {
            dp[i] = (dp[i - 2] && nums[i - 2] == nums[i - 1]) ||
                    (dp[i - 3] &&
                     ((nums[i - 3] == nums[i - 2] && nums[i - 2] == nums[i - 1]) ||
                      (nums[i - 3] + 1 == nums[i - 2] &&
                       nums[i - 2] + 1 == nums[i - 1])));
        }

        return dp[n];
    }
}