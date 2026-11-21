// Approach: DFS the original tree while keeping the nearest ancestor for each
// letter on the current path. That ancestor (or the old parent if none) is the
// new parent. Then DFS the rebuilt tree once to fill subtree sizes.
// Time: O(n) Space: O(n)

public class Solution
{
    public int[] FindSubtreeSizes(int[] parent, string s)
    {
        int n = parent.Length;
        var tree = new List<int>[n];
        var newTree = new List<int>[n];
        for (int i = 0; i < n; ++i)
        {
            tree[i] = new List<int>();
            newTree[i] = new List<int>();
        }

        for (int i = 1; i < n; ++i)
            tree[parent[i]].Add(i);

        int[] last = new int[26];
        Array.Fill(last, -1);
        Build(0, parent, s, tree, newTree, last);

        int[] ans = new int[n];
        DfsSize(0, newTree, ans);
        return ans;
    }

    private void Build(int u, int[] parent, string s, List<int>[] tree,
                       List<int>[] newTree, int[] last)
    {
        int c = s[u] - 'a';
        int prev = last[c];

        if (u != 0)
        {
            int p = prev != -1 ? prev : parent[u];
            newTree[p].Add(u);
        }

        last[c] = u;
        foreach (int v in tree[u])
            Build(v, parent, s, tree, newTree, last);
        last[c] = prev;
    }

    private int DfsSize(int u, List<int>[] tree, int[] ans)
    {
        int sz = 1;
        foreach (int v in tree[u])
            sz += DfsSize(v, tree, ans);
        return ans[u] = sz;
    }
}
