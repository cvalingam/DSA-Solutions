// Approach: Remainder frequency — a pair sums to a multiple of k iff remainders r and (k-r)%k
// appear together. Scan left to right: add freq[(k - rem) % k] to count, then freq[rem]++.
// Time: O(n) Space: O(k)

class Solution {

    public int countKdivPairs(int[] arr, int k) {
        int[] freq = new int[k];
        int count = 0;

        for (int num : arr) {

            int rem = num % k;
            int need = (k - rem) % k;

            count += freq[need];
            freq[rem]++;
        }

        return count;
    }
}
