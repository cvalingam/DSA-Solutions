// Approach: Monotonic decreasing deque storing indices of candidates for the window maximum.
// For each new element at index i: remove from the back any indices whose values are <= nums[i].
// Those elements can never become the maximum for any future window, so they are useless.
// Remove from the front any index that is no longer inside the current window [i-k+1, i].
// The front of the deque always holds the index of the current window's maximum - O(1) query.
// Each index is pushed and popped at most once, so the total work across all windows is O(n).
// Time: O(n) Space: O(k) for the deque.

public class Solution
{
    public int[] MaxSlidingWindow(int[] nums, int k)
    {
        int n = nums.Length;
        int j = 0;
        int[] result = new int[n - k + 1];
        List<int> sw = new List<int>(k);

        for (int i = 0; i < n; i++)
        {
            while (sw.Count > 0 && sw[0] == i - k)
                sw.RemoveAt(0);

            while (sw.Count > 0 && nums[sw[sw.Count - 1]] < nums[i])
                sw.RemoveAt(sw.Count - 1);

            sw.Insert(sw.Count, i);

            if (i >= k - 1)
                result[j++] = nums[sw[0]];
        }

        return result;
    }
}