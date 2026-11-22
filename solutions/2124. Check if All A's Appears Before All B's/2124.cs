// Approach: All a's before all b's means the string never contains the
// substring "ba". A single search for that pattern decides the answer.
// Time: O(n) Space: O(1)

public class Solution
{
    public bool CheckString(string s)
    {
        return !s.Contains("ba");
    }
}
