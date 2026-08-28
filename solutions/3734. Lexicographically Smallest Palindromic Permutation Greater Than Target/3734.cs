// Approach: A palindrome is fixed by its left half (and middle if n is odd).
// Build left to right. While still matching target, try target[i] and recurse;
// a later position may still beat target even if the smallest fill does not.
// Otherwise pick the smallest letter > target[i], fill the rest with smallest
// letters, and return.
// Complexity: O(26 * n) per backtrack level in practice, O(n) extra space.
public class Solution
{
    public string LexPalindromicPermutation(string s, string target)
    {
        int n = s.Length;
        int half = n / 2;
        bool odd = n % 2 == 1;
        int steps = half + (odd ? 1 : 0);
        int[] cnt = new int[26];
        int odds = 0;

        foreach (char c in s)
        {
            if ((++cnt[c - 'a'] & 1) == 1)
                odds++;
            else
                odds--;
        }

        if (odds > 1)
            return "";

        char[] left = new char[half];
        char mid = '\0';
        return Build(0, true, left, ref mid, cnt, target, half, odd, n, steps) ?? "";
    }

    private static string Build(
        int pos,
        bool tight,
        char[] left,
        ref char mid,
        int[] cnt,
        string target,
        int half,
        bool odd,
        int n,
        int steps)
    {
        if (pos == steps)
        {
            string ans = ToString(left, mid, n, half, odd);
            return string.CompareOrdinal(ans, target) > 0 ? ans : null;
        }

        bool isMiddle = odd && pos == half;
        int lo = tight ? target[pos] - 'a' : 0;

        for (int c = lo; c < 26; c++)
        {
            if (!CanTake(cnt, c, isMiddle))
                continue;

            Take(cnt, c, isMiddle);
            char savedMid = mid;

            if (isMiddle)
                mid = (char)('a' + c);
            else
                left[pos] = (char)('a' + c);

            if (tight && c == target[pos] - 'a')
            {
                string ans = Build(pos + 1, true, left, ref mid, cnt, target, half, odd, n, steps);
                if (ans != null)
                    return ans;
            }
            else
            {
                FillSmallest(left, ref mid, isMiddle ? half : pos + 1, cnt, odd, half);
                string ans = ToString(left, mid, n, half, odd);
                if (string.CompareOrdinal(ans, target) > 0)
                    return ans;
            }

            Untake(cnt, c, isMiddle);
            mid = savedMid;
        }

        return null;
    }

    private static bool CanTake(int[] cnt, int c, bool isMiddle)
    {
        return isMiddle ? cnt[c] > 0 : cnt[c] >= 2;
    }

    private static void Take(int[] cnt, int c, bool isMiddle)
    {
        cnt[c] -= isMiddle ? 1 : 2;
    }

    private static void Untake(int[] cnt, int c, bool isMiddle)
    {
        cnt[c] += isMiddle ? 1 : 2;
    }

    private static void FillSmallest(char[] left, ref char mid, int from, int[] cnt, bool odd, int half)
    {
        for (int j = from; j < half; j++)
        {
            for (int c = 0; c < 26; c++)
            {
                if (cnt[c] >= 2)
                {
                    left[j] = (char)('a' + c);
                    cnt[c] -= 2;
                    break;
                }
            }
        }

        if (odd && mid == '\0')
        {
            for (int c = 0; c < 26; c++)
            {
                if (cnt[c] > 0)
                {
                    mid = (char)('a' + c);
                    cnt[c]--;
                    break;
                }
            }
        }
    }

    private static string ToString(char[] left, char mid, int n, int half, bool odd)
    {
        char[] ans = new char[n];
        for (int i = 0; i < half; i++)
        {
            ans[i] = left[i];
            ans[n - 1 - i] = left[i];
        }

        if (odd)
            ans[half] = mid;

        return new string(ans);
    }
}
