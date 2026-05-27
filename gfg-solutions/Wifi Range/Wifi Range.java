
// Approach: Build coverage intervals for every router as [i-x, i+x], clamp them to the road, and merge them.
// If any interval starts after a gap from the current merged range, coverage is broken.
// The road is fully covered only when the merged interval spans from the first to the last room.
// Time: O(n) Space: O(1)

class Solution {

    public boolean wifiRange(String s, int x) {
        int l = Integer.MAX_VALUE;
        int r = Integer.MIN_VALUE;

        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);

            if (ch == '1') {
                int lx = i - x;
                if (lx < 0) {
                    lx = 0;
                }

                int ry = i + x;
                if (ry >= s.length()) {
                    ry = s.length() - 1;
                }

                // covers all rooms
                if (lx == 0 && ry == s.length() - 1) {
                    return true;
                }

                // first interval
                if (l == Integer.MAX_VALUE && r == Integer.MIN_VALUE) {
                    l = lx;
                    r = ry;
                } else {
                    // merge and check
                    if (lx > r && lx - r > 1) {
                        // gap found
                        return false;
                    }
                    // merge interval
                    l = Math.min(l, lx);
                    r = Math.max(r, ry);
                }
            }
        }

        return l == 0 && r == s.length() - 1;
    }
}
