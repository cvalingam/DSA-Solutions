// Approach: The beauty of a substring is its highest letter count minus its
// lowest positive letter count. Extending the substring by one letter changes
// only that letter's count. A count-of-counts array updates the maximum in
// one step. The minimum stays put unless the added letter was a new letter
// or the last letter sitting at the old minimum, in which case the minimum
// becomes 1 or rises by 1.
// Complexity: O(n^2) time, O(n) extra space.
class Solution {
    public int beautySum(String s) {
        int n = s.length();
        int[] freq = new int[26];
        int[] countAt = new int[n + 1];
        int ans = 0;
        for (int i = 0; i < n; i++) {
            java.util.Arrays.fill(freq, 0);
            java.util.Arrays.fill(countAt, 0);
            int max = 0;
            int min = 0;
            for (int j = i; j < n; j++) {
                int old = freq[s.charAt(j) - 'a']++;
                if (old > 0)
                    countAt[old]--;
                countAt[old + 1]++;
                if (old + 1 > max)
                    max = old + 1;
                if (old == 0)
                    min = 1;
                else if (old == min && countAt[old] == 0)
                    min++;
                ans += max - min;
            }
        }
        return ans;
    }
}
