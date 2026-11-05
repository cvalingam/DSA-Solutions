// Approach: The string is valid when no two neighboring letters are equal.
// Count those equal pairs once. Each day replaces one index with '?', which
// can break at most the pair on its left and the pair on its right. When the
// live count reaches zero, that day is the answer.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int getMinimumDays(String s, int[] p) {
        int n = s.length();
        char[] chars = s.toCharArray();
        int equalPairs = 0;
        for (int i = 0; i < n - 1; i++) {
            if (chars[i] == chars[i + 1])
                equalPairs++;
        }
        if (equalPairs == 0)
            return 0;

        for (int day = 0; day < n; day++) {
            int index = p[day];
            if (index > 0 && chars[index - 1] == chars[index])
                equalPairs--;
            if (index + 1 < n && chars[index] == chars[index + 1])
                equalPairs--;
            chars[index] = '?';
            if (equalPairs == 0)
                return day + 1;
        }
        return n;
    }
}
