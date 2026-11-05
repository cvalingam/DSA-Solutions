// Approach: An element of arr1 counts when nothing in arr2 lies inside its
// closed interval of radius d. Sorting arr2 once lets each value from arr1
// binary search for its insertion point. Only that neighbor and the one
// before it can be the closest, so both gaps are checked against d.
// Time: O((m + n) log n) Space: O(1)

public class Solution {
    public int FindTheDistanceValue(int[] arr1, int[] arr2, int d) {
        Array.Sort(arr2);
        int ans = 0;
        foreach (int a in arr1) {
            int i = Array.BinarySearch(arr2, a);
            i = i < 0 ? ~i : i;
            if ((i == arr2.Length || arr2[i] - a > d) &&
                (i == 0 || a - arr2[i - 1] > d))
                ++ans;
        }
        return ans;
    }
}
