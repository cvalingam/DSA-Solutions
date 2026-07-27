// Approach: BST inorder traversal visits nodes in strictly ascending order.
// Perform an iterative inorder traversal using an explicit stack.
// Decrement k each time a node is popped from the stack.
// When k reaches 0, the current node's value is the k-th smallest - return immediately.
// Stopping early avoids visiting the entire tree when k is small.
// Iterative approach avoids stack-overflow risk on degenerate (skewed) BSTs.
// Time: O(H + k) where H is the tree height. Space: O(H) for the stack.

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
    public int KthSmallest(TreeNode root, int k)
    {
        int leftCount = CountNodes(root.left);

        if (leftCount == k - 1)
            return root.val;
        if (leftCount >= k)
            return KthSmallest(root.left, k);
        return KthSmallest(root.right, k - 1 - leftCount); // leftCount < k
    }

    private int CountNodes(TreeNode root)
    {
        if (root == null)
            return 0;
        return 1 + CountNodes(root.left) + CountNodes(root.right);
    }
}