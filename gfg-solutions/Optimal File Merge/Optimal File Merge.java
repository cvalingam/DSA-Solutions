// Approach: A merged file is paid for again every time it is merged later, so
// the cheapest sequence always joins the two smallest sizes first. A binary
// heap stores the sizes as plain longs and returns those two in logarithmic
// time. Their sum is both the cost of this step and the size pushed back.
// Complexity: O(n log n) time, O(n) extra space.
class Solution {
    public int minComputation(int[] files) {
        int n = files.length;
        if (n <= 1)
            return 0;

        long[] heap = new long[n];
        for (int i = 0; i < n; i++)
            heap[i] = files[i];
        for (int i = n / 2 - 1; i >= 0; i--)
            siftDown(heap, n, i);

        long cost = 0;
        int size = n;
        while (size > 1) {
            long a = poll(heap, size);
            size--;
            long b = poll(heap, size);
            size--;
            long sum = a + b;
            cost += sum;
            heap[size] = sum;
            siftUp(heap, size);
            size++;
        }
        return (int) cost;
    }

    private static long poll(long[] heap, int size) {
        long top = heap[0];
        int last = size - 1;
        if (last > 0) {
            heap[0] = heap[last];
            siftDown(heap, last, 0);
        }
        return top;
    }

    private static void siftUp(long[] heap, int i) {
        long value = heap[i];
        while (i > 0) {
            int parent = (i - 1) >> 1;
            if (heap[parent] <= value)
                break;
            heap[i] = heap[parent];
            i = parent;
        }
        heap[i] = value;
    }

    private static void siftDown(long[] heap, int size, int i) {
        long value = heap[i];
        while (true) {
            int left = i * 2 + 1;
            if (left >= size)
                break;
            int right = left + 1;
            int small = right < size && heap[right] < heap[left] ? right : left;
            if (value <= heap[small])
                break;
            heap[i] = heap[small];
            i = small;
        }
        heap[i] = value;
    }
}
