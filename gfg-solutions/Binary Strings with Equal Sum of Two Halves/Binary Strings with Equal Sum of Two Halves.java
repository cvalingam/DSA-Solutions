// Approach: Equal halves means equal number of 1s in each half of length n. For k ones in the
// first half and k in the second, there are C(n,k)^2 strings; summing over k gives C(2n, n).
// Time: O(n) Space: O(n)

class Solution {

    public int computeValue(int n) {
        long[] fact = new long[2 * n + 1];
        fact[0] = 1;

        for (int i = 1; i <= 2 * n; i++) {
            fact[i] = (fact[i - 1] * i) % MOD;
        }

        long numerator = fact[2 * n];
        long denominator = (fact[n] * fact[n]) % MOD;

        long ans = (numerator * power(denominator, MOD - 2)) % MOD;

        return (int) ans;
    }

    static final long MOD = 1000000007L;

    long power(long a, long b) {
        long res = 1;
        a %= MOD;

        while (b > 0) {
            if ((b & 1) == 1) {
                res = (res * a) % MOD;
            }
            a = (a * a) % MOD;
            b >>= 1;
        }
        return res;
    }
}
