// Approach: Count of sums in [l, r] = (sums <= r) - (sums <= l-1). For a bound
// x, slide a window over non-negative arr: grow right, shrink left while the
// window sum exceeds x; every ending index then contributes (right-left+1)
// subarrays with sum <= x.
// Time: O(n) Space: O(1)
class Solution {

    public int countSubarray(int[] arr, int l, int r) {
        return solve(arr, r) - solve(arr, l - 1);
    }

    public static int solve(int[] arr, int x) {
        if (x < 0) {
            return 0;
        }

        int cnt = 0;
        int s = 0;
        int i = 0;
        int n = arr.length;

        for (int j = 0; j < n; j++) {
            s += arr[j];

            while (s > x && i <= j) {
                s -= arr[i];
                i++;
            }
            cnt += (j - i + 1);
        }

        return cnt;
    }
}
