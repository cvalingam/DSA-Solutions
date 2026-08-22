// Approach: Peel digits with n % 10. Accumulate sum and product, then test
// whether n is divisible by (sum + product). A zero digit makes the product
// 0, which is fine: the divisor becomes the digit sum alone.
// Complexity: O(log n) time and O(1) space.
public class Solution
{
    public bool CheckDivisibility(int n)
    {
        int digitSum = 0;
        int digitProduct = 1;
        int number = n;

        while (number != 0)
        {
            int currentDigit = number % 10;
            number /= 10;
            digitSum += currentDigit;
            digitProduct *= currentDigit;
        }

        int total = digitSum + digitProduct;
        return n % total == 0;
    }
}
