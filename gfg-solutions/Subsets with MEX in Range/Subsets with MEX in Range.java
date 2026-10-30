// Approach: A subset has MEX k when every value below k appears at least
// once and k itself is absent. Values above k, and negative values, may be
// kept or dropped freely. The product of (2^freq - 1) for 0 through k - 1
// grows by one value at a time, and the free choices are the remaining
// elements. MEX cannot exceed n, and it cannot pass the first missing value.
// Complexity: O(n + min(r, n)) time, O(n) extra space.
class Solution {
    public int cntSubsets(int[] arr, int l, int r) {
        int n = arr.length;
        if (r < 0 || l > r)
            return 0;
        if (l < 0)
            l = 0;
        if (l > n)
            return 0;

        final long MOD = 1000000007L;
        int bound = Math.min(r, n);
        int[] freq = new int[bound + 1];
        for (int x : arr)
            if (x >= 0 && x <= bound)
                freq[x]++;

        long[] pow2 = new long[n + 1];
        pow2[0] = 1;
        for (int i = 1; i <= n; i++)
            pow2[i] = pow2[i - 1] * 2 % MOD;

        long answer = 0;
        long required = 1;
        int seen = 0;
        for (int k = 0; k < l; k++) {
            if (freq[k] == 0)
                return 0;
            required = required * (pow2[freq[k]] - 1) % MOD;
            seen += freq[k];
        }
        for (int k = l; k <= bound; k++) {
            int count = freq[k];
            answer = (answer + required * pow2[n - seen - count]) % MOD;
            if (count == 0)
                break;
            required = required * (pow2[count] - 1) % MOD;
            seen += count;
        }
        return (int) answer;
    }
}
