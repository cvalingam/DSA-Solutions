// Approach: The cell at (r, c) holds r * 4n + c + 1, so no matrix is built.
// Each ring has two halves: down the left column then right along the
// bottom, and up the right column then left along the top. Coil 1 takes the
// first half on even rings and the second half on odd rings. The second coil
// is the first rotated 180 degrees, so each entry is 16n^2 + 1 minus the
// matching entry of coil 1.
// Complexity: O(n^2) time, O(1) extra space beyond the two coils.
import java.util.ArrayList;

class Solution {
    public ArrayList<ArrayList<Integer>> formCoils(int n) {
        int size = 4 * n;
        int total = size * size;
        int[] coil = new int[total / 2];
        int k = 0;

        for (int ring = 0; ring < size / 2; ring++) {
            int lo = ring;
            int hi = size - 1 - ring;
            if ((ring & 1) == 0) {
                for (int r = lo; r <= hi; r++)
                    coil[k++] = r * size + lo + 1;
                for (int c = lo + 1; c < hi; c++)
                    coil[k++] = hi * size + c + 1;
            } else {
                for (int r = hi; r >= lo; r--)
                    coil[k++] = r * size + hi + 1;
                for (int c = hi - 1; c > lo; c--)
                    coil[k++] = lo * size + c + 1;
            }
        }

        ArrayList<Integer> first = new ArrayList<>(coil.length);
        ArrayList<Integer> second = new ArrayList<>(coil.length);
        for (int v : coil) {
            first.add(v);
            second.add(total + 1 - v);
        }

        ArrayList<ArrayList<Integer>> ans = new ArrayList<>(2);
        ans.add(first);
        ans.add(second);
        return ans;
    }
}
