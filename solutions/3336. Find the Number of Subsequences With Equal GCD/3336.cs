// Approach: DP over disjoint subsequence pairs. dp[x][y] = ways to form two subsequences
// with GCDs x and y (0 = empty). For each num: skip it, append to first, or append to second.
// Answer is sum of dp[g][g] for g >= 1 (both non-empty with equal GCD), mod 1e9+7.
// Time: O(n * M^2) Space: O(M^2) where M = max(nums)
public class Solution
{
    private const int MOD = 1_000_000_007;

    public int SubsequencePairCount(int[] nums)
    {
        int n = nums.Length;
        int maxNum = 0;
        foreach (var num in nums)
        {
            if (num > maxNum)
                maxNum = num;
        }

        int[,] dp = new int[maxNum + 1, maxNum + 1];
        dp[0, 0] = 1;

        foreach (var num in nums)
        {
            int[,] newDp = new int[maxNum + 1, maxNum + 1];
            for (int x = 0; x <= maxNum; ++x)
            {
                for (int y = 0; y <= maxNum; ++y)
                {
                    // 1. Skip `num`.
                    newDp[x, y] = (newDp[x, y] + dp[x, y]) % MOD;
                    // 2. Pick `num` in the first subsequence.
                    int newX = Gcd(x, num);
                    newDp[newX, y] = (newDp[newX, y] + dp[x, y]) % MOD;
                    // 3. Pick `num` in the second subsequence.
                    int newY = Gcd(y, num);
                    newDp[x, newY] = (newDp[x, newY] + dp[x, y]) % MOD;
                }
            }
            dp = newDp;
        }

        int ans = 0;
        for (int g = 1; g <= maxNum; ++g)
            ans = (ans + dp[g, g]) % MOD;

        return ans;
    }

    private int Gcd(int a, int b)
    {
        return b == 0 ? a : Gcd(b, a % b);
    }
}