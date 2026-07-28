
import java.util.*;

class Solution {

    // Approach: Undirected graph with edge weights 1 or 2. Run Dijkstra from src:
    // min-heap of (distance, node), relax neighbors when a shorter path is found,
    // and return the distance when dest is first polled (or -1 if unreachable).
    // Complexity: O((V + E) log V) time and O(V + E) space.
    public int shortestPath(int V, int src, int dest, int[][] edges) {
        List<int[]>[] adj = new ArrayList[V];
        for (int i = 0; i < V; i++) {
            adj[i] = new ArrayList();
        }

        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int w = edge[2];

            adj[u].add(new int[]{w, v});
            adj[v].add(new int[]{w, u});
        }

        PriorityQueue<int[]> pq = new PriorityQueue<int[]>(
                (p, q) -> Integer.compare(p[0], q[0])
        );
        pq.offer(new int[]{0, src});

        int[] dis = new int[V];
        Arrays.fill(dis, Integer.MAX_VALUE);
        dis[src] = 0;

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();

            int node = cur[1];
            int dist = cur[0];

            if (node == dest) {
                return dist;
            }

            for (int[] next : adj[node]) {
                int adjNode = next[1];
                int adjDist = next[0];

                if (dist + adjDist < dis[adjNode]) {
                    dis[adjNode] = dist + adjDist;
                    pq.offer(new int[]{dis[adjNode], adjNode});
                }
            }
        }
        return -1;
    }
}
