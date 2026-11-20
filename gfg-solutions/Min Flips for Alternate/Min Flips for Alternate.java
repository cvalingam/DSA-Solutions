// Approach: An alternating string is either 0101... or 1010.... Count mismatches
// against 0101.... The other pattern mismatches on every other position, so its
// flip count is n minus that value. Return the smaller of the two.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int minFlips(String s) {
        int n = s.length();
        int mismatch = 0;

        for (int i = 0; i < n; i++) {
            char expect = (i % 2 == 0) ? '0' : '1';
            if (s.charAt(i) != expect)
                mismatch++;
        }

        return Math.min(mismatch, n - mismatch);
    }
}