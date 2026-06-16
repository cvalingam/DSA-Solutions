// Approach: Simulate the operations on a mutable result string.
// Keep a StringBuilder for the current result.
// For each character in s:
// - If it is a lowercase letter, append it.
// - If it is '*', delete the last character of the current result (if it exists).
// - If it is '#', duplicate the current result by appending it to itself.
// - If it is '%', reverse the current result in place.
// Time: O(n^2) Space: O(n)
public class Solution
{
    public string ProcessStr(string s)
    {
        StringBuilder result = new StringBuilder();

        foreach (char c in s)
        {
            if (char.IsLetter(c))
                result.Append(c);
            else if (c == '*')
            {
                if (result.Length > 0)
                    result.Length = result.Length - 1;
            }
            else if (c == '#')
                result.Append(result.ToString());
            else if (c == '%')
            {
                // Reverse the current result string
                int len = result.Length;
                for (int i = 0; i < len / 2; i++)
                {
                    char temp = result[i];
                    result[i] = result[len - 1 - i];
                    result[len - 1 - i] = temp;
                }
            }
            // Other characters are ignored
        }

        return result.ToString();
    }
}