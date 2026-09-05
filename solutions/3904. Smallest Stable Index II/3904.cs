// Approach: Instability at i is prefix max through i minus suffix min from i.
// Precompute suffix minima, then scan left to right with a running max and
// return the first index whose score is at most k.
// Complexity: O(n) time and O(n) extra space.
public class Solution
{
    public int FirstStableIndex(int[] nums, int k)
    {
        int n = nums.Length;
        int[] right = new int[n];
        right[n - 1] = nums[n - 1];

        for (int i = n - 2; i >= 0; i--)
            right[i] = Math.Min(right[i + 1], nums[i]);

        int left = 0;
        for (int i = 0; i < n; i++)
        {
            left = Math.Max(left, nums[i]);
            if (left - right[i] <= k)
                return i;
        }
        return -1;
    }
}
