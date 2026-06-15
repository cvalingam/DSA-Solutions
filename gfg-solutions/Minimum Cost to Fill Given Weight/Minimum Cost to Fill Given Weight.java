// Approach: DP where mem[x] is the minimum cost to reach weight x. Seed from direct item
// costs, then relax mem[x + y] = min(mem[x + y], mem[x] + mem[y]) for all valid pairs.
// Time: O(w^2) Space: O(w)

class Solution {

    public int minimumCost(int[] cost, int w) {
        int size = cost.length;
        int mem[] = new int[w + 1];

        /*
        * Let's initialize, if such cost is available
        * we use it otherwise we fallback to -1
         */
        for (int x = 1; x <= w; x++) {
            int c = x - 1 < size ? cost[x - 1] : -1;
            mem[x] = max(c, -1);
        }

        /*
         * Combine previously computed weights to discover cheaper
         * ways of obtaining larger weights.
         *
         * mem[x + y] = min(mem[x + y], mem[x] + mem[y])
         */
        for (int x = 1; x < w; x++) {
            for (int y = x; y < w - x + 1; y++) {
                if (mem[x] == -1 || mem[y] == -1) {
                    continue;
                }
                mem[y + x] = min(mem[y + x], mem[x] + mem[y]);
            }
        }

        return mem[w];
    }

    int max(int a, int b) {
        return a > b ? a : b;
    }

    int min(int a, int b) {
        if (a == -1 || b == -1) {
            return max(a, b);
        }
        return a < b ? a : b;
    }
}
