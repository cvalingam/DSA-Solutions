// Approach: Sliding window over consecutive positives 1,2,3,… - expand right, shrink left
// while sum > n; whenever the window sum equals n, count one way (length ≥ 2 automatically).
// Time: O(n) Space: O(1)

class Solution {

    public int getCount(int n) {
        int sum = 0, cnt = 0, x = 1;
        for (int r = 1; r <= n; r++) {
            if (sum == n) {
                cnt++;
            }
            sum += r;
            while (sum > n) {
                sum -= x;
                x += 1;
            }
        }
        return cnt;
    }
};
