public class Solution
{
    // Approach: s is already a palindrome, so the left half (and optional middle)
    // fully determines the character multiset. Sort that left half ascending,
    // keep the middle character when n is odd, and append the reverse of the
    // sorted half to form the lexicographically smallest palindromic permutation.
    // Complexity: O(n log n) time and O(n) space.
    public string SmallestPalindrome(string s)
    {
        int n = s.Length;
        string sortedHalf = GetSortedHalf(s);
        return sortedHalf + (n % 2 == 1 ? s[n / 2].ToString() : "") + Reversed(sortedHalf);
    }

    private string GetSortedHalf(string s)
    {
        string half = s.Substring(0, s.Length / 2);
        char[] chars = half.ToCharArray();
        Array.Sort(chars);
        return new string(chars);
    }

    private string Reversed(string s)
    {
        var sb = new StringBuilder(s);
        for (int i = 0, j = s.Length - 1; i < j; i++, j--)
        {
            char temp = sb[i];
            sb[i] = sb[j];
            sb[j] = temp;
        }
        return sb.ToString();
    }
}