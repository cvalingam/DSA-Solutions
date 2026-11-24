// Approach: Enumerate pairs (i, j) in lexicographic order and map each sum
// to the first pair that produced it. A later pair with the same sum and
// four distinct indices forms a candidate (first, current); keep the
// lexicographically smallest such quadruplet. Pair order already guarantees
// the stored pair is the earlier one.
// Complexity: O(n^2) time, O(n^2) extra space.
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

class Solution {
    public ArrayList<Integer> findPairs(int[] arr) {
        int n = arr.length;
        HashMap<Integer, int[]> first = new HashMap<>();
        ArrayList<Integer> best = null;

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int sum = arr[i] + arr[j];
                int[] prev = first.get(sum);

                if (prev == null) {
                    first.put(sum, new int[] { i, j });
                    continue;
                }

                int a = prev[0], b = prev[1];
                if (a == i || a == j || b == i || b == j)
                    continue;

                ArrayList<Integer> cur = new ArrayList<>(Arrays.asList(a, b, i, j));
                if (best == null || less(cur, best))
                    best = cur;
            }
        }

        return best != null ? best
                : new ArrayList<>(Arrays.asList(-1, -1, -1, -1));
    }

    private boolean less(ArrayList<Integer> a, ArrayList<Integer> b) {
        for (int i = 0; i < 4; i++) {
            int x = a.get(i), y = b.get(i);
            if (x != y)
                return x < y;
        }
        return false;
    }
}