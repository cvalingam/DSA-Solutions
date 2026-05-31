
// Approach: Bitwise check. A number can be expressed as sum of consecutive integers iff it is NOT a power of 2.
// This follows from the formula: sum of k consecutive integers starting at a is k*(2a+k-1)/2.
// For this to equal n, n must not be divisible only by powers of 2. Use bitwise trick: n & (n-1) != 0.
// Time: O(1) Space: O(1)

class Solution {

    public boolean isSumOfConsecutive(int n) {
        return (n & (n - 1)) != 0;
    }
}
