// Approach: Move every odd value to the front with an in place partition, sort
// that prefix ascending then reverse it for descending order, and sort the even
// suffix ascending. No auxiliary lists are needed.
// Complexity: O(n log n) time, O(1) extra space.
import java.util.Arrays;

class Solution {
    public void sortIt(int[] arr) {
        int n = arr.length;
        int odd = 0;

        for (int i = 0; i < n; i++) {
            if (arr[i] % 2 != 0) {
                int t = arr[odd];
                arr[odd] = arr[i];
                arr[i] = t;
                odd++;
            }
        }

        Arrays.sort(arr, 0, odd);
        for (int l = 0, r = odd - 1; l < r; l++, r--) {
            int t = arr[l];
            arr[l] = arr[r];
            arr[r] = t;
        }
        Arrays.sort(arr, odd, n);
    }
}