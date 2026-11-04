// Approach: Element i appears in (i + 1) * (n - i) subarrays. XOR keeps it
// only when that count is odd, which means both factors are odd. That only
// happens when n is odd and i is even, so an even length array answers 0
// and an odd length array is the XOR of the even indices.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int subarrayXor(int[] arr) {
        int n = arr.length;
        if ((n & 1) == 0)
            return 0;

        int res = 0;
        for (int i = 0; i < n; i += 2)
            res ^= arr[i];
        return res;
    }
}
