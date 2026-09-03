// Approach: With difference >= 1, all-even is only possible if nums1 is already
// all even. All-odd works when every even can subtract the smallest odd (so
// min even must be > min odd), or when there is no even. One pass tracks both.
// Complexity: O(n) time and O(1) extra space.
public class Solution
{
    public bool UniformArray(int[] nums1)
    {
        int minOdd = int.MaxValue;
        int minEven = int.MaxValue;

        foreach (int x in nums1)
        {
            if ((x & 1) == 0)
            {
                if (x < minEven)
                    minEven = x;
            }
            else if (x < minOdd)
            {
                minOdd = x;
            }
        }

        return minOdd == int.MaxValue || minEven == int.MaxValue || minEven > minOdd;
    }
}
