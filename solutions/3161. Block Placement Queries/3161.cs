// Approach: Offline reverse processing with two Fenwick trees.
// Add all type-1 obstacles up front, then process queries in reverse (removals instead of additions).
// cntBIT counts which positions hold obstacles; predecessor/successor found via binary lifting in O(log n).
// gapBIT stores the max gap ending at each obstacle position as a prefix-max Fenwick tree.
// For type-1 reversal: merge the two gaps around the removed obstacle, update gapBIT at successor.
// For type-2: answer is true if max prefix gap up to prev >= sz OR the direct space x-prev >= sz.
// Replaces SortedSet.GetViewBetween (heap allocation + LINQ per query) with zero-allocation BIT ops.
// Time: O(q log n) Space: O(n)
public class Solution
{
    public IList<bool> GetResults(int[][] queries)
    {
        // All x <= 50000; sentinel right boundary just beyond that
        const int MAXN = 50001;
        const int SZ   = MAXN + 2; // BIT index = problem position + 1, so max index = MAXN+1

        int[] cntBIT = new int[SZ];
        int[] gapBIT = new int[SZ];

        // --- count BIT (obstacle presence) ---
        void CntUpdate(int pos, int delta)
        {
            for (int i = pos + 1; i < SZ; i += i & -i)
                cntBIT[i] += delta;
        }
        int CntQuery(int pos) // obstacles in [0..pos]
        {
            int s = 0;
            for (int i = pos + 1; i > 0; i -= i & -i)
                s += cntBIT[i];
            return s;
        }
        // Binary lifting: problem position of the k-th obstacle (1-indexed)
        int FindKth(int k)
        {
            int idx = 0;
            for (int pw = 1 << 16; pw > 0; pw >>= 1)
            {
                int nxt = idx + pw;
                if (nxt < SZ && cntBIT[nxt] < k)
                {
                    idx = nxt;
                    k -= cntBIT[idx];
                }
            }
            return idx; // BIT index idx+1 → problem position idx
        }
        int Pred(int pos) => FindKth(CntQuery(pos));           // largest obstacle <= pos
        int Succ(int pos) => FindKth(CntQuery(pos - 1) + 1);  // smallest obstacle >= pos

        // --- gap BIT (prefix-max of gap lengths) ---
        void GapUpdate(int pos, int val)
        {
            for (int i = pos + 1; i < SZ; i += i & -i)
                gapBIT[i] = Math.Max(gapBIT[i], val);
        }
        int GapQuery(int pos)
        {
            int res = 0;
            for (int i = pos + 1; i > 0; i -= i & -i)
                res = Math.Max(res, gapBIT[i]);
            return res;
        }

        // Sentinels: 0 (left) and MAXN (right, beyond any valid x)
        CntUpdate(0, 1);
        CntUpdate(MAXN, 1);

        // First pass: add all type-1 obstacles
        foreach (var q in queries)
            if (q[0] == 1) CntUpdate(q[1], 1);

        // Build initial gap BIT (all obstacles present)
        int total   = CntQuery(MAXN);
        int prevPos = 0; // starts at left sentinel (position 0 = FindKth(1))
        for (int k = 2; k <= total; k++)
        {
            int pos = FindKth(k);
            GapUpdate(pos, pos - prevPos);
            prevPos = pos;
        }

        var ans = new List<bool>();

        // Second pass in reverse: undo type-1 additions, answer type-2 queries
        for (int i = queries.Length - 1; i >= 0; --i)
        {
            int type = queries[i][0], x = queries[i][1];
            if (type == 1)
            {
                int next = Succ(x + 1);
                int prev = Pred(x - 1);
                GapUpdate(next, next - prev); // merged gap after removing x
                CntUpdate(x, -1);
            }
            else
            {
                int sz   = queries[i][2];
                int prev = Pred(x);
                ans.Add(GapQuery(prev) >= sz || x - prev >= sz);
            }
        }

        ans.Reverse();
        return ans;
    }
}