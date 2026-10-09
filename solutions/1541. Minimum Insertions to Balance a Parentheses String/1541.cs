// Approach: Each '(' needs two consecutive ')'. Track how many closers are
// still owed. A new '(' arriving while an odd number is owed means a single
// ')' was left alone, so one ')' is inserted to finish that pair. A ')' with
// nothing owed needs an inserted '(' and leaves one more ')' owed. The
// answer is the inserted characters plus whatever is still owed at the end.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MinInsertions(string s)
    {
        int neededRight = 0;  // Increment by 2 for each '('.
        int missingLeft = 0;  // Increment by 1 for each missing '('.
        int missingRight = 0; // Increment by 1 for each missing ')'.

        foreach (char c in s)
        {
            if (c == '(')
            {
                if (neededRight % 2 == 1)
                {
                    // e.g. "()(..."
                    ++missingRight;
                    --neededRight;
                }
                neededRight += 2;
            }
            else if (--neededRight < 0)
            { // c == ')'
                // e.g. "()))..."
                ++missingLeft;
                neededRight += 2;
            }
        }

        return neededRight + missingLeft + missingRight;
    }
}