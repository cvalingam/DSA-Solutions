public class Solution
{
    // Approach: The product (a−1)*(b−1) is maximized by the two largest values
    // in the array. Track max1 and max2 in one pass, then return (max1−1)*(max2−1).
    // Complexity: O(n) time and O(1) space.
    public int MaxProduct(int[] nums)
    {
        int max1 = 0;
        int max2 = 0;

        foreach (int num in nums)
        {
            if (num > max1)
            {
                max2 = max1;
                max1 = num;
            }
            else if (num > max2)
                max2 = num;
        }

        return (max1 - 1) * (max2 - 1);
    }
}