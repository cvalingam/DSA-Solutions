// Approach: Open the first row and the last column, and wall off every
// other cell. The only right-and-down route runs across the top and then
// down the right edge. Every lower row is that same wall string, so it is
// built once and shared.
// Time: O(m + n) Space: O(m + n)

public class Solution
{
    public string[] CreateGrid(int m, int n)
    {
        string[] ans = new string[m];
        ans[0] = new string('.', n);
        if (m == 1)
            return ans;

        string rest = string.Create(n, n, static (span, cols) =>
        {
            span.Fill('#');
            span[cols - 1] = '.';
        });
        for (int i = 1; i < m; i++)
            ans[i] = rest;
        return ans;
    }
}
