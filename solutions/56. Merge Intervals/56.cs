// Approach: Sort all intervals by start value so that overlapping intervals become adjacent.
// Maintain a running merged interval (the last element in the result list).
// For each subsequent interval: if its start <= current end, they overlap - extend end if needed.
// If its start > current end, they do not overlap - push the current interval and start a new one.
// Sorting is the critical insight: without it we would need O(n^2) pairwise comparisons.
// Handle the edge case where the last running interval is never pushed (add it after the loop).
// Time: O(n log n) dominated by sort; merging is O(n). Space: O(n) for the result.

public class Solution
{
    public int[][] Merge(int[][] intervals)
    {
        List<int[]> mergedIntervals = new List<int[]>();

        if (intervals.Length == 0 || intervals == null)
        {
            return mergedIntervals.ToArray();
        }

        Array.Sort(intervals, (a, b) => a[0] - b[0]);

        int start = intervals[0][0];
        int end = intervals[0][1];

        for (int i = 0; i < intervals.Length; i++)
        {
            if (intervals[i][0] <= end)
            {
                end = Math.Max(end, intervals[i][1]);
            }
            else
            {
                mergedIntervals.Add(new int[] { start, end });
                start = intervals[i][0];
                end = intervals[i][1];
            }
        }
        mergedIntervals.Add(new int[] { start, end });

        return mergedIntervals.ToArray();
    }
}