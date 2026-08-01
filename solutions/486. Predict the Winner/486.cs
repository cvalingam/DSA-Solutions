public class Solution
{
    // Approach: Minimax on a line of scores. dp[j] = best score difference
    // (current player minus opponent) on subarray ending at j. Expand length d:
    // for interval [i,j], take max of nums[i]-dp[j] (pick left) and nums[j]-dp[j-1]
    // (pick right). Player 1 wins if the full-array difference dp[n-1] >= 0.
    // Complexity: O(n^2) time and O(n) space.
    public bool PredictTheWinner(int[] nums)
    {
        int n = nums.Length;
        int[] dp = (int[])nums.Clone();

        for (int d = 1; d < n; ++d)
            for (int j = n - 1; j - d >= 0; --j)
            {
                int i = j - d;
                dp[j] = Math.Max(nums[i] - dp[j],      // Pick the leftmost number.
                                 nums[j] - dp[j - 1]); // Pick the rightmost number.
            }

        return dp[n - 1] >= 0;
    }
}