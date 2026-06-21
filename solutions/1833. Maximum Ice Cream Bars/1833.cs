// Approach: Sort ice cream costs ascending and buy from cheapest first until coins run out.
// Count how many bars you can afford with a greedy scan after sorting.
// Time: O(n log n) Space: O(1) or O(log n) for sort
public class Solution
{
    public int MaxIceCream(int[] costs, int coins)
    {
        Array.Sort(costs);

        for (int i = 0; i < costs.Length; ++i)
        {
            if (coins >= costs[i])
                coins -= costs[i];
            else
                return i;
        }

        return costs.Length;
    }
}