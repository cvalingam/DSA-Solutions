// Approach: A power of four must be a power of two (one set bit)
// and that bit must sit at an even position - so (n-1) % 3 == 0.
// Time: O(1) Space: O(1)

public class Solution
{
    public bool IsPowerOfFour(int n)
    {
        // Why (4^n - 1) % 3 == 0?
        // (4^n - 1) = (2^n - 1)(2^n + 1) and 2^n - 1, 2^n, 2^n + 1 are
        // three consecutive numbers; among one of them, there must be a multiple
        // of 3, and that can't be 2^n, so it must be either 2^n - 1 or 2^n + 1.
        // Therefore, 4^n - 1 is a multiple of 3
        return n > 0 && BitCount(n) == 1 && (n - 1) % 3 == 0;
    }

    private int BitCount(int n)
    {
        int count = 0;
        while (n != 0)
        {
            count += n & 1;
            n >>= 1;
        }
        
        return count;
    }
}