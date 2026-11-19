// Approach: Two changes can always make the low score 0 by duplicating a value,
// so minimize the high score. After identifying order statistics, the three
// options are remove the two smallest, the two largest, or one of each. Only
// the three smallest and three largest values are needed, found in one pass.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MinimizeSum(int[] nums)
    {
        int a = int.MaxValue, b = int.MaxValue, c = int.MaxValue;
        int x = int.MinValue, y = int.MinValue, z = int.MinValue;

        foreach (int v in nums)
        {
            if (v <= a) { c = b; b = a; a = v; }
            else if (v <= b) { c = b; b = v; }
            else if (v < c) c = v;

            if (v >= x) { z = y; y = x; x = v; }
            else if (v >= y) { z = y; y = v; }
            else if (v > z) z = v;
        }

        return Math.Min(x - c, Math.Min(z - a, y - b));
    }
}
