// Approach: Scan left to right with a balance. At the first prefix where
// closers outnumber openers, one closer at or before that point must go.
// Try each closer from the last removal position onward, skipping repeats
// in a run so the same string is not built twice, then resume the scan from
// the same index. Once the forward pass is balanced, reverse the string and
// run the same pass with the roles of '(' and ')' swapped to drop extra
// openers. Every string reaching the end is valid and unique, so no final
// check or set is needed.
// Time: O(2^n * n) worst case Space: O(n) recursion beyond the output

public class Solution
{
    public IList<string> RemoveInvalidParentheses(string s)
    {
        var ans = new List<string>();
        Remove(s, 0, 0, '(', ')', ans);
        return ans;
    }

    private static void Remove(string s, int scanFrom, int removeFrom, char open, char close, List<string> ans)
    {
        int balance = 0;
        for (int i = scanFrom; i < s.Length; i++)
        {
            if (s[i] == open)
                balance++;
            else if (s[i] == close)
                balance--;
            if (balance >= 0)
                continue;

            for (int j = removeFrom; j <= i; j++)
            {
                if (s[j] == close && (j == removeFrom || s[j - 1] != close))
                    Remove(s.Remove(j, 1), i, j, open, close, ans);
            }
            return;
        }

        char[] rev = s.ToCharArray();
        Array.Reverse(rev);
        string reversed = new string(rev);
        if (open == '(')
            Remove(reversed, 0, 0, ')', '(', ans);
        else
            ans.Add(reversed);
    }
}
