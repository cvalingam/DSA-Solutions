// Approach: Count letters in s. Walk left to right: at each index, record
// the smallest letter still available that is > target[i] (a valid first
// difference). Then try to match target[i] and continue. The rightmost such
// difference gives the lexicographically smallest answer; rebuild by copying
// the matched prefix, placing that letter, and appending the rest sorted.
// Complexity: O(n) time (alphabet size 26) and O(1) extra space besides the
// output string.
public class Solution
{
    public string LexGreaterPermutation(string s, string target)
    {
        int[] count = new int[26];
        foreach (char c in s)
            count[c - 'a']++;

        int n = s.Length;
        int bestPos = -1;
        char bestChar = '\0';

        for (int i = 0; i < n; i++)
        {
            int t = target[i] - 'a';
            for (int c = t + 1; c < 26; c++)
            {
                if (count[c] > 0)
                {
                    bestPos = i;
                    bestChar = (char)('a' + c);
                    break;
                }
            }

            if (count[t] == 0)
                break;
            count[t]--;
        }

        if (bestPos < 0)
            return "";

        Array.Fill(count, 0);
        foreach (char c in s)
            count[c - 'a']++;

        char[] ans = new char[n];
        for (int i = 0; i < bestPos; i++)
        {
            ans[i] = target[i];
            count[target[i] - 'a']--;
        }

        ans[bestPos] = bestChar;
        count[bestChar - 'a']--;

        int idx = bestPos + 1;
        for (int c = 0; c < 26; c++)
        {
            while (count[c]-- > 0)
                ans[idx++] = (char)('a' + c);
        }

        return new string(ans);
    }
}
