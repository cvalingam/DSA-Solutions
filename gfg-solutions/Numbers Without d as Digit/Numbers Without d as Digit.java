// Approach: Digit DP over the decimal representation of n. At each position
// track (pos, tight, started): whether we still match the prefix of n, and
// whether we have placed a non-leading zero. Skip choosing digit d once the
// number has started; leading zeros are allowed and do not count as using d
// until the number actually starts. Memoize states.
// Complexity: O(log n) time and O(log n) space (digit length is O(log n)).

class Solution {

    private Integer[][][] memo;

    public int countWithout(int n, int d) {
        if (n == 0) {
            return 0;
        }

        String digits = String.valueOf(n);
        int len = digits.length();
        memo = new Integer[len][2][2];

        return countDigitFree(0, true, false, digits, d);
    }

    private int countDigitFree(int pos, boolean tight, boolean started, String digits, int d) {
        if (pos == digits.length()) {
            return started ? 1 : 0;
        }

        int tightIdx = tight ? 1 : 0;
        int startedIdx = started ? 1 : 0;

        if (memo[pos][tightIdx][startedIdx] != null) {
            return memo[pos][tightIdx][startedIdx];
        }

        int limit = tight ? (digits.charAt(pos) - '0') : 9;
        int count = 0;

        for (int digit = 0; digit <= limit; digit++) {
            boolean newTight = tight && (digit == limit);

            if (!started && digit == 0) {
                count += countDigitFree(pos + 1, newTight, false, digits, d);
            } else if (digit != d) {
                count += countDigitFree(pos + 1, newTight, true, digits, d);
            }
        }

        return memo[pos][tightIdx][startedIdx] = count;
    }
}
