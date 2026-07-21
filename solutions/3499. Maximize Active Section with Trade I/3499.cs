

public class Solution
{
    // Approach: One optimal trade adds the longest pair of adjacent zero-runs (two
    // consecutive '0' segments separated by '1's). Scan runs of equal characters;
    // count all '1's, and track max(prevZeroRun + curZeroRun) over zero segments.
    // Answer = totalOnes + that maximum (0 if no valid pair).
    // Complexity: O(n) time and O(1) space.
    public int MaxActiveSectionsAfterTrade(string s)
    {
        int n = s.Length;
        int totalOnes = 0;  // Total count of '1's in the string
        int currentIndex = 0;
        int previousZeroSegmentLength = int.MinValue;  // Length of previous segment of '0's
        int maxZeroSegmentSum = 0;  // Maximum sum of two adjacent zero segments

        // Process the string by segments of consecutive identical characters
        while (currentIndex < n)
        {
            // Find the end of current segment with same character
            int segmentEnd = currentIndex + 1;
            while (segmentEnd < n && s[segmentEnd] == s[currentIndex])
            {
                segmentEnd++;
            }

            // Calculate current segment length
            int currentSegmentLength = segmentEnd - currentIndex;

            if (s[currentIndex] == '1')
            {
                // If current segment contains '1's, add to total count
                totalOnes += currentSegmentLength;
            }
            else
            {
                // If current segment contains '0's, update max possible trade value
                // We can potentially trade this segment with a '1' segment
                // Track the maximum sum of two adjacent '0' segments (separated by '1's)
                maxZeroSegmentSum = Math.Max(maxZeroSegmentSum,
                                            previousZeroSegmentLength + currentSegmentLength);
                previousZeroSegmentLength = currentSegmentLength;
            }

            // Move to next segment
            currentIndex = segmentEnd;
        }

        // Final answer: original '1's count plus the best possible trade
        totalOnes += maxZeroSegmentSum;
        return totalOnes;
    }
}