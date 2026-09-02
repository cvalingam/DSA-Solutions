// Approach: If nums1 is all even or all odd, use nums2 = nums1. Otherwise pick one
// odd and one even value; odd minus even is odd, so every index can be set to
// nums1[i] - nums1[j] with opposite parity and all entries become odd. Always
// possible under the given constraints.
// Complexity: O(1) time and O(1) extra space.
public class Solution
{
    public bool UniformArray(int[] nums1)
    {
        return true;
    }
}
