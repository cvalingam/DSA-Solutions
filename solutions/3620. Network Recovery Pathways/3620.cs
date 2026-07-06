// Approach: Binary search the path score (minimum edge weight on a path). For threshold mid,
// keep edges with cost ≥ mid on online nodes and run Dijkstra; feasible if dist[n−1] ≤ k.
// Time: O((n + m) log n log W) Space: O(n + m)
public class Solution
{
    int n;
    List<int[]>[] g;
    long k;

    bool Check(int mid)
    {
        long[] dist = new long[n];
        for (int i = 0; i < n; i++) dist[i] = long.MaxValue / 4;
        dist[0] = 0;

        var pq = new PriorityQueue<(long dist, int node), long>();
        pq.Enqueue((0, 0), 0);

        while (pq.Count > 0)
        {
            var cur = pq.Dequeue();
            long d = cur.dist;
            int u = cur.node;

            if (d > k) return false;
            if (u == n - 1) return true;
            if (dist[u] < d) continue;

            foreach (var e in g[u])
            {
                int v = e[0], w = e[1];
                if (w < mid) continue;

                long nd = d + w;
                if (nd < dist[v])
                {
                    dist[v] = nd;
                    pq.Enqueue((nd, v), nd);
                }
            }
        }

        return false;
    }

    public int FindMaxPathScore(int[][] edges, bool[] online, long k)
    {
        this.k = k;
        n = online.Length;
        g = new List<int[]>[n];
        for (int i = 0; i < n; i++) g[i] = new List<int[]>();

        int l = int.MaxValue;
        int r = 0;

        foreach (var e in edges)
        {
            int u = e[0], v = e[1], w = e[2];
            if (!online[u] || !online[v]) continue;

            g[u].Add(new int[] { v, w });
            l = Math.Min(l, w);
            r = Math.Max(r, w);
        }

        while (l < r)
        {
            int mid = (l + r + 1) >> 1;
            if (Check(mid))
                l = mid;
            else
                r = mid - 1;
        }

        return Check(l) ? l : -1;
    }
}