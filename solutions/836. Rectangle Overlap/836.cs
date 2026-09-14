// Approach: Axis-aligned rectangles overlap with positive area iff their x
// projections and y projections both strictly overlap.
// Complexity: O(1) time and O(1) extra space.
public class Solution
{
    public bool IsRectangleOverlap(int[] rec1, int[] rec2)
    {
        return rec1[0] < rec2[2] && rec2[0] < rec1[2]
            && rec1[1] < rec2[3] && rec2[1] < rec1[3];
    }
}
