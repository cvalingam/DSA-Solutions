// Approach: Sort by start ascending; for equal starts, longer intervals first. Scan and count
// only intervals whose end extends past the farthest end seen so far.
// Time: O(n log n) Space: O(1) extra (sort in-place)
public class Solution
{
    public int RemoveCoveredIntervals(int[][] intervals)
    {
        Array.Sort(intervals, (a, b) =>
        {
            int cmp = a[0].CompareTo(b[0]);
            if (cmp == 0)
                return b[1].CompareTo(a[1]);

            return cmp;
        });

        int ans = 0;
        int prevEnd = 0;

        foreach (var interval in intervals)
        {
            if (prevEnd < interval[1])
            {
                prevEnd = interval[1];
                ans++;
            }
        }

        return ans;
    }
}
