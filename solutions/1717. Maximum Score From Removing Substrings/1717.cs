// Approach: Greedy stack - remove higher-scoring pair first, then lower-scoring pair in second pass.
// Time: O(n) Space: O(n)

public class Solution
{
    public int MaximumGain(string s, int x, int y)
    {
        return x > y ? Gain(s, "ab", x, "ba", y) : Gain(s, "ba", y, "ab", x);
    }

    private int Gain(string s, string sub1, int point1, string sub2, int point2)
    {
        int points = 0;
        var st1 = new Stack<char>();

        // First pass: remove sub1 patterns
        foreach (char c in s)
        {
            if (st1.Count > 0 && st1.Peek() == sub1[0] && c == sub1[1])
            {
                st1.Pop();
                points += point1;
            }
            else
                st1.Push(c);
        }

        // Convert stack to string to preserve correct order
        var remaining = new char[st1.Count];
        for (int i = remaining.Length - 1; i >= 0; i--)
        {
            remaining[i] = st1.Pop();
        }

        // Second pass: remove sub2 patterns from remaining characters
        var st2 = new Stack<char>();
        foreach (char c in remaining)
        {
            if (st2.Count > 0 && st2.Peek() == sub2[0] && c == sub2[1])
            {
                st2.Pop();
                points += point2;
            }
            else
                st2.Push(c);
        }

        return points;
    }
}