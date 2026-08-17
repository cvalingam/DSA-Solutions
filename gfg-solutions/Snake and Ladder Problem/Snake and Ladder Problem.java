// Approach: Model the n x n board (cells 1..n^2) as an unweighted graph: from
// cell c, edges go to c+1..c+6 (if in range), then follow a snake/ladder jump
// if present. BFS from 1 finds the minimum dice throws to reach n^2.
// Complexity: O(n^2) time and O(n^2) space.

import java.util.*;

class Solution {

    public int minThrows(int n, int[] lad, int[] sn) {
        int N = n * n;
        int[] jump = new int[N + 1];
        Arrays.fill(jump, -1);

        for (int i = 0; i < lad.length; i += 2) {
            jump[lad[i]] = lad[i + 1];
        }
        for (int i = 0; i < sn.length; i += 2) {
            jump[sn[i]] = sn[i + 1];
        }

        Queue<Integer> q = new LinkedList<>();
        boolean[] visited = new boolean[N + 1];
        q.offer(1);
        visited[1] = true;
        int throwsCount = 0;

        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int curr = q.poll();
                if (curr == N) {
                    return throwsCount;
                }
                for (int dice = 1; dice <= 6; dice++) {
                    int next = curr + dice;
                    if (next > N) {
                        continue;
                    }
                    if (jump[next] != -1) {
                        next = jump[next];
                    }
                    if (!visited[next]) {
                        visited[next] = true;
                        q.offer(next);
                    }
                }
            }
            throwsCount++;
        }

        return -1;
    }
}
