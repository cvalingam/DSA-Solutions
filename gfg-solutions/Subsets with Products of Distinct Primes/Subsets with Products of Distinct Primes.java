
class Solution {

    // Approach: Count values 1..30. Map each square-free number 2..30 to a bit
    // mask of its distinct primes (10 primes under 30). DP over used-prime masks:
    // for each number, add it onto states that share no primes. Ones multiply the
    // answer by 2^freq[1] since they do not change the product. Exclude empty.
    // Complexity: O(30 * 2^10) time and O(2^10) space after an O(n) frequency pass.
    int mod = (int) 1e9 + 7;

    public int countSubsets(int[] arr) {
        // code here
        int[] freq = new int[31];
        for (int x : arr) {
            freq[x]++;
        }

        int[] prime = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29};
        int[] mask = new int[31];

        for (int i = 2; i <= 30; i++) {
            int x = i;
            int m = 0;
            boolean ok = true;

            for (int j = 0; j < 10; j++) {
                int p = prime[j];
                int cnt = 0;
                while (x % p == 0) {
                    cnt++;
                    x /= p;
                }
                if (cnt > 1) {
                    ok = false;
                    break;
                }
                if (cnt == 1) {
                    m |= (1 << j);
                }
            }

            if (ok) {
                mask[i] = m;
            }
        }

        long[] dp = new long[1024];
        dp[0] = 1;

        for (int i = 2; i <= 30; i++) {
            if (freq[i] == 0 || mask[i] == 0) {
                continue;
            }
            long[] next = dp.clone();
            for (int m = 0; m < 1024; m++) {
                if ((m & mask[i]) == 0) {
                    next[m | mask[i]] = (next[m | mask[i]] + dp[m] * freq[i]) % mod;
                }
            }
            dp = next;
        }

        long ans = 0;
        for (int i = 1; i < 1024; i++) {
            ans = (ans + dp[i]) % mod;
        }

        long ones = 1;
        for (int i = 0; i < freq[1]; i++) {
            ones = (ones * 2) % mod;
        }

        return (int) ((ans * ones) % mod);
    }
}
