// Approach: XOR from 1 to n repeats every four values: n, 1, n + 1, or 0
// according to n mod 4. The range XOR from l to r is then xor(r) xor xor(l - 1),
// because the shared prefix cancels. No loop over the range is needed.
// Complexity: O(1) time, O(1) extra space.
class Solution {
    public int findXOR(int l, int r) {
        return xorUpto(r) ^ xorUpto(l - 1);
    }

    private int xorUpto(int n) {
        return switch (n & 3) {
            case 0 -> n;
            case 1 -> 1;
            case 2 -> n + 1;
            default -> 0;
        };
    }
}
