// Approach: Track the first index of each letter. On a repeat, gap = i - first - 1; keep the max.
// Time: O(n) Space: O(1)

import java.util.*;

class Solution {

    public int maxCharGap(String s) {
        int maxGap = -1;
        int[] first = new int[26];
        Arrays.fill(first, -1);
        for (int i = 0; i < s.length(); i++) {
            int idx = s.charAt(i) - 'a';
            if (first[idx] == -1) {
                first[idx] = i;
            } else {
                int currGap = i - first[idx] - 1;
                maxGap = Math.max(maxGap, currGap);
            }
        }
        return maxGap;
    }
}
