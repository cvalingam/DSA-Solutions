// Approach: For each letter record first/last index. At each first occurrence,
// expand the candidate [i, right] until every letter inside is fully covered;
// reject if any letter starts before i. Process left to right: append a new
// interval when disjoint; otherwise replace the previous one with the later
// nested shorter interval (maximizes count, then minimizes total length).
// Complexity: O(n) time (at most 26 expansions), O(1) extra beyond the answer.
public class Solution
{
    public IList<string> MaxNumOfSubstrings(string s)
    {
        int n = s.Length;
        int[] leftmost = new int[26];
        int[] rightmost = new int[26];
        Array.Fill(leftmost, n);
        Array.Fill(rightmost, -1);

        for (int i = 0; i < n; i++)
        {
            int c = s[i] - 'a';
            leftmost[c] = Math.Min(leftmost[c], i);
            rightmost[c] = i;
        }

        List<(int L, int R)> intervals = new();
        int lastR = -1;

        for (int i = 0; i < n; i++)
        {
            if (i != leftmost[s[i] - 'a'])
                continue;

            int newR = ExpandRight(s, i, leftmost, rightmost);
            if (newR < 0)
                continue;

            if (i <= lastR && intervals.Count > 0)
                intervals[intervals.Count - 1] = (i, newR);
            else
                intervals.Add((i, newR));

            lastR = newR;
        }

        List<string> ans = new(intervals.Count);
        foreach (var (L, R) in intervals)
            ans.Add(s.Substring(L, R - L + 1));
        return ans;
    }

    // Expand from first occurrence i; return inclusive right end or -1 if invalid.
    private static int ExpandRight(string s, int i, int[] leftmost, int[] rightmost)
    {
        int right = rightmost[s[i] - 'a'];
        for (int j = i; j <= right; j++)
        {
            if (leftmost[s[j] - 'a'] < i)
                return -1;
            right = Math.Max(right, rightmost[s[j] - 'a']);
        }
        return right;
    }
}
