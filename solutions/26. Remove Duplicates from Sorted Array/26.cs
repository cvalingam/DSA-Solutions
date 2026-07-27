// Approach: Two pointers - a slow write pointer k and a fast read pointer i.
// k starts at 1 (position of the next unique write slot).
// For each nums[i] from index 1 onward: if nums[i] != nums[i-1], write nums[i] to nums[k] and advance k.
// When the loop ends, the first k elements hold all unique values in sorted order.
// The constraint that the array is sorted means all duplicates are adjacent, enabling a single pass.
// Time: O(n) Space: O(1)

public class Solution
{
    public int RemoveDuplicates(int[] nums)
    {
        int i = 0;
        int j = i + 1;

        while (j < nums.Length)
        {
            if (nums[j] > nums[i])
            {
                i++;
                nums[i] = nums[j];
            }
            j++;
        }
        return i + 1;
    }
}