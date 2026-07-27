// Approach: Record the last occurrence of each digit 0-9; for each position
// find the rightmost larger digit and do a single swap.
// Time: O(n) Space: O(1)

public class Solution
{
    public int MaximumSwap(int num)
    {
        char[] s = num.ToString().ToCharArray();
        int[] lastIndex = new int[10]; // {digit: last index}

        for (int i = 0; i < s.Length; ++i)
            lastIndex[s[i] - '0'] = i;

        for (int i = 0; i < s.Length; ++i)
        {
            for (int d = 9; d > s[i] - '0'; --d)
            {
                if (lastIndex[d] > i)
                {
                    s[lastIndex[d]] = s[i];
                    s[i] = (char)('0' + d);
                    return int.Parse(new string(s));
                }
            }
        }

        return num;
    }
}