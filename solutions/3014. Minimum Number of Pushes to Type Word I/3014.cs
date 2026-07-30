public class Solution
{
    // Approach: Remap letters onto 8 phone keys. More frequent letters should
    // need fewer key presses. Count frequencies, sort ascending, then assign
    // from most frequent: the i-th busiest letter costs (i/8 + 1) presses.
    // Complexity: O(1) time after the O(n) count (26 letters), O(1) space.
    public int MinimumPushes(string word)
    {
        int ans = 0;
        int[] count = new int[26];

        foreach (char c in word)
            ++count[c - 'a'];

        Array.Sort(count);

        for (int i = 0; i < 26; ++i)
            ans += count[26 - i - 1] * (i / 8 + 1);

        return ans;
    }
}