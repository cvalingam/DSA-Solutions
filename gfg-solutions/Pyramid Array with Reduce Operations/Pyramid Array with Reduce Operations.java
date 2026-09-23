// Approach: A pyramid of height h keeps h*h stones, since
// 1+2+...+h+...+2+1 = h*h. Only decreases are allowed, so the cheapest
// pyramid is the tallest feasible one. Scan right to left for the tallest
// rise that suffix allows, then left to right with a running height, and
// take the min at each index as a candidate peak.
// Complexity: O(n) time, O(n) extra space.
class Solution {
    public int formPyramid(int[] arr) {
        int n = arr.length;
        long[] fromRight = new long[n];
        fromRight[n - 1] = Math.min(arr[n - 1], 1);
        for (int i = n - 2; i >= 0; i--)
            fromRight[i] = Math.min((long) arr[i], fromRight[i + 1] + 1);

        long total = 0;
        long left = 0;
        long maxKept = 0;
        for (int i = 0; i < n; i++) {
            total += arr[i];
            left = i == 0 ? Math.min(arr[0], 1) : Math.min((long) arr[i], left + 1);
            long height = Math.min(left, fromRight[i]);
            maxKept = Math.max(maxKept, height * height);
        }

        return (int) (total - maxKept);
    }
}
