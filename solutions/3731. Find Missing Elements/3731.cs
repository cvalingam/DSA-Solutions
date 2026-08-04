// Approach: Missing values are integers strictly between the array min and max.
// Build a hash set of nums while tracking mn/mx, then scan x = mn+1 .. mx-1 and
// collect every x not in the set (ascending by construction).
// Complexity: O(n + R) time and O(n) space, where R = mx - mn.
public class Solution
{
    public IList<int> FindMissingElements(int[] nums)
    {
        int mn = 100, mx = 0;
        HashSet<int> s = new HashSet<int>();
        foreach (int x in nums)
        {
            mn = Math.Min(mn, x);
            mx = Math.Max(mx, x);
            s.Add(x);
        }
        List<int> ans = new List<int>();
        for (int x = mn + 1; x < mx; ++x)
        {
            if (!s.Contains(x))
                ans.Add(x);
        }
        return ans;
    }
}
