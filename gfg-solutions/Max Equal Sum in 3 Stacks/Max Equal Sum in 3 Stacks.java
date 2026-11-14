// Approach: Sum each stack, then repeatedly remove the top of the stack
// whose remaining sum is largest. The three sums only meet when they are
// equal, and emptying any stack means no common positive total remains.
// Complexity: O(n1 + n2 + n3) time, O(1) extra space.
import java.util.ArrayList;

class Solution {
    public int maxEqualSum(ArrayList<Integer> s1, ArrayList<Integer> s2,
                           ArrayList<Integer> s3) {
        long sum1 = 0, sum2 = 0, sum3 = 0;
        for (int x : s1) {
            sum1 += x;
        }
        for (int x : s2) {
            sum2 += x;
        }
        for (int x : s3) {
            sum3 += x;
        }

        int i = 0, j = 0, k = 0;
        int n1 = s1.size(), n2 = s2.size(), n3 = s3.size();

        while (i < n1 && j < n2 && k < n3) {
            if (sum1 == sum2 && sum2 == sum3) {
                return (int) sum1;
            }
            if (sum1 >= sum2 && sum1 >= sum3) {
                sum1 -= s1.get(i++);
            } else if (sum2 >= sum3) {
                sum2 -= s2.get(j++);
            } else {
                sum3 -= s3.get(k++);
            }
        }
        return 0;
    }
}
