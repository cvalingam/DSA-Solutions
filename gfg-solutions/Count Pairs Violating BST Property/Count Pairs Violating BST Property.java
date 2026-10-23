// Approach: Inorder of a BST is sorted, so a violating pair is an inversion in
// that sequence. Write the inorder straight into an int array, then count
// inversions with a bottom-up merge. Each level merges from one buffer into
// the other, so every element is written once per level.
// Complexity: O(n log n) time, O(n) extra space.
import java.util.ArrayDeque;

class Node {
    int data;
    Node left, right;

    Node(int val) {
        data = val;
        left = right = null;
    }
}

class Solution {
    public int pairsViolatingBST(Node root) {
        int n = count(root);
        if (n < 2)
            return 0;

        int[] a = new int[n];
        fill(root, a);
        int[] b = new int[n];
        long inv = 0;
        for (int width = 1; width < n; width <<= 1) {
            for (int low = 0; low < n; low += width << 1) {
                int mid = Math.min(low + width, n);
                int high = Math.min(low + (width << 1), n);
                if (mid >= high)
                    System.arraycopy(a, low, b, low, high - low);
                else
                    inv += merge(a, b, low, mid, high);
            }
            int[] swap = a;
            a = b;
            b = swap;
        }
        return (int) inv;
    }

    private int count(Node root) {
        int n = 0;
        ArrayDeque<Node> stack = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            n++;
            cur = cur.right;
        }
        return n;
    }

    private void fill(Node root, int[] arr) {
        int k = 0;
        ArrayDeque<Node> stack = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            arr[k++] = cur.data;
            cur = cur.right;
        }
    }

    private long merge(int[] src, int[] dst, int low, int mid, int high) {
        int i = low, j = mid, k = low;
        long inv = 0;
        while (i < mid && j < high) {
            if (src[i] <= src[j])
                dst[k++] = src[i++];
            else {
                inv += mid - i;
                dst[k++] = src[j++];
            }
        }
        while (i < mid)
            dst[k++] = src[i++];
        while (j < high)
            dst[k++] = src[j++];
        return inv;
    }
}
