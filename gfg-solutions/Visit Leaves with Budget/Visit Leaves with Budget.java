// Approach: Cost of a leaf is its level (root = 1). Maximize count by taking
// cheapest leaves first. BFS visits levels in order, so leaf costs appear
// already sorted; take greedily and stop when the next leaf exceeds budget.
// Complexity: O(n) time, O(w) space (w = max width).
import java.util.*;

class Solution {
    public int getCount(Node root, int k) {
        if (root == null)
            return 0;

        Queue<Node> q = new ArrayDeque<>();
        q.offer(root);
        int level = 1, count = 0;

        while (!q.isEmpty() && k > 0) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                Node node = q.poll();
                if (node.left == null && node.right == null) {
                    if (level > k)
                        return count;
                    k -= level;
                    count++;
                } else {
                    if (node.left != null)
                        q.offer(node.left);
                    if (node.right != null)
                        q.offer(node.right);
                }
            }
            level++;
        }

        return count;
    }
}

class Node {
    int data;
    Node left, right;

    Node(int data) {
        this.data = data;
    }
}
