
// Approach: Use a bitmask to track character frequency parity.
// XOR each character's bit into the mask - a set bit means that character appears an odd number of times.
// A string can form a palindrome if at most one character has an odd frequency.
// After scanning, check that mask is 0 (all even) or a power of two (exactly one odd) using mask & (mask-1) == 0.
// Time: O(n) Space: O(1)
class Solution {

    boolean canFormPalindrome(String s) {
        int mask = 0;
        for (char c : s.toCharArray()) {
            int bit = 1 << (c - 'a');
            mask ^= bit;
        }
        return ((mask & (mask - 1)) == 0);
    }
}
