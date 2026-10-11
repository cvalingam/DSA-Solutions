// Approach: The special positions (1-indexed) are exactly the divisors of n.
// Divisors come in pairs d and n / d with d <= sqrt(n), so trying d up to
// sqrt(n) finds every one. A perfect square divisor is counted only once.
// Time: O(sqrt n) Space: O(1)

public class Solution
{
    public int SumOfSquares(int[] nums)
    {
        int n = nums.Length;
        int ans = 0;
        for (int d = 1; d * d <= n; d++)
        {
            if (n % d != 0)
                continue;
            ans += nums[d - 1] * nums[d - 1];
            int pair = n / d;
            if (pair != d)
                ans += nums[pair - 1] * nums[pair - 1];
        }
        return ans;
    }
}
