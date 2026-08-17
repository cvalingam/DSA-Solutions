// Approach: Only stone % 3 matters. Type 0 does not change the running XOR-sum
// mod 3; types 1 and 2 flip between residues. With optimal play, Alice wins
// iff (even count of 0s and both 1 and 2 exist) or (odd count of 0s and
// |count[1] - count[2]| > 2).
// Complexity: O(n) time and O(1) space.
public class Solution
{
    public bool StoneGameIX(int[] stones)
    {
        int[] count = new int[3];

        foreach (var stone in stones)
            ++count[stone % 3];

        if (count[0] % 2 == 0)
            return Math.Min(count[1], count[2]) > 0;
        return Math.Abs(count[1] - count[2]) > 2;
    }
}
