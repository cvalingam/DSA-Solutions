// Approach: Every route uses exactly x left steps and y down steps in some
// order, so the count is the binomial C(x + y, k) with k = min(x, y).
// Multiply the k numerator terms and the k denominator terms modulo the
// prime, then divide once with a Fermat inverse.
// Complexity: O(min(x, y) + log MOD) time, O(1) extra space.
class Solution {
    private static final long MOD = 1_000_000_007L;

    public int ways(int x, int y) {
        int n = x + y;
        int k = Math.min(x, y);
        long num = 1;
        long den = 1;
        for (int i = 1; i <= k; i++) {
            num = num * (n - k + i) % MOD;
            den = den * i % MOD;
        }
        return (int) (num * pow(den, MOD - 2) % MOD);
    }

    private long pow(long base, long exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1)
                result = result * base % MOD;
            base = base * base % MOD;
            exp >>= 1;
        }
        return result;
    }
}
