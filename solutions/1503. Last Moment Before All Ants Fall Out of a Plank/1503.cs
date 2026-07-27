// Approach: Key insight - when two ants meet they effectively pass through each other.
// So ants moving left take max(left) time; ants moving right take n - min(right) time.
// Return the maximum of these two values.
// Time: O(n) Space: O(1)
public class Solution
{
    public int GetLastMoment(int n, int[] left, int[] right)
    {
        int maxLeft = left.Length == 0 ? 0 : left.Max();
        int minRight = right.Length == 0 ? n : right.Min();
        return Math.Max(maxLeft, n - minRight);
    }
}