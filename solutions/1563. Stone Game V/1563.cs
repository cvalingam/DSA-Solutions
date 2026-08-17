// Approach: Interval DP with memo. On stoneValue[i..j], try every split p.
// Compare left/right prefix sums: discard the heavier side (either if equal),
// add the kept sum to the recursive best on the kept interval. Alice maximizes.
// Complexity: O(n^3) time and O(n^2) space.
public class Solution
{
    public int StoneGameV(int[] stoneValue)
    {
        int n = stoneValue.Length;
        int[][] mem = new int[n][];
        for (int i = 0; i < n; i++)
        {
            mem[i] = new int[n];
            Array.Fill(mem[i], int.MinValue);
        }
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; ++i)
            prefix[i + 1] = prefix[i] + stoneValue[i];
        return StoneGameV(stoneValue, 0, n - 1, prefix, mem);
    }

    // Returns the maximum score that Alice can obtain from stoneValue[i..j].
    private int StoneGameV(int[] stoneValue, int i, int j, int[] prefix, int[][] mem)
    {
        if (i == j)
            return 0;
        if (mem[i][j] != int.MinValue)
            return mem[i][j];

        for (int p = i; p < j; ++p)
        {
            int leftSum = prefix[p + 1] - prefix[i];
            int throwRight = leftSum + StoneGameV(stoneValue, i, p, prefix, mem);
            int rightSum = prefix[j + 1] - prefix[p + 1];
            int throwLeft = rightSum + StoneGameV(stoneValue, p + 1, j, prefix, mem);
            if (leftSum < rightSum)
                mem[i][j] = Math.Max(mem[i][j], throwRight);
            else if (leftSum > rightSum)
                mem[i][j] = Math.Max(mem[i][j], throwLeft);
            else
                mem[i][j] = Math.Max(Math.Max(mem[i][j], throwLeft), throwRight);
        }

        return mem[i][j];
    }
}
