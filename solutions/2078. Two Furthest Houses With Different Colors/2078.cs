// Approach: The furthest pair must include either the first or last house.
// Scan from the left to find the rightmost house with a different color from colors[0] - that distance is a candidate.
// Scan from the right to find the leftmost house with a different color from colors[n-1] - that distance is another candidate.
// Return the maximum of both candidates.
// Time: O(n) Space: O(1)
public class Solution
{
    public int MaxDistance(int[] colors)
    {
        int n = colors.Length;
        int i = 0;     // the leftmost index, where colors[i] != colors[n - 1]
        int j = n - 1; // the rightmost index, where colors[j] != colors[0]
        while (colors[i] == colors[n - 1])
            ++i;
        while (colors[j] == colors[0])
            --j;
        return Math.Max(n - 1 - i, j);
    }
}