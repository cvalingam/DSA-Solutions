
class Solution {

    // Approach: Build a linear XOR basis with Gaussian elimination from MSB to
    // LSB. For each bit, pivot on a number with that bit set, then clear the bit
    // from every other number. Greedily XOR basis vectors into the answer when
    // that increases it, yielding the maximum subset XOR.
    // Complexity: O(32 * n) time and O(1) extra space (in-place on arr).
    public int maxSubsetXOR(int[] arr) {
        int n = arr.length;
        int index = 0;
        // Traverse from highest bit to lowest bit
        for (int bit = 31; bit >= 0; bit--) {
            int maxIndex = -1;
            // Find an element with current bit set
            for (int i = index; i < n; i++) {
                if (((arr[i] >> bit) & 1) == 1) {
                    maxIndex = i;
                    break;
                }
            }

            if (maxIndex == -1) {
                continue;
            }

            // Swap
            int temp = arr[index];
            arr[index] = arr[maxIndex];
            arr[maxIndex] = temp;
            // Eliminate current bit from all other elements
            for (int i = 0; i < n; i++) {
                if (i != index && (((arr[i] >> bit) & 1) == 1)) {
                    arr[i] ^= arr[index];
                }
            }
            index++;
        }

        // Build maximum XOR
        int ans = 0;
        for (int i = 0; i < index; i++) {
            ans = Math.max(ans, ans ^ arr[i]);
        }

        return ans;
    }
}
