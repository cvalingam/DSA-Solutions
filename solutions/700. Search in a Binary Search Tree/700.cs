// Approach: Recursive BST search - go left if val < root, right if val > root;
// return the matching node or null.
// Time: O(h) Space: O(h)

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
    public TreeNode SearchBST(TreeNode root, int val)
    {
        if (root == null)
            return null;
        if (root.val == val)
            return root;
        if (root.val > val)
            return SearchBST(root.left, val);
        return SearchBST(root.right, val);
    }
}