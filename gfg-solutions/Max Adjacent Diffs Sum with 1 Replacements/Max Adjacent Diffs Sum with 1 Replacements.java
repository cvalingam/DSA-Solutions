// Approach: Each index may stay as arr[i] or become 1. Keep two rolling scores:
// best sum ending with the original value, and best ending with 1. At each step
// take the better of the two previous states plus the adjacent absolute gap.
// Complexity: O(n) time and O(1) extra space.
class Solution {

    public int maxDiffSum(int[] arr) {
        int n = arr.length;
        if (n == 1) {
            return 0;
        }

        // dp0 = best sum up to index i when arr[i] is kept
        // dp1 = best sum up to index i when arr[i] is replaced by 1
        int dp0 = 0, dp1 = 0;

        for (int i = 1; i < n; i++) {
            int ndp0 = Math.max(dp0 + Math.abs(arr[i] - arr[i - 1]),
                    dp1 + Math.abs(arr[i] - 1));
            int ndp1 = Math.max(dp0 + Math.abs(1 - arr[i - 1]),
                    dp1); // |1 - 1| = 0
            dp0 = ndp0;
            dp1 = ndp1;
        }

        return Math.max(dp0, dp1);
    }
}
