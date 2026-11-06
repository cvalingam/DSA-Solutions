
// Approach: A balanced tree of height h has a root whose two subtrees have
// heights h - 1 and h - 1, or h - 1 and h - 2 in either order. That gives
// f(h) = f(h - 1)^2 + 2 * f(h - 1) * f(h - 2). Only the previous two heights
// are kept, and every product is reduced modulo 1000000007.
// Complexity: O(h) time, O(1) extra space.
class Solution {

    public int countBT(int h) {
        long mod = 1000000007L;
        long a = 1, b = 1;
        for (int i = 2; i <= h; i++) {
            long c = (b * ((2 * a % mod + b) % mod)) % mod;
            a = b;
            b = c;
        }
        return (int) b;
    }
}
