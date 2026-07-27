// Approach: Sliding window - try all windows anchored left or right of startPos within reach k.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MaxTotalFruits(int[][] fruits, int startPos, int k)
    {
        int maxFruits = 0; // Stores the maximum number of fruits we can collect
        int currentSum = 0; // Stores the current sum of fruits between two points

        // Two pointers approach: i is for the start point and j is for the end point
        for (int i = 0, j = 0; j < fruits.Length; ++j)
        {
            int positionJ = fruits[j][0]; // The position of the j-th tree
            int fruitsAtJ = fruits[j][1]; // The number of fruits at the j-th tree
            currentSum += fruitsAtJ; // Add fruits at the j-th tree to the current sum

            // Adjust the starting point i to not exceed the maximum distance k
            while (i <= j &&
                   positionJ - fruits[i][0] +
                   Math.Min(Math.Abs(startPos - fruits[i][0]), Math.Abs(startPos - positionJ))
                   > k)
            {
                // Subtract the number of fruits at the i-th tree as we move the start point forward
                currentSum -= fruits[i][1];
                i++; // Increment the start point
            }

            // Update maxFruits with the maximum of current sum and previously calculated maxFruits
            maxFruits = Math.Max(maxFruits, currentSum);
        }
        return maxFruits; // Return the maximum number of fruits that can be collected
    }
}