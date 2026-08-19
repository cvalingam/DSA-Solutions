// Approach: Each row can seat at most 2 four-person groups (seats 2-5 and 6-9).
// Seats 1 and 10 never block a group. Pack reserved seats 2-9 into a bitmask per
// touched row. Start from 2*n and subtract 1 if any block is blocked, or 2 if
// left, mid, and right are all blocked.
// Complexity: O(m) time and O(m) space (m = reservedSeats.length).
public class Solution
{
    public int MaxNumberOfFamilies(int n, int[][] reservedSeats)
    {
        var rowToSeats = new Dictionary<int, int>();

        foreach (var rs in reservedSeats)
        {
            int seat = rs[1];
            if (seat == 1 || seat == 10)
                continue;

            int row = rs[0];
            rowToSeats.TryGetValue(row, out int mask);
            rowToSeats[row] = mask | (1 << (seat - 2));
        }

        int ans = n * 2;
        foreach (int seats in rowToSeats.Values)
        {
            bool left = (seats & 0b11110000) != 0;
            bool mid = (seats & 0b00111100) != 0;
            bool right = (seats & 0b00001111) != 0;
            ans -= left && mid && right ? 2 : 1;
        }

        return ans;
    }
}
