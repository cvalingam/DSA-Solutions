// Approach: Removing a prefix and suffix leaves a contiguous subarray, so
// count subarrays by product % k. dp[r] = number of subarrays ending here
// with product % k == r. At each num, start [num] and extend prior endings
// by multiplying; accumulate into ans.
// Complexity: O(n*k) time, O(k) extra space. Optimal for this DP.
public class Solution
{
    public long[] ResultArray(int[] nums, int k)
    {
        long[] ans = new long[k];
        long[] dp = new long[k];
        long[] next = new long[k];

        foreach (int num in nums)
        {
            Array.Clear(next, 0, k);
            int numMod = num % k;
            next[numMod] = 1;

            for (int r = 0; r < k; r++)
            {
                if (dp[r] == 0)
                    continue;
                next[(int)(1L * r * numMod % k)] += dp[r];
            }

            for (int r = 0; r < k; r++)
                ans[r] += next[r];

            (dp, next) = (next, dp);
        }

        return ans;
    }
}
