// Approach: Eulerian path - find start node (outDegree - inDegree = 1 or arbitrary); Hierholzer's DFS.
// Time: O(n) Space: O(n)

public class Solution
{
    public int[][] ValidArrangement(int[][] pairs)
    {
        List<int[]> ans = new List<int[]>();
        Dictionary<int, Stack<int>> graph = new Dictionary<int, Stack<int>>();
        Dictionary<int, int> outDegree = new Dictionary<int, int>();
        Dictionary<int, int> inDegrees = new Dictionary<int, int>();

        foreach (int[] pair in pairs)
        {
            int start = pair[0];
            int end = pair[1];
            if (!graph.ContainsKey(start))
                graph[start] = new Stack<int>();

            graph[start].Push(end);
            outDegree[start] = outDegree.GetValueOrDefault(start, 0) + 1;
            inDegrees[end] = inDegrees.GetValueOrDefault(end, 0) + 1;
        }

        int startNode = GetStartNode(graph, outDegree, inDegrees, pairs);
        Euler(graph, startNode, ans);
        ans.Reverse();
        return ans.ToArray();
    }

    private int GetStartNode(Dictionary<int, Stack<int>> graph, Dictionary<int, int> outDegree,
                             Dictionary<int, int> inDegrees, int[][] pairs)
    {
        foreach (int u in graph.Keys)
        {
            if (outDegree.GetValueOrDefault(u, 0) - inDegrees.GetValueOrDefault(u, 0) == 1)
                return u;
        }
        return pairs[0][0]; // Arbitrarily choose a node.
    }

    private void Euler(Dictionary<int, Stack<int>> graph, int u, List<int[]> ans)
    {
        Stack<int> stack = graph.GetValueOrDefault(u);
        while (stack != null && stack.Count > 0)
        {
            int v = stack.Pop();
            Euler(graph, v, ans);
            ans.Add(new int[] { u, v });
        }
    }
}