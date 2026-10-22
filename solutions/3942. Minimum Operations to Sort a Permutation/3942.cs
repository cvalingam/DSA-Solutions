// Approach: Reverse and left-rotate preserve a cyclic order, so the array can
// become 0,1,...,n-1 only when walking from 0 is exactly that sequence in one
// direction. Find 0, then test the clockwise and counterclockwise orders.
// Clockwise costs min(rotations, reverse + rotations + reverse).
// Counterclockwise costs min(rotations + reverse, reverse + rotations).
// Time: O(n) Space: O(1)

public class Solution
{
    public int MinOperations(int[] nums)
    {
        int n = nums.Length;
        int zero = 0;
        while (nums[zero] != 0)
            zero++;

        int ans = int.MaxValue;
        if (Matches(nums, zero, 1))
            ans = Math.Min(zero, n - zero + 2);
        if (Matches(nums, zero, -1))
            ans = Math.Min(ans, Math.Min(zero + 2, n - zero));
        return ans == int.MaxValue ? -1 : ans;
    }

    private static bool Matches(int[] nums, int zero, int step)
    {
        int n = nums.Length;
        int idx = zero;
        for (int value = 0; value < n; value++)
        {
            if (nums[idx] != value)
                return false;
            idx += step;
            if (idx == n)
                idx = 0;
            else if (idx < 0)
                idx = n - 1;
        }
        return true;
    }
}
