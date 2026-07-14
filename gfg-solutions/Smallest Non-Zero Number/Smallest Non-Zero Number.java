// Approach: Work backwards from a required final value of 0. For the forward update
// x := 2*x - arr[i] to stay non-negative, the minimum previous x is ceil((next + arr[i]) / 2).
// Scan right-to-left with x = (x + arr[i] + 1) / 2 to get the smallest valid starting value.
// Time: O(n) Space: O(1)

class Solution {

    public int find(int[] arr) {
        long x = 0;
        for (int i = arr.length - 1; i >= 0; i--) {
            x = (x + arr[i] + 1) / 2;
        }

        return (int) x;
    }
}
