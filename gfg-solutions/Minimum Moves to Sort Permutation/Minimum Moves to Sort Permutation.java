// Approach: A permutation of 1..n is already "in order" on any run of
// consecutive values that appear left to right (k, then k+1, then k+2, ...).
// Those values can stay. Track run[x] = run[x-1] + 1 while scanning, keep
// the longest run, and move the rest: n - best.
// Complexity: O(n) time and O(n) extra space.

class Solution {

    public int minMoves(int[] arr) {
        int n = arr.length;
        int[] run = new int[n + 1];
        int best = 0;

        for (int x : arr) {
            run[x] = run[x - 1] + 1;
            if (run[x] > best) {
                best = run[x];
            }
        }

        return n - best;
    }
}
