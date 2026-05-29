
import java.util.*;

// Approach: DFS + memoization over partition positions.
// Build groups from left to right and allow a cut only when current group digit-sum >= previous group digit-sum.
// Memo state is (index, previousSum) to avoid recomputation of overlapping subproblems.
// Time: O(n * S * n) in worst case, Space: O(n * S), where S is possible digit-sum range.

class Solution {

    HashMap<String, Integer> mp;

    private int dfs(String s, int i, int n, int prv) {
        if (i == n) {
            return 1;
        }
        int dig = 0, cnt = 0;
        String ky = String.valueOf(i) + "&" + String.valueOf(prv);
        if (mp.containsKey(ky)) {
            return mp.get(ky);
        }
        for (int j = i; j < n; j++) {
            int x = s.charAt(j) - '0';
            dig += x;
            if (dig >= prv) {
                cnt += dfs(s, j + 1, n, dig);
            }
        }
        mp.put(ky, cnt);
        return cnt;
    }

    public int validGroups(String s) {
        mp = new HashMap<>();
        int n = s.length();
        return dfs(s, 0, n, -1);
    }
}
