// Approach: Postorder DFS returns (subtree sum, node count). At each node,
// average is sum/count (integer divide). Count when it equals the node value.
// Complexity: O(n) time and O(h) extra space, h = tree height.
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
    private int ans;

    public int AverageOfSubtree(TreeNode root)
    {
        Dfs(root);
        return ans;
    }

    private (int sum, int count) Dfs(TreeNode node)
    {
        if (node == null)
            return (0, 0);

        var left = Dfs(node.left);
        var right = Dfs(node.right);

        int sum = node.val + left.sum + right.sum;
        int count = 1 + left.count + right.count;

        if (sum / count == node.val)
            ans++;

        return (sum, count);
    }
}
