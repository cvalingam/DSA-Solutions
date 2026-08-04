// Approach: Count unordered index pairs whose values differ by less than k.
// Sort, then two pointers: for each right, advance left while
// arr[right] - arr[left] >= k. Every index in [left, right) forms a valid pair
// with right, so add (right - left).
// Time: O(n log n) Space: O(1) extra (ignoring sort)
import java.util.*;

class Solution {

    public static int countPairs(int arr[], int k) {
        int n = arr.length;
        if (n < 2) {
            return 0;
        }

        Arrays.sort(arr);
        int count = 0;
        int left = 0;

        for (int right = 1; right < n; right++) {
            while (arr[right] - arr[left] >= k) {
                left++;
            }
            count += (right - left);
        }

        return count;
    }
}
