// Approach: For each element, we need the sum of distances to all other positions with the same value.
// A naive O(N^2) approach re-sums for every element. Instead, group indices by value using a Dictionary,
// then process each group with a single left-to-right sweep using a running prefix-sum adjustment.
// Start with sumSoFar = sum of all indices in the group. For each index at position i in the group:
//   - The i elements to its left each move 'gap' farther away  => sumSoFar += (i-1) * gap
//   - The (n-1-i) elements to its right each move 'gap' closer => sumSoFar -= (n-1-i) * gap
// This gives the exact distance sum for each element in O(group_size) rather than O(group_size^2).
//
// Time: O(N) - each index is processed exactly once across all groups.
// Space: O(N) - for the Dictionary mapping values to their index lists.

public class Solution
{
    public long[] Distance(int[] nums)
    {
        long[] ans = new long[nums.Length];
        var numToIndices = new Dictionary<int, List<int>>();

        for (int i = 0; i < nums.Length; ++i)
        {
            if (!numToIndices.ContainsKey(nums[i]))
                numToIndices[nums[i]] = new List<int>();

            numToIndices[nums[i]].Add(i);
        }

        foreach (var indices in numToIndices.Values)
        {
            int n = indices.Count;
            if (n == 1)
                continue;

            long sumSoFar = indices.Sum(i => (long)i);
            int prevIndex = 0;
            for (int i = 0; i < n; ++i)
            {
                sumSoFar += (i - 1L) * (indices[i] - prevIndex);
                sumSoFar -= (n - 1 - i) * (indices[i] - prevIndex);
                ans[indices[i]] = sumSoFar;
                prevIndex = indices[i];
            }
        }

        return ans;
    }
}