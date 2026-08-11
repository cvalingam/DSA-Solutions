// Approach: Sum the longest consecutive prefix nums[0], nums[0]+1, ... then find
// the smallest integer >= that sum not present in nums. Values are in 1..50, so
// a bool[51] marks presence in O(1) space; if the candidate exceeds 50 it cannot
// appear in nums and is returned immediately.
// Complexity: O(n) time and O(1) space.
public class Solution
{
    public int MissingInteger(int[] nums)
    {
        bool[] seen = new bool[51];
        foreach (int x in nums)
            seen[x] = true;

        int ans = nums[0];
        for (int i = 1; i < nums.Length && nums[i] == nums[i - 1] + 1; ++i)
            ans += nums[i];

        while (ans <= 50 && seen[ans])
            ++ans;

        return ans;
    }
}
