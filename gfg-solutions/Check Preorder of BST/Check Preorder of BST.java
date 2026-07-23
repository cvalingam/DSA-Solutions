
import java.util.*;

class Solution {

    // Approach: Simulate BST preorder with a decreasing stack. last is the
    // lower bound after finishing a left subtree (moving to a right child).
    // Pop while the top is smaller than the next value and update last; if the
    // next value is then still below last, the sequence cannot be a BST preorder.
    // Complexity: O(n) time and O(n) space.
    public boolean canRepresentBST(List<Integer> arr) {
        Stack<Integer> st = new Stack<>();
        int last = Integer.MIN_VALUE;
        for (int ele : arr) {
            while (!st.isEmpty() && st.peek() < ele) {
                last = st.pop();
            }
            if (last > ele) {
                return false;
            }
            st.push(ele);
        }
        return true;
    }
}
