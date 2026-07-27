
import java.util.*;

class Node {

    int data;
    Node left;
    Node right;

    Node(int x) {
        data = x;
        left = right = null;
    }
}

// Approach: Serialize both trees via inorder traversal (inserting 0 as a null-node marker),
// then use KMP substring search to check whether root2's inorder sequence appears inside root1's.
// Null markers are essential - without them, different tree shapes can produce identical inorder lists.
// Time: O(m + n) Space: O(m + n)

class Solution {

    public boolean isSubTree(Node root1, Node root2) {
        ArrayList<Integer> list1 = new ArrayList<>();
        ArrayList<Integer> list2 = new ArrayList<>();

        inorder(root1, list1);
        inorder(root2, list2);

        return isSublist(list1, list2);
    }

    public boolean isSublist(ArrayList<Integer> list, ArrayList<Integer> sublist) {
        if (sublist.isEmpty()) {
            return true;
        }
        if (sublist.size() > list.size()) {
            return false;
        }

        // Compute LPS array for the sublist
        int[] lps = computeLPS(sublist);

        int i = 0; // index for list
        int j = 0; // index for sublist

        while (i < list.size()) {
            if (list.get(i).equals(sublist.get(j))) {
                i++;
                j++;
            }

            if (j == sublist.size()) {
                return true; // Found complete match
            } else if (i < list.size() && !list.get(i).equals(sublist.get(j))) {
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        return false;
    }

    private int[] computeLPS(ArrayList<Integer> pattern) {
        int[] lps = new int[pattern.size()];
        int len = 0;
        int i = 1;

        while (i < pattern.size()) {
            if (pattern.get(i).equals(pattern.get(len))) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        return lps;
    }

    public void inorder(Node root, ArrayList<Integer> list) {
        if (root == null) {
            list.add(0);
            return;
        }
        inorder(root.left, list);
        list.add(root.data);
        inorder(root.right, list);
    }
}
