// Approach: Increments only raise values, so the best target is an existing
// value, and the cheapest elements to raise are the closest ones below it.
// After sorting, a window ending at right can all become arr[right] for
// arr[right] * size - windowSum operations. The window never shrinks: when
// the cost exceeds k it slides forward by one, so its size only grows when a
// larger valid window exists, and the final size is the answer.
// Complexity: O(n log n) time for the sort, O(1) extra space beyond sorting.
import java.util.Arrays;

class Solution {
    public int maxFrequency(int[] arr, int k) {
        Arrays.sort(arr);
        int left = 0;
        long sum = 0;
        for (int right = 0; right < arr.length; right++) {
            sum += arr[right];
            if ((long) arr[right] * (right - left + 1) - sum > k)
                sum -= arr[left++];
        }
        return arr.length - left;
    }
}
