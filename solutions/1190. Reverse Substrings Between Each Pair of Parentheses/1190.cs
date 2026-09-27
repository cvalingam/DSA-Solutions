// Approach: Pair each parenthesis with its match. Walk the string with a
// direction. Hitting '(' or ')' jumps to the partner and flips direction,
// which writes the enclosed letters in reverse without copying the span.
// Complexity: O(n) time, O(n) extra space.
public class Solution
{
    public string ReverseParentheses(string s)
    {
        int n = s.Length;
        int[] pair = new int[n];
        var stack = new Stack<int>();

        for (int i = 0; i < n; i++)
        {
            if (s[i] == '(')
                stack.Push(i);
            else if (s[i] == ')')
            {
                int open = stack.Pop();
                pair[i] = open;
                pair[open] = i;
            }
        }

        var sb = new StringBuilder();
        for (int i = 0, dir = 1; i < n; i += dir)
        {
            if (s[i] == '(' || s[i] == ')')
            {
                i = pair[i];
                dir = -dir;
            }
            else
            {
                sb.Append(s[i]);
            }
        }

        return sb.ToString();
    }
}
