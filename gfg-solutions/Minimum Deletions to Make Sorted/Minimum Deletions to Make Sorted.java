
import java.util.*;

class Solution {

    // Approach: The longest non-decreasing subsequence can stay; everything else
    // must be deleted. Compute LIS length with patience sorting (tails array +
    // binary search for the first tail >= num), then answer = n − LIS length.
    // Complexity: O(n log n) time and O(n) space.
    public int minDeletions(int[] arr) {
        if (arr == null || arr.length == 0) {
            return 0;
        }
        ArrayList<Integer> lis = new ArrayList<>();
        for (int num : arr) {
            // Find the position of the first element >= num
            int pos = binarySearch(lis, num);
            // If the element is not found, binarySearch returns -(insertion_point) - 1
            if (pos < 0) {
                pos = -(pos + 1);
            }
            // If pos is within bounds, replace the element to maintain the smallest possible tail
            if (pos < lis.size()) {
                lis.set(pos, num);
            } else {
                lis.add(num);
            }
        }
        // Minimum deletions = Total length - LIS length
        return arr.length - lis.size();
    }

    private int binarySearch(ArrayList<Integer> list, int num) {
        int l = 0, h = list.size();
        while (l < h) {
            int mid = l + (h - l) / 2;
            if (list.get(mid) < num) {
                l = mid + 1;
            } else {
                h = mid;
            }
        }
        return l;
    }
}
