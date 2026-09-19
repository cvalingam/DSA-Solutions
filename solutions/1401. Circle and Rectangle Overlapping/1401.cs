// Approach: Clamp the circle center into the axis-aligned rectangle to get
// the closest point on (or in) the rect. Overlap iff squared distance from
// center to that point is at most radius^2 (avoids sqrt).
// Complexity: O(1) time and O(1) space.
public class Solution
{
    public bool CheckOverlap(int radius, int xCenter, int yCenter, int x1, int y1, int x2, int y2)
    {
        int closestX = Math.Max(x1, Math.Min(x2, xCenter));
        int closestY = Math.Max(y1, Math.Min(y2, yCenter));
        int dx = xCenter - closestX;
        int dy = yCenter - closestY;
        return dx * dx + dy * dy <= radius * radius;
    }
}
