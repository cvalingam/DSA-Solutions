// Approach: Build two sublists using dummy head nodes: one for values < x and one for values >= x.
// Iterate through the original list: append each node to the appropriate sublist.
// After traversal, terminate the second sublist's tail (to avoid a cycle), then connect the first sublist's tail to the second sublist's head.
// Return dummy1.next as the new head.
// Dummy nodes eliminate special-casing for empty sublists.
// Time: O(n) Space: O(1) - nodes are relinked, not copied.

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
    public ListNode Partition(ListNode head, int x)
    {
        ListNode beforeHead = new ListNode();
        ListNode afterHead = new ListNode();
        ListNode before = beforeHead;
        ListNode after = afterHead;

        while (head != null)
        {
            if (head.val < x)
            {
                before.next = head;
                before = head;
            }
            else
            {
                after.next = head;
                after = head;
            }
            head = head.next;
        }

        after.next = null;
        before.next = afterHead.next;

        return beforeHead.next;
    }
}