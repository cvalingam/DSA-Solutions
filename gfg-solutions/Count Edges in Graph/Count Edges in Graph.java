// Approach: In an undirected adjacency list each edge appears in two lists.
// The number of edges is therefore half the sum of all list sizes (the
// handshaking lemma), which needs only one pass over the lists.
// Complexity: O(V + E) time, O(1) extra space.
import java.util.ArrayList;

class Solution {
    public int countEdges(ArrayList<ArrayList<Integer>> adj) {
        int degSum = 0;
        for (ArrayList<Integer> nbrs : adj)
            degSum += nbrs.size();
        return degSum / 2;
    }
}