// Approach: Root the tree at 1, precompute depths and binary-lifting parents, then answer
// each query by finding the LCA and path length d between the two nodes. For d edges,
// exactly half of the 2^d weight assignments have odd sum, so the answer is 2^(d-1).
// Time: O((n + q) log n) Space: O(n log n)

public class Solution
{
    private const int MOD = 1_000_000_007;
    private const int LOG = 17; // since 2^17 > 1e5

    public int[] AssignEdgeWeights(int[][] edges, int[][] queries)
    {
        int n = edges.Length + 1;
        int[] ans = new int[queries.Length];
        int[] depth = new int[n + 1];
        int[][] parent = new int[LOG][];
        for (int i = 0; i < LOG; i++)
        {
            parent[i] = new int[n + 1];
            for (int j = 0; j <= n; j++)
                parent[i][j] = -1;
        }

        List<int>[] graph = new List<int>[n + 1];
        for (int i = 0; i <= n; i++)
            graph[i] = new List<int>();

        foreach (var edge in edges)
        {
            int u = edge[0];
            int v = edge[1];
            graph[u].Add(v);
            graph[v].Add(u);
        }

        Dfs(1, -1, graph, parent, depth);

        for (int k = 1; k < LOG; ++k)
        {
            for (int v = 1; v <= n; ++v)
            {
                if (parent[k - 1][v] != -1)
                    parent[k][v] = parent[k - 1][parent[k - 1][v]];
            }
        }

        for (int i = 0; i < queries.Length; ++i)
        {
            int u = queries[i][0];
            int v = queries[i][1];
            if (u == v)
                ans[i] = 0;
            else
            {
                int a = Lca(u, v, parent, depth);
                int d = depth[u] + depth[v] - 2 * depth[a];
                ans[i] = ModPow(2, d - 1);
            }
        }

        return ans;
    }

    private void Dfs(int u, int p, List<int>[] graph, int[][] parent, int[] depth)
    {
        parent[0][u] = p;
        foreach (int v in graph[u])
        {
            if (v != p)
            {
                depth[v] = depth[u] + 1;
                Dfs(v, u, graph, parent, depth);
            }
        }
    }

    private int Lca(int u, int v, int[][] parent, int[] depth)
    {
        if (depth[u] < depth[v])
        {
            int temp = u;
            u = v;
            v = temp;
        }

        for (int k = LOG - 1; k >= 0; --k)
        {
            if (parent[k][u] != -1 && depth[parent[k][u]] >= depth[v])
                u = parent[k][u];
        }

        if (u == v) 
            return u;

        for (int k = LOG - 1; k >= 0; --k)
        {
            if (parent[k][u] != -1 && parent[k][u] != parent[k][v])
            {
                u = parent[k][u];
                v = parent[k][v];
            }
        }

        return parent[0][u];
    }

    private int ModPow(long x, long n)
    {
        if (n == 0) 
            return 1;

        if ((n & 1) == 1) 
            return (int)(x * ModPow(x % MOD, n - 1) % MOD);

        long half = ModPow(x * x % MOD, n / 2);
        return (int)(half % MOD);
    }
}
