// Approach: Count palindromes of length 1..n whose letters are all distinct,
// chosen from k symbols. Even length 2m uses P(k,m) for the first half; odd
// length 2m+1 multiplies by (k-m) for the center. Sum over valid m.
// Complexity: O(min(n, k)) time and O(1) extra space.

class Solution {

    static final long MOD = 1_000_000_007L;

    public int palindromicStrings(int n, int k) {
        long ans = 0;
        long perm = 1;

        for (int m = 0; 2 * m <= n && m <= k; m++) {
            if (m > 0) {
                perm = perm * (k - m + 1) % MOD;
            }

            if (2 * m + 1 <= n) {
                ans = (ans + perm * (k - m)) % MOD;
            }

            if (m > 0 && 2 * m <= n) {
                ans = (ans + perm) % MOD;
            }
        }

        return (int) ans;
    }
}
