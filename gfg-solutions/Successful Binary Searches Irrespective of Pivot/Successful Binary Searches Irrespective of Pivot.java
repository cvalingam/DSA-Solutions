// Approach: Binary search finds arr[i] no matter how the mid is chosen exactly
// when every left value is smaller and every right value is larger. Then a mid
// on the left always goes right, and a mid on the right always goes left. That
// means arr[i] is a left-to-right maximum and is strictly below the suffix
// minimum on its right. One backward pass builds those suffix minima; one
// forward pass counts the positions that pass both tests.
// Complexity: O(n) time, O(n) extra space.
class Solution {
    public int countAlwaysFound(int[] arr) {
        int n = arr.length;
        if (n == 0)
            return 0;

        int[] suf = new int[n];
        suf[n - 1] = arr[n - 1];
        for (int i = n - 2; i >= 0; i--)
            suf[i] = arr[i] < suf[i + 1] ? arr[i] : suf[i + 1];

        int mx = Integer.MIN_VALUE;
        int cnt = 0;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > mx) {
                if (arr[i] < suf[i + 1])
                    cnt++;
                mx = arr[i];
            }
        }
        if (arr[n - 1] > mx)
            cnt++;
        return cnt;
    }
}
