// Approach: Find the middle with slow/fast pointers, reverse the second half, then compare
// twin sums from both ends moving inward and track the maximum.
// Time: O(n) Space: O(1)

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

public class Solution
{
    public int PairSum(ListNode head)
    {
        int ans = 0;
        ListNode slow = head;
        ListNode fast = head;

        // `slow` points to the start of the second half.
        while (fast != null && fast.next != null)
        {
            slow = slow.next;
            fast = fast.next.next;
        }

        // `tail` points to the end of the reversed second half.
        ListNode tail = ReverseList(slow);

        while (tail != null)
        {
            ans = Math.Max(ans, head.val + tail.val);
            head = head.next;
            tail = tail.next;
        }

        return ans;
    }

    private ListNode ReverseList(ListNode head)
    {
        ListNode prev = null;
        while (head != null)
        {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}