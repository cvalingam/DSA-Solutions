// Approach: Pack each row into a bitmask. For every shift (dr, dc), AND
// overlapping rows (with horizontal shifts) and sum popcounts. Max over shifts.
// Complexity: O(n^3) time and O(n) extra space, n <= 30.
using System.Numerics;

public class Solution
{
    public int LargestOverlap(int[][] img1, int[][] img2)
    {
        int n = img1.Length;
        long[] a = new long[n];
        long[] b = new long[n];
        long mask = (1L << n) - 1;

        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (img1[i][j] == 1)
                    a[i] |= 1L << j;
                if (img2[i][j] == 1)
                    b[i] |= 1L << j;
            }
        }

        int ans = 0;
        for (int dr = 1 - n; dr < n; dr++)
        {
            for (int dc = 1 - n; dc < n; dc++)
            {
                int overlap = 0;
                for (int r = 0; r < n; r++)
                {
                    int r2 = r + dr;
                    if ((uint)r2 >= (uint)n)
                        continue;

                    long row = dc >= 0 ? (a[r] << dc) & mask : a[r] >> -dc;
                    overlap += BitOperations.PopCount((ulong)(row & b[r2]));
                }
                if (overlap > ans)
                    ans = overlap;
            }
        }

        return ans;
    }
}
