// Approach: Repeated doubling (bit-shift) to avoid the division operator.
// For each step, find the largest multiple of divisor (= divisor << k) that fits in the remaining dividend.
// Subtract it, add 2^k to the quotient, and repeat with the remainder.
// Use long to handle INT_MIN / -1 overflow and sign separately.
// The outer loop runs O(log n) times; inner doubling also runs O(log n) - total O(log^2 n).
// Handle edge cases: INT_MIN / -1 = INT_MAX (clamp), INT_MIN / 1 = INT_MIN.
// Time: O(log^2 n) Space: O(1)

public class Solution
{
    public int Divide(int dividend, int divisor)
    {
        if (divisor == 1)
            return dividend;

        if (dividend == int.MinValue && divisor == -1)
            return int.MaxValue;

        bool sign = (dividend > 0 && divisor > 0) || (dividend < 0 && divisor < 0);
        dividend = dividend > 0 ? -dividend : dividend;
        divisor = divisor > 0 ? -divisor : divisor;
        int ans = 0;
        while (dividend <= divisor)
        {
            int x = divisor;
            int cnt = 1;
            while (x >= (int.MinValue >> 1) && dividend <= (x << 1))
            {
                x <<= 1;
                cnt <<= 1;
            }
            ans += cnt;
            dividend -= x;
        }
        return sign ? ans : -ans;
    }
}