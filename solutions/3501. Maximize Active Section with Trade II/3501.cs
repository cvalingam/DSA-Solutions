public class Solution
{
    // Approach: Same trade idea as LC 3499 - a valid trade activates two adjacent
    // zero-runs (net gain = sum of their lengths). Precompute every zero-run, build
    // adjacent-pair lengths, and answer range-max of those pairs with a sparse table.
    // Each query [l,r] clips runs at the endpoints and takes the best of: no trade,
    // merge two clipped endpoint runs, or RMQ over fully interior adjacent pairs.
    // Complexity: O(n log n + q) time and O(n log n) space.
    public IList<int> MaxActiveSectionsAfterTrade(string s, int[][] queries)
    {
        int n = s.Length;
        int ones = 0;
        foreach (char c in s)
            if (c == '1')
                ++ones;

        var (zeroGroups, zeroGroupIndex) = GetZeroGroups(s);

        if (zeroGroups.Count == 0)
            return Enumerable.Repeat(ones, queries.Length).ToList();

        var st = new SparseTable(GetZeroMergeLengths(zeroGroups));
        var ans = new List<int>(queries.Length);

        foreach (int[] query in queries)
        {
            int l = query[0];
            int r = query[1];
            int left = zeroGroupIndex[l] == -1
                ? -1
                : zeroGroups[zeroGroupIndex[l]].Length - (l - zeroGroups[zeroGroupIndex[l]].Start);
            int right = zeroGroupIndex[r] == -1
                ? -1
                : r - zeroGroups[zeroGroupIndex[r]].Start + 1;
            var (startAdjacentGroupIndex, endAdjacentGroupIndex) = MapToAdjacentGroupIndices(
                zeroGroupIndex[l] + 1,
                s[r] == '1' ? zeroGroupIndex[r] : zeroGroupIndex[r] - 1);

            int activeSections = ones;
            if (s[l] == '0' && s[r] == '0' && zeroGroupIndex[l] + 1 == zeroGroupIndex[r])
                activeSections = Math.Max(activeSections, ones + left + right);
            else if (startAdjacentGroupIndex <= endAdjacentGroupIndex)
                activeSections = Math.Max(activeSections,
                    ones + st.Query(startAdjacentGroupIndex, endAdjacentGroupIndex));
            if (s[l] == '0' &&
                zeroGroupIndex[l] + 1 <= (s[r] == '1' ? zeroGroupIndex[r] : zeroGroupIndex[r] - 1))
                activeSections = Math.Max(activeSections,
                    ones + left + zeroGroups[zeroGroupIndex[l] + 1].Length);
            if (s[r] == '0' && zeroGroupIndex[l] < zeroGroupIndex[r] - 1)
                activeSections = Math.Max(activeSections,
                    ones + right + zeroGroups[zeroGroupIndex[r] - 1].Length);
            ans.Add(activeSections);
        }

        return ans;
    }

    // Returns the zero groups and the index of the zero group that contains the i-th character.
    private (List<Group> zeroGroups, int[] zeroGroupIndex) GetZeroGroups(string s)
    {
        var zeroGroups = new List<Group>();
        int[] zeroGroupIndex = new int[s.Length];

        for (int i = 0; i < s.Length; i++)
        {
            if (s[i] == '0')
            {
                if (i > 0 && s[i - 1] == '0')
                    zeroGroups[^1].Length++;
                else
                    zeroGroups.Add(new Group(i, 1));
            }
            zeroGroupIndex[i] = zeroGroups.Count - 1;
        }

        return (zeroGroups, zeroGroupIndex);
    }

    // Returns the sums of the lengths of adjacent zero groups.
    private int[] GetZeroMergeLengths(List<Group> zeroGroups)
    {
        int[] zeroMergeLengths = new int[zeroGroups.Count - 1];
        for (int i = 0; i < zeroGroups.Count - 1; ++i)
            zeroMergeLengths[i] = zeroGroups[i].Length + zeroGroups[i + 1].Length;
        return zeroMergeLengths;
    }

    // Returns the indices of the adjacent groups that contain l and r completely.
    private (int start, int end) MapToAdjacentGroupIndices(int startGroupIndex, int endGroupIndex)
    {
        return (startGroupIndex, endGroupIndex - 1);
    }
}

class Group
{
    public int Start;
    public int Length;

    public Group(int start, int length)
    {
        Start = start;
        Length = length;
    }
}

class SparseTable
{
    private readonly int n;
    private readonly int[][] st; // st[i][j] := max(nums[j..j + 2^i - 1])

    public SparseTable(int[] nums)
    {
        n = nums.Length;
        st = new int[BitLength(n) + 1][];
        for (int i = 0; i < st.Length; ++i)
            st[i] = new int[n + 1];

        if (n > 0)
            Array.Copy(nums, 0, st[0], 0, n);

        for (int i = 1; i < st.Length; ++i)
            for (int j = 0; j + (1 << i) <= n; ++j)
                st[i][j] = Math.Max(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
    }

    // Returns max(nums[l..r]).
    public int Query(int l, int r)
    {
        int i = BitLength(r - l + 1) - 1;
        return Math.Max(st[i][l], st[i][r - (1 << i) + 1]);
    }

    private static int BitLength(int value)
    {
        return value == 0 ? 0 : 32 - System.Numerics.BitOperations.LeadingZeroCount((uint)value);
    }
}
