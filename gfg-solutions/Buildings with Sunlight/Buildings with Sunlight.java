
// Approach: A building receives sunlight if no taller or equal building blocks it from the left.
// Track a running maximum 'ptr' starting at arr[0]. Walk left-to-right: whenever arr[i] >= ptr,
// the building is visible (it is at least as tall as every building before it), so count it and
// update ptr to arr[i].
//
// Time: O(N) - single pass over the array.
// Space: O(1) - only two integer variables.
class Solution {

    public int visibleBuildings(int arr[]) {
        int build = 0, ptr = arr[0];

        for (int i = 0; i < arr.length; i++) {
            if (arr[i] >= ptr) {
                build++;
                ptr = arr[i];
            }
        }

        return build;
    }
}
