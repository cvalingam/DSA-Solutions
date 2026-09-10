// Approach: Need a*b = x*y and gcd(a,b)=x. Write a=x*v, b=x*w with
// gcd(v,w)=1 and v*w = y/x. Count ordered coprime factor pairs of n=y/x
// (or equivalently 2^omega(n) distinct-prime assignments).
// Complexity: O(sqrt(y/x)) time and O(1) extra space.
class Solution {

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    public int pairCount(int x, int y) {
        if (y % x != 0) {
            return 0;
        }

        int n = y / x;
        int ans = 0;

        for (int i = 1; (long) i * i <= n; i++) {
            if (n % i != 0) {
                continue;
            }
            int j = n / i;
            if (gcd(i, j) == 1) {
                ans += (i == j) ? 1 : 2;
            }
        }

        return ans;
    }
}
