// Approach: The string must be a concatenation of blocks of the form x^n y^n.
// Walk left to right, count each run of x, then the following run of y. The
// two run lengths must match and be positive. Then start the next block.
// Anything left over, or a y before an x, fails.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public boolean findPattern(String s) {
        int i = 0;
        int n = s.length();

        while (i < n) {
            int xCount = 0;
            int yCount = 0;

            while (i < n && s.charAt(i) == 'x') {
                xCount++;
                i++;
            }
            while (i < n && s.charAt(i) == 'y') {
                yCount++;
                i++;
            }

            if (xCount == 0 || xCount != yCount) {
                return false;
            }
        }
        return true;
    }
}
