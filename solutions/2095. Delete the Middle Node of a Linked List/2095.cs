// Approach: Use slow/fast pointers to find the middle node, with a dummy head for the case
// where the middle is the first node. Delete by copying the next value or unlinking the tail.
// Time: O(n) Space: O(1)

//Definition for singly-linked list.
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
    public ListNode DeleteMiddle(ListNode head)
    {
        ListNode start = new ListNode(0);
        start.next = head;
        ListNode slow = head;
        ListNode fast = head;
        ListNode prev = head;

        while (fast != null && fast.next != null)
        {
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }

        if (slow.next != null)
        {
            slow.val = slow.next.val;
            slow.next = slow.next.next;
        }
        else
        {
            if (slow.val == head.val)
                start.next = null;
            else
                prev.next = null;
        }

        return start.next;
    }
}