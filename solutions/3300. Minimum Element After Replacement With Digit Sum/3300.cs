// Approach: Replace each number by its digit sum and track the minimum digit sum seen.
// Compute digit sums in O(number of digits) per element and update a running minimum.
// Time: O(n * d) Space: O(1), where d is average digit count.

public class Solution
{
    public int MinElement(int[] nums)
    {
        int ans = int.MaxValue;
        foreach (int num in nums)
            ans = Math.Min(ans, GetDigitSum(num));
        return ans;
    }

    private int GetDigitSum(int num)
    {
        int digitSum = 0;
        while (num > 0)
        {
            digitSum += num % 10;
            num /= 10;
        }
        return digitSum;
    }
}