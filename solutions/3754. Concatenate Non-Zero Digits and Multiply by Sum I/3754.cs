// Approach: Scan digits right-to-left; append non-zero digits to x and add them to sum.
// Return x * sum. Processing from the right keeps original digit order in x.
// Time: O(log n) Space: O(1)
public class Solution
{
    public long SumAndMultiply(int n)
    {
        long x = 0;
        long sum = 0;
        long place = 1;

        // Process digits from right to left
        while (n > 0)
        {
            long digit = n % 10;
            if (digit != 0)
            {
                sum += digit;
                x += digit * place;
                place *= 10;
            }
            n /= 10;
        }

        return x * sum;
    }
}