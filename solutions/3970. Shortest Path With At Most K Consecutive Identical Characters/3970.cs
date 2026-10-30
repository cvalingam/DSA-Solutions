// Approach: Edge weights are positive, so Dijkstra finds the cheapest path.
// Reaching a node with a longer run of the same letter leaves less room, so
// the state is the node plus the current run, which is at most k. The start
// letter is a run of 1. The next letter grows that run when it matches and
// resets it to 1 otherwise. Runs past k are dropped. Distances are 64-bit
// so a long path does not wrap during the search.
// Time: O((n + m) * k * log(n * k)) Space: O(n * k + m)

public class Solution
{
    public int ShortestPath(int n, int[][] edges, string labels, int k)
    {
        int m = edges.Length;
        int[] head = new int[n];
        Array.Fill(head, -1);
        int[] to = new int[m];
        int[] weight = new int[m];
        int[] next = new int[m];
        for (int i = 0; i < m; i++)
        {
            int u = edges[i][0];
            to[i] = edges[i][1];
            weight[i] = edges[i][2];
            next[i] = head[u];
            head[u] = i;
        }

        int stride = k + 1;
        long[] dist = new long[n * stride];
        Array.Fill(dist, long.MaxValue);
        dist[1] = 0;

        var pq = new PriorityQueue<int, long>();
        pq.Enqueue(1, 0);
        while (pq.TryDequeue(out int state, out long d))
        {
            if (d != dist[state])
                continue;
            int u = state / stride;
            if (u == n - 1)
                return (int)d;

            int cur = state - u * stride;
            char here = labels[u];
            for (int e = head[u]; e >= 0; e = next[e])
            {
                int v = to[e];
                int run = labels[v] == here ? cur + 1 : 1;
                if (run > k)
                    continue;
                long nd = d + weight[e];
                int ns = v * stride + run;
                if (nd < dist[ns])
                {
                    dist[ns] = nd;
                    pq.Enqueue(ns, nd);
                }
            }
        }
        return -1;
    }
}
