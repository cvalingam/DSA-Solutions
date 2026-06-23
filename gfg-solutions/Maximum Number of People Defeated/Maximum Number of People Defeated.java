
// Approach: Maximum k such that 1² + 2² + … + k² ≤ p. Use sum-of-squares formula n(n+1)(2n+1)/6.
// Increment n until n(n+1)(2n+1) > 6*p, then return n - 1.
// Time: O(∛p) Space: O(1)
class Solution {

    public int maxPeopleDefeated(int p) {
        int n = 1;
        for (n = 1;; n++) {
            if ((n) * (n + 1) * (2 * n + 1) > 6 * p) {
                break;
            }
        }
        return n - 1;
    }
};
