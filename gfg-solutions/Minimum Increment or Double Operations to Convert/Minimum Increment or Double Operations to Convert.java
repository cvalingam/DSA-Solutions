// Approach: Start from all zeros. Allowed moves: +1 on one index, or double
// every index. Working backwards equals: each set bit needs one increment, and
// the number of global doubles equals floor(log2(max)). Closed form:
// sum(popcount(a)) + bitLength(max) - 1 (= 31 - numberOfLeadingZeros(max) for
// max > 0). All-zero arrays need 0 ops.
// Time: O(n) Space: O(1)
class Solution {

    public int countMinOperations(int arr[]) {
        int incs = 0, maxi = 0;

        for (int a : arr) {
            incs += Integer.bitCount(a);
            maxi = Math.max(maxi, a);
        }

        if (maxi == 0) {
            return 0;
        }

        return incs + 31 - Integer.numberOfLeadingZeros(maxi);
    }
}
