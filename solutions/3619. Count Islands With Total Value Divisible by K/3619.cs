// Approach: An island is a 4-connected group of positive cells. Only the sum
// modulo k matters, so each cell adds its value modulo k into a running
// residue and is then set to 0. An explicit stack expands the four
// neighbors, so a snake of land stays on the heap.
// Time: O(m * n) Space: O(m * n)

public class Solution
{
    public int CountIslands(int[][] grid, int k)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        int ans = 0;
        int[] stack = new int[m * n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] > 0 && Flood(grid, stack, i, j, k) == 0)
                    ans++;
        return ans;
    }

    private static int Flood(int[][] grid, int[] stack, int si, int sj, int k)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        int top = 0;
        int residue = Push(grid, stack, ref top, si, sj, m, n, k, 0);
        while (top > 0)
        {
            int id = stack[--top];
            int r = id / n;
            int c = id - r * n;
            residue = Push(grid, stack, ref top, r - 1, c, m, n, k, residue);
            residue = Push(grid, stack, ref top, r + 1, c, m, n, k, residue);
            residue = Push(grid, stack, ref top, r, c - 1, m, n, k, residue);
            residue = Push(grid, stack, ref top, r, c + 1, m, n, k, residue);
        }
        return residue;
    }

    private static int Push(int[][] grid, int[] stack, ref int top, int r, int c, int m, int n, int k, int residue)
    {
        if (r < 0 || c < 0 || r == m || c == n || grid[r][c] == 0)
            return residue;
        residue += grid[r][c] % k;
        if (residue >= k)
            residue -= k;
        grid[r][c] = 0;
        stack[top++] = r * n + c;
        return residue;
    }
}
