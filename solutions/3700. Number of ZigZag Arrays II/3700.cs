// Approach: One extension step is nextUp = prefix(down), nextDown = suffix(up).
// Encoded as block matrix [[0,U],[D,0]] where U[i][j]=1 if j<i and D[i][j]=1 if j>i.
// Composing two steps gives UD; raise UD to (n-1)/2, multiply U when n-1 is odd, sum entries × 2.
// Time: O(V^3 log n) Space: O(V^2), V = r - l + 1 <= 75
public class Solution
{
    private const int Mod = 1_000_000_007;

    public int ZigZagArrays(int n, int l, int r)
    {
        int m = r - l + 1;
        long[][] U = new long[m][], D = new long[m][];
        for (int i = 0; i < m; i++)
        {
            U[i] = new long[m];
            D[i] = new long[m];
            for (int j = 0; j < i; j++) 
                U[i][j] = 1;
            for (int j = i + 1; j < m; j++) 
                D[i][j] = 1;
        }

        long[][] ud = MatMul(U, D, m);
        n--;
        long[][] mat = MatPow(ud, n / 2, m);
        if ((n & 1) == 1)
            mat = MatMul(mat, U, m);

        long ans = 0;
        for (int i = 0; i < m; i++)
        {
            for (int j = 0; j < m; j++)
                ans = (ans + mat[i][j]) % Mod;
        }

        return (int)(ans * 2 % Mod);
    }

    private static long[][] MatPow(long[][] a, long exp, int m)
    {
        long[][] res = new long[m][];
        for (int i = 0; i < m; i++)
        {
            res[i] = new long[m];
            res[i][i] = 1;
        }

        while (exp > 0)
        {
            if ((exp & 1) == 1)
                res = MatMul(res, a, m);
            a = MatMul(a, a, m);
            exp >>= 1;
        }

        return res;
    }

    private static long[][] MatMul(long[][] a, long[][] b, int m)
    {
        long[][] c = new long[m][];
        for (int i = 0; i < m; i++)
            c[i] = new long[m];

        for (int i = 0; i < m; i++)
        {
            for (int k = 0; k < m; k++)
            {
                if (a[i][k] != 0)
                {
                    for (int j = 0; j < m; j++)
                        c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % Mod;
                }
            }
        }

        return c;
    }
}
