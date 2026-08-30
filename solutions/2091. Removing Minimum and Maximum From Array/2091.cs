// Approach: Find the indices of min and max. Any optimal plan is one of three:
// delete from the front through the farther index, from the back through the
// nearer index, or one from each end. Take the minimum of those three costs.
// Complexity: O(n) time and O(1) extra space.

public class Solution
{
    public int MinimumDeletions(int[] nums)
    {
        int n = nums.Length;

        int mn = int.MaxValue;
        int mx = int.MinValue;
        int minIndex = -1;
        int maxIndex = -1;

        for (int i = 0; i < n; ++i)
        {
            if (nums[i] < mn)
            {
                mn = nums[i];
                minIndex = i;
            }
            if (nums[i] > mx)
            {
                mx = nums[i];
                maxIndex = i;
            }
        }

        int a = Math.Min(minIndex, maxIndex);
        int b = Math.Max(minIndex, maxIndex);

        // min(delete from front and back,
        //     delete from front,
        //     delete from back)
        return Math.Min(a + 1 + n - b, Math.Min(b + 1, n - a));
    }
}