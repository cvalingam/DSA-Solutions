// Approach: An integer is almost missing if it appears in exactly one k-window.
// k == n: the whole array is that window, so answer is max(nums).
// k == 1: each element is its own window, so answer is the largest unique value.
// Else only nums[0] / nums[n-1] can sit in a unique window; take the larger
// one that appears once in the whole array (else -1).
// Complexity: O(n) time and O(1) space.
public class Solution
{
    public int LargestInteger(int[] nums, int k)
    {
        int n = nums.Length;

        if (k == n)
        {
            int max = nums[0];
            for (int i = 1; i < n; i++)
            {
                if (nums[i] > max)
                    max = nums[i];
            }
            return max;
        }

        if (k == 1)
        {
            int[] count = new int[51];
            foreach (int x in nums)
                count[x]++;

            for (int v = 50; v >= 0; v--)
            {
                if (count[v] == 1)
                    return v;
            }
            return -1;
        }

        int first = nums[0], last = nums[n - 1];
        bool firstUnique = true, lastUnique = true;
        for (int i = 0; i < n; i++)
        {
            if (i != 0 && nums[i] == first)
                firstUnique = false;
            if (i != n - 1 && nums[i] == last)
                lastUnique = false;
        }

        int ans = -1;
        if (firstUnique)
            ans = first;
        if (lastUnique && last > ans)
            ans = last;
        return ans;
    }
}
