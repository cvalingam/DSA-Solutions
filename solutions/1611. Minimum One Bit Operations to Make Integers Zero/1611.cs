// Approach: Gray code recursion - f(n) = f(n XOR (highBit | highBit>>1)) + 1 + highBit - 1.
// Time: O(log n) Space: O(log n)

public class Solution
{
    public int MinimumOneBitOperations(int n)
    {
        if (n == 0)
            return 0;
        int x = 1;
        while (x * 2 <= n)
            x <<= 1;
        return MinimumOneBitOperations(n ^ (x | (x >> 1))) + 1 + x - 1;
    }
}