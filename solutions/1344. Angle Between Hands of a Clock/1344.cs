// Approach: Each clock hand moves at a constant degrees-per-minute rate.
// Hour hand: (hour % 12 + minutes / 60.0) * 30 - 30° per hour plus fractional hour from minutes.
// Minute hand: minutes * 6 - 6° per minute.
// Take the absolute difference and return the smaller of diff and 360 - diff (acute angle).
// Time: O(1) Space: O(1)
public class Solution
{
    public double AngleClock(int hour, int minutes)
    {
        double hourHand = (hour % 12 + minutes / 60.0) * 30;
        double minuteHand = minutes * 6;
        double diff = Math.Abs(hourHand - minuteHand);
        return Math.Min(diff, 360 - diff);
    }
}