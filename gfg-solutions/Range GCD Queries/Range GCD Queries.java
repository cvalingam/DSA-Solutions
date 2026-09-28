// Approach: A segment tree stores the GCD of every range. Point updates
// recompute only the ancestors whose GCD actually changes. A range read
// merges O(log n) nodes and stops as soon as the running GCD becomes 1.
// Complexity: O(n + q log n) time, O(n) extra space.
import java.util.ArrayList;

class Solution {
    public ArrayList<Integer> processQueries(int[] arr, int[][] queries) {
        int n = arr.length;
        int[] tree = new int[n << 1];
        for (int i = 0; i < n; i++)
            tree[n + i] = arr[i];
        for (int i = n - 1; i > 0; i--)
            tree[i] = gcd(tree[i << 1], tree[i << 1 | 1]);

        ArrayList<Integer> ans = new ArrayList<>();
        for (int[] q : queries) {
            if (q[0] == 0)
                ans.add(query(tree, n, q[1], q[2]));
            else
                update(tree, n, q[1], q[2]);
        }
        return ans;
    }

    private void update(int[] tree, int n, int index, int value) {
        int i = n + index;
        if (tree[i] == value)
            return;
        tree[i] = value;
        for (i >>= 1; i > 0; i >>= 1) {
            int next = gcd(tree[i << 1], tree[i << 1 | 1]);
            if (tree[i] == next)
                return;
            tree[i] = next;
        }
    }

    // Inclusive [l, r]. 0 is the GCD identity, so an empty side does not change the result.
    private int query(int[] tree, int n, int l, int r) {
        int res = 0;
        for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
            if ((l & 1) == 1) {
                res = gcd(res, tree[l++]);
                if (res == 1)
                    return 1;
            }
            if ((r & 1) == 1) {
                res = gcd(res, tree[--r]);
                if (res == 1)
                    return 1;
            }
        }
        return res;
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }
}
