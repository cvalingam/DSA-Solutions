// Approach: DFS with memoization - for each cell, recursively explore all four neighbors
// that have a strictly larger value, caching the longest path from each cell.
// Start a DFS from every unvisited cell; the global maximum over all starts is the answer.
// Because the path must strictly increase, no cycle is possible - no visited set is needed.
// The memoization table ensures each cell is fully computed only once.
// Time: O(m x n) - each cell visited once. Space: O(m x n) for the memo table.

public class Solution
{
    public int LongestIncreasingPath(int[][] matrix)
    {
        int m = matrix.Length;
        int n = matrix[0].Length;
        int ans = 0;
        // mem[i][j] := the LIP starting from matrix[i][j]
        int[][] mem = new int[m][];

        for (int i = 0; i < m; ++i)
            mem[i] = new int[n];

        for (int i = 0; i < m; ++i)
        {
            for (int j = 0; j < n; ++j)
                ans = Math.Max(ans, Dfs(matrix, i, j, int.MinValue, mem));
        }

        return ans;
    }

    private int Dfs(int[][] matrix, int i, int j, int prev, int[][] mem)
    {
        if (i < 0 || i == matrix.Length || j < 0 || j == matrix[0].Length)
            return 0;

        if (matrix[i][j] <= prev)
            return 0;

        if (mem[i][j] > 0)
            return mem[i][j];

        int curr = matrix[i][j];
        int a = Dfs(matrix, i + 1, j, curr, mem);
        int b = Dfs(matrix, i - 1, j, curr, mem);
        int c = Dfs(matrix, i, j + 1, curr, mem);
        int d = Dfs(matrix, i, j - 1, curr, mem);
        
        return mem[i][j] = 1 + Math.Max(Math.Max(a, b), Math.Max(c, d));
    }
}