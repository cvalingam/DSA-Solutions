// Approach: For jump j the time is T(d - j) + 1, where T(x) is the time to
// reach x under the a-forward / b-back cycle. Those times form a sparse
// sequence, so the sum over a range of positions is a prefix difference:
// sum(1..t) minus the missing 2b-length blocks. Jumps with j >= d each
// take time 1 and are counted separately. The total is reduced modulo 1e9+7.
// Complexity: O(1) time, O(1) extra space.
class Solution {
    private static final long MOD = 1_000_000_007L;

    public long minTime(int a, int b, int d, int l, int r) {
        long ans = 0;

        if (r >= d) {
            int from = Math.max(l, d);
            ans = (r - from + 1L) % MOD;
        }

        int right = Math.min(r, d - 1);
        if (l <= right) {
            int left = Math.max(l, 1);
            if (left <= right) {
                long t1 = jumpTime(a, b, d - left);
                long t0 = (d - right) == 0 ? 0 : jumpTime(a, b, d - right - 1);
                ans = (ans + (prefix(a, b, t1) - prefix(a, b, t0) + MOD) % MOD) % MOD;
            }
        }

        return ans;
    }

    private long jumpTime(int a, int b, int x) {
        if (x <= 0)
            return 1;
        if (x <= a)
            return x + 1L;

        long net = a - b;
        long cycles = (x - a + net - 1) / net;
        return x + 2L * b * cycles + 1;
    }

    private long summ(int a, int b, long t) {
        long first = a + 2L;
        long cycle = a + (long) b;
        if (t < first)
            return 0;

        long count = (t - first) / cycle + 1;
        long last = first + (count - 1) * cycle;

        long term1 = (b % MOD) * (count % MOD) % MOD;
        term1 = term1 * ((first + last) % MOD) % MOD;

        long term2 = (count % MOD) * ((2L * b - 1) % MOD) % MOD;
        term2 = term2 * ((2L * b) % MOD) % MOD;
        term2 = term2 * ((MOD + 1) / 2) % MOD;

        return (term1 + term2) % MOD;
    }

    private long prefix(int a, int b, long t) {
        if (t <= 0)
            return 0;
        long total = (t % MOD) * ((t + 1) % MOD) % MOD;
        total = total * ((MOD + 1) / 2) % MOD;
        return (total - summ(a, b, t) + MOD) % MOD;
    }
}