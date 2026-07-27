
// Approach: For each bit position i, a pair contributes 2^i to the XOR sum only when exactly
// one of the two numbers has that bit set. If count1 numbers have bit i set and count0 = n - count1
// do not, then count1 * count0 pairs each contribute 2^i. Summing over all 32 bit positions gives
// the total XOR sum across all unordered pairs in O(32 * N) = O(N) time.
//
// Time: O(N) - 32 passes of length N.
// Space: O(1) - only a counter per bit position.
class Solution {

    public long sumXOR(int[] arr) {
        int n = arr.length;
        long total = 0;
        // Check each bit position (0-31)
        for (int i = 0; i < 32; i++) {
            long count1 = 0;
            for (int num : arr) {
                if ((num & (1 << i)) != 0) {
                    count1++;
                }
            }
            
            long count0 = n - count1;
            total += count1 * count0 * (1L << i);
        }

        return total;
    }
}
