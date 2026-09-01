// Approach: BFS on (row, col, energy, litter bitmask). Start at S with full
// energy and all litter bits set; stepping on L clears that bit, R refills
// energy. First time mask is 0 gives the minimum move count.
// Complexity: O(m * n * energy * 2^L) time and space (L = litter cells).
public class Solution
{
    public int MinMoves(string[] classroom, int energy)
    {
        int m = classroom.Length;
        int n = classroom[0].Length;
        char[][] grid = new char[m][];
        int[,] litBit = new int[m, n];
        int sx = 0, sy = 0, lit = 0;

        for (int i = 0; i < m; i++)
        {
            grid[i] = classroom[i].ToCharArray();
            for (int j = 0; j < n; j++)
            {
                char c = grid[i][j];
                if (c == 'S')
                {
                    sx = i;
                    sy = j;
                }
                else if (c == 'L')
                    litBit[i, j] = 1 << lit++;
            }
        }

        if (lit == 0)
            return 0;

        int maskSize = 1 << lit;
        bool[,,,] vis = new bool[m, n, energy + 1, maskSize];
        var q = new Queue<(int x, int y, int e, int mask)>();
        int startMask = maskSize - 1;

        vis[sx, sy, energy, startMask] = true;
        q.Enqueue((sx, sy, energy, startMask));

        int[] dx = { -1, 0, 1, 0 };
        int[] dy = { 0, 1, 0, -1 };
        int steps = 0;

        while (q.Count > 0)
        {
            int size = q.Count;
            while (size-- > 0)
            {
                var (x, y, e, mask) = q.Dequeue();
                if (mask == 0)
                    return steps;
                if (e == 0)
                    continue;

                for (int d = 0; d < 4; d++)
                {
                    int nx = x + dx[d];
                    int ny = y + dy[d];
                    if (nx < 0 || nx >= m || ny < 0 || ny >= n)
                        continue;

                    char cell = grid[nx][ny];
                    if (cell == 'X')
                        continue;

                    int ne = cell == 'R' ? energy : e - 1;
                    int nmask = mask & ~litBit[nx, ny];

                    if (vis[nx, ny, ne, nmask])
                        continue;

                    vis[nx, ny, ne, nmask] = true;
                    q.Enqueue((nx, ny, ne, nmask));
                }
            }
            steps++;
        }

        return -1;
    }
}
