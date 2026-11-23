// Approach: Each expansion doubles the string and inserts step dollar signs
// in the middle: S -> S + "$"*step + reverse(S). Grow the length until it
// covers pos, then walk the expansions backward. If pos lands in the dollar
// block return '$'; if it lands in the reversed half mirror it into the
// front half; otherwise stay in the front half.
// Complexity: O(log pos) time, O(1) extra space.
class Solution {
    public char posInfinite(String s, int pos) {
        long len = s.length();
        long target = pos;
        long step = 0;

        while (len < target) {
            step++;
            len = 2 * len + step;
        }

        while (target > s.length()) {
            long prevLen = (len - step) / 2;

            if (target > prevLen && target <= prevLen + step)
                return '$';

            if (target > prevLen + step)
                target = len - target + 1;

            len = prevLen;
            step--;
        }

        return s.charAt((int) target - 1);
    }
}