// Approach: Digits 1-9 only contribute primes 2,3,5,7, so if t has any other
// prime factor return "-1". Greedily pack remaining prime powers into the
// fewest digits (prefer 8,9,6,4,...). If that packing needs more digits than
// num, emit the shortest packing alone. Otherwise walk num from right to left,
// bump a digit and fill the suffix with '1's plus the packed remaining factors
// so the result is the smallest zero-free number >= num whose digit product is
// divisible by t (or grow by one digit of leading ones if needed).
// Complexity: O(n) time and O(n) space for the output (n = num.Length).
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class Solution
{
    public string SmallestNumber(string num, long t)
    {
        var primeCountResult = GetPrimeCount(t);
        Dictionary<int, int> primeCount = primeCountResult.Key;
        bool isDivisible = primeCountResult.Value;
        if (!isDivisible)
            return "-1";

        Dictionary<int, int> factorCount = GetFactorCount(primeCount);
        if (SumValues(factorCount) > num.Length)
            return Construct(factorCount);

        Dictionary<int, int> primeCountPrefix = GetPrimeCount(num);
        int firstZeroIndex = num.IndexOf('0');
        if (firstZeroIndex == -1)
        {
            firstZeroIndex = num.Length;
            if (IsSubset(primeCount, primeCountPrefix))
                return num;
        }

        for (int i = num.Length - 1; i >= 0; --i)
        {
            int d = num[i] - '0';
            // Remove the current digit's factors from primeCountPrefix.
            primeCountPrefix = Subtract(primeCountPrefix, FactorCounts[d]);
            int spaceAfterThisDigit = num.Length - 1 - i;
            if (i > firstZeroIndex)
                continue;
            for (int biggerDigit = d + 1; biggerDigit < 10; ++biggerDigit)
            {
                // Compute the required factors after replacing with a larger digit.
                Dictionary<int, int> factorsAfterReplacement = GetFactorCount(
                    Subtract(Subtract(primeCount, primeCountPrefix), FactorCounts[biggerDigit]));
                // Check if the replacement is possible within the available space.
                if (SumValues(factorsAfterReplacement) <= spaceAfterThisDigit)
                {
                    // Fill extra space with '1', if any, and construct the result.
                    int fillOnes = spaceAfterThisDigit - SumValues(factorsAfterReplacement);
                    return num.Substring(0, i) + // Keep the prefix unchanged.
                        biggerDigit +            // Replace the current digit.
                        new string('1', fillOnes) + // Fill remaining space with '1'.
                        Construct(factorsAfterReplacement);
                }
            }
        }

        // No solution of the same length exists, so we need to extend the number
        // by prepending '1's and adding the required factors.
        Dictionary<int, int> factorsAfterExtension = GetFactorCount(primeCount);
        return new string('1', num.Length + 1 - SumValues(factorsAfterExtension)) +
            Construct(factorsAfterExtension);
    }

    private static readonly Dictionary<int, Dictionary<int, int>> FactorCounts = new Dictionary<int, Dictionary<int, int>> {
        { 0, new Dictionary<int, int>() },
        { 1, new Dictionary<int, int>() },
        { 2, new Dictionary<int, int> { { 2, 1 } } },
        { 3, new Dictionary<int, int> { { 3, 1 } } },
        { 4, new Dictionary<int, int> { { 2, 2 } } },
        { 5, new Dictionary<int, int> { { 5, 1 } } },
        { 6, new Dictionary<int, int> { { 2, 1 }, { 3, 1 } } },
        { 7, new Dictionary<int, int> { { 7, 1 } } },
        { 8, new Dictionary<int, int> { { 2, 3 } } },
        { 9, new Dictionary<int, int> { { 3, 2 } } }
    };

    // Returns the prime count of t and if t is divisible by 2, 3, 5, 7.
    private KeyValuePair<Dictionary<int, int>, bool> GetPrimeCount(long t)
    {
        Dictionary<int, int> count = new Dictionary<int, int> { { 2, 0 }, { 3, 0 }, { 5, 0 }, { 7, 0 } };
        int[] primes = { 2, 3, 5, 7 };
        foreach (int prime in primes)
        {
            while (t % prime == 0)
            {
                t /= prime;
                count[prime] = count[prime] + 1;
            }
        }
        return new KeyValuePair<Dictionary<int, int>, bool>(count, t == 1);
    }

    // Returns the prime count of `num`.
    private Dictionary<int, int> GetPrimeCount(string num)
    {
        Dictionary<int, int> count = new Dictionary<int, int> { { 2, 0 }, { 3, 0 }, { 5, 0 }, { 7, 0 } };
        foreach (char c in num)
        {
            Dictionary<int, int> digitFactors = FactorCounts[c - '0'];
            foreach (var entry in digitFactors)
            {
                int prime = entry.Key;
                int freq = entry.Value;
                if (count.ContainsKey(prime))
                    count[prime] += freq;
                else
                    count[prime] = freq;
            }
        }
        return count;
    }

    private Dictionary<int, int> GetFactorCount(Dictionary<int, int> count)
    {
        // 2^3 = 8
        int count8 = count[2] / 3;
        int remaining2 = count[2] % 3;
        // 3^2 = 9
        int count9 = count[3] / 2;
        int count3 = count[3] % 2;
        // 2^2 = 4
        int count4 = remaining2 / 2;
        int count2 = remaining2 % 2;
        // Combine 2 and 3 to 6 if both are present
        int count6 = 0;
        if (count2 == 1 && count3 == 1)
        {
            count2 = 0;
            count3 = 0;
            count6 = 1;
        }
        // Combine 3 and 4 to 2 and 6 if both are present
        if (count3 == 1 && count4 == 1)
        {
            count2 = 1;
            count6 = 1;
            count3 = 0;
            count4 = 0;
        }
        return new Dictionary<int, int> {
            { 2, count2 }, { 3, count3 }, { 4, count4 }, { 5, count[5] },
            { 6, count6 }, { 7, count[7] }, { 8, count8 }, { 9, count9 }
        };
    }

    private string Construct(Dictionary<int, int> factors)
    {
        StringBuilder sb = new StringBuilder();
        for (int digit = 2; digit < 10; ++digit)
        {
            int count = factors[digit];
            sb.Append(new string((char)(digit + '0'), count));
        }
        return sb.ToString();
    }

    // Returns true if a is a subset of b.
    private bool IsSubset(Dictionary<int, int> a, Dictionary<int, int> b)
    {
        foreach (var entry in a)
        {
            if (b[entry.Key] < entry.Value)
                return false;
        }
        return true;
    }

    // Returns a - b.
    private Dictionary<int, int> Subtract(Dictionary<int, int> a, Dictionary<int, int> b)
    {
        Dictionary<int, int> res = new Dictionary<int, int>(a);
        foreach (var entry in b)
        {
            int key = entry.Key;
            int value = entry.Value;
            res[key] = Math.Max(0, res[key] - value);
        }
        return res;
    }

    // Returns the sum of the values in `count`.
    private int SumValues(Dictionary<int, int> count)
    {
        return count.Values.Sum();
    }
}
