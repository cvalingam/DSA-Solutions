
// Approach: Type-1 queries apply XOR to every existing element, so the final value of an inserted x depends on
// the XOR of all type-1 query values that appear after the insertion.
// Process queries from right to left while keeping cumulativeXor = XOR of all seen type-1 values.
// When you see a type-0 (insert x), add x XOR cumulativeXor to the answer list.
// After all queries, the initial element 0 becomes 0 XOR cumulativeXor = cumulativeXor; add it too.
// Sort the collected list in increasing order.
// Time: O(qlogq) Space: O(q)
import java.util.*;

class Solution {

    public ArrayList<Integer> constructList(int[][] queries) {
        ArrayList<Integer> arr = new ArrayList<>();
        // Stores cumulative XOR effect of all type-1 queries seen so far
        int sum = 0, q = queries.length;
        // Process queries from end to start
        for (int i = q - 1; i >= 0; i--) {
            // Type 0: Insert x
            if (queries[i][0] == 0) {
                // Apply all future XOR operations to x
                arr.add(queries[i][1] ^ sum);
            } else {
                // Accumulate XOR operations
                sum ^= queries[i][1];
            }
        }
        // Initial element 0 becomes (0 ^ sum) so 0^sum=sum
        arr.add(sum);
        // Return sorted result
        Collections.sort(arr);
        return arr;
    }
}
