// Approach: Classic friends pairing recurrence. Friend n either stays single
// (then times f(n-1) ways for the rest) or pairs with any of the other n-1
// friends (times f(n-2) for each choice). So f(n) = f(n-1) + (n-1)*f(n-2) with
// f(0)=f(1)=1. Compute iteratively with two rolling variables.
// Time: O(n) Space: O(1)
class Solution {

    public int countFriendsPairings(int n) {
        int curr = 1, prev = 1;
        for (int i = 2; i <= n; i++) {
            int temp = curr + (prev * (i - 1));
            prev = curr;
            curr = temp;
        }

        return curr;
    }
}
