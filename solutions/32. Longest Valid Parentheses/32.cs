// Approach: Two counter scans. Left to right, count opens and closes. When
// they are equal the current run is balanced, and when closes exceed opens
// the run is broken, so both counters reset. That pass misses runs that
// still have extra opens at the end, such as "(()", so a right to left pass
// with the roles swapped catches them.
// Time: O(n) Space: O(1)

public class Solution
{
    public int LongestValidParentheses(string s)
    {
        int best = 0;
        int open = 0;
        int close = 0;

        for (int i = 0; i < s.Length; i++)
        {
            if (s[i] == '(')
                open++;
            else
                close++;

            if (open == close)
                best = Math.Max(best, 2 * close);
            else if (close > open)
                open = close = 0;
        }

        open = close = 0;
        for (int i = s.Length - 1; i >= 0; i--)
        {
            if (s[i] == '(')
                open++;
            else
                close++;

            if (open == close)
                best = Math.Max(best, 2 * open);
            else if (open > close)
                open = close = 0;
        }

        return best;
    }
}
