// Approach: For each 1-indexed position i, add (26 - (s[i]-'a')) * i.
// That is the letter's reverse alphabet rank times its position.
// Complexity: O(n) time, O(1) extra space. Already optimal.
public class Solution
{
    public int ReverseDegree(string s)
    {
        int ans = 0;
        for (int i = 0; i < s.Length; i++)
            ans += (26 - (s[i] - 'a')) * (i + 1);
        return ans;
    }
}
