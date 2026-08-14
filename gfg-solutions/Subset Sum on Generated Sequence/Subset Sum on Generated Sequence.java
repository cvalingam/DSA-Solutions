// Approach: Sequence starts at s; each next value is (sum so far) + arr[i], so
// every new value is >= the sum of all earlier ones (superincreasing-style).
// Subset sum is then greedy from largest to smallest. x == 0 is true (empty
// subset). Generate until the next value would exceed x (at most O(log x)
// terms). Reconstruct those values from the final total while walking arr
// backward - no need to store the list.
// Complexity: O(min(n, log x)) time and O(1) extra space.

class Solution {

    public boolean isPossible(int[] arr, int s, int x) {
        // Empty subset sums to 0.
        if (x == 0 || x == s) {
            return true;
        }
        if (x < s) {
            return false;
        }

        long total = s;
        int k = 0;

        for (int a : arr) {
            if (a > x || total > (long) x - a) {
                break;
            }
            long next = total + a;
            total += next;
            k++;
        }

        long target = x;
        for (int i = k - 1; i >= 0; i--) {
            // total = 2 * prev + arr[i], last = prev + arr[i] = (total + arr[i]) / 2
            long last = (total + arr[i]) / 2;
            if (last <= target) {
                target -= last;
                if (target == 0) {
                    return true;
                }
            }
            total = (total - arr[i]) / 2;
        }

        return target == s;
    }
}
