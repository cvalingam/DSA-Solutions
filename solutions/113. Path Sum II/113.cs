// Approach: DFS with backtracking - append the node at entry and remove it
// on exit; record the path when a leaf is reached with remaining sum zero.
// Time: O(n²) Space: O(n)

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
    public IList<IList<int>> PathSum(TreeNode root, int targetSum)
    {
        IList<IList<int>> result = new List<IList<int>>();
        List<int> ds = new();
        PSIIDFS(root, targetSum, ds, result);
        return result;
    }

    private void PSIIDFS(TreeNode root, int targetSum, IList<int> ds, IList<IList<int>> result)
    {
        if (root == null)
            return;

        if (root.val == targetSum && root.left == null && root.right == null)
        {
            ds.Add(root.val);
            result.Add(new List<int>(ds));
            ds.RemoveAt(ds.Count - 1);
            return;
        }

        ds.Add(root.val);
        PSIIDFS(root.left, targetSum - root.val, ds, result);
        PSIIDFS(root.right, targetSum - root.val, ds, result);
        ds.RemoveAt(ds.Count - 1);
    }
}