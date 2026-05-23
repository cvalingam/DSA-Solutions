// Structure for Tree Node

class Node {

    int data;
    Node left, right;

    // Constructor
    Node(int val) {
        data = val;
        left = null;
        right = null;
    }
};

// Approach: Postorder DFS. For each node, first compute sums of left and right subtrees.
// Replace node.data with leftSum + rightSum, and return (oldValue + new node.data) upward.
// This transforms the tree in-place into a sum tree.
// Time: O(n) Space: O(h)

class Solution {

    public void toSumTree(Node root) {
        solve(root);
    }

    private int solve(Node node) {
        if (node == null) {
            return 0;
        }
        // Recursively compute left and right subtree sums
        int old = node.data;
        node.data = solve(node.left) + solve(node.right);
        // Return the total sum including the original node value
        return node.data + old;
    }
}
