// Approach: Sort, then greedily take end pairs. Odd k: take the largest first
// so the rest is even. Each step compare product of two leftmost vs two
// rightmost and keep the larger pair. Special-case all-negative with odd k
// (pick least-magnitude negatives from the right).
// Complexity: O(n log n) time and O(1) extra space.
import java.util.*;

class Solution {

    public int maxProduct(int[] arr, int k) {
        int n = arr.length;
        Arrays.sort(arr);

        if (k == n) {
            long prod = 1;
            for (int x : arr) {
                prod *= x;
            }
            return (int) prod;
        }

        // All non-positive and odd k: product stays negative; take k largest
        // (least magnitude) from the right.
        if (arr[n - 1] <= 0 && (k & 1) == 1) {
            long prod = 1;
            for (int i = n - 1; i >= n - k; i--) {
                prod *= arr[i];
            }
            return (int) prod;
        }

        int left = 0;
        int right = n - 1;
        long maxProd = 1;

        if ((k & 1) == 1) {
            maxProd *= arr[right--];
            k--;
        }

        while (k > 0) {
            long leftPair = (long) arr[left] * arr[left + 1];
            long rightPair = (long) arr[right] * arr[right - 1];
            if (leftPair > rightPair) {
                maxProd *= leftPair;
                left += 2;
            } else {
                maxProd *= rightPair;
                right -= 2;
            }
            k -= 2;
        }

        return (int) maxProd;
    }
}
