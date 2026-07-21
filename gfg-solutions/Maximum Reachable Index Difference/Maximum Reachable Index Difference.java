
import java.util.*;

class Solution {

    // Approach: Start only at 'a'. From each position jump right to the next
    // alphabet letter (a→b→c…). Track minStart[c] = earliest index that can
    // begin a valid chain ending at letter c. When s[i] is letter c, extend from
    // minStart[c-1] and maximize i - minStart[c]. Return -1 if no 'a' exists.
    // Complexity: O(n) time and O(1) space (26-letter table).
    public int maxIndexDifference(String s) {
        int[] minStart = new int[26];
        Arrays.fill(minStart, Integer.MAX_VALUE);
        int maxDiff = -1;

        for (int i = 0; i < s.length(); i++) {
            int idx = s.charAt(i) - 'a';
            if (idx == 0) {
                minStart[0] = Math.min(minStart[0], i);
                maxDiff = Math.max(maxDiff, 0);
            } else {
                if (minStart[idx - 1] != Integer.MAX_VALUE) {
                    minStart[idx] = Math.min(minStart[idx], minStart[idx - 1]);
                    maxDiff = Math.max(maxDiff, i - minStart[idx]);
                }
            }
        }
        return maxDiff;
    }
}
