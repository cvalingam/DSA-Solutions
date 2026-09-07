// Approach: At each index, skip the element or place it on a strict inc/dec chain.
// State is the last index used in each chain. Bottom-up with two 2D layers because
// only the next index row is needed. Minimize skipped elements directly.
// Complexity: O(n^3) time and O(n^2) extra space.

class Solution {

    public int minCount(int[] arr) {
        int n = arr.length;
        int[][] next = new int[n + 1][n + 1];
        int[][] curr = new int[n + 1][n + 1];

        for (int idx = n - 1; idx >= 0; idx--) {
            for (int incLast = -1; incLast < n; incLast++) {
                for (int decLast = -1; decLast < n; decLast++) {
                    int ans = 1 + next[incLast + 1][decLast + 1];

                    if (incLast == -1 || arr[idx] > arr[incLast]) {
                        ans = Math.min(ans, next[idx + 1][decLast + 1]);
                    }
                    if (decLast == -1 || arr[idx] < arr[decLast]) {
                        ans = Math.min(ans, next[incLast + 1][idx + 1]);
                    }

                    curr[incLast + 1][decLast + 1] = ans;
                }
            }

            int[][] temp = next;
            next = curr;
            curr = temp;
        }

        return next[0][0];
    }
}
