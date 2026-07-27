// Approach: Greedy single pass - plant a flower whenever the current cell
// and both neighbors are empty; modify the array in-place.
// Time: O(n) Space: O(1)

public class Solution
{
    public bool CanPlaceFlowers(int[] flowerbed, int n)
    {
        if (n == 0)
            return true;

        for (int i = 0; i < flowerbed.Length; i++)
        {
            if (flowerbed[i] == 0 && (i == 0 || flowerbed[i - 1] == 0)
            && (i == flowerbed.Length - 1 || flowerbed[i + 1] == 0))
            {
                flowerbed[i] = 1;
                if (--n == 0)
                    return true;
            }
        }

        return false;
    }
}