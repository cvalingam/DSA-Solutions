// Approach: Greedy - fill each cell with min(rowSum[i], colSum[j]) and subtract from both.
// Time: O(mn) Space: O(mn)

public class Solution
{
    public int[][] RestoreMatrix(int[] rowSum, int[] colSum)
    {
        int m = rowSum.Length;
        int n = colSum.Length;
        int[][] ans = new int[m][];

        for (int i = 0; i < m; ++i)
            ans[i] = new int[n];

        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j)
            {
                ans[i][j] = Math.Min(rowSum[i], colSum[j]);
                rowSum[i] -= ans[i][j];
                colSum[j] -= ans[i][j];
            }

        return ans;
    }
}