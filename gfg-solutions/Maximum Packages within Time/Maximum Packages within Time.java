
// Approach: Each location costs one unit of time, so the agent visits a
// contiguous block of min(totalTime, n) locations. The sum of the first
// block is the starting answer. Each later block drops the location that
// falls out of the window and adds the location that enters it.
// Complexity: O(n) time, O(1) extra space.
class Solution {

    public int maxPackages(int[] arr, int totalTime) {
        int n = arr.length;

        int rightSum = 0;
        int leftSum = 0;

        int i = 0;
        for (; i < Math.min(totalTime, n); i++) {
            rightSum += arr[i];
        }
        int ans = rightSum;
        int j = 0;

        for (; i < n; i++, j++) {
            rightSum += arr[i];
            leftSum += arr[j];

            ans = Math.max(ans, (rightSum - leftSum));
        }
        return ans;
    }
}
