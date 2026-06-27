// Approach: Valid subset is a chain x, x², x⁴, … using multiset counts. For x > 1, take pairs
// (count ≥ 2) at each power until the chain breaks, then add one more if the next power exists.
// For x = 1, use all copies if count is odd, else count − 1. Track frequencies in a hash map.
// Time: O(n log max) Space: O(n)
public class Solution
{
    public int MaximumLength(int[] nums)
    {
        int maxNum = nums.Max();
        Dictionary<int, int> count = new Dictionary<int, int>();

        foreach (int num in nums)
            count[num] = count.GetValueOrDefault(num, 0) + 1;

        int ans = count.ContainsKey(1) ? count[1] - (count[1] % 2 == 0 ? 1 : 0) : 1;

        foreach (int num in nums)
        {
            if (num == 1)
                continue;
            int length = 0;
            long x = num;
            while (x <= maxNum && count.ContainsKey((int)x) && count[(int)x] >= 2)
            {
                length += 2;
                x *= x;
            }
            ans = Math.Max(ans, length + (count.ContainsKey((int)x) ? 1 : -1));
        }

        return ans;
    }
}