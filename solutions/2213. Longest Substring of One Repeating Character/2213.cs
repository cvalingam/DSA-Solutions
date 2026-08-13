// Approach: Segment tree over the string. Each node stores the longest uniform
// run inside its range, plus the prefix/suffix letter and run lengths so two
// children can merge across the midpoint when the left suffix letter matches
// the right prefix letter. Point updates recompute O(log n) ancestors.
// Complexity: O(n) build, O(q log n) time for q updates, O(n) space.
public class SegmentTreeNode
{
    public int Lo;
    public int Hi;
    public char MaxLetter;
    public char PrefixLetter;
    public char SuffixLetter;
    public int MaxLength;
    public int PrefixLength;
    public int SuffixLength;
    public SegmentTreeNode Left;
    public SegmentTreeNode Right;

    public SegmentTreeNode(
        int lo, int hi, char maxLetter, char prefixLetter, char suffixLetter,
        int maxLength, int prefixLength, int suffixLength,
        SegmentTreeNode left = null, SegmentTreeNode right = null)
    {
        Lo = lo;
        Hi = hi;
        MaxLetter = maxLetter;
        PrefixLetter = prefixLetter;
        SuffixLetter = suffixLetter;
        MaxLength = maxLength;
        PrefixLength = prefixLength;
        SuffixLength = suffixLength;
        Left = left;
        Right = right;
    }
}

public class SegmentTree
{
    private SegmentTreeNode _root;

    public SegmentTree(string s)
    {
        _root = Build(s, 0, s.Length - 1);
    }

    public void Update(int i, char val)
    {
        _root = Update(_root, i, val);
    }

    public int GetMaxLength() => _root.MaxLength;

    private SegmentTreeNode Build(string s, int lo, int hi)
    {
        if (lo == hi)
            return new SegmentTreeNode(lo, hi, s[lo], s[lo], s[lo], 1, 1, 1);

        int mid = (lo + hi) / 2;
        var left = Build(s, lo, mid);
        var right = Build(s, mid + 1, hi);
        return Merge(left, right);
    }

    private SegmentTreeNode Update(SegmentTreeNode root, int i, char c)
    {
        if (root.Lo == i && root.Hi == i)
        {
            root.MaxLetter = c;
            root.PrefixLetter = c;
            root.SuffixLetter = c;
            return root;
        }

        int mid = (root.Lo + root.Hi) / 2;
        if (i <= mid)
        {
            var updatedLeft = Update(root.Left, i, c);
            return Merge(updatedLeft, root.Right);
        }
        else
        {
            var updatedRight = Update(root.Right, i, c);
            return Merge(root.Left, updatedRight);
        }
    }

    private SegmentTreeNode Merge(SegmentTreeNode left, SegmentTreeNode right)
    {
        char maxLetter;
        int maxLength;
        if (left.MaxLength > right.MaxLength)
        {
            maxLetter = left.MaxLetter;
            maxLength = left.MaxLength;
        }
        else
        {
            maxLetter = right.MaxLetter;
            maxLength = right.MaxLength;
        }

        if (left.SuffixLetter == right.PrefixLetter &&
            left.SuffixLength + right.PrefixLength > maxLength)
        {
            maxLetter = left.SuffixLetter;
            maxLength = left.SuffixLength + right.PrefixLength;
        }

        char prefixLetter = left.PrefixLetter;
        int prefixLength = left.PrefixLength;
        if (left.Lo + prefixLength == right.Lo &&
            left.PrefixLetter == right.PrefixLetter)
            prefixLength += right.PrefixLength;

        char suffixLetter = right.SuffixLetter;
        int suffixLength = right.SuffixLength;
        if (right.Hi - suffixLength == left.Hi &&
            right.SuffixLetter == left.SuffixLetter)
            suffixLength += left.SuffixLength;

        return new SegmentTreeNode(
            left.Lo, right.Hi, maxLetter, prefixLetter, suffixLetter,
            maxLength, prefixLength, suffixLength, left, right);
    }
}

public class Solution
{
    public int[] LongestRepeating(string s, string queryCharacters, int[] queryIndices)
    {
        var ans = new int[queryIndices.Length];
        var tree = new SegmentTree(s);

        for (int i = 0; i < queryIndices.Length; i++)
        {
            tree.Update(queryIndices[i], queryCharacters[i]);
            ans[i] = tree.GetMaxLength();
        }

        return ans;
    }
}
