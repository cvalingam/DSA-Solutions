// Approach: AND is independent per bit. Count how many numbers have bit b set.
// Each such pair contributes 2^b, so add C(count,2) * (1 << b) for every bit.
// Complexity: O(31 * n) time and O(1) extra space.
class Solution {

    public long pairAndSum(int[] arr) {
        long ans = 0;

        for (int bit = 0; bit < 31; bit++) {
            long count = 0;

            for (int x : arr) {
                if ((x & (1L << bit)) != 0) {
                    count++;
                }
            }

            long pairs = count * (count - 1) / 2;
            ans += pairs * (1L << bit);
        }

        return ans;
    }
}
