// Approach: Keep how many even-sum and odd-sum subarrays end at the previous
// index. An odd value swaps those counts and starts one new odd subarray. An
// even value extends every previous even subarray and keeps the odd count.
// Only the running odd count is added to the answer, so the arrays collapse
// to two integers.
// Time: O(n) Space: O(1)

public class Solution
{
    public int NumOfSubarrays(int[] arr)
    {
        const int Mod = 1_000_000_007;
        int even = 0;
        int odd = 0;
        int ans = 0;

        foreach (int num in arr)
        {
            if ((num & 1) == 1)
            {
                int nextEven = odd;
                odd = even + 1;
                even = nextEven;
            }
            else
            {
                even++;
            }

            ans += odd;
            if (ans >= Mod)
                ans -= Mod;
        }

        return ans;
    }
}
