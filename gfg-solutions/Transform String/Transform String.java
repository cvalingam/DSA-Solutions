// Approach: Only possible if s1 and s2 are anagrams (same char frequencies).
// Allowed op: pick a char in s1 and move it to the front. Matching from the
// right, every mismatched s1 char must be moved later, so count those skips
// until s1 aligns with the remaining suffix of s2.
// Complexity: O(n) time and O(1) space.
class Solution {

    int transform(String s1, String s2) {
        int n = s1.length();
        if (n != s2.length()) {
            return -1;
        }

        int[] freq = new int[256];
        for (int i = 0; i < n; i++) {
            freq[s1.charAt(i)]++;
            freq[s2.charAt(i)]--;
        }
        for (int f : freq) {
            if (f != 0) {
                return -1;
            }
        }

        int i = n - 1;
        int j = n - 1;
        int ops = 0;
        while (i >= 0) {
            while (i >= 0 && s1.charAt(i) != s2.charAt(j)) {
                ops++;
                i--;
            }
            if (i >= 0) {
                i--;
                j--;
            }
        }
        return ops;
    }
}
