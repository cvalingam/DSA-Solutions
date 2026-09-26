// Approach: Store knowledge as key to value. Walk s once. Copy each plain
// run in one append. On '(', read until the matching ')' and look up the
// inner key, appending the value or '?' when it is missing.
// Complexity: O(n + k) time, O(k + output) space. n is the string length
// and k is the number of knowledge pairs.
public class Solution
{
    public string Evaluate(string s, IList<IList<string>> knowledge)
    {
        var map = new Dictionary<string, string>(knowledge.Count);
        foreach (var pair in knowledge)
            map[pair[0]] = pair[1];

        var sb = new StringBuilder(s.Length);
        for (int i = 0; i < s.Length; i++)
        {
            if (s[i] != '(')
            {
                int start = i;
                while (i < s.Length && s[i] != '(')
                    i++;
                sb.Append(s, start, i - start);
                i--;
                continue;
            }

            int close = i + 1;
            while (s[close] != ')')
                close++;
            string key = s.Substring(i + 1, close - i - 1);
            sb.Append(map.TryGetValue(key, out string value) ? value : "?");
            i = close;
        }

        return sb.ToString();
    }
}
