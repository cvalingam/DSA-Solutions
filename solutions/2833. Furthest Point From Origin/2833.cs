// Approach: Count L moves, R moves, and '_' wildcards separately in one pass.
// The net displacement without wildcards is |countL - countR|. Every wildcard '_'
// can freely move in whichever direction is dominant, adding 1 to the furthest distance.
// So the answer is simply Math.Abs(countL - countR) + countUnderline.
//
// Time: O(N) - single pass over the moves string.
// Space: O(1) - three integer counters only.
public class Solution
{
    public int FurthestDistanceFromOrigin(string moves)
    {
        int countL = 0;
        int countR = 0;
        int countUnderline = 0;

        foreach (char c in moves)
        {
            if (c == 'L')
                ++countL;
            else if (c == 'R')
                ++countR;
            else // c == '_'
                ++countUnderline;
        }

        return Math.Abs(countL - countR) + countUnderline;
    }
}