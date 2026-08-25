// Approach: Mark values that appear (values are at most 100). Then walk
// k, 2k, 3k, ... and return the first multiple that is unmarked or larger
// than 100, since that multiple cannot be in nums.
// Complexity: O(n) time and O(1) extra space (fixed table of size 101).
public class Solution
{
    public int MissingMultiple(int[] nums, int k)
    {
        bool[] s = new bool[101];
        foreach (int x in nums)
        {
            if (x < s.Length)
                s[x] = true;
        }
        for (int i = 1; ; ++i)
        {
            int x = k * i;
            if (x >= s.Length || !s[x])
                return x;
        }
    }
}