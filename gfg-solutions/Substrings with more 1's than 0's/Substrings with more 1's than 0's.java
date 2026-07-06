// Approach: Map 1→+1, 0→−1. A substring has more 1s than 0s when an earlier prefix sum is
// strictly less than the current one. Count with a Fenwick tree over shifted prefix sums.
// Time: O(n log n) Space: O(n)

class Solution {

    private void update(int[] bit, int idx, int val) {
        for (; idx < bit.length; idx += idx & -idx) {
            bit[idx] += val;
        }
    }

    private int query(int[] bit, int idx) {
        int sum = 0;
        for (; idx > 0; idx -= idx & -idx) {
            sum += bit[idx];
        }
        return sum;
    }

    public int countSubstring(String s) {
        int n = s.length();
        int offset = n + 1;
        int[] bit = new int[2 * n + 3];

        int currentSum = 0;
        int totalSubstrings = 0;

        update(bit, offset, 1);

        for (int i = 0; i < n; i++) {
            currentSum += s.charAt(i) == '1' ? 1 : -1;
            totalSubstrings += query(bit, currentSum + offset - 1);
            update(bit, currentSum + offset, 1);
        }

        return totalSubstrings;
    }
}
