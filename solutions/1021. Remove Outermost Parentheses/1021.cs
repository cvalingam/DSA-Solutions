// Approach: The stack only ever holds '(' characters, so its size is the
// whole state. Keep a depth counter instead. An opener is outermost when the
// depth is 0 before it, and a closer is outermost when the depth returns to
// 0 after it. Every other character is copied into a buffer sized to the
// input, and one string is built at the end.
// Time: O(n) Space: O(1) beyond the output

public class Solution
{
    public string RemoveOuterParentheses(string s)
    {
        char[] buf = new char[s.Length];
        int len = 0;
        int depth = 0;
        foreach (char c in s)
        {
            if (c == '(')
            {
                if (depth++ > 0)
                    buf[len++] = c;
            }
            else if (--depth > 0)
            {
                buf[len++] = c;
            }
        }

        return new string(buf, 0, len);
    }
}
