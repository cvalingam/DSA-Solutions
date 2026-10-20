// Approach: Adjacent swaps are allowed only between equal parity, so values
// cannot cross a parity change. The array splits into maximal same-parity
// runs, and each run may be permuted freely. For the lexicographically
// largest result, sort every run in descending order, then emit the array.
// Complexity: O(n log n) time, O(n) space for the result list.
import java.util.ArrayList;
import java.util.Arrays;

class Solution {
    public ArrayList<Integer> lexicographicallyLargest(int[] arr) {
        int n = arr.length;
        int i = 0;
        while (i < n) {
            int j = i + 1;
            int parity = arr[i] & 1;
            while (j < n && (arr[j] & 1) == parity)
                j++;
            if (j - i > 1) {
                Arrays.sort(arr, i, j);
                for (int l = i, r = j - 1; l < r; l++, r--) {
                    int t = arr[l];
                    arr[l] = arr[r];
                    arr[r] = t;
                }
            }
            i = j;
        }

        ArrayList<Integer> res = new ArrayList<>(n);
        for (int x : arr)
            res.add(x);
        return res;
    }
}
