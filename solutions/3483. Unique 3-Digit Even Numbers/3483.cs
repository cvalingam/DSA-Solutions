// Approach: Count digit frequencies. Enumerate hundreds (1-9), tens (0-9), and
// even units (0,2,4,6,8). Accept a number when the multiset of used digits is
// covered by the available counts.
// Complexity: O(1) time and O(1) extra space (fixed 10-digit alphabet).
public class Solution
{
    public int TotalNumbers(int[] digits)
    {
        int[] freq = new int[10];
        foreach (int d in digits)
            freq[d]++;

        int ans = 0;
        for (int hundreds = 1; hundreds <= 9; hundreds++)
        {
            for (int tens = 0; tens <= 9; tens++)
            {
                for (int units = 0; units <= 8; units += 2)
                {
                    if (CanForm(freq, hundreds, tens, units))
                        ans++;
                }
            }
        }

        return ans;
    }

    private bool CanForm(int[] freq, int a, int b, int c)
    {
        int[] need = new int[10];
        need[a]++;
        need[b]++;
        need[c]++;

        for (int d = 0; d < 10; d++)
            if (need[d] > freq[d])
                return false;

        return true;
    }
}
