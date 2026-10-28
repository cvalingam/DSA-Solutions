// Approach: The infinite string is 123456789101112... Numbers with d digits
// contribute 9 * 10^(d-1) * d characters. Subtract whole groups until the
// remaining index falls inside one group, then the number and the offset
// inside it are division and remainder. That digit is read by shifting,
// without building the decimal text.
// Complexity: O(log n) time, O(1) extra space.
class Solution {
    public char nthCharacter(int n) {
        long rem = n;
        long digits = 1;
        long count = 9;
        long start = 1;
        while (rem > digits * count) {
            rem -= digits * count;
            digits++;
            count *= 10;
            start *= 10;
        }

        long num = start + (rem - 1) / digits;
        long place = 1;
        for (long i = (rem - 1) % digits + 1; i < digits; i++)
            place *= 10;
        return (char) ('0' + (num / place) % 10);
    }
}
