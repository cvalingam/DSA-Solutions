// Approach: Generate all strings reachable from s1 and s2 by applying each of the two allowed swaps
// (indices 0↔2, indices 1↔3) independently - at most 4 variants per string. Check if any variant
// of s1 equals any variant of s2.
// Time: O(1) Space: O(1)
public class Solution
{
    public bool CanBeEqual(string s1, string s2)
    {
        foreach (var a in SwappedStrings(s1))
        {
            foreach (var b in SwappedStrings(s2))
            {
                if (a == b)
                    return true;
            }
        }
        
        return false;
    }

    private List<string> SwappedStrings(string s)
    {
        var res = new List<string>();
        char[] chars = s.ToCharArray();
        res.Add(s);
        res.Add(new string(new char[] { chars[2], chars[1], chars[0], chars[3] }));
        res.Add(new string(new char[] { chars[0], chars[3], chars[2], chars[1] }));
        res.Add(new string(new char[] { chars[2], chars[3], chars[0], chars[1] }));
        return res;
    }
}