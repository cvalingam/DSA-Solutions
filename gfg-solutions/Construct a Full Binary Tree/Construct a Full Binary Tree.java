
import java.util.*;

//Structure of Binary Tree Node
class Node {

    int data;
    Node left, right;

    Node(int val) {
        data = val;
        left = right = null;
    }
}

class Solution {

    // Approach: A full binary tree is uniquely determined by its preorder and the
    // preorder of its mirror. Consume nodes from pre in order; look up the next
    // pre value in preMirror to split the current mirror-range into original left
    // (mirror right half) and original right (mirror left half), then recurse.
    // Complexity: O(n) time and O(n) space for the index map and recursion.
    int preIndex = 0;

    public Node constructBinaryTree(int[] pre, int[] preMirror) {
        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < preMirror.length; i++) {
            map.put(preMirror[i], i);
        }

        return build(pre, preMirror, map, 0, preMirror.length - 1);
    }

    private Node build(int[] pre, int[] preMirror,
            HashMap<Integer, Integer> map,
            int l, int r) {

        if (preIndex >= pre.length || l > r) {
            return null;
        }

        Node root = new Node(pre[preIndex++]);

        if (l == r || preIndex >= pre.length) {
            return root;
        }

        int idx = map.get(pre[preIndex]);

        root.left = build(pre, preMirror, map, idx, r);
        root.right = build(pre, preMirror, map, l + 1, idx - 1);

        return root;
    }
}
