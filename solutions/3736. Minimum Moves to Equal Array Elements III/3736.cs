// Approach: Each move raises one element by 1, so the shared final value
// cannot sit below the current maximum. Raising every element to that
// maximum costs the gap for each element, which is the maximum times the
// length minus the sum of the array. One pass records both values.
// Time: O(n) Space: O(1)

public class Solution {
    public int MinMoves(int[] nums) {
        int n = nums.Length;
        int maxValue = nums[0];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int value = nums[i];
            if (value > maxValue)
                maxValue = value;
            sum += value;
        }
        return maxValue * n - sum;
    }
}
