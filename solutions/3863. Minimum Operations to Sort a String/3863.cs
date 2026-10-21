// Approach: Sorting a proper substring can place the global minimum at the
// front or the global maximum at the back, but never both in one step when
// they sit only at the opposite ends. If the string is already sorted, the
// answer is 0. Length 2 that is not sorted is impossible. Otherwise the first
// index of the minimum and the last index of the maximum decide the answer:
// an endpoint placement needs 1, a middle placement needs 2, and minimum only
// at the end with maximum only at the start needs 3.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MinOperations(string s)
    {
        int n = s.Length;
        int firstMin = 0, lastMax = 0;
        bool sorted = true;
        for (int i = 1; i < n; i++)
        {
            char c = s[i];
            if (c < s[i - 1])
                sorted = false;
            if (c < s[firstMin])
                firstMin = i;
            if (c >= s[lastMax])
                lastMax = i;
        }
        if (sorted)
            return 0;
        if (n == 2)
            return -1;
        if (firstMin == 0 || lastMax == n - 1)
            return 1;
        return firstMin == n - 1 && lastMax == 0 ? 3 : 2;
    }
}
