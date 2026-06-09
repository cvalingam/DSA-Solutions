// Approach: First reject any already-invalid arrangement with adjacent occupied seats.
// Then greedily scan left to right and place a person at every empty seat whose existing
// neighbors are empty or outside the row, skipping the next seat after each placement.
// Time: O(n) Space: O(1)

class Solution {

    public boolean canSeatAllPeople(int k, int[] seats) {
        int n = seats.length;
        for (int i = 0; i < n - 1; ++i) {
            if (seats[i] == 1 && seats[i + 1] == 1) {
                return false;
            }
        }

        for (int i = 0; i < n && k != 0; ++i) {
            boolean leftEmpty = (i == 0) || seats[i - 1] == 0;
            boolean rightEmpty = (i == n - 1) || seats[i + 1] == 0;
            if (seats[i] == 0 && leftEmpty && rightEmpty) {
                seats[i] = 1;
                k--;
                i++;
            }

        }
        return k == 0;
    }
}
