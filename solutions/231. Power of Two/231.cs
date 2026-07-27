// Approach: Bit manipulation - a power of two has exactly one set bit in binary.
// Therefore: n > 0 AND (n & (n - 1)) == 0 is a sufficient and necessary condition.
// n & (n - 1) clears the lowest set bit; if the result is 0, only one bit was set.
// This O(1) trick avoids any loop or repeated division.
// Edge case: n <= 0 can never be a power of two, handled by the n > 0 check.
// Time: O(1) Space: O(1)

public class Solution
{
    public bool IsPowerOfTwo(int n)
    {
        // Check if n is greater than 0 and if n AND (n-1) is 0
        return n > 0 && (n & (n - 1)) == 0;
    }
}