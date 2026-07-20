public class Solution
{
    // Approach: Treat the grid as a flattened 1D array of length m*n. For each
    // cell (i, j), move it k positions forward in row-major order with wrap-around:
    // newIndex = (i*n + j + k) % (m*n), then write into (newIndex/n, newIndex%n).
    // Complexity: O(m·n) time and O(m·n) space.
    public IList<IList<int>> ShiftGrid(int[][] grid, int k)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        var ans = new List<IList<int>>();
        int[,] arr = new int[m, n];

        k %= m * n;

        for (int i = 0; i < m; ++i)
        {
            for (int j = 0; j < n; ++j)
            {
                int index = (i * n + j + k) % (m * n);
                int x = index / n;
                int y = index % n;
                arr[x, y] = grid[i][j];
            }
        }

        for (int i = 0; i < m; i++)
        {
            var row = new List<int>();
            for (int j = 0; j < n; j++)
                row.Add(arr[i, j]);
            ans.Add(row);
        }

        return ans;
    }
}