// Approach: Two pointers starting at both ends of the array.
// The water volume between two lines equals the shorter height multiplied by the distance between them.
// Start with left=0 and right=n-1 to maximise the width, then shrink inward.
// Always advance the pointer at the shorter side - moving the taller side can only decrease area.
// Track the maximum area seen across all valid pairs.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MaxArea(int[] height)
    {
        int n = height.Length;
        int l = 0;
        int r = n - 1;
        int maxWater = 0;
        while (l <= r)
        {
            if (height[l] <= height[r])
            {
                int water = height[l] * (r - l);
                maxWater = Math.Max(water, maxWater);
                l++;
            }
            else
            {
                int water = height[r] * (r - l);
                maxWater = Math.Max(water, maxWater);
                r--;
            }
        }

        return maxWater;
    }
}