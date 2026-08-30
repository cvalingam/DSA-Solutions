// Approach: Each interval [l[i], r[i]] contributes (r[i]-l[i]+1) ranks. Prefix-
// sum those counts, then for each query rank use binary search to find the
// interval and compute mark as r[idx] - (prefix[idx] - rank).
// Complexity: O(n + q log n) time and O(n) extra space (q = rank.length).

import java.util.*;

class Solution {

    public ArrayList<Integer> getMarks(int[] l, int[] r, int[] rank) {
        int n = l.length;
        long[] prefix = new long[n];

        for (int i = 0; i < n; i++) {
            prefix[i] = (r[i] - l[i] + 1L) + (i > 0 ? prefix[i - 1] : 0);
        }

        ArrayList<Integer> ans = new ArrayList<>();

        for (int q : rank) {
            int lo = 0;
            int hi = n - 1;

            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (prefix[mid] >= q) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }

            ans.add((int) (r[lo] - (prefix[lo] - q)));
        }

        return ans;
    }
}
