// Approach: BST inorder is sorted, so the minimum absolute difference is
// between some consecutive values. Walk inorder while keeping the previous
// value and update the running minimum; no need to store the full sequence.
// Complexity: O(n) time, O(h) space for the recursion stack.
class Solution {
    private Integer prev;
    private int ans;

    public int absDiff(Node root) {
        prev = null;
        ans = Integer.MAX_VALUE;
        inOrder(root);
        return ans;
    }

    private void inOrder(Node root) {
        if (root == null)
            return;
        inOrder(root.left);
        if (prev != null)
            ans = Math.min(ans, root.data - prev);
        prev = root.data;
        inOrder(root.right);
    }
}

class Node {
    int data;
    Node left, right;

    Node(int data) {
        this.data = data;
    }
}
