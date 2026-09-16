// Approach: Sharing endpoints maps to C(n + k - 1, 2k): each of k segments
// needs 2 endpoints, and k-1 "glue" units encode shared joins, so pick 2k
// positions from n+k-1. Compute the binomial mod 1e9+7 multiplicatively.
// Complexity: O(k log MOD) time, O(1) extra space.
public class Solution
{
    private const int Mod = 1_000_000_007;

    public int NumberOfSets(int n, int k)
    {
        return Comb(n + k - 1, 2 * k);
    }

    // C(n, r) mod Mod via product form; uses min(r, n-r).
    private static int Comb(int n, int r)
    {
        if (r < 0 || r > n)
            return 0;
        r = Math.Min(r, n - r);
        long res = 1;
        for (int i = 1; i <= r; i++)
        {
            res = res * (n - r + i) % Mod;
            res = res * ModInverse(i) % Mod;
        }
        return (int)res;
    }

    private static long ModInverse(int a)
    {
        return ModPow(a, Mod - 2);
    }

    private static long ModPow(long baseVal, int exp)
    {
        long res = 1;
        baseVal %= Mod;
        while (exp > 0)
        {
            if ((exp & 1) == 1)
                res = res * baseVal % Mod;
            baseVal = baseVal * baseVal % Mod;
            exp >>= 1;
        }
        return res;
    }
}
