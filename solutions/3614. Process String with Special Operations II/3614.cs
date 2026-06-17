// Approach: The final string can be enormous, so never build it explicitly.
// Pass 1 (left to right): simulate operators on the length m only.
//   Letters increase m by 1; '*' deletes the last character (m = max(0, m-1));
//   '#' duplicates the string (m <<= 1); '%' only reverses and does not change length.
// If k >= m, return '.'.
// Pass 2 (right to left): undo each operator to locate the k-th character.
//   '*' adds a character back (m++); '#' halves m and maps k from the second copy to the first (if k >= m, k -= m);
//   '%' mirrors the index (k = m - 1 - k); for a letter, shrink m and return it when k == m.
// Time: O(n) Space: O(1)
public class Solution
{
    public char ProcessStr(string s, long k)
    {
        long m = 0;
        for (int i = 0; i < s.Length; i++)
        {
            char c = s[i];
            if (c == '*')
                m = Math.Max(0, m - 1);
            else if (c == '#')
                m <<= 1;
            else if (c != '%')
                m += 1;
        }
        if (k >= m)
            return '.';
        for (int i = s.Length - 1; ; i--)
        {
            char c = s[i];
            if (c == '*')
                m += 1;
            else if (c == '#')
            {
                m /= 2;
                if (k >= m)
                    k -= m;
            }
            else if (c == '%')
                k = m - 1 - k;
            else
            {
                m -= 1;
                if (k == m)
                    return c;
            }
        }
    }
}