// Approach: Work backwards from n to 0. An odd number must come from a +1, so
// each set bit costs one operation, and every other step halves the number,
// so each shift down costs one. The total is the number of set bits plus the
// bit length minus one. Both are single CPU instructions in Java.
// Complexity: O(1) time, O(1) extra space.
class Solution {
    public int minOperation(int n) {
        if (n <= 0)
            return 0;
        return Integer.bitCount(n) + 31 - Integer.numberOfLeadingZeros(n);
    }
}
