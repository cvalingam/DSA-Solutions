// Approach: Math shortcut - OR all elements; result = OR * 2^(n-1) (each bit contributes equally).
// Time: O(n) Space: O(1)

public class Solution
{
    public int SubsetXORSum(int[] nums)
    {
        int n = nums.Length;
        int ans = 0;

        for (int i = 0; i < (1 << n); i++)
        {
            int subsetXOR = 0;
            for (int j = 0; j < n; j++)
            {
                if (((i >> j) & 1) != 0)
                    subsetXOR ^= nums[j];
            }
            ans += subsetXOR;
        }

        return ans;
    }
}