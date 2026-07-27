// Approach: Sort robots and factories; DP(robot, factory, capacity) - assign or skip current factory slot.
// Time: O(r * f * maxCap) Space: O(r * f * maxCap)

public class Solution
{
    public long MinimumTotalDistance(IList<int> robot, int[][] factory)
    {
        List<int> robots = new List<int>(robot);
        robots.Sort();
        Array.Sort(factory, (a, b) => a[0].CompareTo(b[0]));
        long[][][] mem = new long[robots.Count][][];
        for (int i = 0; i < robots.Count; i++)
        {
            mem[i] = new long[factory.Length][];
            for (int j = 0; j < factory.Length; j++)
                mem[i][j] = new long[robots.Count];
        }
        return MinimumTotalDistance(robots, factory, 0, 0, 0, mem);
    }

    private long MinimumTotalDistance(List<int> robot, int[][] factory, int i, int j, int k, long[][][] mem)
    {
        if (i == robot.Count)
            return 0;
        if (j == factory.Length)
            return long.MaxValue;
        if (mem[i][j][k] > 0)
            return mem[i][j][k];
        long skipFactory = MinimumTotalDistance(robot, factory, i, j + 1, 0, mem);
        int position = factory[j][0];
        int limit = factory[j][1];
        long useFactory = limit > k ? MinimumTotalDistance(robot, factory, i + 1, j, k + 1, mem) +
                                      Math.Abs(robot[i] - position)
                                      : long.MaxValue / 2;
        return mem[i][j][k] = Math.Min(skipFactory, useFactory);
    }
}