// Approach: Alternate nesting levels between the two groups, so each group
// gets about half of the maximum depth. The depth before index i has the
// same parity as i, so an opening parenthesis goes to group i % 2 and its
// matching close lands on the opposite parity index with the same group.
// Complexity: O(n) time, O(1) extra space beyond the output.
public class Solution
{
    public int[] MaxDepthAfterSplit(string seq)
    {
        int[] ans = new int[seq.Length];
        for (int i = 0; i < seq.Length; i++)
            ans[i] = (i & 1) ^ (seq[i] == ')' ? 1 : 0);
        return ans;
    }
}
