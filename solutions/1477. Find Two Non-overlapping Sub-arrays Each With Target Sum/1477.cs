// Approach: Positive elements => unique sliding window for each right end.
// best[i] = shortest target subarray ending at or before i. When window
// [l, r] hits target, pair it with best[l-1] if that exists, then refresh
// the running shortest length into best[r].
// Complexity: O(n) time, O(n) extra space. Optimal up to constants.
public class Solution
{
    public int MinSumOfLengths(int[] arr, int target)
    {
        int n = arr.Length;
        int ans = int.MaxValue;
        int sum = 0;
        int bestSoFar = int.MaxValue;
        int[] best = new int[n];

        for (int l = 0, r = 0; r < n; r++)
        {
            sum += arr[r];
            while (sum > target)
                sum -= arr[l++];

            if (sum == target)
            {
                int len = r - l + 1;
                if (l > 0 && best[l - 1] != int.MaxValue)
                    ans = Math.Min(ans, best[l - 1] + len);
                bestSoFar = Math.Min(bestSoFar, len);
            }

            best[r] = bestSoFar;
        }

        return ans == int.MaxValue ? -1 : ans;
    }
}
