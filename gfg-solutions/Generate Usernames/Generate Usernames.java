// Approach: Every name in the input is reserved before any assignment. The
// first request for a name keeps it. A repeated request takes the smallest
// positive suffix name1, name2, ... that is neither reserved nor already
// handed out. A map stores the next suffix to try for each name, so a later
// request does not rescan suffixes that were already rejected.
// Complexity: O(n) expected time, O(n) extra space, counting each generated
// name once.
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

class Solution {
    public ArrayList<String> generateUsernames(String[] arr) {
        HashSet<String> reserved = new HashSet<>();
        for (String name : arr) {
            reserved.add(name);
        }

        HashSet<String> assigned = new HashSet<>();
        HashMap<String, Integer> next = new HashMap<>();
        ArrayList<String> ans = new ArrayList<>(arr.length);

        for (String name : arr) {
            if (assigned.add(name)) {
                ans.add(name);
                continue;
            }

            int suffix = next.getOrDefault(name, 1);
            String candidate = name + suffix;
            while (reserved.contains(candidate) || assigned.contains(candidate)) {
                suffix++;
                candidate = name + suffix;
            }
            assigned.add(candidate);
            next.put(name, suffix + 1);
            ans.add(candidate);
        }
        return ans;
    }
}
