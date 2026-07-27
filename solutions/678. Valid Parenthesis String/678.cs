// Approach: Two-pass greedy - treat '*' as '(' left-to-right and as ')'
// right-to-left; fail if either running count goes negative.
// Time: O(n) Space: O(1)

public class Solution
{
    public bool CheckValidString(string s)
    {
        int oc = 0, cc = 0;
        int n = s.Length;

        for (int i = 0; i < n; i++)
        {
            if (s[i] == '(' || s[i] == '*')
                oc++;
            else
                oc--;

            if (s[n - 1 - i] == ')' || s[n - 1 - i] == '*')
                cc++;
            else
                cc--;

            if (oc < 0 || cc < 0)
                return false;
        }

        return true;
    }
}