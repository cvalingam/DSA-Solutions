// Approach: Raising every element except one by 1 changes the gaps the same
// way as lowering that one element by 1. The shared final value is the
// current minimum, so the number of moves is the total of every gap above
// it. One pass records the sum and the minimum in 64 bit arithmetic, then
// the result is the sum minus the minimum times the length.
// Time: O(n) Space: O(1)

public class Solution {
    public int MinMoves(int[] nums) {
        long sum = 0;
        int minValue = nums[0];
        for (int i = 0; i < nums.Length; i++) {
            int value = nums[i];
            sum += value;
            if (value < minValue)
                minValue = value;
        }
        return (int)(sum - (long)minValue * nums.Length);
    }
}
