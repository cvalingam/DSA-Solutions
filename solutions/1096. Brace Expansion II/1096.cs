// Approach: The grammar is union inside braces and concatenation of neighbors.
// Parse with recursion on matching braces. Each level keeps the options seen
// so far in a hash set, multiplies adjacent pieces, and unions comma-separated
// pieces. Sort once at the end, since only the final list must be ordered.
// Complexity: O(U * L) to build the words plus O(U log U) to sort, where U is
// the number of distinct words and L is the longest word. Output size dominates.
public class Solution
{
    public IList<string> BraceExpansionII(string expression)
    {
        var words = Expand(expression, 0, expression.Length - 1);
        var ans = new List<string>(words);
        ans.Sort(StringComparer.Ordinal);
        return ans;
    }

    private HashSet<string> Expand(string expression, int s, int e)
    {
        var groups = new List<HashSet<string>> { new HashSet<string>() };
        int layer = 0;
        int left = 0;

        for (int i = s; i <= e; i++)
        {
            char c = expression[i];
            if (c == '{' && ++layer == 1)
            {
                left = i + 1;
            }
            else if (c == '}' && --layer == 0)
            {
                Merge(groups, Expand(expression, left, i - 1));
            }
            else if (c == ',' && layer == 0)
            {
                groups.Add(new HashSet<string>());
            }
            else if (layer == 0)
            {
                Merge(groups, new HashSet<string> { c.ToString() });
            }
        }

        var ans = new HashSet<string>();
        foreach (var group in groups)
            ans.UnionWith(group);
        return ans;
    }

    private static void Merge(List<HashSet<string>> groups, HashSet<string> incoming)
    {
        int last = groups.Count - 1;
        if (groups[last].Count == 0)
        {
            groups[last] = incoming;
            return;
        }

        var merged = new HashSet<string>();
        foreach (string left in groups[last])
        {
            foreach (string right in incoming)
                merged.Add(left + right);
        }
        groups[last] = merged;
    }
}
