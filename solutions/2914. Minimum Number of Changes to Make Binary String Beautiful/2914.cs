// Approach: A beautiful binary string splits into even-length blocks of equal
// bits. Length-2 blocks are enough: each pair s[2i], s[2i+1] must match, and
// a mismatch costs one change. Scan those pairs once. Every character must
// be read, so the bound is already tight.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MinChanges(string s)
    {
        int ans = 0;

        for (int i = 0; i + 1 < s.Length; i += 2)
        {
            if (s[i] != s[i + 1])
                ++ans;
        }

        return ans;
    }
}