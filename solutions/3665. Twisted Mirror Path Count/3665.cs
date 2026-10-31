// Approach: The robot only steps right or down. Entering a mirror while
// moving right continues downward into the cell below it, and entering a
// mirror while moving down continues rightward into the cell beside it.
// Chains of mirrors keep that same rule, so a path never moves up or left.
// Each cell stores how many ways arrive from above and how many arrive from
// the left. An empty cell sends both of those onward. A mirror sends only
// the arrival that bounces through it. The previous row is reused.
// Time: O(m * n) Space: O(n)

public class Solution
{
    public int UniquePaths(int[][] grid)
    {
        const int Mod = 1_000_000_007;
        int m = grid.Length;
        int n = grid[0].Length;
        long[] fromAbove = new long[n];
        long[] fromLeft = new long[n];
        fromAbove[0] = 1;

        for (int i = 0; i < m; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (i > 0)
                {
                    if (grid[i - 1][j] == 0)
                        fromAbove[j] = (fromAbove[j] + fromLeft[j]) % Mod;
                    else
                        fromAbove[j] = fromLeft[j];
                }
                if (j > 0)
                {
                    if (grid[i][j - 1] == 0)
                        fromLeft[j] = (fromAbove[j - 1] + fromLeft[j - 1]) % Mod;
                    else
                        fromLeft[j] = fromAbove[j - 1];
                }
            }
        }
        return (int)((fromAbove[n - 1] + fromLeft[n - 1]) % Mod);
    }
}
