// Approach: Bellman-Ford with all distances starting at 0 (virtual super-
// source into every vertex). Relax every edge up to V-1 times, stopping early
// if a pass makes no change. One more successful relax means a negative cycle.
// Complexity: O(V * E) time and O(V) extra space.

class Solution {

    public boolean isNegativeWeightCycle(int V, int[][] edges) {
        int[] dist = new int[V];

        for (int i = 0; i < V - 1; i++) {
            boolean updated = false;

            for (int[] e : edges) {
                int u = e[0];
                int v = e[1];
                int w = e[2];

                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }

            if (!updated) {
                break;
            }
        }

        for (int[] e : edges) {
            if (dist[e[0]] + e[2] < dist[e[1]]) {
                return true;
            }
        }

        return false;
    }
}
