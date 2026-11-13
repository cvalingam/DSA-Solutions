// Approach: Scan right to left. A window [i, j] stores the cheapest cost to
// make nums[i..j] non-decreasing by raising each position to the running
// left maximum. A monotonic deque of indices keeps those maxima in order.
// When nums[i] enters, every smaller segment to its right is raised to it and
// the cost grows by length times the lift. While cost exceeds k, drop the
// rightmost index and refund its lift. Every valid right end for the current
// left adds j - i + 1 subarrays. Each index enters and leaves the deque once.
// Time: O(n) Space: O(n)

public class Solution
{
    public long CountNonDecreasingSubarrays(int[] nums, int k)
    {
        int n = nums.Length;
        long ans = 0;
        long cost = 0;
        int[] dq = new int[n];
        int head = 0, tail = 0;

        for (int i = n - 1, j = n - 1; i >= 0; --i)
        {
            int num = nums[i];
            while (head < tail && nums[dq[tail - 1]] < num)
            {
                int l = dq[--tail];
                int r = head == tail ? j + 1 : dq[tail - 1];
                cost += (long)(r - l) * (num - nums[l]);
            }
            dq[tail++] = i;

            while (cost > k)
            {
                cost -= nums[dq[head]] - nums[j];
                if (dq[head] == j)
                    ++head;
                --j;
            }

            ans += j - i + 1;
        }

        return ans;
    }
}
