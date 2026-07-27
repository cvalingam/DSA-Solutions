// Approach: Dutch National Flag algorithm - single-pass three-way partition.
// Maintain three pointers: low (next position for 0), mid (current element), high (next position for 2).
// If nums[mid] == 0: swap with nums[low], advance both low and mid.
// If nums[mid] == 2: swap with nums[high], retreat high only (mid stays to re-examine the swapped value).
// If nums[mid] == 1: just advance mid.
// Loop ends when mid > high; the array is now sorted with 0s, 1s, and 2s in place.
// Time: O(n) Space: O(1) - no counting sort, true single pass.

public class Solution
{
    public void SortColors(int[] nums)
    {
        int l = 0;               // The next 0 should be placed in l.
        int r = nums.Length - 1; // The next 2 should be placed in r.

        for (int i = 0; i <= r;)
        {
            if (nums[i] == 0)
                Swap(nums, i++, l++);
            else if (nums[i] == 1)
                ++i;
            else
            {
                // We may swap a 0 to index i, but we're still not sure whether this 0
                // is placed in the correct index, so we can't move pointer i.
                Swap(nums, i, r--);
            }
        }
    }

    private void Swap(int[] nums, int i, int j)
    {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}