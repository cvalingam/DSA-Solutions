
// Approach: Two pointers from both ends. Compare arr[i] and arr[j], then discard one end each turn.
// Continue until pointers meet; the remaining position is the last coin according to this elimination rule.
// Time: O(n) Space: O(1)

class Solution {

    public int coin(int[] arr) {
        int n = arr.length;
        int i = 0, j = n - 1;

        while (i < j) {
            if (arr[i] >= arr[j]) {
                i++; 
            }else {
                j--;
            }
        }
        return arr[i];
    }
}
