// Approach: The minimum subarray sum ending at i is either arr[i] alone or
// arr[i] added to the minimum sum ending at i - 1. Keep that running ending
// sum and the best value seen. Every index is considered once.
// Complexity: O(n) time, O(1) extra space.
class Solution {

    public int minSubarraySum(int[] arr) {
        int curr = arr[0];
        int ans = arr[0];
        for (int i = 1; i < arr.length; i++) {
            curr = Math.min(arr[i], curr + arr[i]);
            ans = Math.min(ans, curr);
        }
        return ans;
    }
}
