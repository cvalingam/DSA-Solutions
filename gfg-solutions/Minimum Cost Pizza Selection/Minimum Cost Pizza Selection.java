// Approach: Unbounded knapsack for the cheapest way to reach area at least x
// with three pizza sizes. dp[i] is the minimum cost of exactly area i.
// Only reachable areas below x are expanded, because every cost is positive,
// so buying more after x cannot help. A pizza is ignored when another pizza
// gives at least as much area for a strictly better price.
// The last pizza overshoots by less than the largest size, so the table
// stops at x + maxSize - 1.
// Complexity: O(x) time and O(x) extra space.
import java.util.Arrays;

class Solution {
    public int minimumCost(int x, int s, int m, int l, int cs, int cm, int cl) {
        int[] area = { s, m, l };
        int[] cost = { cs, cm, cl };
        boolean[] skip = new boolean[3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i != j && area[j] >= area[i] && cost[j] <= cost[i]
                        && (area[j] > area[i] || cost[j] < cost[i]))
                    skip[i] = true;
            }
        }

        int maxSize = Math.max(s, Math.max(m, l));
        int limit = x + maxSize - 1;
        int inf = Integer.MAX_VALUE / 4;
        int[] dp = new int[limit + 1];
        Arrays.fill(dp, inf);
        dp[0] = 0;

        int answer = inf;
        for (int i = 0; i <= limit; i++) {
            if (dp[i] == inf)
                continue;
            if (i >= x) {
                answer = Math.min(answer, dp[i]);
                continue;
            }
            for (int t = 0; t < 3; t++) {
                if (skip[t])
                    continue;
                int next = i + area[t];
                if (next <= limit)
                    dp[next] = Math.min(dp[next], dp[i] + cost[t]);
            }
        }
        return answer;
    }
}
