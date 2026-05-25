import java.util.*;

// Approach: Sort the array, then count how many elements lie in [start, end].
// If this count equals (end - start + 1), the range length is fully covered according to this logic.
// Time: O(n log n) Space: O(1) excluding sort stack/internal implementation

class Solution {

    public boolean checkElements(int start, int end, int[] arr) {
        Arrays.sort(arr);
        int count = 0;
        for (int i : arr) {
            if (i >= start && i <= end) {
                count++;
            }
        }
        return count == (end - start + 1);
    }
}
