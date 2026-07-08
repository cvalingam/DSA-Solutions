// Approach: Prefix arrays — sumD (digit sum), cntN0 (non-zero count), p (concatenated value mod).
// For query [l,r]: x = p[r+1] − p[l]·10^n0, answer = x·sd mod 1e9+7.
// Time: O(n + q) Space: O(n)
public class Solution
{
    private const int MX = 100001;
    private const int MOD = 1_000_000_007;
    private static readonly long[] POW10 = new long[MX];

    static Solution()
    {
        POW10[0] = 1;
        for (int i = 1; i < MX; i++)
        {
            POW10[i] = POW10[i - 1] * 10 % MOD;
        }
    }

    public int[] SumAndMultiply(string s, int[][] queries)
    {
        int n = s.Length;
        int[] sumD = new int[n + 1];
        int[] cntN0 = new int[n + 1];
        long[] p = new long[n + 1];

        for (int i = 1; i <= n; i++)
        {
            int d = s[i - 1] - '0';
            sumD[i] = sumD[i - 1] + d;
            cntN0[i] = cntN0[i - 1] + (d > 0 ? 1 : 0);
            p[i] = d > 0 ? (p[i - 1] * 10 + d) % MOD : p[i - 1];
        }

        int[] ans = new int[queries.Length];
        for (int i = 0; i < queries.Length; i++)
        {
            int l = queries[i][0], r = queries[i][1];
            int n0 = cntN0[r + 1] - cntN0[l];
            int sd = sumD[r + 1] - sumD[l];
            long x = (p[r + 1] - p[l] * POW10[n0] % MOD + MOD) % MOD;
            ans[i] = (int)(x * sd % MOD);
        }
        return ans;
    }
}