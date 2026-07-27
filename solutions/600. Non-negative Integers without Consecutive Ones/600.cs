// Approach: Digit DP on the binary representation - Fibonacci-like recurrences
// zero[i]/one[i] count valid i-bit endings; subtract over-counts above num.
// Time: O(log n) Space: O(log n)

public class Solution
{
    public int FindIntegers(int num)
    {
        StringBuilder bits = new StringBuilder();
        for (; num > 0; num >>= 1)
            bits.Append(num & 1);

        int n = bits.Length;
        int[] zero = new int[n];
        int[] one = new int[n];

        zero[0] = 1;
        one[0] = 1;

        for (int i = 1; i < n; ++i)
        {
            zero[i] = zero[i - 1] + one[i - 1];
            one[i] = zero[i - 1];
        }

        int ans = zero[n - 1] + one[n - 1];

        for (int i = n - 2; i >= 0; --i)
        {
            // The numbers > num and <= 2^n - 1 are invalid.
            if (bits[i] == '1' && bits[i + 1] == '1')
                break;
            if (bits[i] == '0' && bits[i + 1] == '0')
                ans -= one[i];
        }

        return ans;
    }
}