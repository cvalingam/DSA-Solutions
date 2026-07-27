// Approach: Reverse BFS - enqueue right child before left; the last dequeued
// node is the bottom-left (leftmost) node.
// Time: O(n) Space: O(n)

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
    public int FindBottomLeftValue(TreeNode root)
    {
        Queue<TreeNode> q = new Queue<TreeNode>();
        q.Enqueue(root);

        while (q.Count > 0)
        {
            root = q.Dequeue();

            if (root.right != null)
                q.Enqueue(root.right);

            if (root.left != null)
                q.Enqueue(root.left);
        }

        return root.val;
    }
}