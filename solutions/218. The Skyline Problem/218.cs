// Approach: Divide and conquer - split the buildings list in half, recursively compute
// each half's skyline, then merge two skylines into one.
// Merging two skylines uses a two-pointer sweep over their key points.
// At each x-coordinate, take the maximum height from both skylines.
// Only add a key point to the result when the effective maximum height changes.
// This is analogous to merge-sort and shares the same recurrence T(n) = 2T(n/2) + O(n).
// Time: O(n log n) Space: O(n) for temporary skyline lists.

public class Solution
{
    public IList<IList<int>> GetSkyline(int[][] buildings)
    {
        int n = buildings.Length;
        if (n == 0)
            return new List<IList<int>>();
        if (n == 1)
        {
            int left = buildings[0][0];
            int right = buildings[0][1];
            int height = buildings[0][2];
            IList<IList<int>> ans = new List<IList<int>>();
            ans.Add(new List<int> { left, height });
            ans.Add(new List<int> { right, 0 });
            return ans;
        }

        IList<IList<int>> leftSkyline = GetSkyline(buildings[0..(n / 2)]);
        IList<IList<int>> rightSkyline = GetSkyline(buildings[(n / 2)..n]);
        return Merge(leftSkyline, rightSkyline);
    }

    private IList<IList<int>> Merge(IList<IList<int>> left, IList<IList<int>> right)
    {
        IList<IList<int>> ans = new List<IList<int>>();
        int i = 0; // left's index
        int j = 0; // right's index
        int leftY = 0;
        int rightY = 0;

        while (i < left.Count && j < right.Count)
        {
            // Choose the point with the smaller x.
            if (left[i][0] < right[j][0])
            {
                leftY = left[i][1]; // Update the ongoing `leftY`.
                AddPoint(ans, left[i][0], Math.Max(left[i++][1], rightY));
            }
            else
            {
                rightY = right[j][1]; // Update the ongoing `rightY`.
                AddPoint(ans, right[j][0], Math.Max(right[j++][1], leftY));
            }
        }

        while (i < left.Count)
            AddPoint(ans, left[i][0], left[i++][1]);

        while (j < right.Count)
            AddPoint(ans, right[j][0], right[j++][1]);

        return ans;
    }

    private void AddPoint(IList<IList<int>> ans, int x, int y)
    {
        if (ans.Count > 0 && ans[ans.Count - 1][0] == x)
        {
            ans[ans.Count - 1][1] = y;
            return;
        }
        if (ans.Count > 0 && ans[ans.Count - 1][1] == y)
            return;
        ans.Add(new List<int> { x, y });
    }
}