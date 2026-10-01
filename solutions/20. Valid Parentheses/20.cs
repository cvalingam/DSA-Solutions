// Approach: Each opening bracket pushes the closing bracket it expects. A
// closing bracket must equal the top of that stack. An odd length can never
// balance, and the scan stops once more brackets are open than characters
// remain to close them.
// Complexity: O(n) time, O(n) extra space.
public class Solution
{
    public bool IsValid(string s)
    {
        int n = s.Length;
        if ((n & 1) == 1)
            return false;

        char[] stack = new char[n / 2];
        int top = 0;
        for (int i = 0; i < n; i++)
        {
            char ch = s[i];
            char expect = ch switch
            {
                '(' => ')',
                '{' => '}',
                '[' => ']',
                _ => '\0',
            };

            if (expect != '\0')
            {
                if (top == stack.Length)
                    return false;
                stack[top++] = expect;
            }
            else if (top == 0 || stack[--top] != ch)
                return false;
        }

        return top == 0;
    }
}
