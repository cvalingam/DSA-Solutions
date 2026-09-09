// Approach: Each power of 1000 adds one more comma for every number at or
// above that threshold. Sum (n - x + 1) for x = 1000, 1e6, 1e9, ... while x <= n.
// Complexity: O(log n) time and O(1) extra space.
public class Solution
{
    public long CountCommas(long n)
    {
        long ans = 0;
        for (long x = 1000; x <= n; x *= 1000)
            ans += n - x + 1;
        return ans;
    }
}
