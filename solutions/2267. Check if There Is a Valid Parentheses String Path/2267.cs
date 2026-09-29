// Approach: Every path into a cell has the same length, so the balance of
// opens minus closes fits in a bitset. Entering '(' shifts that set up by
// one. Entering ')' shifts it down and drops a negative balance. A cell
// keeps the union of the cell above and the cell to the left.
// Complexity: O(mn (m + n) / 64) time, O(n (m + n) / 64) extra space.
public class Solution
{
    public bool HasValidPath(char[][] grid)
    {
        int m = grid.Length;
        int n = grid[0].Length;
        // A valid parentheses string has even length. The path has m + n - 1 cells.
        if (((m + n) & 1) == 0 || grid[0][0] != '(' || grid[m - 1][n - 1] != ')')
            return false;

        int words = (m + n + 63) >> 6;
        ulong[][] dp = new ulong[n][];
        for (int j = 0; j < n; j++)
            dp[j] = new ulong[words];
        ulong[] cell = new ulong[words];

        for (int i = 0; i < m; i++)
        {
            for (int j = 0; j < n; j++)
            {
                Array.Clear(cell);
                if (i == 0 && j == 0)
                    cell[0] = 1UL;
                else
                {
                    if (i > 0)
                        OrInto(cell, dp[j]);
                    if (j > 0)
                        OrInto(cell, dp[j - 1]);
                }

                if (grid[i][j] == '(')
                    ShiftUp(cell);
                else
                    ShiftDown(cell);

                ulong[] previous = dp[j];
                dp[j] = cell;
                cell = previous;
            }
        }

        return (dp[n - 1][0] & 1UL) != 0;
    }

    private static void OrInto(ulong[] dst, ulong[] src)
    {
        for (int i = 0; i < dst.Length; i++)
            dst[i] |= src[i];
    }

    // Balance k moves to k + 1.
    private static void ShiftUp(ulong[] bits)
    {
        ulong carry = 0;
        for (int i = 0; i < bits.Length; i++)
        {
            ulong next = bits[i] >> 63;
            bits[i] = (bits[i] << 1) | carry;
            carry = next;
        }
    }

    // Balance k moves to k - 1. A zero balance falls off and is discarded.
    private static void ShiftDown(ulong[] bits)
    {
        ulong carry = 0;
        for (int i = bits.Length - 1; i >= 0; i--)
        {
            ulong next = bits[i] << 63;
            bits[i] = (bits[i] >> 1) | carry;
            carry = next;
        }
    }
}
