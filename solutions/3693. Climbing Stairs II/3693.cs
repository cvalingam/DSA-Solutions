// Approach: dp[i] is the cheapest way to reach step i. A jump from i - d
// costs costs[i - 1] plus d squared for d in 1, 2, 3. Only the previous three
// dp values are needed, so they roll forward in constant space.
// Time: O(n) Space: O(1)

public class Solution
{
    public int ClimbStairs(int n, int[] costs)
    {
        const int Inf = int.MaxValue / 4;
        int a = Inf, b = Inf, c = 0;

        for (int i = 1; i <= n; i++)
        {
            int cost = costs[i - 1];
            int next = Inf;
            if (c != Inf)
                next = Math.Min(next, c + cost + 1);
            if (b != Inf)
                next = Math.Min(next, b + cost + 4);
            if (a != Inf)
                next = Math.Min(next, a + cost + 9);
            a = b;
            b = c;
            c = next;
        }

        return c;
    }
}
