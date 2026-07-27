// Approach: For each 3×3 sub-grid with center 5, verify all 9 digits are distinct 1-9 and all rows, columns, and diagonals sum to 15.
// Time: O(n²) Space: O(1)

public class Solution
{
    public int NumMagicSquaresInside(int[][] grid)
    {
        int ans = 0;
        var set = new HashSet<int>() {
            1, 2, 3, 4, 5, 6, 7, 8, 9
        };

        for (int i = 0; i + 2 < grid.Length; i++)
        {
            for (int j = 0; j + 2 < grid[0].Length; j++)
            {
                if (grid[i + 1][j + 1] != 5)
                    continue;

                if (IsMagic(grid[i][j], grid[i][j + 1],
                        grid[i][j + 2], grid[i + 1][j],
                        grid[i + 1][j + 1],
                        grid[i + 1][j + 2],
                        grid[i + 2][j],
                        grid[i + 2][j + 1],
                        grid[i + 2][j + 2], set) != 0)
                    ans++;
            }
        }

        return ans;
    }

    private int IsMagic(int a, int b, int c, int d, int e,
                     int f, int g, int h, int i, HashSet<int> set)
    {
        HashSet<int> s1 = new HashSet<int>() {
            a, b, c, d, e, f, g, h, i
        };

        if (s1.SetEquals(set) && (a + b + c) == 15
            && (d + e + f) == 15 && (g + h + i) == 15
            && (a + d + g) == 15 && (b + e + h) == 15
            && (c + f + i) == 15 && (a + e + i) == 15
            && (c + e + g) == 15)
            return 1;
        return 0;
    }
}