// Approach: Each task goes to the free server with the smallest weight, and
// the smaller index breaks a tie. A free heap stores those servers. A busy
// heap stores the rest by the time they next become free. If every server
// is busy, the task starts when the earliest busy server finishes, and that
// finish time is kept in a 64 bit integer so a long chain of tasks does not
// wrap. Servers are stored as indices.
// Time: O((n + m) log n) Space: O(n)

public class Solution
{
    public int[] AssignTasks(int[] servers, int[] tasks)
    {
        int n = servers.Length;
        int m = tasks.Length;
        int[] ans = new int[m];
        long[] freeAt = new long[n];
        var free = new PriorityQueue<int, (int weight, int index)>();
        var busy = new PriorityQueue<int, (long freeAt, int weight, int index)>();

        for (int i = 0; i < n; i++)
            free.Enqueue(i, (servers[i], i));

        for (int i = 0; i < m; i++)
        {
            while (busy.Count > 0 && freeAt[busy.Peek()] <= i)
            {
                int server = busy.Dequeue();
                free.Enqueue(server, (servers[server], server));
            }

            int chosen;
            long start;
            if (free.Count > 0)
            {
                chosen = free.Dequeue();
                start = i;
            }
            else
            {
                chosen = busy.Dequeue();
                start = freeAt[chosen];
            }

            ans[i] = chosen;
            freeAt[chosen] = start + tasks[i];
            busy.Enqueue(chosen, (freeAt[chosen], servers[chosen], chosen));
        }

        return ans;
    }
}
