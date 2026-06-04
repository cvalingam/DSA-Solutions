// Approach: Brute-force all values in [num1, num2] and compute each number's waviness independently.
// For each number, inspect every middle digit and count local extrema (strictly greater than both neighbors or strictly smaller than both).
// Time: O((num2 - num1 + 1) * d) Space: O(d), where d is number of digits

public class Solution
{
    public int TotalWaviness(int num1, int num2)
    {
        int ans = 0;
        for (int x = num1; x <= num2; x++)
            ans += F(x);

        return ans;
    }

    private int F(int x)
    {
        int[] nums = new int[20];
        int m = 0;
        while (x > 0)
        {
            nums[m++] = x % 10;
            x /= 10;
        }

        if (m < 3)
            return 0;

        int s = 0;
        for (int i = 1; i < m - 1; i++)
        {
            if ((nums[i] > nums[i - 1] && nums[i] > nums[i + 1])
                || (nums[i] < nums[i - 1] && nums[i] < nums[i + 1]))
                s++;
        }
        return s;
    }
}