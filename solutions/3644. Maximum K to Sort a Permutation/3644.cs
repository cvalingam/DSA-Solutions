// Approach: A swap is allowed only when the two values AND to k, so every bit
// of k must be set in every value that is not already at its own index. The
// largest such k is the AND of those misplaced values. AND with 0 stays 0, so
// the scan stops as soon as the running AND becomes 0. A sorted permutation
// has no misplaced value and returns 0.
// Time: O(n) Space: O(1)

public class Solution
{
    public int SortPermutation(int[] nums)
    {
        int result = -1;
        for (int i = 0; i < nums.Length; i++)
        {
            if (nums[i] == i)
                continue;
            result &= nums[i];
            if (result == 0)
                return 0;
        }
        return result == -1 ? 0 : result;
    }
}
