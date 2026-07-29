
import java.util.*;

class Solution {

    // Approach: Partition into the fewest subsets of consecutive numbers. Sort
    // so consecutive values sit together, then count how many times the sorted
    // sequence breaks (arr[i] != arr[i-1] + 1). Each contiguous run is one subset.
    // Complexity: O(n log n) time and O(1) extra space (sort in place).
    int minSubsets(int arr[]) {
        Arrays.sort(arr);

        int count = 1;

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] != arr[i - 1] + 1) {
                count++;
            }
        }

        return count;
    }
}
