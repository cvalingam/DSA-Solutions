// Approach: Backtracking with two counters - open ('(' placed) and close (')' placed).
// At each step, append '(' if open < n (more opening brackets are allowed),
// or append ')' if close < open (there is an unclosed bracket to close).
// A complete string is added to the result when both counters equal n.
// This generates only valid strings without any post-validation - invalid paths are never explored.
// The total number of valid combinations is the n-th Catalan number C(n) = C(2n,n)/(n+1).
// Time: O(4^n/√n) Space: O(n) per path in the recursion stack

public class Solution
{
    public IList<string> GenerateParenthesis(int n)
    {
        IList<string> dp = new List<string>();
        Generate(0, n, 0, 0, "", dp);
        return dp;
    }

    private void Generate(int ind, int n, int op, int cl, string res, IList<string> ans)
    {
        if (op < cl || op > n || cl > n)
            return;

        if (ind == 2 * n)
        {
            ans.Add(res);
            return;
        }

        Generate(ind + 1, n, op + 1, cl, res + '(', ans);
        Generate(ind + 1, n, op, cl + 1, res + ')', ans);
    }
}