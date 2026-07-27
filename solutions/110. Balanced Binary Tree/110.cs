/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     public int val;
 *     public TreeNode left;
 *     public TreeNode right;
 *     public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
// Approach: DFS returning subtree height. Return -1 to signal imbalance
// and propagate it upward immediately.
// Time: O(n) Space: O(h)

public class Solution
{
    public bool IsBalanced(TreeNode root)
    {
        if (root == null)
            return true;

        return height(root) != -1;
    }

    private int height(TreeNode root)
    {
        if (root == null)
            return 0;

        int lh = height(root.left);
        int rh = height(root.right);

        if (Math.Abs(lh - rh) > 1 || lh == -1 || rh == -1)
            return -1;

        return Math.Max(lh, rh) + 1;
    }
}