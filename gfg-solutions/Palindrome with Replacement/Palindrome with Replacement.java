// Approach: A palindrome forces each pair s[i] and s[n-1-i] to share one
// letter. Two different letters in a pair make it impossible. A '?' copies
// the letter opposite it, and a pair of '?' can be filled later for free.
// The cheapest filling between two fixed letters changes by 1 at a time, so
// its cost is just the absolute gap between those letters. One left-to-right
// pass resolves each character from its pair and adds those gaps.
// Complexity: O(n) time, O(1) extra space.
class Solution {
    public int minimumSum(String s) {
        int n = s.length();
        int sum = 0;
        char prev = '?';
        for (int i = 0; i < n; i++) {
            int j = n - 1 - i;
            char here = s.charAt(i);
            char mirror = s.charAt(j);
            if (i < j && here != '?' && mirror != '?' && here != mirror)
                return -1;
            char c = here != '?' ? here : mirror;
            if (c == '?')
                continue;
            if (prev != '?')
                sum += Math.abs(c - prev);
            prev = c;
        }
        return sum;
    }
}
