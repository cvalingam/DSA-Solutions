// Approach: From 1 you may add 1 or multiply by 3. Working backward from n,
// those moves are subtract 1 or divide by 3 when n is a multiple of 3. Dividing
// whenever possible is optimal, because a multiply jumps over a whole range of
// add-1 steps. Count the operations until 1 remains.
// Complexity: O(log n) time, O(1) space.
class Solution {
    public int minimumStep(int n) {
        int steps = 0;
        while (n > 1) {
            if (n % 3 == 0)
                n /= 3;
            else
                n--;
            steps++;
        }
        return steps;
    }
}
