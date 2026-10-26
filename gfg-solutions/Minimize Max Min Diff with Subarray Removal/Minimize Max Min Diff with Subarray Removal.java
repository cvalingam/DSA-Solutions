// Approach: Removing one block of k cells leaves a prefix and a suffix. The
// minimum and maximum of every suffix that can remain are stored once. As
// the block slides right, the prefix bounds grow by the cell that just left
// the block, so each remaining range is scored in constant time. A removal
// that leaves no cell has difference 0.
// Complexity: O(n) time, O(n - k) extra space.
class Solution {
    public int minDiff(int k, int[] arr) {
        int n = arr.length;
        if (k >= n)
            return 0;

        int len = n - k;
        int[] suffixMin = new int[len];
        int[] suffixMax = new int[len];
        suffixMin[len - 1] = suffixMax[len - 1] = arr[n - 1];
        for (int i = len - 2; i >= 0; i--) {
            int value = arr[k + i];
            suffixMin[i] = Math.min(suffixMin[i + 1], value);
            suffixMax[i] = Math.max(suffixMax[i + 1], value);
        }

        int ans = suffixMax[0] - suffixMin[0];
        int prefixMin = arr[0];
        int prefixMax = arr[0];
        for (int i = 1; i < len; i++) {
            int min = Math.min(prefixMin, suffixMin[i]);
            int max = Math.max(prefixMax, suffixMax[i]);
            ans = Math.min(ans, max - min);
            prefixMin = Math.min(prefixMin, arr[i]);
            prefixMax = Math.max(prefixMax, arr[i]);
        }
        return Math.min(ans, prefixMax - prefixMin);
    }
}
