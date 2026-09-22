// Approach: Store every index of each letter in s. A dictionary word is a
// subsequence when each next letter occurs strictly after the previous match,
// found by binary search. Keep the longest match, breaking ties by the
// lexicographically smallest word. Skip a word that cannot beat the current best.
// Complexity: O(|s| + n * L * log |s|) time, O(|s|) extra space.
import java.util.*;

class Solution {
    public String findLongestWord(String s, List<String> d) {
        List<Integer>[] pos = new ArrayList[26];
        for (int c = 0; c < 26; c++)
            pos[c] = new ArrayList<>();
        for (int i = 0; i < s.length(); i++)
            pos[s.charAt(i) - 'a'].add(i);

        String best = "";
        for (String word : d) {
            if (word.length() < best.length())
                continue;
            if (word.length() == best.length() && word.compareTo(best) >= 0)
                continue;
            if (isSubsequence(word, pos))
                best = word;
        }
        return best;
    }

    private boolean isSubsequence(String word, List<Integer>[] pos) {
        int prev = -1;
        for (int i = 0; i < word.length(); i++) {
            List<Integer> list = pos[word.charAt(i) - 'a'];
            int idx = lowerBound(list, prev + 1);
            if (idx == list.size())
                return false;
            prev = list.get(idx);
        }
        return true;
    }

    // First index whose value is >= target.
    private int lowerBound(List<Integer> list, int target) {
        int lo = 0, hi = list.size();
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (list.get(mid) < target)
                lo = mid + 1;
            else
                hi = mid;
        }
        return lo;
    }
}
