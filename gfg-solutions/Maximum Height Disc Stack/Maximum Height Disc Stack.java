// Approach: A disc stacks only on a strictly larger radius and height. Sort by
// radius ascending, and by height descending when radii match, so equal radii
// never form an increasing height chain. Then this is a weighted LIS on
// height: a Fenwick tree stores the best stack ending at each compressed
// height, and each disc extends the best strictly shorter one.
// Complexity: O(n log n) time, O(n) extra space.
import java.util.*;

class Solution {
    public int maxStackHeight(int[] r, int[] h) {
        int n = r.length;
        int[][] discs = new int[n][2];
        int[] heights = new int[n];
        for (int i = 0; i < n; i++) {
            discs[i][0] = r[i];
            discs[i][1] = h[i];
            heights[i] = h[i];
        }

        Arrays.sort(discs, (a, b) -> a[0] != b[0]
                ? Integer.compare(a[0], b[0])
                : Integer.compare(b[1], a[1]));
        Arrays.sort(heights);

        int m = 0;
        for (int i = 0; i < n; i++) {
            if (m == 0 || heights[i] != heights[m - 1])
                heights[m++] = heights[i];
        }

        int[] bit = new int[m + 1];
        int answer = 0;
        for (int[] disc : discs) {
            int height = disc[1];
            int rank = lowerBound(heights, m, height) + 1;
            int current = query(bit, rank - 1) + height;
            answer = Math.max(answer, current);
            update(bit, rank, current);
        }
        return answer;
    }

    private int lowerBound(int[] a, int n, int target) {
        int lo = 0, hi = n;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] < target)
                lo = mid + 1;
            else
                hi = mid;
        }
        return lo;
    }

    private int query(int[] bit, int index) {
        int result = 0;
        while (index > 0) {
            result = Math.max(result, bit[index]);
            index -= index & -index;
        }
        return result;
    }

    private void update(int[] bit, int index, int value) {
        while (index < bit.length) {
            bit[index] = Math.max(bit[index], value);
            index += index & -index;
        }
    }
}
