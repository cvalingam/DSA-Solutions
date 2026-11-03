// Approach: A path whose heaviest edge is at most x uses only edges of
// weight at most x. Sorting the edges by weight and merging them with a
// disjoint set grows the connected components in that order. When two
// components of sizes a and b join, a * b new paths appear. Queries are
// sorted the same way and answered offline as edges are added.
// Complexity: O((n + q) log n) time, O(n + q) extra space.
import java.util.ArrayList;
import java.util.Arrays;
class Solution {
    public ArrayList<Integer> maximumWeight(int n, int[][] edges, int[] queries) {
        int[] parent = new int[n + 1];
        int[] size = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            parent[i] = i;
            size[i] = 1;
        }

        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));

        int q = queries.length;
        long[] order = new long[q];
        for (int i = 0; i < q; i++)
            order[i] = ((long) queries[i] << 32) | i;
        Arrays.sort(order);

        ArrayList<Integer> res = new ArrayList<>(q);
        for (int i = 0; i < q; i++)
            res.add(0);

        long paths = 0;
        int edgeIdx = 0;
        int edgeCount = edges.length;
        for (int i = 0; i < q; i++) {
            int limit = (int) (order[i] >>> 32);
            int idx = (int) order[i];
            while (edgeIdx < edgeCount && edges[edgeIdx][2] <= limit) {
                int u = find(parent, edges[edgeIdx][0]);
                int v = find(parent, edges[edgeIdx][1]);
                if (u != v) {
                    if (size[u] < size[v]) {
                        int temp = u;
                        u = v;
                        v = temp;
                    }
                    paths += (long) size[u] * size[v];
                    parent[v] = u;
                    size[u] += size[v];
                }
                edgeIdx++;
            }
            res.set(idx, (int) paths);
        }
        return res;
    }

    private static int find(int[] parent, int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
}
