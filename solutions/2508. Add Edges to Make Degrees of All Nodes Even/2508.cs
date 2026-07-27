// Approach: Build adjacency sets. Count odd-degree nodes - must be 0, 2, or 4.
// With 0 odd nodes: already valid. With 2 odd nodes (a,b): find a node not adjacent to
// both. With 4 odd nodes (a,b,c,d): try pairing (a-b,c-d), (a-c,b-d), (a-d,b-c).
// Time: O(n + e) Space: O(n + e)
public class Solution
{
    public bool IsPossible(int n, IList<IList<int>> edges)
    {
        HashSet<int>[] graph = new HashSet<int>[n];

        for (int i = 0; i < n; ++i)
            graph[i] = new HashSet<int>();

        foreach (List<int> edge in edges)
        {
            int u = edge[0] - 1;
            int v = edge[1] - 1;
            graph[u].Add(v);
            graph[v].Add(u);
        }

        List<int> oddNodes = GetOddNodes(graph);
        if (oddNodes.Count == 0)
            return true;
        if (oddNodes.Count == 2)
        {
            int a = oddNodes[0];
            int b = oddNodes[1];
            for (int i = 0; i < n; ++i)
                // Can connect i with a and i with b.
                if (!graph[i].Contains(a) && !graph[i].Contains(b))
                    return true;
        }
        if (oddNodes.Count == 4)
        {
            int a = oddNodes[0];
            int b = oddNodes[1];
            int c = oddNodes[2];
            int d = oddNodes[3];
            return (!graph[a].Contains(b) && !graph[c].Contains(d)) ||
                   (!graph[a].Contains(c) && !graph[b].Contains(d)) ||
                   (!graph[a].Contains(d) && !graph[b].Contains(c));
        }
        return false;
    }

    private List<int> GetOddNodes(HashSet<int>[] graph)
    {
        List<int> oddNodes = new List<int>();
        for (int i = 0; i < graph.Length; ++i)
            if (graph[i].Count % 2 == 1)
                oddNodes.Add(i);
        return oddNodes;
    }
}