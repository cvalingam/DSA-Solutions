// Approach: One global swap of two character values (all occurrences) - find the first position where a smaller letter should appear.
// Scan letters a..z; when s[i] != current smallest available letter, swap that letter with s[i] everywhere and return.
// If the string is already lexicographically minimal under one swap, return s unchanged.
// Time: O(n) Space: O(n) for the result string
class Solution {

    public String chooseSwap(String s) {
        int n = s.length();
        if (n == 1) {
            return s;
        }

        int[] freq = new int[26];
        for (char ch : s.toCharArray()) {
            freq[ch - 'a']++;
        }

        char first = '0', second = '0';
        int f = 0, i = 0;

        while (f < 26) {
            if (freq[f] != 0) {

                if (i < n && s.charAt(i) != (char) (f + 'a')) {
                    first = (char) (f + 'a');
                    second = s.charAt(i);
                    break;
                }

                while (i < n && s.charAt(i) == (char) (f + 'a')) {
                    i++;
                }
            }
            f++;
        }
        if (first == '0' || second == '0') {
            return s;
        }

        StringBuilder sb = new StringBuilder();
        for (char ch : s.toCharArray()) {

            if (ch == first) {
                sb.append(second);
            } else if (ch == second) {
                sb.append(first);
            } else {
                sb.append(ch);
            }
        }
        return sb.toString();
    }
}
