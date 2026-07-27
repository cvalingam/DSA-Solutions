// Approach: Three-pointer DP - track the next multiple of 2, 3, and 5 from
// the generated list; advance the pointer(s) that produced the minimum.
// Time: O(n) Space: O(n)

public class Solution
{
    public int NthUglyNumber(int n)
    {
        List<int> uglyNums = new List<int>();
        uglyNums.Add(1);
        int i2 = 0;
        int i3 = 0;
        int i5 = 0;

        while (uglyNums.Count < n)
        {
            int next2 = uglyNums[i2] * 2;
            int next3 = uglyNums[i3] * 3;
            int next5 = uglyNums[i5] * 5;
            int next = Math.Min(next2, Math.Min(next3, next5));
            if (next == next2)
                i2++;
            if (next == next3)
                i3++;
            if (next == next5)
                i5++;
            uglyNums.Add(next);
        }

        return uglyNums[uglyNums.Count - 1];
    }
}