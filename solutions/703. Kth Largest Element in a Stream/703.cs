// Approach: Min-heap of size k - the top is always the k-th largest;
// add each new element and evict the minimum if size exceeds k.
// Time: O(n log k) build, O(log k) add Space: O(k)

public class KthLargest
{
    private int k;
    private PriorityQueue<int, int> pq = new PriorityQueue<int, int>();
    public KthLargest(int k, int[] nums)
    {
        this.k = k;
        foreach (int num in nums)
            Heapify(num);
    }

    private void Heapify(int num)
    {
        pq.Enqueue(num, num);
        if (pq.Count > k)
            pq.Dequeue();
    }

    public int Add(int val)
    {
        Heapify(val);
        return pq.Peek();
    }
}
