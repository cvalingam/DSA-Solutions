// Approach: Alice wins iff the two halves cannot be forced equal. Treat each
// '?' as 4.5 (the midpoint of 0..9). Add that value on the left half and
// subtract it on the right. A non-zero total means Alice can keep the sums
// different; zero means Bob can always cancel.
// Complexity: O(n) time and O(1) extra space.
public class Solution
{
    public bool SumGame(string num)
    {
        int n = num.Length;
        double ans = 0.0;

        for (int i = 0; i < n / 2; ++i)
            ans += GetExpectation(num[i]);

        for (int i = n / 2; i < n; ++i)
            ans -= GetExpectation(num[i]);

        return ans != 0.0;
    }

    private double GetExpectation(char c)
    {
        return c == '?' ? 4.5 : c - '0';
    }
}