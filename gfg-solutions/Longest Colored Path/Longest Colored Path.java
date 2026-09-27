// Approach: A valid path is one color, or one red run joined to one blue run.
// Same-color nodes form tree components. In a tree the farthest node from
// anywhere is an endpoint of a diameter, so two BFS passes give every node's
// longest same-color distance. A bichromatic edge then joins those two arms.
// Complexity: O(n) time, O(n) extra space.
import java.util.*;

class Solution {
    public int longestPath(String s, int[][] edges) {
        int n = s.length();
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++)
            adj[i] = new ArrayList<>();
        for (int[] e : edges) {
            int u = e[0] - 1;
            int v = e[1] - 1;
            adj[u].add(v);
            adj[v].add(u);
        }

        int[] distA = new int[n];
        int[] distB = new int[n];
        int[] far = new int[n];
        Arrays.fill(distA, -1);
        Arrays.fill(distB, -1);
        boolean[] seen = new boolean[n];
        int best = 0;

        for (int src = 0; src < n; src++) {
            if (seen[src])
                continue;
            char col = s.charAt(src);
            List<Integer> comp = new ArrayList<>();
            int endA = bfs(src, col, s, adj, distA, comp);
            for (int node : comp) {
                seen[node] = true;
                distA[node] = -1;
            }

            List<Integer> touched = new ArrayList<>();
            int endB = bfs(endA, col, s, adj, distA, touched);
            bfs(endB, col, s, adj, distB, new ArrayList<>());

            best = Math.max(best, distA[endB] + 1);
            for (int node : comp) {
                far[node] = Math.max(distA[node], distB[node]);
                distA[node] = -1;
                distB[node] = -1;
            }
        }

        for (int[] e : edges) {
            int u = e[0] - 1;
            int v = e[1] - 1;
            if (s.charAt(u) != s.charAt(v))
                best = Math.max(best, far[u] + far[v] + 2);
        }
        return best;
    }

    // Fills dist for the same-color component and returns a farthest node.
    private int bfs(int start, char col, String s, List<Integer>[] adj, int[] dist, List<Integer> touched) {
        ArrayDeque<Integer> q = new ArrayDeque<>();
        dist[start] = 0;
        q.add(start);
        touched.add(start);
        int farNode = start;

        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj[u]) {
                if (s.charAt(v) != col || dist[v] != -1)
                    continue;
                dist[v] = dist[u] + 1;
                touched.add(v);
                q.add(v);
                if (dist[v] > dist[farNode])
                    farNode = v;
            }
        }
        return farNode;
    }
}
