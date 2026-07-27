// Approach: DFS subtracting each node's value from the remaining target sum.
// At each node, reduce target by node.val and recurse into both children.
// A leaf node (no children) returns true only when the remaining sum equals zero,
// confirming the root-to-leaf path sums to the original target.
// Every node is visited at most once - O(n) time. Stack depth equals tree height O(h).
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
    public bool HasPathSum(TreeNode root, int targetSum)
    {
        if (root == null)
            return false;

        if (root.val == targetSum && root.left == null && root.right == null)
            return true;

        bool left = HasPathSum(root.left, targetSum - root.val);
        bool right = HasPathSum(root.right, targetSum - root.val);

        return left || right;
    }
}