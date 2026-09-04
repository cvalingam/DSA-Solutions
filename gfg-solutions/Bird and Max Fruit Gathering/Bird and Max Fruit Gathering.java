// Approach: Trees form a circle. Visiting m trees wraps and can re-collect, so
// the total is (m / n) full circle sums plus the best contiguous arc of length
// m % n (possibly wrapping). Prefix sums answer every arc in O(1).
// Complexity: O(n) time and O(n) extra space.
import java.util.*;

class Solution {

    public int maxFruits(ArrayList<Integer> arr, int m) {
        int l = arr.size();
        int[] pref = new int[l + 1];
        for (int i = 0; i < l; i++) {
            pref[i + 1] = pref[i] + arr.get(i);
        }

        int full = m / l;
        int rem = m % l;
        int base = pref[l] * full;
        if (rem == 0) {
            return base;
        }

        int best = 0;
        for (int i = 0; i < l; i++) {
            if (i + rem >= l) {
                int extra = rem - (l - i);
                best = Math.max(best, pref[l] - pref[i] + pref[extra]);
            } else {
                best = Math.max(best, pref[i + rem] - pref[i]);
            }
        }
        return base + best;
    }
}
