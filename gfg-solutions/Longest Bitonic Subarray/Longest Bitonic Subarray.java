// Approach: One pass over contiguous windows. Extend a non-decreasing ascent, then a
// non-increasing descent; track max window length. On a strict drop, remember nextStart
// so the next bitonic window can begin at that peak (shared between adjacent shapes).
// Time: O(n) Space: O(1)

class Solution {

    public int bitonic(int[] arr) {
        int n = arr.length;

        if (n <= 1) {
            return n;
        }

        int maxLen = 1;
        int start = 0;
        int nextStart = 0;
        int j = 0;

        while (j < n - 1) {
            // 1. Look for the end of the ascent (increasing sequence)
            while (j < n - 1 && arr[j] <= arr[j + 1]) {
                j++;
            }

            // 2. Look for the end of the descent (decreasing sequence)
            while (j < n - 1 && arr[j] >= arr[j + 1]) {
                // Safely mark where the next potential sequence should start
                if (j < n - 1 && arr[j] > arr[j + 1]) {
                    nextStart = j + 1;
                }
                j++;
            }

            // 3. Update the maximum length found so far
            maxLen = Math.max(maxLen, j - start + 1);
            // 4. Reset start position for the next transition window
            start = nextStart;
        }

        return maxLen;
    }
}
