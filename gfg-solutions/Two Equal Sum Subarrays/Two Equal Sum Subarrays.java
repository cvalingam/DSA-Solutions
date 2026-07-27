
// Approach: We want to find a split point where the sum of the left part equals the sum of the right part.
// First compute the total sum as the initial 'suffix'. Then walk left-to-right, growing the prefix and
// shrinking the suffix by the current element. Whenever prefix == suffix, a valid split exists.
// Note: if the total sum is odd, no equal split is possible - but the loop handles this naturally.
//
// Time: O(N) - two linear passes over the array.
// Space: O(1) - only two integer accumulators.

class Solution {

    public boolean canSplit(int arr[]) {
        int suff = 0;
        int pre = 0;
        for (int i : arr) {
            suff += i;
        }

        for (int i : arr) {
            pre += i;
            suff -= i;

            if (pre == suff) {
                return true;
            }
        }
        return false;
    }
}
