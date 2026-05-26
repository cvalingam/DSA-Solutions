// Approach: Track whether each lowercase and uppercase letter appears using two boolean arrays.
// A letter is special if both its lowercase and uppercase forms are present in the word.
// Count such letters across all 26 alphabet positions.
// Time: O(n + 26) Space: O(26)

public class Solution
{
    public int NumberOfSpecialChars(string word)
    {
        int ans = 0;
        bool[] lower = new bool[26];
        bool[] upper = new bool[26];

        foreach (char c in word)
        {
            if (char.IsLower(c))
                lower[c - 'a'] = true;
            else
                upper[c - 'A'] = true;
        }

        for (int i = 0; i < 26; ++i)
        {
            if (lower[i] && upper[i])
                ++ans;
        }

        return ans;
    }
}