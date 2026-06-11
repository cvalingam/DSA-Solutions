// Approach: Build the tree, BFS from node 1 to find the maximum depth in edges, then count
// assignments of weights 1/2 on that deepest path with odd total weight. For d path edges,
// exactly half of the 2^d assignments have odd sum, so the answer is 2^(d-1).
// Time: O(n + log n) Space: O(n)

public class Solution
{
    private const int MOD = 1_000_000_007;

    public int AssignEdgeWeights(int[][] edges)
    {
        int n = edges.Length + 1;
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

        Queue<int> q = new Queue<int>();
        q.Enqueue(1);
        bool[] seen = new bool[n + 1];
        seen[1] = true;

        int step = 0;
        while (q.Count > 0)
        {
            int sz = q.Count;
            for (int i = 0; i < sz; i++)
            {
                int u = q.Dequeue();
                foreach (int v in graph[u])
                {
                    if (!seen[v])
                    {
                        q.Enqueue(v);
                        seen[v] = true;
                    }
                }
            }
            step++;
        }

        return step > 1 ? ModPow(2, step - 2) : 0;
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
