// Approach: DP with memoization - state (point, segments, prevUsed) to count valid placements.
// Time: O(n²k) Space: O(nk)

public class Solution
{
    public int NumberOfSets(int n, int k)
    {
        int?[][][] mem = new int?[n][][];
        for (int i = 0; i < n; i++)
        {
            mem[i] = new int?[k + 1][];
            for (int j = 0; j <= k; j++)
                mem[i][j] = new int?[2];
        }
        
        return NumberOfSets(0, k, false, n, mem).Value;
    }

    private const int kMod = 1000000007;

    private int? NumberOfSets(int i, int k, bool drawing, int n, int?[][][] mem)
    {
        if (k == 0) // Find a way to draw k segments.
            return 1;
        if (i == n) // Reach the end.
            return 0;
        if (mem[i][k][drawing ? 1 : 0] != null)
            return mem[i][k][drawing ? 1 : 0].Value;

        // 1. Keep drawing at i and move to i + 1.
        // 2. Stop at i so decrease k. We can start from i for the next segment.
        if (drawing)
            return mem[i][k][drawing ? 1 : 0] = (NumberOfSets(i + 1, k, true, n, mem) +
                                                  NumberOfSets(i, k - 1, false, n, mem)) % kMod;
        // 1. Skip i and move to i + 1.
        // 2. Start at i and move to i + 1.
        return mem[i][k][drawing ? 1 : 0] = (NumberOfSets(i + 1, k, false, n, mem) +
                                              NumberOfSets(i + 1, k, true, n, mem)) % kMod;
    }
}