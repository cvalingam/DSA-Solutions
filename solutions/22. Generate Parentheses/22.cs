// Approach: Backtrack over one shared char buffer of length 2n with two
// counters, open and close. Place '(' while open < n, and place ')' while
// close < open, so only valid prefixes are ever explored. A string is built
// only when the buffer is full, and the result list is presized to the
// Catalan number C(n) = C(2n, n) / (n + 1).
// Time: O(4^n/√n) Space: O(n) recursion and buffer beyond the output

public class Solution
{
    public IList<string> GenerateParenthesis(int n)
    {
        long catalan = 1;
        for (int i = 0; i < n; i++)
            catalan = catalan * 2 * (2 * i + 1) / (i + 2);

        var ans = new List<string>((int)catalan);
        Generate(new char[2 * n], 0, 0, n, ans);
        return ans;
    }

    private static void Generate(char[] buf, int open, int close, int n, List<string> ans)
    {
        int pos = open + close;
        if (pos == buf.Length)
        {
            ans.Add(new string(buf));
            return;
        }

        if (open < n)
        {
            buf[pos] = '(';
            Generate(buf, open + 1, close, n, ans);
        }
        if (close < open)
        {
            buf[pos] = ')';
            Generate(buf, open, close + 1, n, ans);
        }
    }
}
