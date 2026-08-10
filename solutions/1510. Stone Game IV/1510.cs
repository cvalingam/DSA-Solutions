// Approach: Bottom-up win/lose DP. dp[i] = true iff the player to move with i
// stones can force a win. Try removing every square j*j <= i; if any leave the
 // opponent in a losing state (!dp[i - j*j]), then dp[i] is winning.
// Complexity: O(n * sqrt(n)) time and O(n) space.
public class Solution
{
    public bool WinnerSquareGame(int n)
    {
        // dp[i] := the winning result for n = i
        bool[] dp = new bool[n + 1];

        for (int i = 1; i <= n; ++i)
        {
            for (int j = 1; j * j <= i; ++j)
            {
                if (!dp[i - j * j])
                { // Removing j^2 stones make the opponent lose.
                    dp[i] = true;       // So, we win.
                    break;
                }
            }
        }
        return dp[n];
    }
}
