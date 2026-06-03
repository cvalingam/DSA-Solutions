
import java.util.*;

// Approach: Preprocess positions of each distinct value, then answer each query with binary search on that value's index list.
// Frequency in range [l, r] equals count of stored indices between l and r (inclusive), computed as upperBound(r) - lowerBound(l).
// Time: O(n + q log f) Space: O(n)

class Solution {

    public ArrayList<Integer> freqInRange(int[] arr, int[][] queries) {
        ArrayList<Integer> ans = new ArrayList<>();
        Map<Integer, List<Integer>> mp = new HashMap<>();
        for (int i = 0; i < arr.length; i++) {
            mp.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
        }
        for (int[] q : queries) {
            List<Integer> idxs = mp.get(q[2]);
            if (idxs == null) {
                ans.add(0);
            } else {
                int lb = Collections.binarySearch(idxs, q[0]);
                if (lb < 0) {
                    lb = -lb - 1;
                }
                int ub = Collections.binarySearch(idxs, q[1]);
                if (ub < 0) {
                    ub = -ub - 2;
                }
                ans.add(ub - lb + 1);
            }
        }
        return ans;
    }
}
