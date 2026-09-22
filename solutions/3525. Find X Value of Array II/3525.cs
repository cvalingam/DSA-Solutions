// Approach: After each update, count suffixes of nums[start..] whose product
// % k equals x. A segment tree node stores the range product mod k and how
// many prefixes of that range land on each residue. Merge shifts the right
// child's counts by the left product. k <= 5, so nodes are plain structs.
// Complexity: O(k (n + q log n)) time, O(n) extra space.
public class Solution
{
    public int[] ResultArray(int[] nums, int k, int[][] queries)
    {
        int n = nums.Length;
        int[] ans = new int[queries.Length];
        var tree = new SegmentTree(nums, k);

        for (int qi = 0; qi < queries.Length; qi++)
        {
            int[] query = queries[qi];
            tree.Update(query[0], query[1] % k);
            ans[qi] = tree.Query(query[2], n - 1).Get(query[3]);
        }

        return ans;
    }
}

public struct Node
{
    public int Prod;
    public int R0, R1, R2, R3, R4;

    public int Get(int i) => i switch
    {
        0 => R0,
        1 => R1,
        2 => R2,
        3 => R3,
        _ => R4
    };

    public void Clear()
    {
        R0 = R1 = R2 = R3 = R4 = 0;
    }

    public void Add(int i, int v)
    {
        switch (i)
        {
            case 0: R0 += v; break;
            case 1: R1 += v; break;
            case 2: R2 += v; break;
            case 3: R3 += v; break;
            default: R4 += v; break;
        }
    }
}

public class SegmentTree
{
    private readonly int n;
    private readonly int k;
    private readonly Node[] tree;

    public SegmentTree(int[] nums, int k)
    {
        n = nums.Length;
        this.k = k;
        tree = new Node[4 * n];
        Build(nums, 0, 0, n - 1);
    }

    public void Update(int i, int val) => Update(0, 0, n - 1, i, val);

    public Node Query(int i, int j) => Query(0, 0, n - 1, i, j);

    private void Build(int[] nums, int cur, int left, int right)
    {
        if (left == right)
        {
            int v = nums[left] % k;
            tree[cur].Prod = v;
            tree[cur].Add(v, 1);
            return;
        }

        int mid = left + (right - left) / 2;
        Build(nums, 2 * cur + 1, left, mid);
        Build(nums, 2 * cur + 2, mid + 1, right);
        tree[cur] = Merge(tree[2 * cur + 1], tree[2 * cur + 2]);
    }

    private void Update(int treeIndex, int lo, int hi, int i, int val)
    {
        if (lo == hi)
        {
            tree[treeIndex].Clear();
            tree[treeIndex].Prod = val;
            tree[treeIndex].Add(val, 1);
            return;
        }

        int mid = lo + (hi - lo) / 2;
        if (i <= mid)
            Update(2 * treeIndex + 1, lo, mid, i, val);
        else
            Update(2 * treeIndex + 2, mid + 1, hi, i, val);
        tree[treeIndex] = Merge(tree[2 * treeIndex + 1], tree[2 * treeIndex + 2]);
    }

    private Node Query(int treeIndex, int lo, int hi, int i, int j)
    {
        if (i <= lo && hi <= j)
            return tree[treeIndex];
        if (j < lo || hi < i)
            return new Node { Prod = 1 };

        int mid = lo + (hi - lo) / 2;
        return Merge(
            Query(2 * treeIndex + 1, lo, mid, i, j),
            Query(2 * treeIndex + 2, mid + 1, hi, i, j));
    }

    private Node Merge(in Node left, in Node right)
    {
        Node node = default;
        node.Prod = left.Prod * right.Prod % k;
        node.R0 = left.R0;
        node.R1 = left.R1;
        node.R2 = left.R2;
        node.R3 = left.R3;
        node.R4 = left.R4;
        for (int i = 0; i < k; i++)
        {
            int count = right.Get(i);
            if (count != 0)
                node.Add(i * left.Prod % k, count);
        }
        return node;
    }
}
