// Approach: The stack only ever holds unmatched closers below unmatched
// openers, so two counters replace it. open counts openers still waiting for
// a match. A closer uses one of them if possible; otherwise it needs an added
// opener. The answer is those added openers plus the openers left at the end.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MinAddToMakeValid(string s)
    {
        int open = 0;
        int adds = 0;
        foreach (char c in s)
        {
            if (c == '(')
                open++;
            else if (open > 0)
                open--;
            else
                adds++;
        }

        return adds + open;
    }
}
