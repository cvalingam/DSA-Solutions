
// Definition for singly-linked list.
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

// Approach: Find the list length and make it circular by connecting the tail back to the head.
// The effective rotation count is k % len. The new tail is at position (len - k%len) from the
// start, so walk exactly that many steps, break the circle there, and the next node is the new head.
//
// Time: O(N) - one pass to find length, one pass to find the new tail.
// Space: O(1) - only a few pointer variables.
public class Solution
{
    public ListNode RotateRight(ListNode head, int k)
    {
        if (head == null || head.next == null || k == 0)
            return head;

        ListNode temp = head;
        int len = 1;

        while (temp.next != null)
        {
            temp = temp.next;
            len++;
        }

        temp.next = head;
        k = len - k % len;

        while (k > 0)
        {
            temp = temp.next;
            k--;
        }

        head = temp.next;
        temp.next = null;
        return head;
    }
}