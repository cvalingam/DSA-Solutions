// Approach: Greedy interval extension - track 'maxReach', the maximum sum reachable
// using elements already considered (starts at 0, meaning we can form sums [1..maxReach]).
// Iterate through nums: if nums[i] <= maxReach + 1, extend maxReach by nums[i].
// If nums[i] > maxReach + 1, there is a gap - patch by adding (maxReach + 1), doubling maxReach + 1.
// Count each patch; stop when maxReach >= n.
// The key insight: after processing or patching, maxReach always represents the upper bound of [1..maxReach] coverage.
// Time: O(log n + len(nums)) Space: O(1).

public class Solution {
    public int MinPatches(int[] nums, int n) {
        long minPatch = 0, maxNum = 0;
        int i = 0, sz = nums.Length;

        while(maxNum < n)
        {
            if(i < sz && maxNum + 1 >= nums[i])
            {
                maxNum += nums[i];
                i++;
            }
            else
            {
                minPatch++;
                maxNum += (maxNum + 1);
            }
        }

        return (int)minPatch;
    }
}