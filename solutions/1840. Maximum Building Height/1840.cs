// Approach: Add sentinel restrictions at (1, 0) and (n, n-1), then sort by position.
// Forward pass: each cap is tightened by the left neighbor — height[i] <= height[i-1] + distance.
// Backward pass: tighten from the right the same way.
// Between consecutive caps, max height is max(hL, hR) + (dist - |hL - hR|) / 2 (best peak under slope-1 constraint).
// Time: O(k log k) Space: O(k)
public class Solution
{
    public int MaxBuilding(int n, int[][] restrictions)
    {
        int k = restrictions.Length;
        int[][] A = new int[k + 2][];
        Array.Copy(restrictions, A, k);
        A[k] = new int[] { 1, 0 };
        A[k + 1] = new int[] { n, n - 1 };

        A = A.OrderBy(a => a[0]).ThenBy(a => a[1]).ToArray();

        for (int i = 1; i < A.Length; ++i)
        {
            int dist = A[i][0] - A[i - 1][0];
            A[i][1] = Math.Min(A[i][1], A[i - 1][1] + dist);
        }

        for (int i = A.Length - 2; i >= 0; --i)
        {
            int dist = A[i + 1][0] - A[i][0];
            A[i][1] = Math.Min(A[i][1], A[i + 1][1] + dist);
        }

        int ans = 0;

        for (int i = 1; i < A.Length; ++i)
        {
            int l = A[i - 1][0];
            int r = A[i][0];
            int hL = A[i - 1][1];
            int hR = A[i][1];
            ans = Math.Max(ans, Math.Max(hL, hR) + (r - l - Math.Abs(hL - hR)) / 2);
        }

        return ans;
    }
}