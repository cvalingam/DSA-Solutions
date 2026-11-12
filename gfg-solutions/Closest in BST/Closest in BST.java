// Approach: Walk one root-to-leaf path using the BST order. At each node,
// update the closest absolute difference to k, then go left when k is
// smaller and right otherwise. An exact match returns 0 at once. Only one
// path is visited, so the bound is already tight for a BST search.
// Complexity: O(h) time, O(1) extra space, where h is the tree height.

class Node {
    int data;
    Node left, right;

    public Node(int val) {
        data = val;
        left = right = null;
    }
}

class Solution {
    public int minDiff(Node root, int k) {
        int ans = Integer.MAX_VALUE;

        while (root != null) {
            ans = Math.min(ans, Math.abs(root.data - k));
            if (ans == 0) {
                return 0;
            }
            root = k < root.data ? root.left : root.right;
        }
        return ans;
    }
}
