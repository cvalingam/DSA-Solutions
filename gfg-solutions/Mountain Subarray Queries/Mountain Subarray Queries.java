
import java.util.*;

class Solution {

    // Approach: Precompute two rightward reach arrays. up[i] is the farthest
    // index reachable from i while the sequence stays non-decreasing; down[i]
    // is the farthest while it stays non-increasing. For query [l, r], the
    // non-decreasing stretch from l ends at peak = up[l]. The range is a
    // mountain iff it ends before/at that peak (pure ascent) or the
    // non-increasing stretch from the peak reaches r (ascent then descent).
    // Complexity: O(n + q) time and O(n) space.
    public ArrayList<Boolean> processQueries(int[] arr, int[][] queries) {
        int n = arr.length;

        int[] up = new int[n];
        int[] down = new int[n];

        up[n - 1] = n - 1;
        for (int i = n - 2; i >= 0; i--) {
            if (arr[i] <= arr[i + 1]) {
                up[i] = up[i + 1];
            } else {
                up[i] = i;
            }
        }

        down[n - 1] = n - 1;
        for (int i = n - 2; i >= 0; i--) {
            if (arr[i] >= arr[i + 1]) {
                down[i] = down[i + 1];
            } else {
                down[i] = i;
            }
        }

        ArrayList<Boolean> ans = new ArrayList<>();

        for (int[] q : queries) {
            int l = q[0];
            int r = q[1];

            int peak = up[l];

            if (peak >= r || down[peak] >= r) {
                ans.add(true);
            } else {
                ans.add(false);
            }
        }

        return ans;
    }
}
