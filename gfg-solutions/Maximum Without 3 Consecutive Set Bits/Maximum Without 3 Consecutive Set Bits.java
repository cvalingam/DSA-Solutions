// Approach: Bits can only be cleared, and a higher bit is worth more than all
// lower bits together, so decide greedily from the most significant bit down.
// Keep a set bit unless the two bits just above it were both kept as 1s; in
// that case clear it, which also resets the run. A 0 bit resets the run too.
// Complexity: O(1) time (at most 31 bits), O(1) space.
class Solution {
    public int maxValue(int n) {
        int run = 0;
        for (int b = 30; b >= 0; b--) {
            if ((n >> b & 1) == 0) {
                run = 0;
            } else if (run == 2) {
                n &= ~(1 << b);
                run = 0;
            } else {
                run++;
            }
        }
        return n;
    }
}
