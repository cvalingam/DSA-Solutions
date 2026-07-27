// Approach: Math identity - sum of first n odds = n², sum of first n evens = n(n+1).
// gcd(n², n(n+1)) = n * gcd(n, n+1) = n since consecutive integers are coprime.
// Time: O(1) Space: O(1)
public class Solution
{
    public int GcdOfOddEvenSums(int n)
    {
        return n;
    }
}
