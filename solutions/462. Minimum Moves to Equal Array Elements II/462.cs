// Approach: The value that minimizes the total of increments and decrements
// is a median. Three way quickselect finds it. Values equal to the pivot
// land in one band, so a long run of duplicates ends in a single partition.
// The search is a loop. The move count is the sum of absolute gaps from
// that median, accumulated in a 64 bit integer.
// Time: O(n) average Space: O(1)

public class Solution
{
    public int MinMoves2(int[] nums)
    {
        int median = Select(nums, (nums.Length - 1) / 2);
        long moves = 0;
        for (int i = 0; i < nums.Length; i++)
            moves += Math.Abs((long)nums[i] - median);
        return (int)moves;
    }

    private static int Select(int[] nums, int k)
    {
        int left = 0;
        int right = nums.Length - 1;
        while (left <= right)
        {
            int pivot = nums[Random.Shared.Next(left, right + 1)];
            int lt = left;
            int i = left;
            int gt = right;
            while (i <= gt)
            {
                if (nums[i] < pivot)
                    Swap(nums, lt++, i++);
                else if (nums[i] > pivot)
                    Swap(nums, i, gt--);
                else
                    i++;
            }

            if (k < lt)
                right = lt - 1;
            else if (k > gt)
                left = gt + 1;
            else
                return pivot;
        }
        return nums[k];
    }

    private static void Swap(int[] nums, int i, int j)
    {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
