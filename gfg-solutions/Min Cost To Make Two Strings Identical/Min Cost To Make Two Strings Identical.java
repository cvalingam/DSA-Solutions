// Approach: Deleting everything costs n*costS1 + m*costS2. Keeping an LCS of
// length L saves L*(costS1+costS2), so min cost = (n-L)*costS1 + (m-L)*costS2.
// Compute L with classic LCS DP, rolling one row so space is O(min(n,m)).
// Complexity: O(n*m) time, O(min(n,m)) extra space.
class Solution {
    public int findMinCost(String s1, String s2, int costS1, int costS2) {
        if (s1.length() < s2.length()) {
            String tmp = s1;
            s1 = s2;
            s2 = tmp;
            int c = costS1;
            costS1 = costS2;
            costS2 = c;
        }

        int n = s1.length(), m = s2.length();
        int[] prev = new int[m + 1];
        int[] curr = new int[m + 1];

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1))
                    curr[j] = prev[j - 1] + 1;
                else
                    curr[j] = Math.max(prev[j], curr[j - 1]);
            }
            int[] swap = prev;
            prev = curr;
            curr = swap;
            // curr is reused; zeroing is unnecessary because every j is overwritten
        }

        int lcs = prev[m];
        return (n - lcs) * costS1 + (m - lcs) * costS2;
    }
}
