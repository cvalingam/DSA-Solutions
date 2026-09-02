// Approach: Each letter appears twice (arrive, leave). Track per customer:
// absent, waiting without a seat, or seated. On first sight, seat if a computer
// is free else count a walk-away. On second sight, free a seat only if seated.
// Complexity: O(|s|) time and O(1) extra space.
class Solution {

    public int solve(int n, String s) {
        byte[] state = new byte[26];
        int walkaways = 0;

        for (int i = 0; i < s.length(); i++) {
            int idx = s.charAt(i) - 'A';

            if (state[idx] == 0) {
                if (n > 0) {
                    n--;
                    state[idx] = 2;
                } else {
                    walkaways++;
                    state[idx] = 1;
                }
            } else {
                if (state[idx] == 2) {
                    n++;
                }
                state[idx] = 0;
            }
        }

        return walkaways;
    }
}
