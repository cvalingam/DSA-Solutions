// Approach: Greedy - sort pairs by their end value; always pick the next
// pair whose start exceeds the last selected pair’s end.
// Time: O(n log n) Space: O(1)

public class Solution
{
    public int FindLongestChain(int[][] pairs)
    {
        int n = pairs.Length;
        Array.Sort(pairs, (a, b) => a[1] - b[1]);

        // for(int i = 0; i < n; i++)
        // {
        //     Console.WriteLine("Pair " + i + " : " + pairs[i][0] + " " + pairs[i][1]);
        // }

        int maxi = 1;
        int[] last = pairs[0];
        for (int i = 1; i < n; i++)
        {
            if (pairs[i][0] > last[1])
            {
                last = pairs[i];
                maxi++;
            }
        }

        return maxi;
    }
}