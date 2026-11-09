// Approach: A busy min-heap stores (end time, server). A free min-heap stores
// server ids shifted so the next preferred id i % k comes out first, wrapping
// to smaller ids when needed. Each request frees every server whose end time
// is due, then takes the free heap top when one exists. Counts track how many
// requests each server handled, and every server that ties the maximum is kept.
// Time: O(n log k) Space: O(k)

public class Solution
{
    public IList<int> BusiestServers(int k, int[] arrival, int[] load)
    {
        int n = arrival.Length;
        int[] count = new int[k];
        var free = new PriorityQueue<int, int>();
        var busy = new PriorityQueue<(int end, int server), int>();

        for (int s = 0; s < k; s++)
            free.Enqueue(s, s);

        for (int i = 0; i < n; i++)
        {
            int start = arrival[i];
            while (busy.Count > 0 && busy.Peek().end <= start)
            {
                int server = busy.Dequeue().server;
                int offset = i + (server - i % k + k) % k;
                free.Enqueue(server, offset);
            }

            if (free.Count == 0)
                continue;

            int chosen = free.Dequeue();
            count[chosen]++;
            busy.Enqueue((start + load[i], chosen), start + load[i]);
        }

        int best = 0;
        for (int s = 0; s < k; s++)
            if (count[s] > best)
                best = count[s];

        var ans = new List<int>();
        for (int s = 0; s < k; s++)
            if (count[s] == best)
                ans.Add(s);
        return ans;
    }
}
