
// Approach: Sweep left to right, overwriting each position with XOR of the current element and the next one.
// Preserve the previous original value in a temporary variable so the chain can continue without extra memory.
// The final element is handled separately using the last saved original value.
// Time: O(n) Space: O(1)

class Solution {

    public void replaceElements(int[] arr) {
        int n = arr.length;
        int prev = arr[0];
        for (int i = 0; i < n - 1; i++) {
            int temp = arr[i];
            arr[i] = prev ^ arr[i + 1];
            prev = temp;
        }
        arr[n - 1] = arr[n - 1] ^ prev;
    }
}
