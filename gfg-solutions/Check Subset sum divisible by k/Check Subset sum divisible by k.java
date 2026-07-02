// Approach: If arr.length >= k, pigeonhole on prefix sums of the first k elements guarantees
// a non-empty contiguous-block subset (hence a subset) with sum divisible by k.
// Otherwise, DP on remainders: dp[r] = some non-empty subset has sum ≡ r (mod k).
// Time: O(n * k) Space: O(k)

class Solution {

    public boolean divisibleByK(int[] arr, int k) {
        int n = arr.length;
        if (k == 1) {
            return true;
        }
        if (n >= k) {
            return true;
        }

        boolean[] dp = new boolean[k];

        for (int x : arr) {
            int mod = x % k;
            boolean[] next = dp.clone();
            next[mod] = true;
            for (int r = 0; r < k; r++) {
                if (dp[r]) {
                    next[(r + mod) % k] = true;
                }
            }
            dp = next;
            if (dp[0]) {
                return true;
            }
        }

        return dp[0];
    }
}
