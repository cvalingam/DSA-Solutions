// Approach: b is a 1-based permutation. Find all cycle lengths; answer is LCM of those
// lengths. Compute LCM via max prime exponents across cycle lengths, multiply out mod 1e9+7.
// Time: O(n √n) Space: O(n)

class Solution {

    static final int MOD = 1000000007;

    int minOperations(int[] b) {
        int n = b.length;
        boolean[] vis = new boolean[n];
        int[] maxPow = new int[n + 1];

        // Find cycle lengths
        for (int i = 0; i < n; i++) {
            if (!vis[i]) {
                int len = 0;
                int cur = i;
                while (!vis[cur]) {
                    vis[cur] = true;
                    cur = b[cur] - 1; // 1-based to 0-based
                    len++;
                }

                // Prime factorization of cycle length
                int x = len;
                for (int p = 2; p * p <= x; p++) {
                    if (x % p == 0) {
                        int cnt = 0;
                        while (x % p == 0) {
                            x /= p;
                            cnt++;
                        }
                        maxPow[p] = Math.max(maxPow[p], cnt);
                    }
                }
                if (x > 1) {
                    maxPow[x] = Math.max(maxPow[x], 1);
                }
            }
        }

        long ans = 1;

        // Reconstruct LCM modulo MOD
        for (int p = 2; p <= n; p++) {
            for (int i = 0; i < maxPow[p]; i++) {
                ans = (ans * p) % MOD;
            }
        }

        return (int) ans;
    }
};
