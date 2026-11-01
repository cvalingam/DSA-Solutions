// Approach: A subarray ending at the current index has two useful forms.
// One has squared nothing, and one has already squared a single element.
// The plain form is the current value, or that value added to the previous
// plain form. The squared form starts at the square of the current value,
// extends a plain form by that square, or extends a squared form by the
// current value. The best of every form is the answer.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int maximumSubarray(int[] arr) {
        int n = arr.length;
        if (n == 0)
            return 0;

        long plain = arr[0];
        long squared = (long) arr[0] * arr[0];
        long best = Math.max(plain, squared);

        for (int i = 1; i < n; i++) {
            long value = arr[i];
            long square = value * value;
            long nextPlain = Math.max(value, plain + value);
            long nextSquared = Math.max(square, Math.max(plain + square, squared + value));
            plain = nextPlain;
            squared = nextSquared;
            best = Math.max(best, Math.max(plain, squared));
        }
        return (int) best;
    }
}
