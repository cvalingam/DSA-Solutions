
// Approach: Check if n+1 is a power of 2. A number has all bits set
// (e.g., 0b111 = 7, 0b1111 = 15) iff n = 2^k - 1, which means n+1 = 2^k.
// A power of 2 has exactly one bit set, so (n+1) & n == 0 when n is all-bits-set.
// Time: O(log n) Space: O(1)

class Solution {

    public boolean isBitSet(int n) {
        if (n == 0) {
            return false;
        }
        int num = (n + 1);
        while (num > 1) {
            int dig = num % 2;
            if (dig != 0) {
                return false;
            }
            num = num / 2;
        }
        
        return true;
    }
};
