// Approach: Build prefixGcd[i] = gcd(nums[i], max(nums[0..i])). Sort ascending, then
// pair smallest with largest (two pointers from ends); sum gcd of each pair. Odd middle ignored.
// Time: O(n log n + n log M) Space: O(n) where M = max(nums)
public class Solution
{
    public long GcdSum(int[] nums)
    {
        int n = nums.Length;
        int[] prefixGcd = new int[n];
        int mx = 0;

        for (int i = 0; i < n; i++)
        {
            int x = nums[i];
            mx = Math.Max(mx, x);
            prefixGcd[i] = Gcd(x, mx);
        }

        Array.Sort(prefixGcd);

        long ans = 0;
        for (int i = 0; i < n / 2; i++)
            ans += Gcd(prefixGcd[i], prefixGcd[n - i - 1]);

        return ans;
    }

    private int Gcd(int a, int b)
    {
        while (b != 0)
        {
            int t = a % b;
            a = b;
            b = t;
        }

        return a;
    }
}
