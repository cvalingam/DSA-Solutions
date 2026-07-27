// Approach: Max-heap of seat counts - each sale takes the row with the most vacant seats
// (price = vacancies), then push vacancies−1 back. Repeat k times; sum mod 1e9+7.
// Time: O((n + k) log n) Space: O(n)

import java.util.*;

class Solution {

    public int maxAmount(int[] arr, int k) {
        PriorityQueue<Integer> q = new PriorityQueue<>(Collections.reverseOrder());

        for (int i : arr) {
            q.add(i);
        }
        int mod = 1000000007;
        long ans = 0;
        while (!q.isEmpty() && k != 0) {
            int temp = q.poll();
            ans = (ans + temp) % mod;

            if (temp - 1 > 0) {
                q.add(temp - 1);
            }
            k--;

        }

        return (int) ans;
    }
}
