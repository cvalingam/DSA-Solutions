// Approach: Divide and conquer - split at any char whose case-complement is absent, recurse and take max.
// Time: O(n²) Space: O(n)

public class Solution
{
    public string LongestNiceSubstring(string s)
    {
        if (s.Length < 2)
            return "";

        HashSet<char> seen = new HashSet<char>(s.ToCharArray());

        for (int i = 0; i < s.Length; ++i)
            if (!seen.Contains(ToggleCase(s[i])))
            {
                string prefix = LongestNiceSubstring(s.Substring(0, i));
                string suffix = LongestNiceSubstring(s.Substring(i + 1));
                return prefix.Length >= suffix.Length ? prefix : suffix;
            }

        return s;
    }

    private char ToggleCase(char c)
    {
        return char.IsLower(c) ? char.ToUpper(c) : char.ToLower(c);
    }
}