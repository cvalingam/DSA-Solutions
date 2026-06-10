// Approach: Build a sparse table for O(1) range max/min queries. For each left endpoint,
// push the value of its longest suffix subarray into a max-heap; whenever that candidate is
// chosen, shrink its right endpoint by one and push the next candidate for the same left.
// Time: O(n log n + (n + k) log n) Space: O(n log n)

class SparseTableRMQ
{
    int n;
    int maxLog;
    int[][] fMax;
    int[][] fMin;
    int[] lg;

    public SparseTableRMQ(int[] data)
    {
        n = data.Length;
        maxLog = 32 - CountLeadingZeros(n) + 1;
        fMax = new int[n][];
        fMin = new int[n][];
        for (int i = 0; i < n; i++)
        {
            fMax[i] = new int[maxLog];
            fMin[i] = new int[maxLog];
        }
        lg = new int[n + 1];

        for (int i = 2; i <= n; i++)
        {
            lg[i] = lg[i >> 1] + 1;
        }

        for (int i = 0; i < n; i++)
        {
            fMax[i][0] = data[i];
            fMin[i][0] = data[i];
        }

        for (int j = 1; j < maxLog; j++)
        {
            for (int i = 0; i <= n - (1 << j); i++)
            {
                fMax[i][j] = Math.Max(fMax[i][j - 1], fMax[i + (1 << (j - 1))][j - 1]);
                fMin[i][j] = Math.Min(fMin[i][j - 1], fMin[i + (1 << (j - 1))][j - 1]);
            }
        }
    }

    public int queryMax(int l, int r)
    {
        int k = lg[r - l + 1];
        return Math.Max(fMax[l][k], fMax[r - (1 << k) + 1][k]);
    }

    public int queryMin(int l, int r)
    {
        int k = lg[r - l + 1];
        return Math.Min(fMin[l][k], fMin[r - (1 << k) + 1][k]);
    }

    private static int CountLeadingZeros(int x)
    {
        // Count leading zeros for 32-bit integer
        if (x == 0) return 32;
        int n = 0;
        if ((x & 0xFFFF0000) == 0) { n += 16; x <<= 16; }
        if ((x & 0xFF000000) == 0) { n += 8; x <<= 8; }
        if ((x & 0xF0000000) == 0) { n += 4; x <<= 4; }
        if ((x & 0xC0000000) == 0) { n += 2; x <<= 2; }
        if ((x & 0x80000000) == 0) { n += 1; }
        return n;
    }
}

class Solution
{
    public long MaxTotalValue(int[] nums, int k)
    {
        int n = nums.Length;
        SparseTableRMQ st = new SparseTableRMQ(nums);
        var pq = new PriorityQueue<long[], long>(Comparer<long>.Create((a, b) => b.CompareTo(a)));

        for (int l = 0; l < n; l++)
        {
            long val = (long)st.queryMax(l, n - 1) - st.queryMin(l, n - 1);
            pq.Enqueue(new long[] { val, l, n - 1 }, val);
        }

        long ans = 0;
        for (int i = 0; i < k && pq.Count > 0; i++)
        {
            var curr = pq.Dequeue();
            long val = curr[0];
            int l = (int)curr[1];
            int r = (int)curr[2];
            ans += val;
            if (r > l)
            {
                long nextVal = (long)st.queryMax(l, r - 1) - st.queryMin(l, r - 1);
                pq.Enqueue(new long[] { nextVal, l, r - 1 }, nextVal);
            }
        }
        return ans;
    }
}
