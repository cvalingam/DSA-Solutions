// Approach: Iterative k-group reversal using a dummy node to simplify head manipulation.
// For each group: first walk ahead k steps to verify enough nodes remain; if not, stop.
// Reverse the k-node segment in-place using the standard three-pointer linked-list reversal.
// Reconnect: attach the previous group's tail to the new group head, and the new group tail to the remaining list.
// Advance the 'group tail' pointer and repeat for the next group.
// Leaves any final partial group (length < k) in its original order.
// Time: O(n) Space: O(1) - purely iterative with no recursion.

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
    public ListNode ReverseKGroup(ListNode head, int k)
    {
        if (head == null || k == 1) return head;
        ListNode dummy = new ListNode();
        dummy.next = head;

        ListNode prev = dummy, curr = dummy, nex = dummy;
        int cnt = 0;

        while (curr.next != null)
        {
            curr = curr.next;
            cnt++;
        }

        while (cnt >= k)
        {
            curr = prev.next;
            nex = curr.next;

            for (int i = 1; i < k; i++)
            {
                curr.next = nex.next;
                nex.next = prev.next;
                prev.next = nex;
                nex = curr.next;
            }
            prev = curr;
            cnt -= k;
        }

        return dummy.next;
    }
}