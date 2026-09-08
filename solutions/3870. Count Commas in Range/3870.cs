// Approach: n <= 10^5, so only numbers >= 1000 get a comma and each gets
// exactly one. Count is max(0, n - 999).
// Complexity: O(1) time and O(1) extra space.
public class Solution
{
    public int CountCommas(int n)
    {
        return Math.Max(0, n - 999);
    }
}
