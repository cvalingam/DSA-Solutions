// Approach: Two pointers at both ends. Area between bars i and j is min(height[i], height[j]) * (j - i - 1).
// Move the pointer at the shorter bar inward — a taller inner bar cannot beat the current bound.
// Time: O(n) Space: O(1)
import java.util.*;

class Solution {

    public int maxArea(List<Integer> height) {
        int n = height.size();
        int i = 0, j = n - 1;

        int area = 0;
        while (i < j) {

            area = Math.max(
                    area, Math.min(height.get(i), height.get(j)) * (j - i - 1)
            );

            if (height.get(i) <= height.get(j)) {
                i++;
            } else {
                j--;
            }
        }
        return area;
    }
}
