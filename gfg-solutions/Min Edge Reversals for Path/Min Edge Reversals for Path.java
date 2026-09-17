// Approach: Model each directed edge u->v as cost 0, and the reverse v->u as
// cost 1. Minimum reversals from src to dst is then shortest path with only
// 0/1 weights, solved by 0-1 BFS (deque: 0-cost to front, 1-cost to back).
// Complexity: O(n + m) time and space.
import java.util.*;

class Solution {
    public int minimumEdgeReversal(int[][] edges, int n, int src, int dst) {
        List<int[]>[] adj = new ArrayList[n + 1];
        for (int i = 0; i <= n; i++)
            adj[i] = new ArrayList<>();

        for (int[] e : edges) {
            int u = e[0], v = e[1];
            adj[u].add(new int[] { v, 0 });
            adj[v].add(new int[] { u, 1 });
        }

        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        ArrayDeque<Integer> dq = new ArrayDeque<>();
        dq.add(src);

        while (!dq.isEmpty()) {
            int u = dq.pollFirst();
            if (u == dst)
                return dist[u];

            for (int[] edge : adj[u]) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    if (w == 0)
                        dq.addFirst(v);
                    else
                        dq.addLast(v);
                }
            }
        }

        return -1;
    }
}
