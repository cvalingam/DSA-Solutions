// Approach: While the string is longer than k, split it into consecutive
// groups of at most k digits, replace each group with the decimal digits of
// its sum, and repeat on that shorter string. The process stops once the
// length is at most k. Every character of the current string must be read
// each round, so the simulation is already tight.
// Time: O(n) across shrinking rounds Space: O(n)

using System.Text;

public class Solution
{
    public string DigitSum(string s, int k)
    {
        while (s.Length > k)
        {
            var sb = new StringBuilder();
            for (int i = 0; i < s.Length; i += k)
            {
                int sum = 0;
                int end = Math.Min(s.Length, i + k);
                for (int j = i; j < end; ++j)
                    sum += s[j] - '0';
                sb.Append(sum);
            }
            s = sb.ToString();
        }
        return s;
    }
}
