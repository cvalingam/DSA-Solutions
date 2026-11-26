// Approach: Players must remove 10, then 9, then 8, ... stones in order.
// Alice starts. Simulate the forced sequence; when the next required count
// exceeds the remaining stones, that player loses. Alice wins iff that
// failed turn is Bob's, which is when the required count is odd.
// Time: O(1) Space: O(1)

public class Solution
{
    public bool CanAliceWin(int n)
    {
        for (int take = 10; ; --take)
        {
            if (take > n)
                return (take & 1) == 1;
            n -= take;
        }
    }
}
