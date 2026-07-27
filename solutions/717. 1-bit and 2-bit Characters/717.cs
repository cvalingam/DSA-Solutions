// Approach: Walk through the array - skip 2 positions if bit is 1, skip 1 if
// bit is 0; return true only if the walk ends exactly at the last index.
// Time: O(n) Space: O(1)

public class Solution
{
    public bool IsOneBitCharacter(int[] bits)
    {
        int currentIndex = 0;
        int arrayLength = bits.Length;

        // Traverse through the array, skipping characters based on their bit length
        // Stop before the last element to check if it's a standalone one-bit character
        while (currentIndex < arrayLength - 1)
            // If current bit is 1, it forms a two-bit character (10 or 11), skip 2 positions
            // If current bit is 0, it's a one-bit character, skip 1 position
            // bits[currentIndex] + 1 gives us: 1 + 1 = 2 for two-bit, 0 + 1 = 1 for one-bit
            currentIndex += bits[currentIndex] + 1;

        // If we land exactly at the last position (arrayLength - 1),
        // it means the last bit is a standalone one-bit character
        return currentIndex == arrayLength - 1;
    }
}