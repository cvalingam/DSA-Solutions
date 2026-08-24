// Approach: Prefix-balanced binary strings of n pairs are Dyck words, so the
// count is the Catalan number C_n = (1/(n+1)) * C(2n, n). Build
// (n+1)*...*(2n) / (n+1)! modulo 1e9+7 with one Fermat inverse.
// Complexity: O(n + log MOD) time and O(1) extra space.

class Solution {

    static final long MOD = 1000000007L;

    public int prefixStrings(int n) {
        long numerator = 1;
        long denominator = n + 1L;

        for (int i = 1; i <= n; i++) {
            numerator = numerator * (n + i) % MOD;
            denominator = denominator * i % MOD;
        }

        return (int) (numerator * power(denominator, MOD - 2) % MOD);
    }

    private long power(long a, long b) {
        long result = 1;

        while (b > 0) {
            if ((b & 1) == 1) {
                result = result * a % MOD;
            }

            a = a * a % MOD;
            b >>= 1;
        }

        return result;
    }
}
