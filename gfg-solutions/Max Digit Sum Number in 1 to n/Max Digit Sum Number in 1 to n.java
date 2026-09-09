// Approach: Among 1..n, max digit sum is achieved by n or by decreasing one
// digit and setting all digits to its right to 9. Try each such candidate and
// keep the best sum, breaking ties with the larger value.
// Complexity: O(d^2) time and O(1) extra space, d = number of digits.
class Solution {

    public int findMax(int n) {
        if (n <= 9) {
            return n;
        }

        long maxSum = digitSum(n);
        int result = n;

        long temp = n;
        long multiplier = 1;

        while (temp > 0) {
            long candidate = (temp - 1) * multiplier + (multiplier - 1);
            long currentSum = digitSum(candidate);

            if (currentSum > maxSum || (currentSum == maxSum && candidate > result)) {
                maxSum = currentSum;
                result = (int) candidate;
            }

            temp /= 10;
            multiplier *= 10;
        }

        return result;
    }

    private long digitSum(long n) {
        long sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        return sum;
    }
}
