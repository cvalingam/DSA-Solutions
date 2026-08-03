// Approach: Bottom-up DP from the end. dp[i] is the best relative score
// (stones taken minus opponent's best from the remainder) starting at i, when
// the current player may take 1, 2, or 3 piles. Try each take size, add the
// prefix sum of taken piles, subtract dp[j+1], keep the max. Compare dp[0]
// to decide Alice / Bob / Tie.
// Complexity: O(n) time and O(n) space.
public class Solution
{
    public string StoneGameIII(int[] stoneValue)
    {
        int n = stoneValue.Length;
        // dp[i] := the maximum relative score Alice can make with stoneValue[i..n)
        int[] dp = new int[n + 1];
        Array.Fill(dp, int.MinValue / 2, 0, n);
        dp[n] = 0;

        for (int i = n - 1; i >= 0; --i)
        {
            int sum = 0;
            for (int j = i; j < i + 3 && j < n; ++j)
            {
                sum += stoneValue[j];
                dp[i] = Math.Max(dp[i], sum - dp[j + 1]);
            }
        }

        int score = dp[0];
        return score > 0 ? "Alice" : score < 0 ? "Bob" : "Tie";
    }
}
