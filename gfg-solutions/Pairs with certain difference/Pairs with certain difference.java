
import java.util.*;

// Approach: Greedy after sorting. Pair adjacent elements from right to left when their difference is less than k.
// Taking the largest valid pair first is optimal, because each element can be used at most once and larger values contribute more to the sum.
// Time: O(n log n) Space: O(1) extra (ignoring sort stack)

class Solution {

    public int sumDiffPairs(int[] arr, int k) {
        Arrays.sort(arr);
        int n = arr.length;

        int sum = 0;
        for (int i = n - 1; i >= 0; i--) {

            if (i - 1 >= 0 && arr[i] - arr[i - 1] < k) {
                sum += (arr[i] + arr[i - 1]);
                i--;
            }
        }
        return sum;
    }
}
