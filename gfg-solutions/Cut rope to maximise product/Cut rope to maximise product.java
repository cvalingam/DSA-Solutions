
// Approach: To maximise the product of rope pieces, use as many length-3 segments as possible (greedy).
// If the remainder after dividing by 3 is 1, replace one 3 with 4 (e.g. length 4 = 2+2 beats 3+1).
// Handle n = 2 or n = 3 as base cases (return n - 1).
// Multiply 3^cnt3 with binary exponentiation; if remainder is 2 or 4, multiply that factor in.
// Time: O(log n) Space: O(1)
class Solution {

    public int maxProduct(int n) {
        if (n == 2 || n == 3) {
            return n - 1;
        }

        int cnt3 = n / 3;
        int rem = n % 3;

        if (rem == 1) {
            cnt3 -= 1;
            rem = 4;
        }

        int prd = power(3, cnt3);
        if (rem == 2 || rem == 4) {
            prd *= rem;
        }

        return prd;
    }

    private int power(int base, int exp) {
        int res = 1;

        while (exp > 0) {
            if ((exp & 1) != 0) {
                res *= base;
            }
            base *= base;
            exp >>= 1;
        }
        return res;
    }
}
