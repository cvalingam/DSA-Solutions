// Approach: Sort the distinct values, then binary search for the first index
// where arr[i] - (i + 1) is at least k. That difference is how many natural
// numbers are missing before arr[i]. The k-th missing value is then that
// index plus k. If every prefix still misses fewer than k numbers, the
// answer lies past the last element and equals n + k.
// Complexity: O(n log n) time, O(1) extra space.
import java.util.Arrays;

class Solution {
    public int findKthSmall(int[] arr, int k) {
        Arrays.sort(arr);
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] - (mid + 1) < k) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return lo + k;
    }
}
