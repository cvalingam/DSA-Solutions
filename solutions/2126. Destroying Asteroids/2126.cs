// Approach: Greedy with sorting. Sort asteroids by size, then absorb them left-to-right as long as mass allows.
// Each absorbed asteroid adds its mass, increasing capacity for larger ones. If any asteroid is too large, return false.
// Time: O(n log n) Space: O(log n) for sorting

public class Solution
{
    public bool AsteroidsDestroyed(int mass, int[] asteroids)
    {
        Array.Sort(asteroids);

        long m = mass;

        foreach (int asteroid in asteroids)
        {
            if (m >= asteroid)
                m += asteroid;
            else
                return false;
        }

        return true;
    }
}