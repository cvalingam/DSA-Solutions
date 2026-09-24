// Approach: Walk indexes from the left and return the first i whose digit
// sum equals i. nums[i] is at most 1000, so a digit sum is at most 27 and
// every later index is impossible. A value smaller than i is also impossible,
// because a digit sum never exceeds the number itself.
// Complexity: O(min(n, 28)) digit-sum checks, O(1) extra space.
public class Solution
{
    private const int MaxDigitSum = 27;

    public int SmallestIndex(int[] nums)
    {
        int limit = Math.Min(nums.Length, MaxDigitSum + 1);
        for (int i = 0; i < limit; i++)
        {
            int num = nums[i];
            if (num < i)
                continue;
            if (DigitSum(num) == i)
                return i;
        }
        return -1;
    }

    private static int DigitSum(int num)
    {
        int sum = 0;
        while (num > 0)
        {
            sum += num % 10;
            num /= 10;
        }
        return sum;
    }
}
