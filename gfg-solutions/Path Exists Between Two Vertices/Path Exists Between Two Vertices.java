// Approach: BFS from u through the adjacency list until v is reached or the
// reachable component is exhausted. Mark visited nodes so each vertex and
// edge is processed once. Equal endpoints are a trivial yes.
// Complexity: O(V + E) time, O(V) extra space.
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Queue;

class Solution {
    public boolean checkPath(ArrayList<ArrayList<Integer>> adj, int u, int v) {
        if (u == v)
            return true;

        boolean[] vis = new boolean[adj.size()];
        Queue<Integer> q = new ArrayDeque<>();
        q.add(u);
        vis[u] = true;

        while (!q.isEmpty()) {
            int node = q.poll();
            for (int nei : adj.get(node)) {
                if (vis[nei])
                    continue;
                if (nei == v)
                    return true;
                vis[nei] = true;
                q.add(nei);
            }
        }

        return false;
    }
}