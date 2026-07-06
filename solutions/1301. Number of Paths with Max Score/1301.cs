// Approach: Bottom-up DP from (n−1,n−1). For each cell, take max score from right/down/diagonal
// neighbors and sum path counts on ties. Add digit score when the cell is reachable.
// Time: O(n^2) Space: O(n^2)
public class Solution
{
    public int[] PathsWithMaxScore(IList<string> board)
    {
        const int MOD = 1_000_000_007;
        int[][] DIRS = new int[][] { new int[] { 0, 1 }, new int[] { 1, 0 }, new int[] { 1, 1 } };
        int n = board.Count;
        // dp[i][j] := the maximum sum from (n - 1, n - 1) to (i, j)
        int[,] dp = new int[n + 1, n + 1];
        for (int i = 0; i <= n; i++)
        {
            for (int j = 0; j <= n; j++)
                dp[i, j] = -1;
        }
        // count[i][j] := the number of paths to get dp[i][j] from (n - 1, n - 1) to (i, j)
        int[,] count = new int[n + 1, n + 1];

        dp[0, 0] = 0;
        dp[n - 1, n - 1] = 0;
        count[n - 1, n - 1] = 1;

        for (int i = n - 1; i >= 0; --i)
        {
            for (int j = n - 1; j >= 0; --j)
            {
                char c = board[i][j];
                if (c == 'S' || c == 'X')
                    continue;
                foreach (var dir in DIRS)
                {
                    int x = i + dir[0];
                    int y = j + dir[1];
                    if (x < 0 || x >= n || y < 0 || y >= n)
                        continue;
                    if (dp[i, j] < dp[x, y])
                    {
                        dp[i, j] = dp[x, y];
                        count[i, j] = count[x, y];
                    }
                    else if (dp[i, j] == dp[x, y])
                        count[i, j] = (count[i, j] + count[x, y]) % MOD;
                }
                // If there's path(s) from 'S' to (i, j) and the cell is not 'E'.
                if (dp[i, j] != -1 && c != 'E')
                    dp[i, j] = (dp[i, j] + (c - '0')) % MOD;
            }
        }

        return new int[] { dp[0, 0], count[0, 0] };
    }
}