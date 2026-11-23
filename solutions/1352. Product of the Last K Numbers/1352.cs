// Approach: Keep a prefix product stream starting at 1. A non-zero appends
// last * num. A zero clears the stream because every product that includes
// that zero is 0. GetProduct(k) is then last / prefix[n - k - 1], or 0 when
// k reaches back past the most recent zero.
// Time: O(1) per operation Space: O(n)

public class ProductOfNumbers
{
    private readonly List<int> prefix = new List<int> { 1 };

    public ProductOfNumbers()
    {
    }

    public void Add(int num)
    {
        if (num == 0)
        {
            prefix.Clear();
            prefix.Add(1);
        }
        else
        {
            prefix.Add(prefix[prefix.Count - 1] * num);
        }
    }

    public int GetProduct(int k)
    {
        int n = prefix.Count;
        return k >= n ? 0 : prefix[n - 1] / prefix[n - k - 1];
    }
}

/**
 * Your ProductOfNumbers object will be instantiated and called as such:
 * ProductOfNumbers obj = new ProductOfNumbers();
 * obj.Add(num);
 * int param_2 = obj.GetProduct(k);
 */
