// Approach: Sort, force arr[0] = 1, then greedily cap each element to at most previous + 1.
// This satisfies arr[i] - arr[i-1] <= 1 while keeping values as large as possible.
// Time: O(n log n) Space: O(1) excluding sort
public class Solution
{
    public int MaximumElementAfterDecrementingAndRearranging(int[] arr)
    {
        Array.Sort(arr);
        arr[0] = 1;

        for (int i = 1; i < arr.Length; ++i)
            arr[i] = Math.Min(arr[i], arr[i - 1] + 1);

        return arr[arr.Length - 1];
    }
}