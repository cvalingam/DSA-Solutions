// Approach: Define dp[i][j] as the side length of the largest all-'1' square with its bottom-right corner at (i,j).
// Recurrence: if matrix[i][j] == '1', dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).
// The minimum of the three neighbors limits the square size - the weakest neighbor is the bottleneck.
// If matrix[i][j] == '0', dp[i][j] = 0 since no square can have its corner here.
// Track the maximum dp value seen; the area is (maxSide)^2.
// The dp table can be compressed to a 1D rolling array to reduce space to O(n).
// Time: O(m x n) Space: O(m x n); reducible to O(n) with a rolling array.

public class Solution
{
    public int MaximalSquare(char[][] matrix)
    {
        int m = matrix.Length;
        int n = matrix[0].Length;
        int maxi = 0;
        int[][] dp = new int[m][];
        for (int i = 0; i < m; i++)
        {
            dp[i] = new int[n];
            dp[i][0] = matrix[i][0] - '0';
        }

        for (int j = 0; j < n; j++)
            dp[0][j] = matrix[0][j] - '0';

        for (int i = 1; i < m; i++)
        {
            for (int j = 1; j < n; j++)
            {
                if (matrix[i][j] == '1')
                    dp[i][j] = 1 + Math.Min(dp[i - 1][j], Math.Min(dp[i - 1][j - 1], dp[i][j - 1]));
                else
                    dp[i][j] = 0;
            }
        }

        for (int i = 0; i < m; i++)
        {
            for (int j = 0; j < n; j++)
                maxi = Math.Max(maxi, dp[i][j]);
        }

        return maxi * maxi;
    }
}