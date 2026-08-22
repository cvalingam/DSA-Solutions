// Approach: Turns happen when the unique path changes left/right. Find the LCA
// of p and q, then one DFS from the LCA records how many direction changes lie
// on the path to each target. If the LCA is neither target, add 1 for the
// switch at the LCA. A straight path (no turn) is reported as -1.
// Complexity: O(n) time and O(h) space (h = tree height).

class Node {

    int data;
    Node left;
    Node right;

    Node(int val) {
        data = val;
        left = right = null;
    }
}

class Solution {

    public int numberOfTurns(Node root, int first, int second) {
        if (first == second) {
            return -1;
        }

        Node lca = lca(root, first, second);
        if (lca == null) {
            return -1;
        }

        int[] turns = { -1, -1 };
        walk(lca, first, second, 0, 0, turns);

        if (lca.data == first || lca.data == second) {
            int other = lca.data == first ? turns[1] : turns[0];
            return other <= 0 ? -1 : other;
        }
        return turns[0] + turns[1] + 1;
    }

    private Node lca(Node root, int p, int q) {
        if (root == null || root.data == p || root.data == q) {
            return root;
        }
        Node left = lca(root.left, p, q);
        Node right = lca(root.right, p, q);
        if (left != null && right != null) {
            return root;
        }
        return left != null ? left : right;
    }

    // dir: 0 at LCA, 1 came from a left edge, 2 from a right edge.
    private void walk(Node node, int p, int q, int dir, int soFar, int[] turns) {
        if (node == null || (turns[0] >= 0 && turns[1] >= 0)) {
            return;
        }
        if (node.data == p) {
            turns[0] = soFar;
        }
        if (node.data == q) {
            turns[1] = soFar;
        }
        walk(node.left, p, q, 1, soFar + (dir == 2 ? 1 : 0), turns);
        walk(node.right, p, q, 2, soFar + (dir == 1 ? 1 : 0), turns);
    }
}
