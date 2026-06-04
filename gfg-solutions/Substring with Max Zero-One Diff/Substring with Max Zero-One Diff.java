
// Approach: Convert '0' to +1 and '1' to -1, then find maximum subarray sum using Kadane's algorithm.
// The maximum sum corresponds to the substring maximizing (#zeros - #ones). If no '0' exists, answer is -1.
// Time: O(n) Space: O(1)

class Solution {

    int maxSubstring(String s) {
        int n = s.length();
        int mx = -1, cs = 0;
        boolean t = false;
        int v = 0;
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == '0') {
                v = 1;
                t = true;
            } else {
                v = -1;
            }
            cs += v;
            if (cs > mx) {
                mx = cs;
            }
            if (cs < 0) {
                cs = 0;
            }
        }
        if (t == false) {
            return -1;
        }
        
        return mx;
    }
}
