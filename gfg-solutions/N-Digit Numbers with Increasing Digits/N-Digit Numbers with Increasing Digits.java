// Approach: Backtracking — build digits left to right in strictly increasing order.
// For n = 1 return 0..9; otherwise the first digit is 1..9 and each next digit is greater than the last.
// Time: O(C(10, n) * n) Space: O(n) recursion depth

import java.util.*;

class Solution {

    public ArrayList<Integer> increasingNumbers(int n) {
        ArrayList<Integer> ans = new ArrayList<>();
        if (n == 1) {
            for (int i = 0; i <= 9; i++) {
                ans.add(i);
            }
            return ans;
        }
        generate(1, n, "", ans);
        return ans;
    }

    public static void generate(int st, int n, String current, ArrayList<Integer> ans) {
        if (current.length() == n) {
            ans.add(Integer.valueOf(current));
            return;
        }
        for (int i = st; i <= 9; i++) {
            generate(i + 1, n, current + i, ans);
        }
    }
}
