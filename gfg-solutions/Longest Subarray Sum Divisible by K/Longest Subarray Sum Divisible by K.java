// Approach: A subarray sum is divisible by k iff two prefix sums share the
// same remainder mod k. Store the earliest index of each remainder; the
// farthest matching pair for that rem is the longest valid subarray. An
// array of size k replaces a hash map under the usual k bound.
// Complexity: O(n) time, O(k) extra space.
class Solution {
    public int longestSubarrayDivK(int[] arr, int k) {
        int[] first = new int[k];
        java.util.Arrays.fill(first, -2);
        first[0] = -1;

        long sum = 0;
        int maxLen = 0;

        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
            int rem = (int) ((sum % k + k) % k);

            if (first[rem] != -2)
                maxLen = Math.max(maxLen, i - first[rem]);
            else
                first[rem] = i;
        }

        return maxLen;
    }
}