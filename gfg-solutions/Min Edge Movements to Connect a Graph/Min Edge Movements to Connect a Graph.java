// Approach: Moving an edge means removing it from one place and adding it
// elsewhere. To connect c components you need c-1 new bridges. If the graph
// already has fewer than n-1 edges total, there are not enough edges to form a
// tree even after rearranging, so return -1. Otherwise DFS/BFS count components
// and answer is components - 1.
// Time: O(n + m) Space: O(n + m)
import java.util.*;

class Solution {

    int minEdgesReq(int n, int[][] edges) {
        if (edges.length < n - 1) {
            return -1;
        }

        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] e : edges) {
            int a = e[0];
            int b = e[1];
            adj.get(a).add(b);
            adj.get(b).add(a);
        }
        boolean[] vis = new boolean[n];
        int com = 0;
        for (int i = 0; i < n; i++) {
            if (!vis[i]) {
                com++;
                dfs(adj, vis, i);
            }
        }
        return com - 1;
    }

    public void dfs(ArrayList<ArrayList<Integer>> adj, boolean[] vis, int src) {
        vis[src] = true;
        for (Integer v : adj.get(src)) {
            if (!vis[v]) {
                dfs(adj, vis, v);
            }
        }
    }
}
