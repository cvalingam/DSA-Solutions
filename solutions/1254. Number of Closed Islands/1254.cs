// Approach: A closed island is a 0-component that never touches the border.
// Flood each unvisited 0 with an explicit stack and mark it as visited. The
// component counts only when none of its cells lie on the first or last row
// or column. A grid thinner than 3 in either direction has no interior cell,
// so the answer is 0.
// Time: O(m * n) Space: O(m * n)

public class Solution
{
    public int ClosedIsland(int[][] grid)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        if (m < 3 || n < 3)
            return 0;

        int ans = 0;
        int[] stack = new int[m * n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] == 0 && Fill(grid, stack, i, j))
                    ans++;
        return ans;
    }

    private static bool Fill(int[][] grid, int[] stack, int si, int sj)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        bool closed = si > 0 && sj > 0 && si < m - 1 && sj < n - 1;
        int top = 0;
        stack[top++] = si * n + sj;
        grid[si][sj] = 1;

        while (top > 0)
        {
            int id = stack[--top];
            int r = id / n;
            int c = id - r * n;
            closed &= Push(grid, stack, ref top, r - 1, c, m, n);
            closed &= Push(grid, stack, ref top, r + 1, c, m, n);
            closed &= Push(grid, stack, ref top, r, c - 1, m, n);
            closed &= Push(grid, stack, ref top, r, c + 1, m, n);
        }
        return closed;
    }

    private static bool Push(int[][] grid, int[] stack, ref int top, int r, int c, int m, int n)
    {
        if (r < 0 || c < 0 || r == m || c == n || grid[r][c] == 1)
            return true;
        grid[r][c] = 1;
        stack[top++] = r * n + c;
        return r != 0 && c != 0 && r != m - 1 && c != n - 1;
    }
}
