// Approach: Build a prefix array of vowel counts so each query [l, r] is
// pref[r + 1] - pref[l] in constant time after one O(n) scan.
// Complexity: O(n + q) time, O(n) extra space.
import java.util.ArrayList;

class Solution {
    public ArrayList<Integer> countVowels(String s, int[][] queries) {
        int n = s.length();
        int[] pref = new int[n + 1];

        for (int i = 0; i < n; i++)
            pref[i + 1] = pref[i] + (isVowel(s.charAt(i)) ? 1 : 0);

        ArrayList<Integer> res = new ArrayList<>(queries.length);
        for (int[] q : queries)
            res.add(pref[q[1] + 1] - pref[q[0]]);

        return res;
    }

    private static boolean isVowel(char c) {
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }
}