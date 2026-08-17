// Approach: Min non-empty subset product. Multiply all non-zeros and count
// negatives; track the negative closest to zero (maxNeg) and the overall min.
// Odd negatives: product of non-zeros is already minimal. Even negatives:
// divide out maxNeg to flip the sign. No negatives: answer is the minimum
// element (0 if a zero exists, else the smallest positive).
// Complexity: O(n) time and O(1) space.

class Solution {

    public int minProd(int[] arr) {
        int neg = 0;
        int maxNeg = Integer.MIN_VALUE;
        int completeProduct = 1;
        int min = Integer.MAX_VALUE;

        for (int x : arr) {
            if (x < 0) {
                neg++;
                maxNeg = Math.max(maxNeg, x);
            }
            if (x != 0) {
                completeProduct *= x;
            }
            min = Math.min(min, x);
        }

        if (neg % 2 != 0) {
            return completeProduct;
        }
        if (neg == 0) {
            return min;
        }
        return completeProduct / maxNeg;
    }
}
