// Approach: XOR of a subsequence is 0 for every choice only when every
// element is 0. Otherwise: if the full-array XOR is non-zero, length n works;
// if it is 0, removing any non-zero element yields XOR equal to that element,
// so length n-1 is always achievable and maximal.
// Complexity: O(n) time and O(1) space.
public class Solution
{
    public int LongestSubsequence(int[] nums)
    {
        int xor = 0;
        bool hasNonZero = false;

        foreach (int x in nums)
        {
            xor ^= x;
            if (x != 0)
                hasNonZero = true;
        }

        if (!hasNonZero)
            return 0;
        return xor != 0 ? nums.Length : nums.Length - 1;
    }
}
