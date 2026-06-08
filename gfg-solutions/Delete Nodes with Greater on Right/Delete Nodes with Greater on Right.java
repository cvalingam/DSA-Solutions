// Approach: Recursively process from right to left. After fixing the suffix, drop the current node
// if the suffix head is strictly greater; otherwise keep it and link to the filtered suffix.
// Time: O(n) Space: O(n) for recursion stack

class Node {

    int data;
    Node next;

    Node(int d) {
        data = d;
        next = null;
    }
}

class Solution {

    Node compute(Node head) {
        if (head.next == null) {
            return head;
        }

        Node tp = compute(head.next);

        if (tp.data > head.data) {
            return tp;
        }

        head.next = tp;

        return head;
    }
}
