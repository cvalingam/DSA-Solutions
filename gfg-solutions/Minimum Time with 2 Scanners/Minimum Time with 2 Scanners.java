// Approach: Give i documents to the faster scanner and the rest to the
// slower one. The finish time is max(i * s1, (n - i) * s2), which falls
// then rises as i grows. The minimum sits where the two sides meet, so
// only the floor and ceil of n * s2 / (s1 + s2) need to be checked, along
// with putting every document on the faster scanner.
// Complexity: O(1) time, O(1) extra space.
class Solution {
    public int minTime(int n, int s1, int s2) {
        if (s1 > s2) {
            int tmp = s1;
            s1 = s2;
            s2 = tmp;
        }

        long best = (long) n * s1;
        int i = (int) (((long) n * s2) / ((long) s1 + s2));
        for (int k = i; k <= i + 1; k++) {
            if (k < 0 || k > n) {
                continue;
            }
            long cur = Math.max((long) k * s1, (long) (n - k) * s2);
            if (cur < best) {
                best = cur;
            }
        }
        return (int) best;
    }
}
