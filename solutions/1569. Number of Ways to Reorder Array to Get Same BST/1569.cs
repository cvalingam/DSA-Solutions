// Approach: The BST shape is fixed by the relative order of values. After the
// root, the left and right subsequences may be interleaved in any order that
// keeps each side's relative order, which is C(left+right, left) ways, times
// the same count recursively on each side. Subtract 1 so the original order
// is not counted. Precompute binomial coefficients with Pascal's triangle.
// Time: O(n^2) Space: O(n^2)

public class Solution
{
    private const int MOD = 1_000_000_007;
    private int[][] comb;

    public int NumOfWays(int[] nums)
    {
        int n = nums.Length;
        comb = BuildComb(n);
        return (int)((Ways(nums) - 1 + MOD) % MOD);
    }

    private long Ways(int[] nums)
    {
        int n = nums.Length;
        if (n <= 2)
            return 1;

        int root = nums[0];
        int leftCount = 0;
        for (int i = 1; i < n; i++)
            if (nums[i] < root)
                leftCount++;

        int[] left = new int[leftCount];
        int[] right = new int[n - 1 - leftCount];
        int li = 0, ri = 0;
        for (int i = 1; i < n; i++)
        {
            if (nums[i] < root)
                left[li++] = nums[i];
            else
                right[ri++] = nums[i];
        }

        long ans = comb[n - 1][leftCount];
        ans = ans * Ways(left) % MOD;
        ans = ans * Ways(right) % MOD;
        return ans;
    }

    private static int[][] BuildComb(int n)
    {
        int[][] c = new int[n + 1][];
        for (int i = 0; i <= n; i++)
        {
            c[i] = new int[i + 1];
            c[i][0] = 1;
            c[i][i] = 1;
            for (int j = 1; j < i; j++)
                c[i][j] = (c[i - 1][j - 1] + c[i - 1][j]) % MOD;
        }
        return c;
    }
}
