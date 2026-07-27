// Approach: Sort both arrays; greedy two-pointer - match player to smallest capable trainer.
// Time: O(n log n) Space: O(1)

public class Solution
{
    public int MatchPlayersAndTrainers(int[] players, int[] trainers)
    {
        int ans = 0;

        Array.Sort(players);
        Array.Sort(trainers);

        for (int i = 0; i < trainers.Length; ++i)
        {
            if (players[ans] <= trainers[i] && ++ans == players.Length)
                return ans;
        }

        return ans;
    }
}