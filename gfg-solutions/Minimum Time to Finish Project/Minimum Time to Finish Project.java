// Approach: Kahn's topological sort. A dependency [u, v] means v starts
// after u finishes, so finish[v] is its duration plus the largest finish
// among its prerequisites. Edges are stored in flat arrays (compressed
// adjacency), and the queue is a plain int array. If some task never reaches
// indegree 0, the dependencies contain a cycle and the project cannot finish.
// Complexity: O(n + m) time, O(n + m) extra space.
class Solution {
    public int minTime(int[] duration, int[][] dependencies) {
        int n = duration.length;
        int m = dependencies.length;

        int[] start = new int[n + 1];
        int[] indeg = new int[n];
        for (int[] d : dependencies) {
            start[d[0] + 1]++;
            indeg[d[1]]++;
        }
        for (int i = 0; i < n; i++)
            start[i + 1] += start[i];

        int[] next = new int[m];
        int[] fill = new int[n];
        System.arraycopy(start, 0, fill, 0, n);
        for (int[] d : dependencies)
            next[fill[d[0]]++] = d[1];

        int[] finish = new int[n];
        int[] queue = new int[n];
        int head = 0;
        int tail = 0;
        for (int i = 0; i < n; i++) {
            finish[i] = duration[i];
            if (indeg[i] == 0)
                queue[tail++] = i;
        }

        int ans = 0;
        while (head < tail) {
            int u = queue[head++];
            ans = Math.max(ans, finish[u]);
            for (int e = start[u]; e < start[u + 1]; e++) {
                int v = next[e];
                finish[v] = Math.max(finish[v], finish[u] + duration[v]);
                if (--indeg[v] == 0)
                    queue[tail++] = v;
            }
        }
        return tail < n ? -1 : ans;
    }
}
