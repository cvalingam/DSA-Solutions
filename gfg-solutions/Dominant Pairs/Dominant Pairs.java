// Approach: Count pairs (i, j) with i in [0, n/2), j in [n/2, n) and
// arr[i] >= 5 * arr[j]. Sort each half ascending, then two pointers: as left
// grows, right only advances, so each second-half index is visited once.
// Complexity: O(n log n) time, O(1) extra space (in-place half sorts).
import java.util.*;

class Solution {
    public int dominantPairs(int[] arr) {
        int n = arr.length;
        int mid = n / 2;
        Arrays.sort(arr, 0, mid);
        Arrays.sort(arr, mid, n);

        int count = 0;
        int right = mid;
        for (int left = 0; left < mid; left++) {
            while (right < n && (long) arr[left] >= 5L * arr[right])
                right++;
            count += right - mid;
        }
        return count;
    }
}
