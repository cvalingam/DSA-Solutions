public class Solution
{
    // Approach: nums is a permutation of 1..n. Count distinct values of
    // nums[i] XOR nums[j] XOR nums[k] for i ≤ j ≤ k. For n ≤ 2 the answer is n;
    // for n ≥ 3 every value in [0, 2^⌈log2(n+1)⌉ − 1] is achievable, so return
    // the next power of two: 1 << (floor(log2(n)) + 1).
    // Complexity: O(1) time and O(1) space (log is O(1) on 32-bit ints).
    public int UniqueXorTriplets(int[] nums)
    {
        int n = nums.Length;
        if (n == 1)
        {
            return 1;
        }
        if (n == 2)
        {
            return 2;
        }
        int b = (int)Math.Floor(Math.Log(n, 2)) + 1;
        return 1 << b;
    }
}