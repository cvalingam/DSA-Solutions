// Approach: Bit circuit with ones/twos variables - each bit accumulates modulo 3
// so it clears from both after appearing three times.
// Time: O(n) Space: O(1)

public class Solution
{
    public int SingleNumber(int[] nums)
    {
        int ones = 0, twos = 0;

        for (int i = 0; i < nums.Length; i++)
        {
            ones ^= nums[i] & ~twos;
            twos ^= nums[i] & ~ones;
        }

        return ones;
    }
}