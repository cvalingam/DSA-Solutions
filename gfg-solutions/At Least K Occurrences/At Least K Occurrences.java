// Approach: Scan left to right and raise a frequency slot for each value. The
// first value whose count hits k is the answer, because that is the earliest
// k-th occurrence. Values lie in 0 through 10^6, so a plain array replaces a
// hash map.
// Complexity: O(n) time, O(1) extra space relative to the fixed value range.
class Solution {
    public int firstElementKTime(int[] arr, int k) {
        int[] cnt = new int[1_000_001];
        for (int a : arr) {
            if (++cnt[a] == k) {
                return a;
            }
        }
        return -1;
    }
}
