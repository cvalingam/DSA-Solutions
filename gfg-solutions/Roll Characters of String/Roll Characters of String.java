// Approach: A roll of r shifts the first r characters forward by one letter,
// so character i is shifted once for every roll with r > i. Count each roll at
// its last index r - 1, then walk from the right keeping a running total:
// that total is how far the current character moves, wrapping after 'z'.
// Complexity: O(n + q) time, O(n) extra space, where q is the roll count.
class Solution {

    public String findRollOut(String s, int[] roll) {
        int n = s.length();
        int[] cnt = new int[n];
        for (int r : roll) {
            if (r > 0) {
                cnt[r - 1]++;
            }
        }
        char[] c = s.toCharArray();
        int run = 0;
        for (int i = n - 1; i >= 0; i--) {
            run += cnt[i];
            c[i] = (char) ('a' + (c[i] - 'a' + run) % 26);
        }
        return new String(c);
    }
}
