// Approach: The target order is increasing by digit sum, then by value. With
// distinct values that order is a permutation of the current indices, and the
// fewest swaps equal n minus the number of cycles. Digit sums are at most 81,
// so sort indices by value with an LSD radix pass, then stably counting-sort
// by digit sum, build the index-to-target map, and walk the cycles.
// Time: O(n) Space: O(n)

public class Solution
{
    public int MinSwaps(int[] nums)
    {
        int n = nums.Length;
        int[] sums = new int[n];
        int[] idx = new int[n];
        for (int i = 0; i < n; i++)
        {
            sums[i] = DigitSum(nums[i]);
            idx[i] = i;
        }

        RadixSortByValue(idx, nums);
        CountingSortBySum(idx, sums);

        int[] target = new int[n];
        for (int j = 0; j < n; j++)
            target[idx[j]] = j;

        bool[] seen = new bool[n];
        int cycles = 0;
        for (int i = 0; i < n; i++)
        {
            if (seen[i])
                continue;
            cycles++;
            for (int j = i; !seen[j]; j = target[j])
                seen[j] = true;
        }
        return n - cycles;
    }

    private static void RadixSortByValue(int[] idx, int[] nums)
    {
        int n = idx.Length;
        int[] a = idx;
        int[] b = new int[n];
        int[] count = new int[256];
        for (int shift = 0; shift < 32; shift += 8)
        {
            Array.Clear(count, 0, 256);
            for (int i = 0; i < n; i++)
                count[(nums[a[i]] >> shift) & 0xFF]++;
            for (int i = 1; i < 256; i++)
                count[i] += count[i - 1];
            for (int i = n - 1; i >= 0; i--)
                b[--count[(nums[a[i]] >> shift) & 0xFF]] = a[i];
            (a, b) = (b, a);
        }
        if (!ReferenceEquals(a, idx))
            Array.Copy(a, idx, n);
    }

    private static void CountingSortBySum(int[] idx, int[] sums)
    {
        int n = idx.Length;
        int[] count = new int[82];
        for (int i = 0; i < n; i++)
            count[sums[idx[i]]]++;
        for (int i = 1; i < 82; i++)
            count[i] += count[i - 1];
        int[] output = new int[n];
        for (int i = n - 1; i >= 0; i--)
            output[--count[sums[idx[i]]]] = idx[i];
        Array.Copy(output, idx, n);
    }

    private static int DigitSum(int num)
    {
        int sum = 0;
        for (; num > 0; num /= 10)
            sum += num % 10;
        return sum;
    }
}
