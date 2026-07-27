// Approach: 2D DP extending the standard Unique Paths solution to handle obstacles.
// dp[i][j] = number of distinct paths to reach cell (i,j) from (0,0).
// If obstacleGrid[i][j] == 1, set dp[i][j] = 0 (no paths through an obstacle).
// Otherwise dp[i][j] = dp[i-1][j] + dp[i][j-1] (paths from above + paths from left).
// Initialise the first row and column carefully - any obstacle blocks all cells beyond it.
// Time: O(m x n) Space: O(m x n); reducible to O(n) with a rolling row.

public class Solution
{
    public int UniquePathsWithObstacles(int[][] obstacleGrid)
    {
        int m = obstacleGrid.Length;
        int n = obstacleGrid[0].Length;
        // int[][] dp = new int[m][];
        // for(int i = 0; i < m; i++)
        // {
        //     int[] arr = new int[n];
        //     Array.Fill(arr, -1);
        //     dp[i] = arr;
        // }
        //return topdown(m - 1, n - 1, obstacleGrid, dp);
        return tabulation(m - 1, n - 1, obstacleGrid);
    }

    private int topdown(int row, int col, int[][] grid, int[][] dp)
    {
        if (row >= 0 && col >= 0 && grid[row][col] == 1)
            return 0;

        if (row == 0 && col == 0)
            return 1;

        if (row < 0 || col < 0)
            return 0;

        if (dp[row][col] != -1)
            return dp[row][col];

        int cnt = 0;
        cnt += topdown(row - 1, col, grid, dp);
        cnt += topdown(row, col - 1, grid, dp);
        dp[row][col] = cnt;

        return cnt;
    }

    private static int tabulation(int row, int col, int[][] grid)
    {
        int[] prev = new int[col + 1];

        for (int i = 0; i <= row; i++)
        {
            int[] curr = new int[col + 1];
            for (int j = 0; j <= col; j++)
            {
                if (grid[i][j] == 1)
                    curr[j] = 0;
                else if (i == 0 && j == 0)
                    curr[j] = 1;
                else
                {
                    int up = 0, left = 0;
                    if (i > 0)
                        up = prev[j];
                    if (j > 0)
                        left = curr[j - 1];

                    curr[j] = up + left;
                }
            }
            prev = curr;
        }

        return prev[col];
    }
}