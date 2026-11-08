// Approach: Count servers in every row and every column. A server can talk to
// another when its row has more than one server or its column has more than
// one. A second pass counts those servers. Every cell must be read, so the
// bound is already tight.
// Time: O(m · n) Space: O(m + n)

public class Solution
{
    public int CountServers(int[][] grid)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        int ans = 0;
        int[] rows = new int[m];
        int[] cols = new int[n];

        for (int i = 0; i < m; ++i)
        {
            for (int j = 0; j < n; ++j)
            {
                if (grid[i][j] == 1)
                {
                    ++rows[i];
                    ++cols[j];
                }
            }
        }

        for (int i = 0; i < m; ++i)
        {
            for (int j = 0; j < n; ++j)
            {
                if (grid[i][j] == 1 && (rows[i] > 1 || cols[j] > 1))
                    ++ans;
            }
        }

        return ans;
    }
}