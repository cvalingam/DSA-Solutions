// Approach: Simulate each query directly - for each [l, r, k, v] multiply every element
// at indices l, l+k, l+2k, ... ≤ r by v (mod 1e9+7). After all queries, XOR the entire
// array to produce the answer.
// Time: O(Q * n/k) Space: O(1)
public class Solution
{
    public int XorAfterQueries(int[] nums, int[][] queries)
    {
        const int mod = (int)1e9 + 7;
        foreach (var q in queries)
        {
            int l = q[0], r = q[1], k = q[2], v = q[3];
            for (int idx = l; idx <= r; idx += k)
                nums[idx] = (int)((long)nums[idx] * v % mod);
        }

        int ans = 0;
        foreach (int x in nums)
            ans ^= x;

        return ans;
    }
}