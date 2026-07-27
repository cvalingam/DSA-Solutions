// Approach: DP - precount char frequencies per column; dp[i][j] = ways to form target[0..i] using word columns 0..j.
// Time: O(|target| * wordLen) Space: O(|target| * wordLen)

public class Solution
{
    public int NumWays(string[] words, string target)
    {
        int wordLength = words[0].Length;
        int?[,] mem = new int?[target.Length, wordLength];
        // counts[j] := the count map of words[i][j], where 0 <= i < |words|
        int[,] counts = new int[wordLength, 26];

        for (int i = 0; i < wordLength; ++i)
        {
            foreach (var word in words)
                counts[i, word[i] - 'a']++;
        }

        return NumWays(target, 0, 0, counts, mem);
    }

    private const int kMod = 1_000_000_007;

    // Returns the number of ways to form target[i..n) using word[j..n).
    private int NumWays(string target, int i, int j, int[,] counts, int?[,] mem)
    {
        if (i == target.Length) 
            return 1;

        if (j == counts.GetLength(0)) 
            return 0;

        if (mem[i, j] != null) 
            return mem[i, j].Value;

        mem[i, j] = (int)((NumWays(target, i + 1, j + 1, counts, mem) *
                           (long)(counts[j, target[i] - 'a']) +
                           NumWays(target, i, j + 1, counts, mem)) % kMod);

        return mem[i, j].Value;
    }
}