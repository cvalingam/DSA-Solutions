// Approach: Sort nodes by nums value. From each sorted position, the farthest reachable
// index in one edge is the rightmost j with sortedNums[j] - sortedNums[i] <= maxDiff.
// Binary-lift those jumps; each query is the min jump count between the two ranks (or -1).
// Time: O((n + q) log n) Space: O(n log n)
public class Solution
{
    public int[] PathExistenceQueries(int n, int[] nums, int maxDiff, int[][] queries)
    {
        int[] ans = new int[queries.Length];
        int[] indexMap = new int[n];
        int[] sortedNums = new int[n];
        KeyValuePair<int, int>[] sortedNumAndIndexes = new KeyValuePair<int, int>[n];

        for (int i = 0; i < n; ++i)
            sortedNumAndIndexes[i] = new KeyValuePair<int, int>(nums[i], i);

        Array.Sort(sortedNumAndIndexes, (a, b) => a.Key.CompareTo(b.Key));

        for (int i = 0; i < n; ++i)
        {
            int num = sortedNumAndIndexes[i].Key;
            int sortedIndex = sortedNumAndIndexes[i].Value;
            sortedNums[i] = num;
            indexMap[sortedIndex] = i;
        }

        int maxLevel = sizeof(int) * 8 - BitOperations.LeadingZeroCount((uint)n) + 1;
        int[][] jump = new int[n][];
        for (int i = 0; i < n; i++)
            jump[i] = new int[maxLevel];

        int right = 0;
        for (int i = 0; i < n; ++i)
        {
            while (right + 1 < n && sortedNums[right + 1] - sortedNums[i] <= maxDiff)
                ++right;
            jump[i][0] = right;
        }

        for (int level = 1; level < maxLevel; ++level)
        {
            for (int i = 0; i < n; ++i)
            {
                int prevJump = jump[i][level - 1];
                jump[i][level] = jump[prevJump][level - 1];
            }
        }

        for (int i = 0; i < queries.Length; ++i)
        {
            int u = queries[i][0];
            int v = queries[i][1];
            int uIndex = indexMap[u];
            int vIndex = indexMap[v];
            int start = Math.Min(uIndex, vIndex);
            int end = Math.Max(uIndex, vIndex);
            int res = MinJumps(jump, start, end, maxLevel - 1);
            ans[i] = res == int.MaxValue ? -1 : res;
        }

        return ans;
    }

    private int MinJumps(int[][] jump, int start, int end, int level)
    {
        if (start == end)
            return 0;
        if (jump[start][0] >= end)
            return 1;
        if (jump[start][level] < end)
            return int.MaxValue;
        int j = level;
        for (; j >= 0; --j)
            if (jump[start][j] < end)
                break;
        return (1 << j) + MinJumps(jump, jump[start][j], end, j);
    }
}