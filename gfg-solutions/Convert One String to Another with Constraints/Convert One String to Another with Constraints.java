// Approach: Treat '#' as empty slots. Walk both strings while skipping empties
// so letters are matched in order; the sequences must be identical. 'A' can
// only move left, so its index in s1 cannot be less than in s2. 'B' can only
// move right, so its index in s1 cannot be greater than in s2. Any violation
// of those position rules makes the conversion impossible.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public boolean isItPossible(String s1, String s2) {
        int n = s1.length();
        if (n != s2.length())
            return false;

        int i = 0, j = 0;
        while (true) {
            while (i < n && s1.charAt(i) == '#')
                i++;
            while (j < n && s2.charAt(j) == '#')
                j++;
            if (i == n || j == n)
                return i == n && j == n;

            char c = s1.charAt(i);
            if (c != s2.charAt(j))
                return false;
            if (c == 'A') {
                if (i < j)
                    return false;
            } else if (i > j) {
                return false;
            }
            i++;
            j++;
        }
    }
}
