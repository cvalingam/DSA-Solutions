// Approach: Each day choose rest, low effort, or high effort. High is allowed
// only when the previous day was rest. dp[i][0/1/2] = best total from day i onward
// ending that day in rest / low / high. Fill from the last day backward and take
// the max of the three states on day 0.
// Time: O(n) Space: O(n)
class Solution {

    public int maxTask(int[] high, int[] low) {
        int n = high.length;
        int dp[][] = new int[n][3];
        // Last day
        dp[n - 1][0] = 0;          // No task
        dp[n - 1][1] = low[n - 1]; // Low task
        dp[n - 1][2] = high[n - 1];// High task

        // Remaining days
        for (int i = n - 2; i >= 0; i--) {
            // Do no task today
            dp[i][0] = Math.max(
                    dp[i + 1][0],
                    Math.max(dp[i + 1][1], dp[i + 1][2])
            );
            // Do low task today
            // Tomorrow cannot do high task
            dp[i][1] = low[i] + Math.max(
                    dp[i + 1][0],
                    dp[i + 1][1]
            );
            // Do high task today
            // Tomorrow cannot do high task
            dp[i][2] = high[i] + Math.max(
                    dp[i + 1][0],
                    dp[i + 1][1]
            );
        }

        return Math.max(
                dp[0][0],
                Math.max(dp[0][1], dp[0][2])
        );
    }
}
