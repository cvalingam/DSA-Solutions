// Approach: The best party house minimizes the farthest house distance, i.e.
// the tree radius. Two BFS runs find a diameter; radius is (diameter + 1) / 2.
// Complexity: O(n) time and O(n) extra space.
import java.util.*;

class Solution {

    public int partyHouse(ArrayList<ArrayList<Integer>> adj) {
        int[] first = bfs(adj, 0);
        int[] second = bfs(adj, first[0]);
        return (second[1] + 1) / 2;
    }

    // Returns {farthestNode, maxDist} from start.
    private int[] bfs(ArrayList<ArrayList<Integer>> adj, int start) {
        int n = adj.size();
        boolean[] visited = new boolean[n];
        Queue<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{start, 0});
        visited[start] = true;

        int farthest = start;
        int maxDist = 0;

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int node = cur[0];
            int dist = cur[1];
            if (dist > maxDist) {
                maxDist = dist;
                farthest = node;
            }

            for (int next : adj.get(node)) {
                next--; // 1-based house numbers in the adjacency list
                if (!visited[next]) {
                    visited[next] = true;
                    q.offer(new int[]{next, dist + 1});
                }
            }
        }

        return new int[]{farthest, maxDist};
    }
}
