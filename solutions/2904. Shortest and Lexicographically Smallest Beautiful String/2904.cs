// Approach: Sliding window on exactly k ones. Shrink while ones > k or the
// window has a leading zero, so every candidate starts and ends on a 1.
// Track the shortest window; on ties keep the lexicographically smaller one.
// Complexity: O(n * L) time in the worst case for string compares (L = answer
// length), O(1) extra space.
public class Solution
{
    public string ShortestBeautifulSubstring(string s, int k)
    {
        int bestLeft = -1;
        int minLength = s.Length + 1;
        int ones = 0;

        for (int l = 0, r = 0; r < s.Length; ++r)
        {
            if (s[r] == '1')
                ++ones;

            while (ones > k || (ones == k && s[l] == '0'))
            {
                if (s[l++] == '1')
                    --ones;
            }

            if (ones == k)
            {
                int currentLength = r - l + 1;
                if (currentLength < minLength ||
                    (currentLength == minLength && string.Compare(s, l, s, bestLeft, minLength) < 0))
                {
                    bestLeft = l;
                    minLength = currentLength;
                }
            }
        }

        return bestLeft == -1 ? "" : s.Substring(bestLeft, minLength);
    }
}
