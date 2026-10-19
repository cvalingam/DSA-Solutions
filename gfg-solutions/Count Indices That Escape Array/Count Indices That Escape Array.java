// Approach: Each index has one outgoing jump, so the array is a functional
// graph. An index is good when following jumps leaves the array, and bad when
// it hits 0 or a cycle. Memoize each node as visiting, good, or bad while
// walking iteratively; when the walk ends, rewalk the visiting chain to paint
// the final state. Later starts that hit a painted node reuse it in O(1).
// Complexity: O(n) time, O(n) space.
class Solution {
    // 0 = unknown, 1 = visiting, 2 = escapes, 3 = trapped
    public int goodIndices(int[] arr) {
        int n = arr.length;
        int[] state = new int[n];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (state[i] == 0)
                paint(i, arr, state);
            if (state[i] == 2)
                count++;
        }
        return count;
    }

    private void paint(int start, int[] arr, int[] state) {
        int curr = start;
        while (curr >= 0 && curr < arr.length) {
            if (state[curr] == 2) {
                mark(start, arr, state, 2);
                return;
            }
            if (state[curr] == 3 || state[curr] == 1) {
                mark(start, arr, state, 3);
                return;
            }
            state[curr] = 1;
            int jump = arr[curr];
            if (jump == 0) {
                mark(start, arr, state, 3);
                return;
            }
            curr += jump;
        }
        mark(start, arr, state, 2);
    }

    private void mark(int start, int[] arr, int[] state, int val) {
        int curr = start;
        while (curr >= 0 && curr < arr.length && state[curr] == 1) {
            int jump = arr[curr];
            state[curr] = val;
            curr += jump;
        }
    }
}
