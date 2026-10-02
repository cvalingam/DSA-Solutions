// Approach: Two candidate starts i and j race over the doubled string. When
// they first differ after k equal characters, every start from the larger
// candidate through k positions later cannot be the minimum, so that
// candidate jumps past them. The surviving start is the smallest rotation.
// Indices wrap with a subtraction instead of a modulo, and the answer is
// copied into one array.
// Complexity: O(n) time, O(n) extra space for the char array and result.
class Solution {
    public String lexiString(String s) {
        char[] c = s.toCharArray();
        int n = c.length;
        int i = 0;
        int j = 1;
        int k = 0;

        while (i < n && j < n && k < n) {
            int a = i + k;
            int b = j + k;
            if (a >= n)
                a -= n;
            if (b >= n)
                b -= n;

            if (c[a] == c[b]) {
                k++;
                continue;
            }
            if (c[a] > c[b])
                i += k + 1;
            else
                j += k + 1;
            if (i == j)
                j++;
            k = 0;
        }

        int start = Math.min(i, j);
        char[] out = new char[n];
        System.arraycopy(c, start, out, 0, n - start);
        System.arraycopy(c, 0, out, n - start, start);
        return new String(out);
    }
}
