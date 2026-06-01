
// Approach: Include all positives and negatives (even count) to maximise product.
// If negCount is odd, exclude the negative with the smallest absolute value.
// Special case: if only one negative and no positives, return 0 (if zeros exist) or that negative.
// All zeros → return 0. Use absolute values during product computation; result is always positive.
// Time: O(n) Space: O(1)
class Solution {

    public int findMaxProduct(int[] arr) {
        final int MOD = (int) 1e9 + 7;

        int negCount = 0, posCount = 0, zeroCount = 0;
        int minAbsNeg = Integer.MAX_VALUE;

        for (int x : arr) {
            if (x > 0) {
                posCount++; 
            }else if (x < 0) {
                negCount++;
                minAbsNeg = Math.min(minAbsNeg, -x);
            } else {
                zeroCount++;
            }
        }

        // All zeros — no positive product possible
        if (negCount == 0 && posCount == 0) {
            return 0;
        }

        // One negative, no positives: best subset is {0} if a zero exists, else the negative itself
        if (negCount == 1 && posCount == 0) {
            if (zeroCount > 0) {
                return 0;
            }
            for (int x : arr) {
                if (x < 0) {
                    return x;
                }
            }
        }

        // Multiply absolute values of all non-zeros, skipping one negative (minAbsNeg) if negCount is odd
        boolean skipped = false;
        long pro = 1;
        for (int x : arr) {
            if (x == 0) {
                continue;
            }
            if (!skipped && negCount % 2 == 1 && x < 0 && -x == minAbsNeg) {
                skipped = true;
                continue;
            }
            pro = pro * Math.abs(x) % MOD;
        }

        return (int) pro;
    }
}
