// Approach: Use a dummy node before head to cleanly handle the edge case of removing the head itself.
// Advance the fast pointer n+1 steps ahead of slow (both starting at dummy).
// Move both pointers one step at a time until fast reaches null.
// At that point slow.next is the node to delete; redirect slow.next = slow.next.next.
// Single pass - no need to know the list length or make a second traversal.
// Time: O(n) Space: O(1)

public class ListNode
{
    public int val;
    public ListNode next;
    public ListNode(int val = 0, ListNode next = null)
    {
        this.val = val;
        this.next = next;
    }
}

public class Solution
{
    public ListNode RemoveNthFromEnd(ListNode head, int n)
    {
        ListNode start = new ListNode();
        start.next = head;
        ListNode slow = start;
        ListNode fast = start;
        for (int i = 1; i <= n; i++)
        {
            fast = fast.next;
        }

        while (fast.next != null)
        {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;
        return start.next;
    }
}