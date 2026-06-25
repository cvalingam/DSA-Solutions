// Approach: Map target to +1 and other values to -1. A subarray has a strict majority of target
// iff the transformed sum is positive. Count subarrays with positive sum using prefix sums and a Fenwick tree.
// Time: O(n log n) Space: O(n)
public class Solution
{
    public int CountMajoritySubarrays(int[] nums, int target)
    {
        int n = nums.Length;
        BinaryIndexedTree tree = new BinaryIndexedTree(2 * n + 1);
        int s = n + 1;
        tree.Update(s, 1);
        long ans = 0;
        foreach (int x in nums)
        {
            s += x == target ? 1 : -1;
            ans += tree.Query(s - 1);
            tree.Update(s, 1);
        }
        return (int)ans;
    }
}

class BinaryIndexedTree
{
    private int n;
    private int[] c;

    public BinaryIndexedTree(int n)
    {
        this.n = n;
        this.c = new int[n + 1];
    }

    public void Update(int x, int delta)
    {
        for (; x <= n; x += x & -x)
            c[x] += delta;
    }

    public int Query(int x)
    {
        int s = 0;
        for (; x > 0; x -= x & -x)
            s += c[x];
            
        return s;
    }
}