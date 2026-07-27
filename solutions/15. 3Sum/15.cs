// Approach: Sort the array so duplicates are adjacent and the two-pointer technique is valid.
// For each element nums[i], set left = i+1 and right = n-1 and look for pairs summing to -nums[i].
// If nums[left] + nums[right] == -nums[i], record the triplet and skip all duplicate values on both ends.
// If the sum is too small, advance left; if too large, retreat right.
// Skip duplicate values of nums[i] at the outer loop to avoid repeating triplets in the output.
// Sorting is the key enabler - without it we would need O(n^2) hash-set work with deduplication logic.
// Time: O(n^2) Space: O(n) for result storage

public class Solution
{
    public IList<IList<int>> ThreeSum(int[] nums)
    {
        int n = nums.Length;
        Array.Sort(nums);
        IList<IList<int>> result = new List<IList<int>>();
        for (int i = 0; i < n; i++)
        {
            if (i > 0 && nums[i] == nums[i - 1])
                continue;

            int j = i + 1;
            int k = n - 1;

            while (j < k)
            {
                long sum = nums[j] + nums[k];
                sum += nums[i];
                if (sum < 0)
                    j++;
                else if (sum > 0)
                    k--;
                else
                {
                    IList<int> temp = new List<int>()
                    {
                        nums[i],
                        nums[j],
                        nums[k]
                    };
                    result.Add(temp);
                    j++;
                    k--;

                    while (j < k && nums[j] == nums[j - 1]) 
                        j++;
                    while (j < k && nums[k] == nums[k + 1]) 
                        k--;
                }
            }
        }
        return result;
    }
}