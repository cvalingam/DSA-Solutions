// Approach: DFS from city 1 through the connected component. The answer is the minimum edge
// weight on any edge reachable from city 1 (any path 1→n uses only those edges).
// Time: O(n + m) Space: O(n + m)
public class Solution
{
    private int ans;
    private bool[] vis;
    private List<int[]>[] g;

    public int MinScore(int n, int[][] roads)
    {
        g = new List<int[]>[n + 1];
        for (int i = 0; i <= n; i++)
            g[i] = new List<int[]>();

        foreach (var e in roads)
        {
            int a = e[0], b = e[1], w = e[2];
            g[a].Add(new int[] { b, w });
            g[b].Add(new int[] { a, w });
        }

        ans = int.MaxValue;
        vis = new bool[n + 1];

        Dfs(1);
        return ans;
    }

    private void Dfs(int a)
    {
        vis[a] = true;
        foreach (var nb in g[a])
        {
            int b = nb[0], w = nb[1];
            ans = Math.Min(ans, w);
            if (!vis[b])
                Dfs(b);
        }
    }
}