// Approach: With n at most 100 and values at most 10, check every subarray
// while rolling product, LCM, and GCD. The identity prod == lcm * gcd can
// hold only while the product stays at most lcm(1..10) * 10, so stop the
// inner scan once the product exceeds that bound.
// Time: O(n^2 log A) Space: O(1)

public class Solution
{
    public int MaxLength(int[] nums)
    {
        const int MaxProd = 2520 * 10; // lcm(1..10) * max(nums[i])
        int n = nums.Length;
        int ans = 0;

        for (int i = 0; i < n; ++i)
        {
            long prod = 1;
            int l = 1;
            int g = 0;

            for (int j = i; j < n; ++j)
            {
                prod *= nums[j];
                if (prod > MaxProd)
                    break;

                l = Lcm(l, nums[j]);
                g = Gcd(g, nums[j]);

                if (prod == (long)l * g)
                    ans = Math.Max(ans, j - i + 1);
            }
        }

        return ans;
    }

    private static int Gcd(int a, int b)
    {
        while (b != 0)
        {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    private static int Lcm(int a, int b)
    {
        return a / Gcd(a, b) * b;
    }
}
