// Approach: After a take of stones[0..i], the pile becomes prefix[i] plus the
// unused suffix, so the opponent starts at i. Current best difference is
// max(skip to a later start, prefix[i] - opponentBest). Walk right to left;
// only the next dp value is needed, so keep one variable.
// Complexity: O(n) time and O(1) extra space (prefix written into stones).
public class Solution
{
    public int StoneGameVIII(int[] stones)
    {
        int n = stones.Length;
        for (int i = 1; i < n; i++)
            stones[i] += stones[i - 1];

        int ans = stones[n - 1];
        for (int i = n - 2; i >= 1; i--)
            ans = Math.Max(ans, stones[i] - ans);

        return ans;
    }
}
