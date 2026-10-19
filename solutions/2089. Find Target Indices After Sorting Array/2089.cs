// Approach: After sorting, every value smaller than target comes first, then
// every copy of target in a contiguous block. One pass counts how many values
// are less than target and how many equal it; the answer indices are then
// lessCount, lessCount+1, ..., lessCount+eqCount-1. Sorting is unnecessary.
// Time: O(n) Space: O(1) besides the output

public class Solution
{
    public IList<int> TargetIndices(int[] nums, int target)
    {
        int less = 0, eq = 0;
        foreach (int num in nums)
        {
            if (num < target)
                less++;
            else if (num == target)
                eq++;
        }

        var ans = new List<int>(eq);
        for (int i = 0; i < eq; i++)
            ans.Add(less + i);
        return ans;
    }
}
