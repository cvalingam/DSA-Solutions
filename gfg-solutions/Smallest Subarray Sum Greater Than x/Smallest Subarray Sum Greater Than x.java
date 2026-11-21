// Approach: With positive elements the window sum grows when the right end
// advances and shrinks when the left end advances. Grow right, then shrink
// left while the sum stays strictly greater than x, tracking the shortest
// valid window. One pass is enough.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int smallestSubWithSum(int[] arr, int x) {
        int n = arr.length;
        int left = 0;
        int sum = 0;
        int minLen = Integer.MAX_VALUE;

        for (int right = 0; right < n; right++) {
            sum += arr[right];

            while (sum > x) {
                minLen = Math.min(minLen, right - left + 1);
                sum -= arr[left++];
            }
        }

        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }
}