
class Solution {

    // Approach: Use Kadane's algorithm from right to left to precompute the
    // maximum and minimum subarray sums in every suffix. Then scan split points
    // left to right while maintaining the corresponding prefix extrema. For each
    // split, compare left maximum with right minimum and left minimum with right
    // maximum; one of these opposite-extreme pairs gives the best absolute gap.
    // Complexity: O(n) time and O(n) auxiliary space.
    public int maxDiffSubArrays(int[] arr) {
        int n = arr.length;
        if (n < 2) {
            return 0;
        }
        // Space Optimization: Only precompute right (suffix) values
        int[] maxRight = new int[n];
        int[] minRight = new int[n];
        // 1. Precompute right values (Suffix)
        int currentMax = arr[n - 1], maxSoFar = arr[n - 1];
        int currentMin = arr[n - 1], minSoFar = arr[n - 1];
        maxRight[n - 1] = maxSoFar;
        minRight[n - 1] = minSoFar;

        for (int i = n - 2; i >= 0; i--) {
            currentMax = Math.max(arr[i], currentMax + arr[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
            maxRight[i] = maxSoFar;
            currentMin = Math.min(arr[i], currentMin + arr[i]);
            minSoFar = Math.min(minSoFar, currentMin);
            minRight[i] = minSoFar;
        }

        // 2. Compute left values on the fly and find the max difference
        int maxDiff = Integer.MIN_VALUE;
        int currentMaxLeft = arr[0], maxLeftSoFar = arr[0];
        int currentMinLeft = arr[0], minLeftSoFar = arr[0];
        for (int i = 0; i < n - 1; i++) {
            // Update left values up to index i
            if (i > 0) {
                currentMaxLeft = Math.max(arr[i], currentMaxLeft + arr[i]);
                maxLeftSoFar = Math.max(maxLeftSoFar, currentMaxLeft);
                currentMinLeft = Math.min(arr[i], currentMinLeft + arr[i]);
                minLeftSoFar = Math.min(minLeftSoFar, currentMinLeft);
            }

            // Calculate differences with the precomputed right values at i + 1
            int diff1 = Math.abs(maxLeftSoFar - minRight[i + 1]);
            int diff2 = Math.abs(minLeftSoFar - maxRight[i + 1]);
            maxDiff = Math.max(maxDiff, Math.max(diff1, diff2));
        }

        return maxDiff;
    }
}
