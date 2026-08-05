// Approach: Directed DFS from k marks the suspicious closure (k and everything
// it can reach via invocations). Undirected edges then flood from every still
// non-suspicious method, clearing the suspicious flag along the connected
// component - any outside reach into the group means removal is illegal, so
// those methods stay. Remaining methods are those with suspicious = false.
// Time: O(n + E) Space: O(n + E)
public class Solution
{
    private bool[] suspicious;
    private bool[] vis;
    private List<int>[] f;
    private List<int>[] g;

    public IList<int> RemainingMethods(int n, int k, int[][] invocations)
    {
        suspicious = new bool[n];
        vis = new bool[n];
        f = new List<int>[n];
        g = new List<int>[n];

        for (int i = 0; i < n; i++)
        {
            f[i] = new List<int>();
            g[i] = new List<int>();
        }

        foreach (var e in invocations)
        {
            int a = e[0], b = e[1];
            f[a].Add(b);
            f[b].Add(a);
            g[a].Add(b);
        }

        Dfs(k);
        for (int i = 0; i < n; ++i)
        {
            if (!suspicious[i] && !vis[i])
                Dfs2(i);
        }

        List<int> ans = new List<int>();
        for (int i = 0; i < n; ++i)
        {
            if (!suspicious[i])
                ans.Add(i);
        }
        return ans;
    }

    private void Dfs(int i)
    {
        suspicious[i] = true;
        foreach (int j in g[i])
        {
            if (!suspicious[j])
                Dfs(j);
        }
    }

    private void Dfs2(int i)
    {
        vis[i] = true;
        foreach (int j in f[i])
        {
            if (!vis[j])
            {
                suspicious[j] = false;
                Dfs2(j);
            }
        }
    }
}
