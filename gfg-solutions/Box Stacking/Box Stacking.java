// Approach: Any side may be the height, so each box becomes three rotations
// with the base ordered so width <= length. A repeated base cannot be stacked
// on itself, so one copy of each rotation is enough. Sort by length descending
// and let dp[i] be the tallest stack with rotation i on top: it extends any
// earlier rotation whose width and length are both strictly larger.
// Complexity: O(n^2) time, O(n) extra space.
import java.util.*;

class Solution {
    public int maxHeight(int[] height, int[] width, int[] length) {
        int n = height.length;
        int[][] boxes = new int[3 * n][3];
        int m = 0;
        for (int i = 0; i < n; i++) {
            m = add(boxes, m, width[i], length[i], height[i]);
            m = add(boxes, m, height[i], length[i], width[i]);
            m = add(boxes, m, height[i], width[i], length[i]);
        }

        Arrays.sort(boxes, 0, m, (a, b) -> Integer.compare(b[1], a[1]));

        int[] dp = new int[m];
        int ans = 0;
        for (int i = 0; i < m; i++) {
            dp[i] = boxes[i][2];
            for (int j = 0; j < i; j++) {
                if (boxes[j][0] > boxes[i][0] && boxes[j][1] > boxes[i][1])
                    dp[i] = Math.max(dp[i], dp[j] + boxes[i][2]);
            }
            ans = Math.max(ans, dp[i]);
        }
        return ans;
    }

    // Store [width, length, height] with width <= length.
    private int add(int[][] boxes, int m, int w, int l, int h) {
        if (w > l) {
            int t = w;
            w = l;
            l = t;
        }
        boxes[m][0] = w;
        boxes[m][1] = l;
        boxes[m][2] = h;
        return m + 1;
    }
}
