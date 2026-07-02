// Approach: BFS on state (row, col, remainingHealth). Entering a cell costs grid[r][c],
// so we start with health - grid[0][0]. We can revisit the same cell with different
// remaining health values, so track seen[row,col,health]. If we ever reach the bottom-right
// cell with health > 0, a safe walk exists.
// Time: O(m * n * health) Space: O(m * n * health)
public class Solution
{
    private record T(int i, int j, int h);

    public bool FindSafeWalk(IList<IList<int>> grid, int health)
    {
        int[][] DIRS = new int[][] { new int[] { 0, 1 }, new int[] { 1, 0 }, new int[] { 0, -1 }, new int[] { -1, 0 } };
        int m = grid.Count;
        int n = grid[0].Count;
        int initialHealth = health - grid[0][0];
        var q = new Queue<T>();
        q.Enqueue(new T(0, 0, initialHealth));
        bool[,,] seen = new bool[m, n, health + 1];
        seen[0, 0, initialHealth] = true;

        while (q.Count > 0)
        {
            int sz = q.Count;
            for (int _ = 0; _ < sz; _++)
            {
                var curr = q.Dequeue();
                int i = curr.i, j = curr.j, h = curr.h;
                if (i == m - 1 && j == n - 1 && h > 0)
                    return true;
                for (int k = 0; k < 4; k++)
                {
                    int x = i + DIRS[k][0];
                    int y = j + DIRS[k][1];
                    if (x < 0 || x == m || y < 0 || y == n)
                        continue;
                    int nextHealth = h - grid[x][y];
                    if (nextHealth <= 0 || seen[x, y, nextHealth])
                        continue;
                    q.Enqueue(new T(x, y, nextHealth));
                    seen[x, y, nextHealth] = true;
                }
            }
        }

        return false;
    }
}