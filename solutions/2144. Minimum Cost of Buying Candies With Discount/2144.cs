// Approach: Sort costs in descending order and process candies in groups of three.
// In every group, pay for the first two (most expensive) and get the third for free to minimize total cost.
// Time: O(n log n) Space: O(n)

public class Solution
{
    public int MinimumCost(int[] cost)
    {
        int ans = 0;

        cost = cost.OrderByDescending(x => x).ToArray();

        for (int i = 0; i < cost.Length; ++i)
        {
            if (i % 3 != 2)
                ans += cost[i];
        }

        return ans;
    }
}

