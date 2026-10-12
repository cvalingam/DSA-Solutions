// Approach: Every cut must run across the whole piece, so the best move is to
// cut off as many squares of the shorter side as fit. With sides n <= m that
// gives m / n squares and leaves an n by (m % n) rectangle. Repeating this is
// the Euclidean algorithm, and the answer is the sum of its quotients.
// Complexity: O(log(min(n, m))) time, O(1) space.
class Solution {

    public int minSquares(int n, int m) {
        int count = 0;

        while (n > 0 && m > 0) {
            if (n > m) {
                int temp = n;
                n = m;
                m = temp;
            }

            count += m / n;
            m %= n;
        }

        return count;
    }
}
