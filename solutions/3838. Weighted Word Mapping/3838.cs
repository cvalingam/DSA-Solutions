// Approach: For each word, sum the per-letter weights modulo 26, then map that value to a
// character with index 25 - sum (equivalently the reverse-alphabet position).
// Time: O(total characters) Space: O(1) excluding output

public class Solution
{
    public string MapWordWeights(string[] words, int[] weights)
    {
        var ans = new StringBuilder();
        foreach (var w in words)
        {
            int s = 0;
            foreach (char c in w)
                s = (s + weights[c - 'a']) % 26;

            ans.Append((char)('a' + (25 - s)));
        }
        return ans.ToString();
    }
}