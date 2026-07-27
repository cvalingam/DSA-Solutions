// Approach: Bit-by-bit extraction and reassembly over exactly 32 iterations.
// At each step: left-shift the result to make room, extract the LSB of n (n & 1), OR it into result.
// Right-shift n to expose the next bit.
// After 32 iterations the 32 bits of n appear in reverse order in the result.
// Using uint avoids sign-extension issues that would occur with int right shifts.
// Time: O(1) - always exactly 32 iterations. Space: O(1).

public class Solution
{
    public uint ReverseBits(uint n)
    {
        uint ans = 0;

        for (int i = 0; i < 32; i++)
        {
            ans <<= 1;
            if ((n & 1) == 1)
                ans += 1;
            n >>= 1;
        }

        return ans;
    }
}

public class Solution1
{
    public int ReverseBits(int n)
    {
        int ans = 0;

        for (int i = 0; i < 32; i++)
        {
            ans <<= 1;
            if ((n & 1) == 1)
                ans += 1;
            n >>= 1;
        }

        return ans;
    }
}