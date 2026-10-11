// Approach: The array is two sorted runs. Find the first index where the
// order drops; with no drop it is already sorted. Copy only the shorter run
// into a buffer and merge back in place. If the left run is shorter, merge
// from the front; otherwise merge from the back. Either way the write
// position never passes an unread value of the run left in the array.
// Complexity: O(n) time, O(min(left, right)) extra space.
class Solution {
    public void mergeTwoParts(int[] arr) {
        int n = arr.length;
        int mid = 1;
        while (mid < n && arr[mid - 1] <= arr[mid])
            mid++;
        if (mid >= n)
            return;

        if (mid <= n - mid) {
            int[] left = new int[mid];
            System.arraycopy(arr, 0, left, 0, mid);
            int i = 0, j = mid, k = 0;
            while (i < mid && j < n)
                arr[k++] = left[i] <= arr[j] ? left[i++] : arr[j++];
            while (i < mid)
                arr[k++] = left[i++];
        } else {
            int len = n - mid;
            int[] right = new int[len];
            System.arraycopy(arr, mid, right, 0, len);
            int i = mid - 1, j = len - 1, k = n - 1;
            while (i >= 0 && j >= 0)
                arr[k--] = arr[i] > right[j] ? arr[i--] : right[j--];
            while (j >= 0)
                arr[k--] = right[j--];
        }
    }
}
