// Approach: Need indices in word1 forming a subsequence almost equal to word2
// (at most one mismatch), and the lexicographically smallest such index array.
// Precompute last[j]: while matching word2 from the end, the latest word1 index
// that can cover word2[j]. Then scan word1 left to right: take exact matches;
// otherwise use the single skip at the earliest index i if the remaining suffix
// of word2 is still matchable (i < last[j+1], or j is the last char).
// Complexity: O(|word1| + |word2|) time and O(|word2|) space.
public class Solution
{
    public int[] ValidSequence(string word1, string word2)
    {
        int[] ans = new int[word2.Length];
        // last[j] := the index i of the last occurrence in word1, where
        // word1[i] == word2[j]
        int[] last = new int[word2.Length];
        Array.Fill(last, -1);

        int i = word1.Length - 1;
        int j = word2.Length - 1;
        while (i >= 0 && j >= 0)
        {
            if (word1[i] == word2[j])
                last[j--] = i;
            --i;
        }

        bool canSkip = true;
        j = 0;
        for (i = 0; i < word1.Length; ++i)
        {
            if (j == word2.Length)
                break;
            if (word1[i] == word2[j])
                ans[j++] = i;
            else if (canSkip && (j == word2.Length - 1 || i < last[j + 1]))
            {
                canSkip = false;
                ans[j++] = i;
            }
        }

        return j == word2.Length ? ans : new int[0];
    }
}
