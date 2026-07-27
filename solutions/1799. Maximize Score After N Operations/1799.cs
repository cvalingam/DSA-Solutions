// Approach: Bitmask DP - enumerate pair selections; dp[mask] = max score using pairs indicated by set bits.
// Time: O(n² * 2^(2n)) Space: O(2^(2n))

public class Solution
{
    public int MaxScore(int[] nums)
    {
        int n = nums.Length / 2;
        int[,] mem = new int[n + 1, 1 << (n * 2)];
        return MaxScore(nums, 1, 0, mem);
    }

    // Returns the maximum score you can receive after performing the k to n
    // operations, where `mask` is the bitmask of the chosen numbers.
    private int MaxScore(int[] nums, int k, int mask, int[,] mem)
    {
        if (k == mem.GetLength(0))
            return 0;
            
        if (mem[k, mask] > 0)
            return mem[k, mask];

        for (int i = 0; i < nums.Length; ++i)
        {
            for (int j = i + 1; j < nums.Length; ++j)
            {
                int chosenMask = (1 << i) | (1 << j);
                if ((mask & chosenMask) == 0)
                    mem[k, mask] = Math.Max(mem[k, mask], k * Gcd(nums[i], nums[j]) +
                                        MaxScore(nums, k + 1, mask | chosenMask, mem));
            }
        }

        return mem[k, mask];
    }

    private int Gcd(int a, int b)
    {
        return b == 0 ? a : Gcd(b, a % b);
    }
}