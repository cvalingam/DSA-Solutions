// Approach: Union-Find - the first edge whose two vertices share the same
// root is the redundant connection forming a cycle.
// Time: O(nα(n)) Space: O(n)

public class Solution
{
    public int[] FindRedundantConnection(int[][] edges)
    {
        int n = edges.Length;
        DisjointSet ds = new DisjointSet(n);

        for (int i = 0; i < n; i++)
        {
            int u = edges[i][0];
            int v = edges[i][1];
            if (ds.findUPar(u) == ds.findUPar(v))
                return new int[] { u, v };
            else
                ds.unionBySize(u, v);
        }

        return new int[] { -1, -1 };
    }
}

class DisjointSet
{
    //public List<int> rank = new List<int>();
    public List<int> parent = new List<int>();
    public List<int> size = new List<int>();
    public DisjointSet(int n)
    {
        for (int i = 0; i <= n; i++)
        {
            //rank.Add(0); 
            parent.Add(i);
            size.Add(1);
        }
    }

    public int findUPar(int node)
    {
        if (node == parent[node])
            return node;

        return parent[node] = findUPar(parent[node]);
    }

    public void unionBySize(int u, int v)
    {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v)
            return;
        if (size[ulp_u] < size[ulp_v])
            parent[ulp_u] = ulp_v;
        else if (size[ulp_v] < size[ulp_u])
            parent[ulp_v] = ulp_u;
        else
        {
            parent[ulp_v] = ulp_u;
            int sizeU = size[ulp_u];
            size[ulp_u] = sizeU + 1;
        }
    }
}