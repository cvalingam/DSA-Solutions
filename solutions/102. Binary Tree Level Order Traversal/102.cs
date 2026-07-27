// Approach: BFS with a queue to process nodes level by level.
// At the start of each iteration, snapshot the queue size - this is the exact count of nodes at the current level.
// Dequeue that many nodes, collect their values into a row list, and enqueue their non-null children.
// Append the completed row to the result after all nodes at that level are processed.
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
    public IList<IList<int>> LevelOrder(TreeNode root)
    {
        IList<IList<int>> result = new List<IList<int>>();
        if (root == null)
            return result;
        Queue<TreeNode> q = new Queue<TreeNode>();
        q.Enqueue(root);

        while (q.Count > 0)
        {
            int levelNum = q.Count;
            List<int> subList = new();
            for (int i = 0; i < levelNum; i++)
            {
                if (q.Peek().left != null)
                    q.Enqueue(q.Peek().left);

                if (q.Peek().right != null)
                    q.Enqueue(q.Peek().right);

                subList.Add(q.Dequeue().val);
            }
            result.Add(subList);
        }

        return result;
    }
}