// Approach: Last digit of a^b depends only on the last digit of a and b mod 4 (with 0 mapped to 4).
// Handle b = "0" → 1 and a = "0" → 0. Read the last two digits of b when long, then reduce exponent mod 4.
// Raise the base last digit to that small exponent and return mod 10.
// Time: O(len(b)) Space: O(1)
class Solution {

    public int getLastDigit(String a, String b) {
        if (b.equals("0")) {
            return 1;
        }
        if (a.equals("0")) {
            return 0;
        }

        int num1 = a.charAt(a.length() - 1) - '0';
        int num2 = b.charAt(b.length() - 1) - '0';

        if (b.length() >= 2) {
            int len = b.length();
            num2 = Integer.parseInt(b.substring(len - 2, len));
        }

        int mod = num2 % 4;
        num2 = mod == 0 ? 4 : mod;

        int res = (int) Math.pow(num1, num2);
        return res % 10;
    }
};
