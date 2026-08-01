
class Solution {

    // Approach: Difference array for m range adds on an n-length zero array.
    // For each [a[i], b[i]] add k[i]: mark +k at a[i] and -k at b[i]+1. Prefix
    // sum reconstructs final values; track the maximum along the way.
    // Complexity: O(m + n) time and O(n) space.
    public int findMax(int n, int[] a, int[] b, int[] k) {
        int m = a.length;
        int[] arr = new int[n + 1];

        for (int i = 0; i < m; i++) {
            int start = a[i], end = b[i], add = k[i];
            arr[start] += add;
            arr[end + 1] -= add;
        }

        int res = 0, curr = 0;
        for (int i = 0; i < n; i++) {
            curr += arr[i];
            res = Math.max(res, curr);
        }
        return res;
    }
}
