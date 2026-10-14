// Approach: For a fixed digit sum, squares grow fastest when the sum is packed
// into as few large digits as possible, so use as many 9s as fit, then the
// remainder digit, then zeros. Putting the large digits first also makes the
// number as large as possible. If even num 9s cannot reach sum, return "".
// The string is written once in place with string.Create.
// Time: O(num) Space: O(1) besides the output

public class Solution
{
    public string MaxSumOfSquares(int num, int sum)
    {
        if ((long)num * 9 < sum)
            return "";
        return string.Create(num, (nines: sum / 9, rest: sum % 9), static (span, s) =>
        {
            span[..s.nines].Fill('9');
            int i = s.nines;
            if (s.rest > 0)
                span[i++] = (char)('0' + s.rest);
            span[i..].Fill('0');
        });
    }
}
