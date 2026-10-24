// Approach: Convert each MM-DD to a day of the year with a prefix of month
// lengths. Both visits are inclusive intervals on that line, so the shared
// stretch is max(0, min(leave) - max(arrive) + 1).
// Time: O(1) Space: O(1)

public class Solution
{
    private static readonly int[] Prefix = { 0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 };

    public int CountDaysTogether(string arriveAlice, string leaveAlice, string arriveBob, string leaveBob)
    {
        int start = Math.Max(Day(arriveAlice), Day(arriveBob));
        int end = Math.Min(Day(leaveAlice), Day(leaveBob));
        return Math.Max(0, end - start + 1);
    }

    private static int Day(string s)
    {
        int month = (s[0] - '0') * 10 + (s[1] - '0');
        int day = (s[3] - '0') * 10 + (s[4] - '0');
        return Prefix[month] + day;
    }
}
