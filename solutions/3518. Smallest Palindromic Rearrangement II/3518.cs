public class Solution
{
    // Approach: Only the left half of a palindrome can vary. Take half of each
    // character count (and the odd middle letter). Cap combination counts at
    // MAX (> max k). For each left position, try letters a..z: tentatively use
    // one, count remaining multiset permutations; if that block is >= k, keep
    // the letter, else subtract and try the next. Mirror the left half for the answer.
    // Complexity: O(26 * n * 26) time for building the half with combination math,
    // O(1) extra beyond the half (26 letters).
    private readonly int MAX = 1000001;

    public string SmallestPalindrome(string s, int k)
    {
        var count = new Dictionary<char, int>();
        foreach (var c in s)
        {
            if (!count.ContainsKey(c))
                count[c] = 0;
            count[c]++;
        }

        if (!IsPalindromePossible(count))
            return "";

        var (halfCount, midLetter) = GetHalfCountAndMidLetter(count);
        var totalPerm = CalculateTotalPermutations(halfCount);
        if (k > totalPerm)
            return "";

        var leftHalf = GenerateLeftHalf(halfCount, k);
        char[] rightChars = leftHalf.ToArray();
        Array.Reverse(rightChars);
        return new string(leftHalf.ToArray()) + midLetter + new string(rightChars);
    }

    private bool IsPalindromePossible(Dictionary<char, int> count)
    {
        int oddCount = count.Values.Count(freq => freq % 2 == 1);
        return oddCount <= 1;
    }

    private (List<int>, string) GetHalfCountAndMidLetter(Dictionary<char, int> count)
    {
        var halfCount = new List<int>(new int[26]);
        string midLetter = "";
        foreach (var kvp in count)
        {
            int idx = kvp.Key - 'a';
            halfCount[idx] = kvp.Value / 2;
            if (kvp.Value % 2 == 1)
                midLetter = kvp.Key.ToString();
        }
        return (halfCount, midLetter);
    }

    private int CalculateTotalPermutations(List<int> halfCount)
    {
        return CountArrangements(halfCount);
    }

    private List<char> GenerateLeftHalf(List<int> halfCount, int k)
    {
        int halfLen = halfCount.Sum();
        var left = new List<char>();
        for (int _ = 0; _ < halfLen; _++)
        {
            for (int i = 0; i < halfCount.Count; i++)
            {
                if (halfCount[i] == 0)
                    continue;

                halfCount[i]--;
                int arrangements = CountArrangements(halfCount);
                if (arrangements >= k)
                {
                    left.Add((char)(i + 'a'));
                    break;
                }
                else
                {
                    k -= arrangements;
                    halfCount[i]++;
                }
            }
        }
        return left;
    }

    private int CountArrangements(List<int> count)
    {
        int total = count.Sum();
        long res = 1;
        foreach (var freq in count)
        {
            res *= NChooseK(total, freq);
            if (res >= MAX)
                return MAX;
            total -= freq;
        }
        return (int)res;
    }

    private int NChooseK(int n, int k)
    {
        if (k > n)
            return 0;
        if (k > n - k)
            k = n - k;
        long res = 1;
        for (int i = 1; i <= k; i++)
        {
            res = res * (n - i + 1) / i;
            if (res >= MAX)
                return MAX;
        }
        return (int)res;
    }
}