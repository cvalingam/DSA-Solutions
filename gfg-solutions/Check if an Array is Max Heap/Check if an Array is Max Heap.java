// Approach: For every non-root node i, check arr[i] <= arr[(i-1)/2] (its parent).
// Iterating over children avoids the one-child edge case - parent index is always valid.
// Time: O(n) Space: O(1)
class Solution {

    public boolean isMaxHeap(int[] arr) {
        for (int i = arr.length - 1; i >= 1; i--) {
            if (arr[i] > arr[(i - 1) / 2]) {
                return false;
            }
        }

        return true;
    }
}
