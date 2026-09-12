// Approach: Sort intervals by left endpoint. DP(i, quota) = best (weight,
// lex-smallest original indices) from intervals[i..] with at most quota picks.
// Binary-search the first start strictly after the current right; share no
// endpoints. Precompute those jumps once.
// Complexity: O(n log n + n) time with quota fixed at 4, O(n) extra space.
public class Solution
{
    public int[] MaximumWeight(IList<IList<int>> intervals)
    {
        int n = intervals.Count;
        var indexed = new Interval[n];
        for (int i = 0; i < n; i++)
        {
            var it = intervals[i];
            indexed[i] = new Interval(it[0], it[1], it[2], i);
        }

        Array.Sort(indexed, (a, b) =>
        {
            int c = a.Left.CompareTo(b.Left);
            return c != 0 ? c : a.OriginalIndex.CompareTo(b.OriginalIndex);
        });

        int[] next = new int[n];
        for (int i = 0; i < n; i++)
            next[i] = FindFirstGreater(indexed, i + 1, indexed[i].Right);

        var memo = new T?[n, 5];
        return Dp(indexed, next, memo, 0, 4).Selected.ToArray();
    }

    private record T(long Weight, List<int> Selected);
    private record Interval(int Left, int Right, int Weight, int OriginalIndex);

    private T Dp(Interval[] intervals, int[] next, T?[,] memo, int i, int quota)
    {
        if (i == intervals.Length || quota == 0)
            return new T(0, new List<int>());
        if (memo[i, quota] != null)
            return memo[i, quota]!;

        T skip = Dp(intervals, next, memo, i + 1, quota);

        Interval cur = intervals[i];
        T nextRes = Dp(intervals, next, memo, next[i], quota - 1);

        List<int> picked = new List<int>(nextRes.Selected.Count + 1);
        InsertSorted(picked, nextRes.Selected, cur.OriginalIndex);
        T take = new T(cur.Weight + nextRes.Weight, picked);

        T best = Better(take, skip);
        memo[i, quota] = best;
        return best;
    }

    private static void InsertSorted(List<int> dest, List<int> src, int value)
    {
        bool placed = false;
        foreach (int x in src)
        {
            if (!placed && value < x)
            {
                dest.Add(value);
                placed = true;
            }
            dest.Add(x);
        }
        if (!placed)
            dest.Add(value);
    }

    private static T Better(T a, T b)
    {
        if (a.Weight != b.Weight)
            return a.Weight > b.Weight ? a : b;
        return CompareLists(a.Selected, b.Selected) <= 0 ? a : b;
    }

    private static int FindFirstGreater(Interval[] intervals, int startFrom, int rightBoundary)
    {
        int l = startFrom;
        int r = intervals.Length;
        while (l < r)
        {
            int m = l + (r - l) / 2;
            if (intervals[m].Left > rightBoundary)
                r = m;
            else
                l = m + 1;
        }
        return l;
    }

    private static int CompareLists(List<int> a, List<int> b)
    {
        int m = Math.Min(a.Count, b.Count);
        for (int i = 0; i < m; i++)
        {
            int c = a[i].CompareTo(b[i]);
            if (c != 0)
                return c;
        }
        return a.Count.CompareTo(b.Count);
    }
}
