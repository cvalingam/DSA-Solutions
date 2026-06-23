// Approach: DP on (last value, last step direction). After placing the first two distinct values,
// state (v, up) means the last element is v and the previous element is smaller; (v, down) means larger.
// To extend: from (v, up) only add w < v (blocks a<b<c); from (v, down) only add w > v (blocks a>b>c).
// Use prefix/suffix sums over values to transition in O(r - l) per length instead of O(V^2).
// Time: O(n * (r - l)) Space: O(r - l)
public class Solution
{
    private const int Mod = 1_000_000_007;

    public int ZigZagArrays(int n, int l, int r)
    {
        long[] up = new long[r + 1];
        long[] down = new long[r + 1];

        for (int a = l; a <= r; a++)
        {
            for (int b = l; b <= r; b++)
            {
                if (a == b) 
                    continue;
                if (a < b) 
                    up[b] = (up[b] + 1) % Mod;
                else 
                    down[b] = (down[b] + 1) % Mod;
            }
        }

        for (int len = 2; len < n; len++)
        {
            long[] nextUp = new long[r + 1];
            long[] nextDown = new long[r + 1];

            long prefixDown = 0;
            for (int w = l; w <= r; w++)
            {
                nextUp[w] = prefixDown;
                prefixDown = (prefixDown + down[w]) % Mod;
            }

            long suffixUp = 0;
            for (int w = r; w >= l; w--)
            {
                nextDown[w] = suffixUp;
                suffixUp = (suffixUp + up[w]) % Mod;
            }

            up = nextUp;
            down = nextDown;
        }

        long ans = 0;
        for (int v = l; v <= r; v++)
            ans = (ans + up[v] + down[v]) % Mod;

        return (int)ans;
    }
}
