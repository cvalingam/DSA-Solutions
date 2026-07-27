// Approach: Reconstruct the matrix from encodedText (row-major order).
// Read diagonals starting from each column of row 0 - each diagonal is one
// original word segment. Append all diagonal characters, then trim trailing spaces.
// Time: O(rows * cols) Space: O(rows * cols)
public class Solution
{
    public string DecodeCiphertext(string encodedText, int rows)
    {
        int n = encodedText.Length;
        int cols = n / rows;

        char[,] matrix = new char[rows, cols];
        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < cols; j++)
                matrix[i, j] = encodedText[i * cols + j];
        }

        StringBuilder ans = new StringBuilder();
        for (int col = 0; col < cols; col++)
        {
            int i = 0, j = col;
            while (i < rows && j < cols)
            {
                ans.Append(matrix[i, j]);
                i++;
                j++;
            }
        }

        return ans.ToString().TrimEnd();
    }
}