// Approach: A valid string only needs a running open count. Each '(' deepens
// the nest and each ')' closes it. The answer is the highest count seen.
// Letters and operators never change the depth.
// Complexity: O(n) time, O(1) extra space.
public class Solution
{
    public int MaxDepth(string s)
    {
        int ans = 0;
        int opened = 0;

        foreach (char c in s)
        {
            if (c == '(')
                ans = Math.Max(ans, ++opened);
            else if (c == ')')
                --opened;
        }

        return ans;
    }
}