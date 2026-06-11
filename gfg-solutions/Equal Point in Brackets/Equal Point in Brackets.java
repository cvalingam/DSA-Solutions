// Approach: Count all closing brackets first, then scan every split index while tracking
// openings on the left and closings remaining on the right. The first index where both
// counts match is the required equal point.
// Time: O(n) Space: O(1)

class Solution {

    public int findIndex(String s) {
        int n = s.length();

        int open = 0, close = 0;
        for (char ch : s.toCharArray()) {
            if (ch == ')') {
                close++;
            }
        }

        for (int i = 0; i <= n; i++) {
            if (open == close) {
                return i;
            }

            if (i < n) {
                if (s.charAt(i) == '(') {
                    open++;
                } else {
                    close--;
                }
            }
        }
        return -1;
    }
}
