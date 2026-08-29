// Approach: Sort indices by value. Consecutive values with gap <= limit form a
// component that can be freely rearranged. For each component, sort its indices
// and write the already-sorted values into those positions (lex-smallest).
// Complexity: O(n log n) time and O(n) extra space.
public class Solution
{
    public int[] LexicographicallySmallestArray(int[] nums, int limit)
    {
        int n = nums.Length;
        int[] idx = new int[n];
        for (int i = 0; i < n; i++)
            idx[i] = i;

        Array.Sort(idx, (a, b) => nums[a].CompareTo(nums[b]));

        int[] ans = new int[n];
        int start = 0;

        for (int i = 1; i <= n; i++)
        {
            if (i < n && nums[idx[i]] - nums[idx[i - 1]] <= limit)
                continue;

            int len = i - start;
            int[] slots = new int[len];
            for (int j = 0; j < len; j++)
                slots[j] = idx[start + j];

            Array.Sort(slots);
            for (int j = 0; j < len; j++)
                ans[slots[j]] = nums[idx[start + j]];

            start = i;
        }

        return ans;
    }
}
