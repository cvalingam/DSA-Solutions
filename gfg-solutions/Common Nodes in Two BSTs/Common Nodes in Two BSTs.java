// Approach: Inorder of a BST is sorted, so the common values are the
// intersection of two sorted streams. Two stacks walk both trees at once,
// always comparing the next inorder nodes. Equal values are kept, the
// smaller side advances, and only O(height) nodes sit on each stack.
// Complexity: O(n + m) time, O(h1 + h2) extra space.
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;

class Node {
    public int data;
    public Node left;
    public Node right;

    public Node(int val) {
        data = val;
        left = right = null;
    }
}

class Solution {
    public ArrayList<Integer> findCommon(Node r1, Node r2) {
        ArrayList<Integer> ans = new ArrayList<>();
        Deque<Node> s1 = new ArrayDeque<>();
        Deque<Node> s2 = new ArrayDeque<>();

        while (true) {
            while (r1 != null) {
                s1.push(r1);
                r1 = r1.left;
            }
            while (r2 != null) {
                s2.push(r2);
                r2 = r2.left;
            }
            if (s1.isEmpty() || s2.isEmpty()) {
                break;
            }

            Node a = s1.peek();
            Node b = s2.peek();
            if (a.data == b.data) {
                ans.add(a.data);
                s1.pop();
                s2.pop();
                r1 = a.right;
                r2 = b.right;
            } else if (a.data < b.data) {
                s1.pop();
                r1 = a.right;
                r2 = null;
            } else {
                s2.pop();
                r2 = b.right;
                r1 = null;
            }
        }
        return ans;
    }
}
