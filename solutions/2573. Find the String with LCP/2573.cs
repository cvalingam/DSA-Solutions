// Approach: Greedily assign letters left to right - if word[i] is unset, assign the next available
// letter and propagate it to all j>i where lcp[i][j]>0. Then validate by recomputing the LCP table
// from the constructed string: lcp[i][j] = word[i]==word[j] ? 1+lcp[i+1][j+1] : 0, checking it
// matches the input. Return "" if any mismatch or letters run out past 'z'.
// Time: O(n^2) Space: O(n)
public class Solution
{
    public string FindTheString(int[][] lcp)
    {
        int n = lcp.Length;
        const char nonLetter = (char)('a' - 1);
        char c = nonLetter;
        char[] word = new char[n];
        for (int i = 0; i < n; i++)
            word[i] = nonLetter;

        for (int i = 0; i < n; ++i)
        {
            if (word[i] != nonLetter)  // There's a candidate already.
                continue;
            if (++c > 'z')  // Run out of letters, so return "".
                return "";
            // No need to consider [0..i - 1] since they were considered.
            for (int j = i; j < n; ++j)
            {
                if (lcp[i][j] > 0)
                    word[j] = c;
            }
        }

        // Check if `word` is valid.
        for (int i = 0; i < n; ++i)
        {
            for (int j = 0; j < n; ++j)
            {
                int nextLcp = (i + 1 < n && j + 1 < n) ? lcp[i + 1][j + 1] : 0;
                int currLcp = word[i] == word[j] ? 1 + nextLcp : 0;
                if (lcp[i][j] != currLcp)
                    return "";
            }
        }

        return new string(word);
    }
}