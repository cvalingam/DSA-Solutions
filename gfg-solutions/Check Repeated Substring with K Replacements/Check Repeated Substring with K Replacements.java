// Approach: Split the string into blocks of length k and count distinct block frequencies.
// The string is valid if all blocks already match, or if exactly two block patterns exist
// and one of them appears once, meaning one block replacement can make all blocks equal.
// Time: O(n) Space: O(n)

import java.util.*;

class Solution {

    public boolean kSubstr(String s, int k) {
        int n = s.length();
        if (n % k != 0) {
            return false;
        }

        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i += k) {
            String sub = s.substring(i, i + k);
            map.put(sub, map.getOrDefault(sub, 0) + 1);
        }

        if (map.size() == 1) {
            return true;
        }
        if (map.size() != 2) {
            return false;
        }

        for (int val : map.values()) {
            if (val == 1 || val == (n / k - 1)) {
                return true;
            }
        }
        return false;
    }
}
