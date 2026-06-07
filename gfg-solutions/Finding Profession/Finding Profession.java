// Approach: Walk from the target position up to the root. Each even position means the node is a
// right child, which toggles inherited profession relative to the parent; odd positions preserve it.
// Time: O(log level) Space: O(1)

class Solution {

    public String profession(int level, int pos) {
        int flip = 0;
        while (pos > 1) {
            if (pos % 2 == 0) {
                flip = 1 - flip;
            }
            pos = (pos + 1) / 2;
        }

        if (flip == 0) {
            return "Engineer"; 
        }else {
            return "Doctor";
        }
    }
}
