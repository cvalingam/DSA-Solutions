// Approach: Cantor's diagonal - flip the i-th bit of nums[i] to guarantee the result differs from every string.
// Time: O(n) Space: O(n)

public class Solution
{
    public string FindDifferentBinaryString(string[] nums)
    {
        StringBuilder sb = new StringBuilder();

        // Flip the i-th bit for each nums[i] so that `ans` is unique.
        for (int i = 0; i < nums.Length; ++i)
            sb.Append(nums[i][i] == '0' ? '1' : '0');

        return sb.ToString();
    }
}