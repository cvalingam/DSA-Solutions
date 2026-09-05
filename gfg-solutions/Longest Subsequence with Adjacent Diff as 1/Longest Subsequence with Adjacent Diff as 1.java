// Approach: A subsequence ending at value x can extend from x-1 or x+1 seen earlier.
// Keep the best length per value in a direct table and update in one left-to-right pass.
// Complexity: O(n) time and O(max value) extra space.
class Solution {

    public int longestSubseq(int[] arr) {
        int[] dp = new int[1000001];
        int ans = 1;
        for (int x : arr) {
            dp[x] = 1 + Math.max(dp[x - 1], dp[x + 1]);
            ans = Math.max(ans, dp[x]);
        }

        return ans;
    }
}
