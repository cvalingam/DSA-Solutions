// Approach: Two pointers a and b start at the heads of lists A and B respectively.
// Each advances one step at a time. When a reaches null, redirect it to headB; likewise b → headA.
// Both pointers travel a total of |A| + |B| steps, so they arrive at the intersection simultaneously.
// If the lists do not intersect, both reach null at the same time (null == null ends the loop).
// The cross-traversal cancels out the length difference - no need to compute list lengths.
// Time: O(m + n) Space: O(1) - no extra data structures needed.

public class ListNode
{
    public int val;
    public ListNode next;
    public ListNode(int x) { val = x; }
}

public class Solution
{
    public ListNode GetIntersectionNode(ListNode headA, ListNode headB)
    {
        if (headA == null || headB == null) return null;

        ListNode a = headA;
        ListNode b = headB;

        while (a != b)
        {
            a = a == null ? headB : a.next;
            b = b == null ? headA : b.next;
        }
        return a;
    }
}