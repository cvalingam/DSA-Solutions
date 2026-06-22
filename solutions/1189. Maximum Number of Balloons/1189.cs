// Approach: Count letter frequencies. "balloon" needs b, a, n once each and l, o twice each.
// Answer is the minimum of those quotas: count/2 for l and o, raw count for b, a, n.
// Time: O(n) Space: O(1)
public class Solution
{
    public int MaxNumberOfBalloons(string text)
    {
        int ans = int.MaxValue;
        int[] count = new int[26];

        foreach (char c in text)
            count[c - 'a']++;

        foreach (char c in new char[] { 'b', 'a', 'n' })
            ans = Math.Min(ans, count[c - 'a']);

        foreach (char c in new char[] { 'o', 'l' })
            ans = Math.Min(ans, count[c - 'a'] / 2);

        return ans;
    }
}