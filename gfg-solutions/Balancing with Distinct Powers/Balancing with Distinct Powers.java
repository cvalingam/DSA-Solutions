// Approach: Each weight a^i is used at most once, on either pan, so b must be
// a sum of powers of a with coefficients -1, 0, or 1. Read b in base a from
// the lowest digit. A remainder of 0 means that power is unused, 1 means it
// sits on the opposite pan, and a - 1 means it sits on the same pan as b,
// which carries one into the next power. Any other remainder cannot be
// balanced. The value is kept in a long so the carry cannot overflow.
// Complexity: O(log_a b) time, O(1) extra space.
class Solution {
    public boolean balancePan(int a, int b) {
        long x = b;
        while (x > 0) {
            long r = x % a;
            if (r == 0)
                x /= a;
            else if (r == 1)
                x = (x - 1) / a;
            else if (r == a - 1)
                x = (x + 1) / a;
            else
                return false;
        }
        return true;
    }
}
