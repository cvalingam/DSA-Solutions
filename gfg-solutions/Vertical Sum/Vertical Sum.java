
import java.util.*;

class Node {

    int data;
    Node left, right;

    Node(int item) {
        data = item;
        left = right = null;
    }
}

// Approach: DFS with horizontal distance (column index).
// Add each node value into a TreeMap keyed by column; left child is column-1, right child is column+1.
// TreeMap keeps columns sorted, so values are returned from leftmost to rightmost vertical line.
// Time: O(n log k) Space: O(k + h)

class Solution {

    TreeMap<Integer, Integer> map;

    public ArrayList<Integer> verticalSum(Node root) {
        map = new TreeMap<>();
        calculate(0, root);

        return new ArrayList<>(map.values());
    }

    public void calculate(int level, Node root) {
        if (root == null) {
            return;
        }

        int previousVal = map.getOrDefault(level, 0);
        map.put(level, previousVal + root.data);

        calculate(level - 1, root.left);
        calculate(level + 1, root.right);
    }
}
