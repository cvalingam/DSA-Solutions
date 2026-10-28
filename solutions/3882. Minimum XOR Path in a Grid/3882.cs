// Approach: XOR is not a running minimum, because a larger prefix can finish
// smaller. Every cell value fits in 10 bits, so every path XOR has at most R
// possible values, where R is the next power of two above the largest cell.
// A cell's reachable values are the values of the cell above and the cell to
// the left, each XORed with the current cell. Only the previous row is kept.
// Time: O(m * n * R) Space: O(n * R)

public class Solution
{
    public int MinCost(int[][] grid)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        int maxV = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] > maxV)
                    maxV = grid[i][j];

        int limit = 1;
        while (limit <= maxV)
            limit <<= 1;

        bool[][] above = new bool[n][];
        bool[][] cur = new bool[n][];
        for (int j = 0; j < n; j++)
        {
            above[j] = new bool[limit];
            cur[j] = new bool[limit];
        }
        above[0][0] = true;

        for (int i = 0; i < m; i++)
        {
            for (int j = 0; j < n; j++)
                Array.Clear(cur[j]);
            for (int j = 0; j < n; j++)
            {
                int v = grid[i][j];
                bool[] up = above[j];
                bool[] left = j > 0 ? cur[j - 1] : null;
                bool[] dest = cur[j];
                for (int k = 0; k < limit; k++)
                    if (up[k] || (left != null && left[k]))
                        dest[k ^ v] = true;
            }

            bool[][] tmp = above;
            above = cur;
            cur = tmp;
        }

        for (int k = 0; k < limit; k++)
            if (above[n - 1][k])
                return k;
        return 0;
    }
}
