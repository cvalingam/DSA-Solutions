// Approach: Level-order both trees in lockstep. A level is an anagram iff the
// multisets of node values match. Count frequencies from one tree and subtract
// with the other instead of sorting each level.
// Complexity: O(n) time, O(w) space (w = max width).
import java.util.*;

class Solution {
    public boolean areAnagrams(Node root1, Node root2) {
        if (root1 == null && root2 == null)
            return true;
        if (root1 == null || root2 == null)
            return false;

        Queue<Node> q1 = new ArrayDeque<>();
        Queue<Node> q2 = new ArrayDeque<>();
        q1.offer(root1);
        q2.offer(root2);

        while (!q1.isEmpty()) {
            if (q1.size() != q2.size())
                return false;

            int size = q1.size();
            Map<Integer, Integer> freq = new HashMap<>();

            for (int i = 0; i < size; i++) {
                Node a = q1.poll();
                Node b = q2.poll();
                freq.merge(a.data, 1, Integer::sum);
                freq.merge(b.data, -1, Integer::sum);

                if (a.left != null)
                    q1.offer(a.left);
                if (a.right != null)
                    q1.offer(a.right);
                if (b.left != null)
                    q2.offer(b.left);
                if (b.right != null)
                    q2.offer(b.right);
            }

            for (int c : freq.values()) {
                if (c != 0)
                    return false;
            }
        }

        return q2.isEmpty();
    }
}

class Node {
    int data;
    Node left, right;

    Node(int x) {
        data = x;
    }
}
