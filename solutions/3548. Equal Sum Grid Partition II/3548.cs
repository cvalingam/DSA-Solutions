// Approach: For each row/column cut, check if the sum difference between the two halves is zero
// (valid without removal) or equals some cell value in the heavier half that can be removed while
// keeping grid connectivity. Handle 1-row/col strips - only corner cells are removable. For proper
// rectangles, any cell is removable. Pre-build value→sorted-index maps for O(log n) binary search.
// Time: O(m*n*log(m*n)) Space: O(m*n)
public class Solution
{
    public bool CanPartitionGrid(int[][] grid)
    {
        int rows = grid.Length;
        int cols = grid[0].Length;

        long total = 0;
        long[] rowSums = new long[rows];
        long[] colSums = new long[cols];

        for (int r = 0; r < rows; r++)
        {
            for (int c = 0; c < cols; c++)
            {
                int v = grid[r][c];
                total += v;
                rowSums[r] += v;
                colSums[c] += v;
            }
        }

        return CanPartitionByRows(grid, total, rowSums) ||
               CanPartitionByCols(grid, total, colSums);
    }

    private static bool CanPartitionByRows(int[][] grid, long total, long[] rowSums)
    {
        int rows = grid.Length;
        int cols = grid[0].Length;
        long topSum = 0;

        var topFreq = new Dictionary<long, int>();
        var bottomFreq = new Dictionary<long, int>();
        for (int r = 0; r < rows; r++)
        {
            for (int c = 0; c < cols; c++)
            {
                AddCount(bottomFreq, grid[r][c]);
            }
        }

        for (int cut = 0; cut < rows - 1; cut++)
        {
            topSum += rowSums[cut];
            MoveRow(grid[cut], topFreq, bottomFreq);

            long bottomSum = total - topSum;
            long diff = topSum - bottomSum;
            if (diff == 0) return true;

            if (diff > 0)
            {
                if (CanRemoveFromRowSection(grid, 0, cut, cols, diff, topFreq)) return true;
            }
            else
            {
                long need = -diff;
                if (CanRemoveFromRowSection(grid, cut + 1, rows - 1, cols, need, bottomFreq)) return true;
            }
        }

        return false;
    }

    private static bool CanPartitionByCols(int[][] grid, long total, long[] colSums)
    {
        int rows = grid.Length;
        int cols = grid[0].Length;
        long leftSum = 0;

        var leftFreq = new Dictionary<long, int>();
        var rightFreq = new Dictionary<long, int>();
        for (int c = 0; c < cols; c++)
        {
            for (int r = 0; r < rows; r++)
            {
                AddCount(rightFreq, grid[r][c]);
            }
        }

        for (int cut = 0; cut < cols - 1; cut++)
        {
            leftSum += colSums[cut];
            MoveCol(grid, cut, leftFreq, rightFreq);

            long rightSum = total - leftSum;
            long diff = leftSum - rightSum;
            if (diff == 0) return true;

            if (diff > 0)
            {
                if (CanRemoveFromColSection(grid, 0, cut, rows, diff, leftFreq)) return true;
            }
            else
            {
                long need = -diff;
                if (CanRemoveFromColSection(grid, cut + 1, cols - 1, rows, need, rightFreq)) return true;
            }
        }

        return false;
    }

    private static bool CanRemoveFromRowSection(
        int[][] grid,
        int startRow,
        int endRow,
        int cols,
        long need,
        Dictionary<long, int> freq)
    {
        int height = endRow - startRow + 1;
        if (height <= 0) return false;

        if (height == 1)
        {
            return grid[startRow][0] == need || grid[startRow][cols - 1] == need;
        }

        if (cols == 1)
        {
            return grid[startRow][0] == need || grid[endRow][0] == need;
        }

        return freq.ContainsKey(need);
    }

    private static bool CanRemoveFromColSection(
        int[][] grid,
        int startCol,
        int endCol,
        int rows,
        long need,
        Dictionary<long, int> freq)
    {
        int width = endCol - startCol + 1;
        if (width <= 0) return false;

        if (width == 1)
        {
            return grid[0][startCol] == need || grid[rows - 1][startCol] == need;
        }

        if (rows == 1)
        {
            return grid[0][startCol] == need || grid[0][endCol] == need;
        }

        return freq.ContainsKey(need);
    }

    private static void MoveRow(int[] row, Dictionary<long, int> to, Dictionary<long, int> from)
    {
        for (int i = 0; i < row.Length; i++)
        {
            int v = row[i];
            AddCount(to, v);
            RemoveCount(from, v);
        }
    }

    private static void MoveCol(int[][] grid, int col, Dictionary<long, int> to, Dictionary<long, int> from)
    {
        for (int r = 0; r < grid.Length; r++)
        {
            int v = grid[r][col];
            AddCount(to, v);
            RemoveCount(from, v);
        }
    }

    private static void AddCount(Dictionary<long, int> freq, long val)
    {
        if (freq.TryGetValue(val, out int count)) freq[val] = count + 1;
        else freq[val] = 1;
    }

    private static void RemoveCount(Dictionary<long, int> freq, long val)
    {
        int count = freq[val] - 1;
        if (count == 0) freq.Remove(val);
        else freq[val] = count;
    }
}