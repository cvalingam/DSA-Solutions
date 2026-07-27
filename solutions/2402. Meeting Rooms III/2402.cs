// Approach: Two priority queues - one for free rooms (min-heap by index) and one for
// occupied rooms (min-heap by end time, then room index). Sort meetings by start time.
// For each meeting, free up rooms whose meetings ended, assign to smallest free room or
// delay the meeting to the earliest available room.
// Time: O(m log n) Space: O(n)
public class Solution
{
    public int MostBooked(int n, int[][] meetings)
    {
        var freeRooms = new PriorityQueue<int, int>(Comparer<int>.Create((a, b) => a - b));
        int[] booked = new int[n];
        for (int i = 0; i < n; i++)
            freeRooms.Enqueue(i, i);

        var occupiedRooms = new PriorityQueue<int[], int[]>(new CustomComparer());

        Array.Sort(meetings, (a, b) => a[0] - b[0]);
        foreach (int[] meeting in meetings)
        {
            int start = meeting[0];
            int end = meeting[1];

            while (occupiedRooms.Count > 0 && occupiedRooms.Peek()[0] <= start)
            {
                int[] values = occupiedRooms.Dequeue();
                freeRooms.Enqueue(values[1], values[1]);
            }

            if (freeRooms.Count > 0)
            {
                int freeRoom = freeRooms.Dequeue();
                booked[freeRoom]++;
                int[] occRoom = new int[] { end, freeRoom };
                occupiedRooms.Enqueue(occRoom, occRoom);
            }
            else
            {
                int[] ocRoom = occupiedRooms.Dequeue();
                booked[ocRoom[1]]++;
                int[] oRoom = new int[] { ocRoom[0] + (end - start), ocRoom[1] };
                occupiedRooms.Enqueue(oRoom, oRoom);
            }
        }

        int maxRooms = 0, meetingRoom = -1;
        for (int i = 0; i < n; i++)
        {
            if (booked[i] > maxRooms)
            {
                maxRooms = booked[i];
                meetingRoom = i;
            }
        }

        return meetingRoom;
    }

    public class CustomComparer : IComparer<int[]>
    {
        public int Compare(int[] x, int[] y)
        {
            if (x[0] == y[0])
                return x[1] - y[1];
            return x[0] - y[0];
        }
    }
}