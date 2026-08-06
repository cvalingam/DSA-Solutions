// Approach: Find the smallest x >= n whose digit product is divisible by t.
// Scan x = n .. n+9. Among any 10 consecutive integers one is a multiple of
// 10 (digit product 0), so a valid answer always exists in that window.
// Complexity: O(1) time (at most 10 numbers, few digits each) and O(1) space.
public class Solution
{
    public int SmallestNumber(int n, int t)
    {
        for (int num = n; num < n + 10; ++num)
        {
            if (GetDigitProd(num) % t == 0)
                return num;
        }
        throw new ArgumentException();
    }

    private int GetDigitProd(int num)
    {
        int digitProd = 1;
        while (num > 0)
        {
            digitProd *= num % 10;
            num /= 10;
        }
        return digitProd;
    }
}
