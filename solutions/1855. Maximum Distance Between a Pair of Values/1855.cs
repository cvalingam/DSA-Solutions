// Approach: Two pointers on the two non-increasing arrays.
// Advance i (left pointer in nums1) when nums1[i] > nums2[j] - the current pair is invalid.
// Otherwise j - i is a valid distance; record it and advance j to try a larger distance.
// Because both arrays are non-increasing, advancing i can only make pairs tighter,
// and advancing j can only make the distance wider, so the greedy order is correct.
// Time: O(n + m) Space: O(1)
public class Solution
{
    public int MaxDistance(int[] nums1, int[] nums2)
    {
        int ans = 0;
        int i = 0;
        int j = 0;

        while (i < nums1.Length && j < nums2.Length)
        {
            if (nums1[i] > nums2[j])
                ++i;
            else
                ans = Math.Max(ans, j++ - i);
        }

        return ans;
    }
}