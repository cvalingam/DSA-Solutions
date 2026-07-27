// Approach: Reverse multi-source BFS from each ocean's border inward.
// Water flows from higher or equal elevation to lower, so reverse this:
// start BFS from Pacific-border cells and mark all cells reachable going uphill.
// Repeat from Atlantic-border cells.
// Any cell marked reachable from BOTH oceans is a valid result - water can flow to both.
// Two separate boolean matrices track reachability; the intersection is the answer.
// Time: O(m x n) Space: O(m x n) for the two visited matrices.

public class Solution
{
    private static readonly int[][] DIRS = new int[][] {
        new int[] {0, 1}, new int[] {1, 0}, new int[] {0, -1}, new int[] {-1, 0}
    };

    public IList<IList<int>> PacificAtlantic(int[][] heights)
    {
        int m = heights.Length;
        int n = heights[0].Length;
        var ans = new List<IList<int>>();
        var qP = new Queue<(int, int)>();
        var qA = new Queue<(int, int)>();
        bool[,] seenP = new bool[m, n];
        bool[,] seenA = new bool[m, n];

        for (int i = 0; i < m; ++i)
        {
            qP.Enqueue((i, 0));
            qA.Enqueue((i, n - 1));
            seenP[i, 0] = true;
            seenA[i, n - 1] = true;
        }

        for (int j = 0; j < n; ++j)
        {
            qP.Enqueue((0, j));
            qA.Enqueue((m - 1, j));
            seenP[0, j] = true;
            seenA[m - 1, j] = true;
        }

        Bfs(heights, qP, seenP);
        Bfs(heights, qA, seenA);

        for (int i = 0; i < m; ++i)
        {
            for (int j = 0; j < n; ++j)
            {
                if (seenP[i, j] && seenA[i, j])
                    ans.Add(new List<int> { i, j });
            }
        }

        return ans;
    }

    private void Bfs(int[][] heights, Queue<(int, int)> q, bool[,] seen)
    {
        while (q.Count > 0)
        {
            var (i, j) = q.Dequeue();
            int h = heights[i][j];
            foreach (var dir in DIRS)
            {
                int x = i + dir[0];
                int y = j + dir[1];
                if (x < 0 || x == heights.Length || y < 0 || y == heights[0].Length)
                    continue;
                if (seen[x, y] || heights[x][y] < h)
                    continue;
                q.Enqueue((x, y));
                seen[x, y] = true;
            }
        }
    }
}