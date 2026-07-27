// Approach: 0/1 Knapsack DP - check whether any subset sums to totalSum / 2.
// If totalSum is odd, partitioning is impossible.
// Create a boolean dp array of size (target + 1): dp[t] = true if some subset sums to t.
// Process each number: iterate t from target down to num and set dp[t] |= dp[t - num].
// Iterating backwards prevents using the same element twice (0/1 knapsack rule).
// If dp[target] is true at the end, an equal-sum partition exists.
// Time: O(n x sum) Space: O(sum) using a 1D bit array.

public class Solution
{
    public bool CanPartition(int[] nums)
    {
        int n = nums.Length;
        int totalSum = 0;

        for (int i = 0; i < nums.Length; i++)
            totalSum += nums[i];

        if (totalSum % 2 > 0)
            return false;
        else
            return tabulation(n, totalSum / 2, nums);
    }

    private bool tabulation(int n, int k, int[] arr)
    {
        bool[][] dp = new bool[n + 1][];

        for (int i = 0; i <= n; i++)
            dp[i] = new bool[k + 1];

        for (int i = 0; i <= n; i++)
            dp[i][0] = true;

        for (int i = 1; i <= k; i++)
            dp[0][i] = false;

        for (int ind = 1; ind <= n; ind++)
        {
            for (int target = 1; target <= k; target++)
            {
                if (target >= arr[ind - 1])
                    dp[ind][target] = dp[ind - 1][target] || dp[ind - 1][target - arr[ind - 1]];
                else
                    dp[ind][target] = dp[ind - 1][target];
            }
        }

        return dp[n][k];
    }
}