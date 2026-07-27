// Approach: Stack-based merge - while top of stack and current share a common factor (LCM them).
// Time: O(n log max) Space: O(n)

public class Solution
{
    public IList<int> ReplaceNonCoprimes(int[] nums)
    {
        // Use a list as a stack to store the result
        List<int> stack = new List<int>();

        // Process each number in the input array
        foreach (int currentNum in nums)
        {
            // Add current number to the stack
            stack.Add(currentNum);

            // Keep merging adjacent non-coprime numbers
            while (stack.Count > 1)
            {
                // Get the last two elements from the stack
                int lastElement = stack[stack.Count - 1];
                int secondLastElement = stack[stack.Count - 2];

                // Calculate GCD of the two elements
                int gcdValue = Gcd(lastElement, secondLastElement);

                // If they are coprime (GCD = 1), no merge needed
                if (gcdValue == 1)
                    break;

                // Remove the last element
                stack.RemoveAt(stack.Count - 1);

                // Replace the second last element with LCM of both elements
                // LCM(a, b) = (a * b) / GCD(a, b)
                // Using long to prevent integer overflow during multiplication
                long lcmValue = (long)lastElement * secondLastElement / gcdValue;
                stack[stack.Count - 1] = (int)lcmValue;
            }
        }

        return stack;
    }

    /**
     * Calculates the Greatest Common Divisor using Euclidean algorithm
     * @param a First positive integer
     * @param b Second positive integer
     * @return GCD of a and b
     */
    private int Gcd(int a, int b)
    {
        // Base case: when b becomes 0, a is the GCD
        if (b == 0)
            return a;

        // Recursive case: GCD(a, b) = GCD(b, a mod b)
        return Gcd(b, a % b);
    }
}