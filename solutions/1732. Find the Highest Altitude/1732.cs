// Approach: The biker starts at altitude 0. Each gain[i] updates the current altitude.
// Track the running sum (prefix sum of gain) and keep the maximum altitude seen at any step, including the start.
// Time: O(n) Space: O(1)
public class Solution
{
    public int LargestAltitude(int[] gain)
    {
        int ans = 0;
        int currAltitude = 0;
        foreach (int g in gain)
        {
            currAltitude += g;
            ans = Math.Max(ans, currAltitude);
        }
        return ans;
    }
}