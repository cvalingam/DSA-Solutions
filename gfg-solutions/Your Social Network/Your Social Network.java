// Approach: User i follows the chain i -> arr[i - 2] -> ... down to user 1.
// Every friend has a smaller number, so the chain is strictly decreasing.
// Writing it into a scratch array from the back puts the reachable users in
// increasing order with no sort. Depths are computed once up front, so the
// chain length and every distance are known before the walk, and the result
// list is presized to the exact number of pairs. User ids and distances all
// lie in 1..n, so each Integer is boxed once and shared across rows.
// Complexity: O(n + P) time, where P is the number of reachable pairs (the
// output size), O(n) extra space beyond the output.

import java.util.ArrayList;

class Solution {

    public ArrayList<ArrayList<Integer>> socialNetwork(int[] arr) {
        int n = arr.length + 1;
        int[] depth = new int[n + 1];
        long pairs = 0;
        for (int i = 2; i <= n; i++) {
            depth[i] = depth[arr[i - 2]] + 1;
            pairs += depth[i];
        }

        Integer[] boxed = new Integer[n + 1];
        for (int v = 0; v <= n; v++)
            boxed[v] = v;

        ArrayList<ArrayList<Integer>> res = new ArrayList<>((int) pairs);
        int[] chain = new int[n];
        for (int i = 2; i <= n; i++) {
            int d = depth[i];
            Integer self = boxed[i];
            int curr = i;
            for (int k = d - 1; k >= 0; k--) {
                curr = arr[curr - 2];
                chain[k] = curr;
            }
            for (int k = 0; k < d; k++) {
                ArrayList<Integer> row = new ArrayList<>(3);
                row.add(self);
                row.add(boxed[chain[k]]);
                row.add(boxed[d - k]);
                res.add(row);
            }
        }
        return res;
    }
}
