// Approach: A path can be rearranged into a palindrome when at most one letter
// has an odd count. Pack the 26 parities into one bitmask. The mask from the
// root to a node is a prefix XOR, so the path from u to v is prefix[u] XOR
// prefix[v] XOR the LCA letter, which was cancelled by the two prefixes.
// Changing a node XORs the difference into every node of its subtree. An
// Euler index turns that subtree into a range, and a Fenwick tree applies
// the range XOR and reads a point prefix. The LCA comes from binary lifting.
// Time: O((n + q) * log n) Space: O(n * log n)

public class Solution
{
    public IList<bool> PalindromePath(int n, int[][] edges, string s, string[] queries)
    {
        int[] deg = new int[n];
        for (int i = 0; i < edges.Length; i++)
        {
            deg[edges[i][0]]++;
            deg[edges[i][1]]++;
        }

        int[][] adj = new int[n][];
        int[] fill = new int[n];
        for (int i = 0; i < n; i++)
            adj[i] = new int[deg[i]];
        for (int i = 0; i < edges.Length; i++)
        {
            int u = edges[i][0];
            int v = edges[i][1];
            adj[u][fill[u]++] = v;
            adj[v][fill[v]++] = u;
        }

        const int Log = 16;
        int[][] up = new int[Log][];
        for (int k = 0; k < Log; k++)
            up[k] = new int[n];
        int[] parent = new int[n];
        int[] depth = new int[n];
        int[] tin = new int[n];
        int[] tout = new int[n];
        parent[0] = -1;

        int[] st = new int[n];
        int[] it = new int[n];
        int top = 0;
        int timer = 0;
        st[top++] = 0;
        tin[0] = ++timer;
        while (top > 0)
        {
            int u = st[top - 1];
            if (it[u] < adj[u].Length)
            {
                int v = adj[u][it[u]++];
                if (v == parent[u])
                    continue;
                parent[v] = u;
                depth[v] = depth[u] + 1;
                up[0][v] = u;
                tin[v] = ++timer;
                st[top++] = v;
            }
            else
            {
                tout[u] = timer + 1;
                top--;
            }
        }

        for (int k = 1; k < Log; k++)
            for (int u = 0; u < n; u++)
                up[k][u] = up[k - 1][up[k - 1][u]];

        int[] bit = new int[n + 2];
        int[] mask = new int[n];
        for (int i = 0; i < n; i++)
        {
            mask[i] = 1 << (s[i] - 'a');
            RangeXor(bit, n, tin[i], tout[i], mask[i]);
        }

        var ans = new List<bool>();
        for (int qi = 0; qi < queries.Length; qi++)
        {
            string q = queries[qi];
            int p = 0;
            while (q[p] != ' ')
                p++;
            p++;
            int u = 0;
            while (q[p] != ' ')
                u = u * 10 + (q[p++] - '0');
            p++;
            if (q[0] == 'q')
            {
                int v = 0;
                while (p < q.Length)
                    v = v * 10 + (q[p++] - '0');
                int lca = Lca(u, v, depth, up);
                int path = Ask(bit, tin[u]) ^ Ask(bit, tin[v]) ^ mask[lca];
                ans.Add((path & (path - 1)) == 0);
            }
            else
            {
                int next = 1 << (q[p] - 'a');
                RangeXor(bit, n, tin[u], tout[u], mask[u] ^ next);
                mask[u] = next;
            }
        }
        return ans;
    }

    private static int Lca(int a, int b, int[] depth, int[][] up)
    {
        if (depth[a] < depth[b])
        {
            int t = a;
            a = b;
            b = t;
        }
        int diff = depth[a] - depth[b];
        for (int k = 0; diff > 0; k++, diff >>= 1)
            if ((diff & 1) == 1)
                a = up[k][a];
        if (a == b)
            return a;
        for (int k = up.Length - 1; k >= 0; k--)
            if (up[k][a] != up[k][b])
            {
                a = up[k][a];
                b = up[k][b];
            }
        return up[0][a];
    }

    private static void RangeXor(int[] bit, int n, int l, int r, int v)
    {
        Add(bit, n, l, v);
        if (r <= n)
            Add(bit, n, r, v);
    }

    private static void Add(int[] bit, int n, int i, int v)
    {
        for (; i <= n; i += i & -i)
            bit[i] ^= v;
    }

    private static int Ask(int[] bit, int i)
    {
        int x = 0;
        for (; i > 0; i -= i & -i)
            x ^= bit[i];
        return x;
    }
}
