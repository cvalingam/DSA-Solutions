// Approach: Every digit sits in exactly 2^(n - 1) non-empty subsequences,
// because each of the other n - 1 digits may be kept or dropped. Sum all
// digits once, multiply by 2^(n - 1) under the modulus, and return that
// product. The string must be read, so the bound is already tight.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int subsequenceSum(String s) {
        int n = s.length();
        if (n == 0) {
            return 0;
        }

        final int mod = 1_000_000_007;
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += s.charAt(i) - '0';
        }

        return (int) ((sum % mod) * modPow(2, n - 1, mod) % mod);
    }

    private long modPow(long base, long exp, int mod) {
        long res = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                res = res * base % mod;
            }
            base = base * base % mod;
            exp >>= 1;
        }
        return res;
    }
}
