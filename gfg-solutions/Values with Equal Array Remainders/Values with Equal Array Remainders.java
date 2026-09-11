// Approach: arr[i]%k equals for all i iff k divides every difference. Let
// g = gcd of (arr[i] - min). If g is 0 (all equal), return -1. Otherwise the
// answer is the number of positive divisors of g.
// Complexity: O(n + sqrt(g)) time and O(1) extra space.
class Solution {

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    public int sameMod(int[] arr) {
        int min = arr[0];
        for (int x : arr) {
            min = Math.min(min, x);
        }

        int g = 0;
        for (int x : arr) {
            g = gcd(g, x - min);
        }

        if (g == 0) {
            return -1;
        }

        int count = 0;
        for (int i = 1; (long) i * i <= g; i++) {
            if (g % i == 0) {
                count++;
                if (i != g / i) {
                    count++;
                }
            }
        }
        return count;
    }
}
