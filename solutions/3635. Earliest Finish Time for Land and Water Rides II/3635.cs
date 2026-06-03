// Approach: Evaluate both valid orders: land then water, and water then land.
// For a fixed order, find the earliest completion time of any first-type ride, then combine it with each second-type ride as max(firstCompletion, secondStart) + secondDuration.
// Time: O(n + m) Space: O(1)

public class Solution
{
    public int EarliestFinishTime(int[] landStartTime, int[] landDuration, int[] waterStartTime, int[] waterDuration)
    {
        int x = Calc(landStartTime, landDuration, waterStartTime, waterDuration);
        int y = Calc(waterStartTime, waterDuration, landStartTime, landDuration);
        return Math.Min(x, y);
    }

    private int Calc(int[] a1, int[] t1, int[] a2, int[] t2)
    {
        int minEnd = int.MaxValue;
        for (int i = 0; i < a1.Length; ++i)
        {
            minEnd = Math.Min(minEnd, a1[i] + t1[i]);
        }
        int ans = int.MaxValue;
        for (int i = 0; i < a2.Length; ++i)
        {
            ans = Math.Min(ans, Math.Max(minEnd, a2[i]) + t2[i]);
        }
        
        return ans;
    }
}