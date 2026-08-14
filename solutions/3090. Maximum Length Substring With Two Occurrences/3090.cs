// Approach: Sliding window. Expand r; if any character appears more than twice
// in [l, r], advance l until every count is at most 2. Track the maximum
// valid window length.
// Complexity: O(n) time and O(1) space (26 letter counts).
public class Solution
{
    public int MaximumLengthSubstring(string s)
    {
        int ans = 0;
        int[] count = new int[26];

        for (int l = 0, r = 0; r < s.Length; ++r)
        {
            ++count[s[r] - 'a'];
            while (count[s[r] - 'a'] > 2)
                --count[s[l++] - 'a'];
            ans = Math.Max(ans, r - l + 1);
        }

        return ans;
    }
}
