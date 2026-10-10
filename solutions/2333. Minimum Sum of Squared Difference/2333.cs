// Approach: Only |nums1[i] - nums2[i]| matters, and k1 and k2 are
// interchangeable, so there is one budget k. Each unit should lower the
// largest difference. Count differences in buckets, then sweep levels from
// the top: all differences at or above a level act as one group of size c,
// and lowering the group by one level costs c. Stop at the first level where
// k < c. At that level k of the group drop one more level and the rest stay.
// Smaller buckets keep their values.
// Time: O(n + maxDiff) Space: O(maxDiff)

public class Solution
{
    public long MinSumSquareDiff(int[] nums1, int[] nums2, int k1, int k2)
    {
        int n = nums1.Length;
        int maxDiff = 0;
        long total = 0;
        for (int i = 0; i < n; i++)
        {
            int d = Math.Abs(nums1[i] - nums2[i]);
            total += d;
            if (d > maxDiff)
                maxDiff = d;
        }

        long k = (long)k1 + k2;
        if (total <= k)
            return 0;

        int[] count = new int[maxDiff + 1];
        for (int i = 0; i < n; i++)
            count[Math.Abs(nums1[i] - nums2[i])]++;

        long group = 0;
        int level = maxDiff;
        for (; level > 0; level--)
        {
            group += count[level];
            if (k < group)
                break;
            k -= group;
        }

        long lower = level - 1;
        long ans = (group - k) * level * level + k * lower * lower;
        for (int v = level - 1; v > 0; v--)
            ans += (long)count[v] * v * v;
        return ans;
    }
}
