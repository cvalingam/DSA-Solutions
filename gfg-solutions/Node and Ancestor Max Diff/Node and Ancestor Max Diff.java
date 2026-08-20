// Approach: For ancestor - descendant, the best diff at a node uses the largest
// ancestor value on the path from root. Pre-order DFS carries that max down;
// at each node update ans with maxAncestor - node.data, then extend max.
// Complexity: O(n) time and O(h) space (h = tree height).

class Node {

    int data;
    Node left, right;

    Node(int item) {
        data = item;
        left = right = null;
    }
}

class Solution {

    int maxDiff(Node root) {
        int[] ans = { Integer.MIN_VALUE };
        dfs(root, Integer.MIN_VALUE, ans);
        return ans[0];
    }

    private void dfs(Node root, int maxAnc, int[] ans) {
        if (root == null) {
            return;
        }
        if (maxAnc != Integer.MIN_VALUE) {
            ans[0] = Math.max(ans[0], maxAnc - root.data);
        }
        maxAnc = Math.max(maxAnc, root.data);
        dfs(root.left, maxAnc, ans);
        dfs(root.right, maxAnc, ans);
    }
}
