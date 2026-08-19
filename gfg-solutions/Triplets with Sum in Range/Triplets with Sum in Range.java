// Approach: After sorting, count triplets with sum <= r minus those with sum
// <= l-1. For each i, two shrinking right pointers find, for every lo, the
// largest hi with arr[i]+arr[lo]+arr[hi] within each bound. Min-triplet prune:
// later i only grow, so stop when arr[i]+arr[i+1]+arr[i+2] > r.
// Complexity: O(n^2) time and O(1) extra space.
import java.util.Arrays;

class Solution {

    public int countTriplets(int[] arr, int l, int r) {
        Arrays.sort(arr);
        int n = arr.length;
        int atMostR = 0;
        int atMostLm1 = 0;
        int lim = l - 1;

        for (int i = 0; i < n - 2; i++) {
            if ((long) arr[i] + arr[i + 1] + arr[i + 2] > r) {
                break;
            }

            int hiR = n - 1;
            int hiL = n - 1;
            for (int lo = i + 1; lo < n - 1; lo++) {
                long base = (long) arr[i] + arr[lo];
                while (hiR > lo && base + arr[hiR] > r) {
                    hiR--;
                }
                while (hiL > lo && base + arr[hiL] > lim) {
                    hiL--;
                }
                if (hiR > lo) {
                    atMostR += hiR - lo;
                }
                if (hiL > lo) {
                    atMostLm1 += hiL - lo;
                }
            }
        }

        return atMostR - atMostLm1;
    }
}
