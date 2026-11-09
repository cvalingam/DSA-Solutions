// Approach: A group is a maximal run of the same letter. Walk the string once
// and raise a 26-slot counter at the start of every run. Then count how many
// letters have a run total of exactly k. Every character must be read, so the
// linear scan is already tight.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    int getCount(String s, int k) {
        int[] cnt = new int[26];
        int n = s.length();

        for (int i = 0; i < n; ) {
            char c = s.charAt(i);
            cnt[c - 'a']++;
            while (i < n && s.charAt(i) == c) {
                i++;
            }
        }

        int ans = 0;
        for (int c : cnt) {
            if (c == k) {
                ans++;
            }
        }
        return ans;
    }
}
