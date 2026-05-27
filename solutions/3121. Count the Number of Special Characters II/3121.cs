// Approach: Track whether each letter has appeared lowercase before uppercase.
// Mark lowercase as eligible only when its uppercase has not been seen yet; uppercase marks the order-completing event.
// Count letters whose lowercase and uppercase forms are both present in the correct order.
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
                lower[c - 'a'] = !upper[c - 'a'];
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