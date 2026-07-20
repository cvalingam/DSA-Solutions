
import java.util.*;

class Solution {

    // Approach: Count every prefix of every word using a rolling integer key
    // (each next character is packed with encode). A prefix is unique when its
    // count is exactly 1. For each word, grow the prefix until that count is 1
    // (or the whole word is consumed) and emit that shortest unique prefix.
    // Complexity: O(total characters) time and O(total characters) space for the
    // prefix frequency map.
    public ArrayList<String> findPrefixes(String[] arr) {
        Map<Integer, Integer> prefixCount = new HashMap<>();

        for (String word : arr) {
            int enc = 0;
            for (int i = 0; i < word.length(); i++) {
                enc = encode(enc, word.charAt(i));
                prefixCount.put(enc, prefixCount.getOrDefault(enc, 0) + 1);
            }
        }

        ArrayList<String> res = new ArrayList<>(arr.length);

        for (String word : arr) {
            int enc = 0;
            StringBuilder prefix = new StringBuilder();

            for (int i = 0; i < word.length(); i++) {
                enc = encode(enc, word.charAt(i));
                prefix.append(word.charAt(i));

                if (prefixCount.get(enc) == 1 || i == word.length() - 1) {
                    res.add(prefix.toString());
                    break;
                }
            }
        }

        return res;
    }

    int encode(int prev, int d) {
        return (prev << 5) + d;
    }
}
