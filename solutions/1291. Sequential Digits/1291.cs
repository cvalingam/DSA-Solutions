// Approach: DFS from each start digit 1-9, always appending the next consecutive digit.
// Collect numbers that fall in [low, high]; sort the small result list at the end.
// Time: O(1) - at most 36 sequential numbers Space: O(1)
public class Solution
{
    public IList<int> SequentialDigits(int low, int high)
    {
        var ans = new List<int>();
        for (int i = 1; i <= 9; i++)
            dfs(low, high, i, 0, ans);

        ans.Sort();
        return ans;
    }

    private void dfs(int low, int high, int i, int num, IList<int> ans)
    {
        if (num >= low && num <= high)
            ans.Add(num);

        if (num > high || i > 9)
            return;

        dfs(low, high, i + 1, num * 10 + i, ans);
    }
}