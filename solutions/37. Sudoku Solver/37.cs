// Approach: Backtracking DFS. Try placing digits 1-9 at each empty cell,
// validate row/col/box constraints before proceeding, backtrack on failure.
// Time: O(9^81) Space: O(1)

public class Solution
{
    public void SolveSudoku(char[][] board)
    {
        Dfs(board, 0);
    }

    private bool Dfs(char[][] board, int s)
    {
        if (s == 81)
            return true;

        int i = s / 9;
        int j = s % 9;

        if (board[i][j] != '.')
            return Dfs(board, s + 1);

        for (char c = '1'; c <= '9'; ++c)
        {
            if (IsValid(board, i, j, c))
            {
                board[i][j] = c;
                if (Dfs(board, s + 1))
                    return true;
                board[i][j] = '.';
            }
        }

        return false;
    }

    private bool IsValid(char[][] board, int row, int col, char c)
    {
        for (int i = 0; i < 9; ++i)
            if (board[i][col] == c || board[row][i] == c ||
                board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == c)
                return false;
        return true;
    }
}