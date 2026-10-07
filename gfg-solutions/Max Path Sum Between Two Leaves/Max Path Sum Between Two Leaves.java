// Approach: For every node, down is the best sum of a path from that node to
// a leaf below it. A node with two children can join its best left and best
// right downward paths into a leaf to leaf path. A node with one child must
// extend through that child, because it is not a leaf. Nodes are listed in
// level order, which places every parent before its children, so walking
// that list backwards computes each node after both of its children with no
// recursion. A leaf has no children, so a root with one child is not a leaf.
// Without any node that has two children (including an empty tree), there
// are fewer than two leaves and the answer is -1.
// Complexity: O(n) time, O(n) extra space.
import java.util.ArrayList;
import java.util.Arrays;

class Node {
    int data;
    Node left, right;

    Node(int item) {
        data = item;
        left = right = null;
    }
}

class Solution {
    public int maxPathSum(Node root) {
        if (root == null)
            return -1;

        ArrayList<Node> order = new ArrayList<>();
        int[] leftIdx = new int[16];
        int[] rightIdx = new int[16];
        order.add(root);

        for (int k = 0; k < order.size(); k++) {
            if (k == leftIdx.length) {
                leftIdx = Arrays.copyOf(leftIdx, k * 2);
                rightIdx = Arrays.copyOf(rightIdx, k * 2);
            }
            Node u = order.get(k);
            leftIdx[k] = -1;
            rightIdx[k] = -1;
            if (u.left != null) {
                leftIdx[k] = order.size();
                order.add(u.left);
            }
            if (u.right != null) {
                rightIdx[k] = order.size();
                order.add(u.right);
            }
        }

        int n = order.size();
        int[] down = new int[n];
        int best = Integer.MIN_VALUE;
        boolean found = false;
        for (int k = n - 1; k >= 0; k--) {
            int data = order.get(k).data;
            int l = leftIdx[k];
            int r = rightIdx[k];
            if (l >= 0 && r >= 0) {
                best = Math.max(best, data + down[l] + down[r]);
                found = true;
                down[k] = data + Math.max(down[l], down[r]);
            } else if (l >= 0) {
                down[k] = data + down[l];
            } else if (r >= 0) {
                down[k] = data + down[r];
            } else {
                down[k] = data;
            }
        }

        return found ? best : -1;
    }
}
