// Approach: Three-reversal trick - rotating right by k is equivalent to three in-place reversals.
// First reduce k modulo n to handle rotations larger than the array length.
// Step 1: reverse the last k elements [n-k .. n-1] into their rotated positions.
// Step 2: reverse the first n-k elements [0 .. n-k-1].
// Step 3: reverse the entire array to combine both reversed halves into the final order.
// Achieves O(1) extra space - no auxiliary array or extra memory needed.
// Time: O(n) Space: O(1)

public class Solution
{
    public void Rotate(int[] nums, int k)
    {
        int n = nums.Length;
        k = k % n;

        Reverse(nums, (n - k), n - 1);
        Reverse(nums, 0, n - k - 1);
        Reverse(nums, 0, n - 1);
    }

    private void Reverse(int[] nums, int start, int end)
    {
        while (start < end)
        {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
}