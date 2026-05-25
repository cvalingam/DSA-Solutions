// Approach: Dynamic programming with prefix sums over reachable indices.
// For each position i with s[i]=='0', check if any reachable index exists in [i-maxJump, i-minJump].
// Prefix sums answer this range-existence query in O(1), giving linear total time.
// Time: O(n) Space: O(n)

public class Solution
{
    public bool CanReach(string s, int minJump, int maxJump)
    {
        int n = s.Length;

        // Prefix sum array to track count of reachable positions
        // prefixSum[i] stores the count of reachable positions from index 0 to i-1
        int[] prefixSum = new int[n + 1];
        prefixSum[1] = 1; // Position 0 is reachable (starting position)

        // Dynamic programming array to track if position i is reachable
        bool[] isReachable = new bool[n];
        isReachable[0] = true; // Starting position is always reachable

        // Iterate through each position in the string
        for (int i = 1; i < n; i++)
        {
            // Can only jump to positions with '0'
            if (s[i] == '0')
            {
                // Calculate the valid range of positions we can jump from
                // We can jump from position j to i if: i - maxJump <= j <= i - minJump
                int leftBound = Math.Max(0, i - maxJump);
                int rightBound = i - minJump;

                // Check if there exists at least one reachable position in the range [leftBound, rightBound]
                // Using prefix sum to efficiently check if any position in range is reachable
                isReachable[i] = leftBound <= rightBound &&
                                 prefixSum[rightBound + 1] - prefixSum[leftBound] > 0;
            }

            // Update prefix sum array
            // Add 1 if current position is reachable, otherwise add 0
            prefixSum[i + 1] = prefixSum[i] + (isReachable[i] ? 1 : 0);
        }

        // Return whether the last position is reachable
        return isReachable[n - 1];
    }
}