// Approach: DP with a monotonic decreasing stack to propagate best jump counts between valid indices.
// Process heights from left to right (plus a sentinel). When a higher bar appears, pop lower/equal groups,
// and relax transitions within distance d from the left and right boundaries.
// Time: O(n) Space: O(n)

public class Solution
{
    public int MaxJumps(int[] arr, int d)
    {
        int n = arr.Length;
        // dp[i] := the maximum jumps starting from arr[i]
        int[] dp = new int[n];
        // a decreasing stack that stores indices
        Stack<int> stack = new Stack<int>();

        for (int i = 0; i <= n; ++i)
        {
            while (stack.Count > 0 && (i == n || arr[stack.Peek()] < (i < n ? arr[i] : int.MaxValue)))
            {
                List<int> indices = new List<int> { stack.Pop() };
                while (stack.Count > 0 && arr[stack.Peek()] == arr[indices[0]])
                    indices.Add(stack.Pop());
                foreach (int j in indices)
                {
                    if (i < n && i - j <= d)
                        // Can jump from i to j.
                        dp[i] = Math.Max(dp[i], dp[j] + 1);
                    if (stack.Count > 0 && j - stack.Peek() <= d)
                        // Can jump from stack.Peek() to j
                        dp[stack.Peek()] = Math.Max(dp[stack.Peek()], dp[j] + 1);
                }
            }
            stack.Push(i);
        }

        return dp.Max() + 1;
    }
}