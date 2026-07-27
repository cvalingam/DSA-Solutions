// Approach: Post-order DFS - recurse into both subtrees before deciding at each node.
// Base cases: return null for a null node; return the node itself if it equals p or q.
// After recursing left and right: if both return non-null, the current root is the LCA.
// If only one side is non-null, that value is the LCA candidate and propagates up.
// This single DFS pass handles all cases: p is ancestor of q, q is ancestor of p, and the general case.
// Time: O(n) Space: O(h) for the recursion stack where h is the tree height.

public class TreeNode
{
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int x) { val = x; }
}

public class Solution
{
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)
    {
        if (root == null || root == p || root == q)
            return root;

        TreeNode left = LowestCommonAncestor(root.left, p, q);
        TreeNode right = LowestCommonAncestor(root.right, p, q);

        if (left == null)
            return right;
        if (right == null)
            return left;
        else
            return root;
    }
}