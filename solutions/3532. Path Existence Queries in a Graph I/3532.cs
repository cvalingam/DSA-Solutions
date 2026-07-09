// Approach: nums is sorted, so connected components are contiguous index ranges where each
// adjacent gap satisfies |nums[i] - nums[i-1]| <= maxDiff. Union those neighbors in DSU;
// each query is true iff Find(u) == Find(v).
// Time: O(n α(n) + q) Space: O(n)
public class Solution
{
    public bool[] PathExistenceQueries(int n, int[] nums, int maxDiff, int[][] queries)
    {
        bool[] ans = new bool[queries.Length];
        UnionFind uf = new UnionFind(n);

        for (int i = 1; i < n; ++i)
        {
            if (Math.Abs(nums[i] - nums[i - 1]) <= maxDiff)
                uf.UnionByRank(i, i - 1);
        }

        for (int i = 0; i < queries.Length; ++i)
        {
            int u = queries[i][0];
            int v = queries[i][1];
            ans[i] = uf.Find(u) == uf.Find(v);
        }

        return ans;
    }
}

public class UnionFind
{
    private int[] id;
    private int[] rank;

    public UnionFind(int n)
    {
        id = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; ++i)
            id[i] = i;
    }

    public void UnionByRank(int u, int v)
    {
        int i = Find(u);
        int j = Find(v);
        if (i == j)
            return;
        if (rank[i] < rank[j])
            id[i] = j;
        else if (rank[i] > rank[j])
            id[j] = i;
        else
        {
            id[i] = j;
            ++rank[j];
        }
    }

    public int Find(int u)
    {
        if (id[u] == u)
            return u;
        return id[u] = Find(id[u]);
    }
}