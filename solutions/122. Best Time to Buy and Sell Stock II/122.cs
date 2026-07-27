// Approach: Greedy - sum every positive consecutive price difference.
// If prices[i] > prices[i-1], capturing that gain is equivalent to buying on day i-1
// and selling on day i. We are allowed multiple transactions, so all upward moves can be taken.
// This greedy choice is provably optimal: any multi-day hold equals the sum of its daily gains.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MaxProfit(int[] prices)
    {
        int n = prices.Length;
        // int[][] dp = new int[n][];
        // for(int i = 0; i < n; i++)
        // {
        //     int[] arr = new int[2];
        //     Array.Fill(arr, -1);
        //     dp[i] = arr;
        // }

        // return topDown(0, 1, prices, dp);
        return tabulation(n, prices);
    }

    private int topDown(int ind, int canBuy, int[] prices, int[][] dp)
    {
        if (ind == prices.Length)
            return 0;

        if (dp[ind][canBuy] != -1)
            return dp[ind][canBuy];

        int profit = 0;
        if (canBuy == 1)
        {
            int bought = -prices[ind] + topDown(ind + 1, 0, prices, dp);
            int notBought = topDown(ind + 1, 1, prices, dp);
            profit = Math.Max(bought, notBought);
        }
        else
        {
            int sold = prices[ind] + topDown(ind + 1, 1, prices, dp);
            int notSold = topDown(ind + 1, 0, prices, dp);
            profit = Math.Max(sold, notSold);
        }

        return dp[ind][canBuy] = profit;
    }

    private int tabulation(int n, int[] prices)
    {
        int[] front = new int[2];
        int[] curr = new int[2];

        front[0] = front[1] = 0;

        for (int ind = n - 1; ind >= 0; ind--)
        {
            for (int canBuy = 0; canBuy < 2; canBuy++)
            {
                int profit = 0;
                if (canBuy == 1)
                {
                    int bought = -prices[ind] + front[0];
                    int notBought = front[1];
                    profit = Math.Max(bought, notBought);
                }
                else
                {
                    int sold = prices[ind] + front[1];
                    int notSold = front[0];
                    profit = Math.Max(sold, notSold);
                }

                curr[canBuy] = profit;
            }
            front = curr;
        }

        return front[1];
    }
}