// Approach: Every character is worth 1 by itself. Pairing two neighbors adds
// 2 more when they already differ, and 1 more when one of them must be
// toggled. Pairs cannot share a character, so the best set of bonuses is the
// house-robber recurrence and only the previous two answers are kept.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int getMaxWeight(String s) {
        int n = s.length();
        int prev2 = 0;
        int prev1 = 0;
        for (int i = 1; i < n; i++) {
            int gain = s.charAt(i - 1) == s.charAt(i) ? 1 : 2;
            int cur = Math.max(prev1, prev2 + gain);
            prev2 = prev1;
            prev1 = cur;
        }
        return n + prev1;
    }
}
