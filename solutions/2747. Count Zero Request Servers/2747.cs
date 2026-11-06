// Approach: A server is idle for a query when it has no log in the closed
// interval from the query time minus x through the query time. Sorting the
// logs by time and the queries by time lets two pointers slide that window.
// A count array tracks how many logs each server has inside the window.
// The answer is n minus the number of servers whose count is positive.
// Time: O(m log m + q log q) Space: O(n + q)

public class Solution {
    public int[] CountServers(int n, int[][] logs, int x, int[] queries) {
        int qLen = queries.Length;
        long[] order = new long[qLen];
        for (int i = 0; i < qLen; i++)
            order[i] = ((long)queries[i] << 32) | (uint)i;
        Array.Sort(order);
        Array.Sort(logs, (a, b) => a[1].CompareTo(b[1]));

        int[] ans = new int[qLen];
        int[] count = new int[n + 1];
        int left = 0, right = 0, active = 0;
        for (int i = 0; i < qLen; i++) {
            int end = (int)(order[i] >> 32);
            int index = (int)order[i];
            int start = end - x;

            while (right < logs.Length && logs[right][1] <= end) {
                if (++count[logs[right][0]] == 1)
                    active++;
                right++;
            }
            while (left < logs.Length && logs[left][1] < start) {
                if (--count[logs[left][0]] == 0)
                    active--;
                left++;
            }
            ans[index] = n - active;
        }
        return ans;
    }
}
