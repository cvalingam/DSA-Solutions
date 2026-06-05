
import java.util.*;

// Approach: Greedy stack-based deletion budget. Adjust k based on whether length is power of 2,
// then maintain a monotonic stack and remove larger previous characters when a smaller one arrives,
// ensuring lexicographically smallest result after exactly k removals.
// Time: O(n) Space: O(n)

class Solution {

    public String lexicographicallySmallest(String s, int k) {
        Stack<Character> st = new Stack<>();
        int n = s.length();
        if (ispower(n)) {
            k = k / 2;
        } else {
            k = k * 2;
        }
        int t = k;
        int cnt = 0;
        for (int i = 0; i < s.length(); i++) {
            if (st.isEmpty()) {
                st.push(s.charAt(i));
                k--;
            } else {
                if (k != 0 && (int) st.peek() <= (int) s.charAt(i)) {
                    st.push(s.charAt(i));
                    k--;
                } else {
                    while (!st.isEmpty()) {
                        if ((int) st.peek() > (int) s.charAt(i)) {
                            if (cnt != t) {
                                st.pop();
                                cnt++;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    st.push(s.charAt(i));
                }
            }
        }
        StringBuilder s1 = new StringBuilder();
        while (!st.isEmpty()) {
            if (cnt != t) {
                cnt++;
                st.pop();
            } else {
                s1.append(st.pop());
            }
        }
        String m = s1.reverse().toString();
        return m.equals("") ? "-1" : m;
    }

    public Boolean ispower(int n) {
        if (n <= 0) {
            return false;
        }

        while (n % 2 == 0) {
            n = n / 2;
        }

        return n == 1;
    }
}
