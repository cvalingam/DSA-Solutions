// Approach: Kadane with one optional skip - curr_sum is best ending at i with no removal;
// skipped_sum is best ending at i after removing exactly one element.
// Time: O(n) Space: O(1)
class Solution {

    public int maxSumSubarray(int[] arr) {
        int curr_sum = arr[0];
        int max_sum = arr[0];
        int skipped_sum = 0;
        for (int i = 1; i < arr.length; i++) {
            skipped_sum = Math.max(curr_sum, skipped_sum + arr[i]);
            curr_sum = Math.max(curr_sum + arr[i], arr[i]);
            max_sum = Math.max(max_sum, Math.max(curr_sum, skipped_sum));
        }
        return max_sum;
    }
}
