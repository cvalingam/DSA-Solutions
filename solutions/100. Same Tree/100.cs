// Approach: Recursively compare both trees node by node.
// Base cases: both nodes null means identical; one null or mismatched values means not identical.
// A subtree is the same only if both its left and right subtrees are identical.
// Every node is visited exactly once - O(n) time. Recursion depth equals tree height O(h).
// Time: O(n) Space: O(h)

public class TreeNode
{
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int val = 0, TreeNode left = null, TreeNode right = null)
    {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution
{
    public bool IsSameTree(TreeNode p, TreeNode q)
    {
        if (p == null || q == null)
            return (p == q);

        return (p.val == q.val) && IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
    }
}