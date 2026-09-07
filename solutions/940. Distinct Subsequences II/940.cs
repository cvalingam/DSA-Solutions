// Approach: Track total distinct subsequences (ans) and count per ending letter.
// At each char, new sequences = ans + 1 minus those already ending with that letter.
// Complexity: O(n) time and O(1) extra space.
public class Solution
{
    public int DistinctSubseqII(string s)
    {
        const int MOD = 1_000_000_007;
        long[] endsIn = new long[26];
        long ans = 0;

        foreach (char c in s)
        {
            int i = c - 'a';
            long add = (ans - endsIn[i] + 1 + MOD) % MOD;
            ans = (ans + add) % MOD;
            endsIn[i] = (endsIn[i] + add) % MOD;
        }

        return (int)ans;
    }
}
