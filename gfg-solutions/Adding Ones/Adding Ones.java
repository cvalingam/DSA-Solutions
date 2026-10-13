// Approach: An update k adds 1 to every position from k to n, so mark a +1
// at index k - 1 in a count array. The value at each position is then the
// prefix sum of those marks. The prefix sums never decrease, so a run of
// equal values reuses one boxed Integer instead of boxing every element.
// Time: O(n + q) Space: O(n), where q is the update count.

import java.util.ArrayList;

class Solution {

    public ArrayList<Integer> update(int n, int[] updates) {
        int[] mark = new int[n];
        for (int k : updates) {
            mark[k - 1]++;
        }

        ArrayList<Integer> result = new ArrayList<>(n);
        int running = 0;
        Integer boxed = 0;
        for (int i = 0; i < n; i++) {
            if (mark[i] != 0) {
                running += mark[i];
                boxed = running;
            }
            result.add(boxed);
        }
        return result;
    }
}
