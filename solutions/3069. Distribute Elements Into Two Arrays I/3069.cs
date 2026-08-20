// Approach: Simulate the rules. Keep arr1 ending at last1 and arr2 at last2;
// from index 2 onward, append nums[i] to the array whose tail is larger (else
// arr2). Write both halves into one result array.
// Complexity: O(n) time and O(n) space.
public class Solution
{
    public int[] ResultArray(int[] nums)
    {
        int n = nums.Length;
        int[] arr1 = new int[n];
        int[] arr2 = new int[n];
        arr1[0] = nums[0];
        arr2[0] = nums[1];
        int i = 0, j = 0;
        int last1 = nums[0], last2 = nums[1];

        for (int k = 2; k < n; k++)
        {
            if (last1 > last2)
                last1 = arr1[++i] = nums[k];
            else
                last2 = arr2[++j] = nums[k];
        }

        int[] ans = new int[n];
        Array.Copy(arr1, 0, ans, 0, i + 1);
        Array.Copy(arr2, 0, ans, i + 1, j + 1);
        return ans;
    }
}
