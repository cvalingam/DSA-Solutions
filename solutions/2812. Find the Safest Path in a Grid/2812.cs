// Approach: Multi-source BFS labels each cell with Manhattan distance to the nearest thief.
// Maximin path Dijkstra from (0,0): each step keeps min(path safeness, neighbor distance).
// One pass replaces binary search + repeated BFS. Time: O(n^2 log n) Space: O(n^2)
public class Solution
{
    private static readonly int[] Dr = { 0, 0, 1, -1 };
    private static readonly int[] Dc = { 1, -1, 0, 0 };

    public int MaximumSafenessFactor(IList<IList<int>> grid)
    {
        int n = grid.Count;
        int[,] dist = BuildDistToThief(grid, n);
        int[,] best = new int[n, n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                best[i, j] = -1;

        var pq = new PriorityQueue<(int r, int c, int s), int>(
            Comparer<int>.Create((a, b) => b.CompareTo(a)));

        best[0, 0] = dist[0, 0];
        pq.Enqueue((0, 0, best[0, 0]), best[0, 0]);

        while (pq.Count > 0)
        {
            var (r, c, s) = pq.Dequeue();
            if (s != best[r, c])
                continue;
            if (r == n - 1 && c == n - 1)
                return s;

            for (int d = 0; d < 4; d++)
            {
                int nr = r + Dr[d];
                int nc = c + Dc[d];
                if (nr < 0 || nr >= n || nc < 0 || nc >= n)
                    continue;

                int ns = Math.Min(s, dist[nr, nc]);
                if (ns > best[nr, nc])
                {
                    best[nr, nc] = ns;
                    pq.Enqueue((nr, nc, ns), ns);
                }
            }
        }

        return best[n - 1, n - 1];
    }

    private static int[,] BuildDistToThief(IList<IList<int>> grid, int n)
    {
        int[,] dist = new int[n, n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i, j] = -1;

        var q = new Queue<(int r, int c)>();
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (grid[i][j] == 1)
                {
                    dist[i, j] = 0;
                    q.Enqueue((i, j));
                }
            }
        }

        for (int level = 0; q.Count > 0; level++)
        {
            int sz = q.Count;
            while (sz-- > 0)
            {
                var (r, c) = q.Dequeue();
                for (int d = 0; d < 4; d++)
                {
                    int nr = r + Dr[d];
                    int nc = c + Dc[d];
                    if (nr < 0 || nr >= n || nc < 0 || nc >= n || dist[nr, nc] != -1)
                        continue;
                    dist[nr, nc] = level + 1;
                    q.Enqueue((nr, nc));
                }
            }
        }

        return dist;
    }
}
