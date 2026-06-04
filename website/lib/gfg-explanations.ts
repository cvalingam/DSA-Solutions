/**
 * Rich structured explanations for GFG problems.
 * Keys are problem slugs (derived from folder names via toSlug()).
 */
export interface RichExplanation {
  intuition: string
  algorithm: string[]
  example?: {
    input: string
    steps: string[]
    output: string
  }
  pitfalls?: string[]
}

const gfgExplanations: Record<string, RichExplanation> = {

  // ─── 0-1 Knapsack Problem ────────────────────────────────────────────────────
  '0-1-knapsack-problem': {
    intuition:
      'Each item is either taken (0) or not (1). DP table dp[i][w] = max value using first i items with capacity w. Taking item i: dp[i][w] = dp[i-1][w-wi] + vi. Not taking: dp[i][w] = dp[i-1][w]. Optimise to 1D by processing weights in reverse.',
    algorithm: [
      'Initialise dp[W+1] = 0.',
      'For each item i: for w from W down to weights[i]: dp[w] = max(dp[w], dp[w-weights[i]] + values[i]).',
      'Return dp[W].',
    ],
    example: {
      input: 'weights=[1,3,4,5], values=[1,4,5,7], W=7',
      steps: [
        'Item 1 (w=1,v=1): dp[1..7] updated. Item 2 (w=3,v=4): dp[7]=dp[4]+4=5.',
        'Item 3 (w=4,v=5): dp[7]=dp[3]+5=9. Item 4 (w=5,v=7): dp[7]=max(9,dp[2]+7)=9.',
      ],
      output: '9',
    },
    pitfalls: ['Process weights in reverse (W down to wi) to prevent reusing the same item.'],
  },

  // ─── Activity Selection ──────────────────────────────────────────────────────
  'activity-selection': {
    intuition:
      'Greedy: among all activities compatible with the last selected one, always pick the one that finishes earliest. This leaves maximum room for future activities. Sort by end time first.',
    algorithm: [
      'Sort activities by end time.',
      'Select activity 0. lastEnd = end[0], count = 1.',
      'For i from 1 to n−1: if start[i] >= lastEnd: select it, count++, lastEnd = end[i].',
      'Return count.',
    ],
    example: {
      input: 'start=[1,3,0,5,8,5], end=[2,4,6,7,9,9]',
      steps: [
        'Sort by end: (1,2),(3,4),(0,6),(5,7),(8,9),(5,9). Select (1,2). lastEnd=2.',
        'Select (3,4). lastEnd=4. Skip (0,6): 0<4. Select (5,7). lastEnd=7. Select (8,9). count=4.',
      ],
      output: '4',
    },
    pitfalls: ['Sort by END time, not start time — a greedy on start times is incorrect.'],
  },

  // ─── Aggressive Cows ─────────────────────────────────────────────────────────
  'aggressive-cows': {
    intuition:
      'Binary search on the minimum distance between any two cows. For a given minimum distance d, greedily check if k cows can be placed: place first cow at stall 0, then each next cow at the first stall at distance ≥ d from the previous.',
    algorithm: [
      'Sort stalls.',
      'Binary search lo=1, hi=stalls[n-1]−stalls[0].',
      'For each mid: check if k cows can be placed with min distance mid.',
      'Canplace(d): place first cow at stalls[0]. For each stall: if gap ≥ d, place cow here, count++. Return count >= k.',
      'If canplace(mid): lo=mid+1 (try larger). Else: hi=mid−1.',
      'Return lo−1.',
    ],
    example: {
      input: 'stalls=[1,2,4,8,9], k=3',
      steps: [
        'lo=1,hi=8. mid=4: place at 1,4? gap=3<4. mid=3: place at 1,4,8. 3 cows ✓ → lo=4.',
        'mid=6: can we? 1,8(gap=7≥6),next? No more. Only 2 → hi=5.',
        'mid=4: same → lo=5. lo>hi. Answer=4.',
      ],
      output: '3 (minimum distance = 3)',
    },
    pitfalls: ['Sort stalls first. Binary search on the ANSWER (distance), not the index.'],
  },

  // ─── Alien Dictionary ────────────────────────────────────────────────────────
  'alien-dictionary': {
    intuition:
      'Build a directed graph of character ordering by comparing adjacent words in the dictionary. Topological sort (Kahn\'s) on this graph gives the alien character order. If a cycle exists, no valid ordering exists.',
    algorithm: [
      'For each pair of adjacent words: find the first differing character. Add edge char1 → char2.',
      'Topological sort via BFS (Kahn\'s). Start with in-degree-0 characters.',
      'If all characters are processed, return order. If cycle detected, return "".',
    ],
    example: {
      input: 'words = ["wrt","wrf","er","ett","rftt"]',
      steps: [
        'wrt vs wrf: t→f. wrf vs er: w→e. er vs ett: r→t. ett vs rftt: e→r.',
        'Topo order: w,e,r,t,f.',
      ],
      output: '"wertf"',
    },
    pitfalls: [
      'Only compare the first differing character between adjacent words.',
      'If word1 is a prefix of word2 but comes after it, that\'s invalid — return "" immediately.',
    ],
  },

  // ─── Anagram ─────────────────────────────────────────────────────────────────
  'anagram': {
    intuition:
      'Two strings are anagrams if they have the same character frequencies. Use a single int[256] array: increment for each character in s1, decrement for each in s2. If all entries are 0, they are anagrams.',
    algorithm: [
      'If lengths differ, return false.',
      'int[256] count. For each i: count[s1[i]]++; count[s2[i]]--.',
      'Return count.All(x => x == 0).',
    ],
    example: {
      input: 's1 = "listen", s2 = "silent"',
      steps: ['After processing: all counts are 0. Return true.'],
      output: 'YES',
    },
    pitfalls: ['Use a char frequency array, not sort — sort is O(n log n) vs O(n).'],
  },

  // ─── Bellman-Ford ────────────────────────────────────────────────────────────
  'bellman-ford': {
    intuition:
      'Relax all edges V−1 times. After V−1 iterations, shortest paths are found (a shortest path has at most V−1 edges). A V-th relaxation that still reduces any distance indicates a negative cycle.',
    algorithm: [
      'dist[src]=0, all others=INF.',
      'Repeat V−1 times: for each edge (u,v,w): if dist[u]+w < dist[v], dist[v]=dist[u]+w.',
      'Check negative cycle: if any edge (u,v,w) has dist[u]+w < dist[v], report negative cycle.',
    ],
    example: {
      input: 'V=5, edges: 0→1(2),0→2(4),1→2(1),1→3(7),2→4(3)',
      steps: [
        'Iter 1: dist=[0,2,3,9,6]. Iter 2–4: no further relaxations.',
      ],
      output: 'dist = [0,2,3,9,6]',
    },
    pitfalls: ['Bellman-Ford handles negative weights; Dijkstra does not. Use Bellman-Ford when negative weights are present.'],
  },

  // ─── BFS of Graph ────────────────────────────────────────────────────────────
  'bfs-of-graph': {
    intuition:
      'BFS explores nodes level by level using a queue. Start from source, enqueue all unvisited neighbors, mark them visited when enqueued (not when dequeued) to avoid duplicate processing.',
    algorithm: [
      'visited[src]=true. Enqueue src.',
      'While queue not empty: dequeue u. Add u to result.',
      'For each neighbor v of u: if not visited: visited[v]=true, enqueue v.',
    ],
    example: {
      input: 'Graph: 0→[1,2], 1→[3], 2→[3], 3→[]',
      steps: [
        'Queue:[0]. Dequeue 0 → result=[0]. Enqueue 1,2.',
        'Dequeue 1 → result=[0,1]. Enqueue 3. Dequeue 2 → result=[0,1,2]. Dequeue 3 → result=[0,1,2,3].',
      ],
      output: '[0,1,2,3]',
    },
    pitfalls: ['Mark visited when ENQUEUING, not when dequeuing — prevents the same node being enqueued multiple times.'],
  },

  // ─── Binary Tree to DLL ──────────────────────────────────────────────────────
  'binary-tree-to-dll': {
    intuition:
      'In-order traversal (left→root→right) of a BST gives sorted order. Convert by linking each node\'s left pointer to the previous node and right pointer to the next node during in-order traversal. Track the last processed node (prev).',
    algorithm: [
      'In-order traversal. Maintain prev node.',
      'For each node: node.left = prev. If prev != null: prev.right = node.',
      'Track head (first node). Update prev = node.',
      'Return head.',
    ],
    example: {
      input: 'BST: 10, left=12, right=15, 12\'s right=25, 15\'s left=36',
      steps: [
        'In-order: 12→25→10→36→15. Link each: 12←→25←→10←→36←→15.',
      ],
      output: 'DLL: 12↔25↔10↔36↔15',
    },
    pitfalls: ['Link prev→curr before updating prev = curr, otherwise you lose the predecessor.'],
  },

  // ─── Boolean Parenthesization ─────────────────────────────────────────────────
  'boolean-parenthesization': {
    intuition:
      'DP on sub-expressions: dp_true[i][j] = number of ways substring [i,j] evaluates to TRUE; dp_false[i][j] = FALSE. Split at each operator k. Combine left and right using truth-table rules for AND, OR, XOR.',
    algorithm: [
      'Base: dp_true[i][i] = (sym[i]=="T") ? 1 : 0. dp_false[i][i] = 1 − dp_true[i][i].',
      'For length l from 2 to n: for each (i,j): for each operator at k between i and j:',
      '  Compute lt,lf,rt,rf (left/right true/false counts).',
      '  AND: true += lt*rt. OR: true += lt*rt+lt*rf+lf*rt. XOR: true += lt*rf+lf*rt.',
      '  false = totalWays − true.',
      'Return dp_true[0][n-1].',
    ],
    example: {
      input: '"T|T&F^T"',
      steps: [
        'Symbols: T,T,F,T. Operators: |,&,^.',
        'dp_true[0][3] = 4.',
      ],
      output: '4',
    },
    pitfalls: ['Total ways for a substring of length n = Catalan(n-1). Use it to compute false = total − true.'],
  },

  // ─── Bottom View of Binary Tree ──────────────────────────────────────────────
  'bottom-view-of-binary-tree': {
    intuition:
      'Level-order traversal with horizontal distance (HD): root=0, left child=HD−1, right child=HD+1. For each HD, the LAST node seen at that HD (deepest level) is the bottom view.',
    algorithm: [
      'BFS with (node, HD) pairs. HashMap: HD → last seen node value.',
      'Process each (node, hd): map[hd] = node.val (overwrite — last wins).',
      'Enqueue (left, hd−1) and (right, hd+1) if non-null.',
      'Return map values sorted by HD.',
    ],
    example: {
      input: 'Tree: 20(root), left=8[left=5,right=3], right=22[right=25], 3 has left=10,right=14',
      steps: ['HD: 5→-2, 8→-1, 10→0, 20→0, 3→0, 14→1, 22→1, 25→2. Bottom: 5,10,3,14,25.'],
      output: '[5,10,3,14,25]',
    },
    pitfalls: ['BFS ensures we process level by level — map[hd] is always overwritten by deeper nodes.'],
  },

  // ─── Check for BST ────────────────────────────────────────────────────────────
  'check-for-bst': {
    intuition:
      'Pass valid range [min, max] down the tree. Each node must be strictly within (min, max). Left child has max=current.val; right child has min=current.val.',
    algorithm: [
      'IsValidBST(node, min, max):',
      'If node is null, return true.',
      'If node.val <= min or node.val >= max, return false.',
      'Return IsValidBST(left, min, node.val) && IsValidBST(right, node.val, max).',
    ],
    example: {
      input: 'root = [2,1,3]',
      steps: [
        'Node 2: range (−∞,+∞) ✓. Node 1: range (−∞,2) ✓. Node 3: range (2,+∞) ✓.',
      ],
      output: 'true',
    },
    pitfalls: ['Use long.MinValue/MaxValue (or null) as initial bounds — int bounds fail on equal-value edge cases.'],
  },

  // ─── Coin Change (Count Ways) ─────────────────────────────────────────────────
  'coin-change-count-ways': {
    intuition:
      'Unbounded knapsack: dp[i] = number of ways to make sum i using the given coins (each coin can be used any number of times). For each coin, iterate forward through the dp array.',
    algorithm: [
      'dp[0]=1, dp[1..sum]=0.',
      'For each coin c: for w from c to sum: dp[w] += dp[w−c].',
      'Return dp[sum].',
    ],
    example: {
      input: 'coins=[1,2,3], sum=4',
      steps: [
        'coin=1: dp=[1,1,1,1,1]. coin=2: dp[2]+=dp[0]=2, dp[3]+=dp[1]=2, dp[4]+=dp[2]=3. → dp=[1,1,2,2,3].',
        'coin=3: dp[3]+=dp[0]=3, dp[4]+=dp[1]=4. → dp[4]=4.',
      ],
      output: '4',
    },
    pitfalls: ['Outer loop over coins, inner loop over amounts — this counts combinations (not permutations). Swap loops for permutations.'],
  },

  // ─── Coin Change (Minimum Coins) ─────────────────────────────────────────────
  'coin-change-minimum-coins': {
    intuition:
      'dp[i] = minimum coins to make sum i. For each coin c and each amount w >= c: dp[w] = min(dp[w], dp[w-c]+1). Initialize dp[1..sum] = INF.',
    algorithm: [
      'dp[0]=0, dp[1..sum]=INF.',
      'For each coin c: for w from c to sum: if dp[w-c] != INF: dp[w]=min(dp[w], dp[w-c]+1).',
      'Return dp[sum] if not INF, else −1.',
    ],
    example: {
      input: 'coins=[1,5,6,9], sum=11',
      steps: [
        'dp[5]=1, dp[6]=1, dp[9]=1. dp[10]=2(5+5 or 4+6...). dp[11]=2 (5+6).',
      ],
      output: '2',
    },
    pitfalls: ['Return −1 if dp[sum] remains INF — the sum is unreachable.'],
  },

  // ─── Count Inversions ────────────────────────────────────────────────────────
  'count-inversions': {
    intuition:
      'An inversion is a pair (i, j) where i < j but arr[i] > arr[j]. Merge sort counts inversions during the merge step: when an element from the right half is placed before elements from the left half, each of those left-half elements forms an inversion with it.',
    algorithm: [
      'Merge sort recursively. Count inversions during merge.',
      'During merge: whenever right[j] < left[i], all elements left[i..mid] are inversions with right[j]. inv_count += (mid − i + 1).',
    ],
    example: {
      input: 'arr = [2,4,1,3,5]',
      steps: [
        'Merge [2,4] and [1,3]: 1<2 → 2 inversions. 3>2, 3>4: 0.',
        'Merge [2,4,1,3] and [5]: 0 inversions.',
        'Total = 3 (pairs: (2,1),(4,1),(4,3)).',
      ],
      output: '3',
    },
    pitfalls: ['Count inversions during merge (not during split) — only then do you know the relative positions.'],
  },

  // ─── DFS of Graph ────────────────────────────────────────────────────────────
  'dfs-of-graph': {
    intuition:
      'DFS explores as deep as possible along each branch before backtracking. Use a stack (or recursion): visit a node, mark it, then recursively visit all unvisited neighbors.',
    algorithm: [
      'visited[src]=true. DFS(src).',
      'DFS(u): add u to result. For each neighbor v: if not visited: visited[v]=true. DFS(v).',
    ],
    example: {
      input: 'Graph: 0→[1,2,3], 1→[4], 2→[], 3→[], 4→[]',
      steps: [
        'DFS(0): visit 0. Go to 1: visit 1. Go to 4: visit 4. Backtrack. Go to 2: visit 2. Go to 3: visit 3.',
        'Result: [0,1,4,2,3].',
      ],
      output: '[0,1,4,2,3]',
    },
    pitfalls: ['Mark as visited BEFORE recursing — not after — to prevent revisiting in undirected graphs.'],
  },

  // ─── Detect Loop in linked list ───────────────────────────────────────────────
  'detect-loop-in-linked-list': {
    intuition:
      'Floyd\'s cycle detection: slow pointer moves one step, fast moves two. If they meet, a cycle exists. If fast reaches null, no cycle.',
    algorithm: [
      'slow = fast = head.',
      'While fast != null and fast.next != null: slow = slow.next. fast = fast.next.next.',
      'If slow == fast: return true (cycle). Return false.',
    ],
    example: {
      input: '1→2→3→4→5→(back to 3)',
      steps: [
        'Step 1: slow=2, fast=3. Step 2: slow=3, fast=5. Step 3: slow=4, fast=4. Meet at 4. Cycle!',
      ],
      output: 'true',
    },
    pitfalls: ['Check fast != null AND fast.next != null before each step to avoid NullPointerException.'],
  },

  // ─── Dijkstra Algorithm ──────────────────────────────────────────────────────
  'dijkstra-algorithm': {
    intuition:
      'Greedy shortest path: always extend the unvisited node with the smallest current distance. Use a min-heap (priority queue) to efficiently get the next minimum. Only works with non-negative edge weights.',
    algorithm: [
      'dist[src]=0, all others=INF. Add (0,src) to min-heap.',
      'While heap not empty: extract (d,u). If d > dist[u], skip (stale entry).',
      'For each neighbor (v,w): if dist[u]+w < dist[v]: dist[v]=dist[u]+w. Push (dist[v],v).',
    ],
    example: {
      input: 'V=5, edges: 0→1(4),0→2(1),2→1(2),1→3(1),2→3(5)',
      steps: [
        'dist=[0,∞,∞,∞,∞]. Process 0: dist[1]=4, dist[2]=1.',
        'Process 2(d=1): dist[1]=min(4,3)=3, dist[3]=6.',
        'Process 1(d=3): dist[3]=min(6,4)=4.',
      ],
      output: 'dist=[0,3,1,4,∞]',
    },
    pitfalls: ['Skip stale heap entries by checking if extracted distance > dist[u].'],
  },

  // ─── Directed Graph Cycle ─────────────────────────────────────────────────────
  'directed-graph-cycle': {
    intuition:
      'A directed cycle exists iff DFS finds a back edge — an edge pointing to an ancestor in the current DFS stack. Use two states: "in-stack" (currently being explored) and "visited" (fully explored). A back edge leads to an "in-stack" node.',
    algorithm: [
      'visited[n]=false, inStack[n]=false.',
      'DFS(u): visited[u]=inStack[u]=true.',
      'For each neighbor v: if !visited: DFS(v). If cycle found, return true.',
      'Else if inStack[v]: return true (back edge → cycle).',
      'inStack[u]=false. Return false.',
    ],
    example: {
      input: 'Graph: 0→1→2→0 (cycle)',
      steps: [
        'DFS(0): mark. DFS(1): mark. DFS(2): neighbor 0 is inStack → cycle!',
      ],
      output: 'true',
    },
    pitfalls: ['For directed graphs, use inStack (recursion stack). For undirected graphs, just use visited + parent tracking.'],
  },

  // ─── Edit Distance ───────────────────────────────────────────────────────────
  'edit-distance': {
    intuition:
      'dp[i][j] = minimum edits to convert s1[0..i-1] to s2[0..j-1]. If characters match: dp[i][j]=dp[i-1][j-1]. Else: 1 + min(insert=dp[i][j-1], delete=dp[i-1][j], replace=dp[i-1][j-1]).',
    algorithm: [
      'dp[0][j]=j (j deletions), dp[i][0]=i (i insertions).',
      'For i,j from 1: if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1].',
      'Else: dp[i][j]=1+min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]).',
      'Return dp[m][n].',
    ],
    example: {
      input: 's1="sunday", s2="saturday"',
      steps: [
        'dp table fills to give dp[6][8]=3 (insert a,t, replace n).',
      ],
      output: '3',
    },
    pitfalls: ['Three operations: insert (dp[i][j-1]+1), delete (dp[i-1][j]+1), replace (dp[i-1][j-1]+1).'],
  },

  // ─── Equilibrium Point ───────────────────────────────────────────────────────
  'equilibrium-point': {
    intuition:
      'An equilibrium point is where the sum of elements to the left equals the sum to the right. Compute total sum first. Then traverse left to right: subtract current element from right sum after checking equality.',
    algorithm: [
      'total = sum(arr). leftSum = 0.',
      'For each index i: total -= arr[i] (now total = rightSum).',
      'If leftSum == total: return i+1 (1-indexed).',
      'leftSum += arr[i].',
      'Return −1.',
    ],
    example: {
      input: 'arr = [-7,1,5,2,-4,3,0]',
      steps: [
        'total=0. leftSum=0. i=0: total=7≠leftSum. i=1: total=6≠-7. ... i=3: total=-1,leftSum=-1 ✓. Return 4.',
      ],
      output: '4',
    },
    pitfalls: ['Subtract the current element from rightSum BEFORE comparing (the current element belongs to neither side).'],
  },

  // ─── Floyd Warshall ───────────────────────────────────────────────────────────
  'floyd-warshall': {
    intuition:
      'All-pairs shortest paths using dynamic programming over intermediate nodes. dist[i][j] = shortest path from i to j. For each intermediate node k: if going through k is shorter, update. Three nested loops: k (intermediate), i (source), j (destination).',
    algorithm: [
      'Initialise dist from adjacency matrix. dist[i][i]=0.',
      'For k from 0 to V-1: for i,j: dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]).',
      'Return dist matrix.',
    ],
    example: {
      input: 'V=4, edges: 0→1(5),0→3(10),1→2(3),2→3(1)',
      steps: [
        'k=0: no improvement. k=1: dist[0][2]=min(∞,5+3)=8. k=2: dist[0][3]=min(10,8+1)=9.',
      ],
      output: 'Shortest paths: 0→3=9',
    },
    pitfalls: ['k must be the OUTER loop — intermediate nodes are added one at a time.'],
  },

  // ─── Gas Station ─────────────────────────────────────────────────────────────
  'gas-station': {
    intuition:
      'If total gas >= total cost, a solution exists and is unique. Use a greedy scan: track running surplus; when it goes negative, the current starting station is impossible — reset to the next station.',
    algorithm: [
      'totalGas=0, currentGas=0, start=0.',
      'For i from 0 to n−1: totalGas += gas[i]−cost[i]. currentGas += gas[i]−cost[i].',
      'If currentGas < 0: start=i+1. currentGas=0.',
      'Return (totalGas >= 0) ? start : −1.',
    ],
    example: {
      input: 'gas=[1,2,3,4,5], cost=[3,4,5,1,2]',
      steps: [
        'i=0: cur=-2 < 0 → start=1. i=1: cur=-2 < 0 → start=2. i=2: cur=-2 < 0 → start=3.',
        'i=3: cur=3. i=4: cur=6. Total=2≥0. Return start=3.',
      ],
      output: '3',
    },
    pitfalls: ['The existence of a solution is guaranteed when total gas >= total cost — only one valid start exists.'],
  },

  // ─── Height of Binary Tree ───────────────────────────────────────────────────
  'height-of-binary-tree': {
    intuition:
      'The height is the number of nodes on the longest path from root to a leaf. Recursively: height = 1 + max(height(left), height(right)). Base: null node has height 0.',
    algorithm: [
      'If node is null, return 0.',
      'Return 1 + max(Height(node.left), Height(node.right)).',
    ],
    example: {
      input: 'Tree: 1→(2→4, 3)',
      steps: [
        'Height(4)=1. Height(2)=2. Height(3)=1. Height(1)=3.',
      ],
      output: '3',
    },
    pitfalls: ['Height of a single node is 1 (not 0). Height of empty tree is 0.'],
  },

  // ─── Histogram Max Rectangular Area ─────────────────────────────────────────
  'histogram-max-rectangular-area': {
    intuition:
      'For each bar, find how far left and right it extends as the minimum bar. Use a monotonic increasing stack: when a shorter bar is found, the popped bar is bounded on the right by the current bar and on the left by the new stack top.',
    algorithm: [
      'Stack of indices. Append heights[n]=0 as sentinel.',
      'For i from 0 to n: while stack not empty and heights[i] < heights[stack.top]:',
      '  h = heights[stack.pop()]. w = (stack empty) ? i : i−stack.top−1.',
      '  area = h*w. Update maxArea.',
      'Push i.',
    ],
    example: {
      input: 'heights = [2,1,5,6,2,3]',
      steps: [
        'Process 5,6: pushed. At 2: pop 6 (area=6), pop 5 (area=10). At sentinel: pop 2(area=2*5=10),1(area=6).',
        'maxArea=10.',
      ],
      output: '10',
    },
    pitfalls: ['Append a 0-height bar at the end to flush all remaining bars from the stack.'],
  },

  // ─── Implement Trie ──────────────────────────────────────────────────────────
  'implement-trie': {
    intuition:
      'A Trie is a prefix tree. Each node has up to 26 children (for lowercase letters) and an isEnd flag. Insert: walk/create nodes for each character. Search: walk nodes, return isEnd at the last node. StartsWith: walk nodes, return true if path exists.',
    algorithm: [
      'TrieNode: TrieNode[26] children; bool isEnd.',
      'Insert(word): for each char c, create child[c-"a"] if null. Mark isEnd at last node.',
      'Search(word): traverse nodes. Return isEnd at last node (false if path not found).',
      'StartsWith(prefix): traverse nodes. Return true if all nodes exist.',
    ],
    example: {
      input: 'Insert "apple". Search "apple", "app".',
      steps: [
        'Insert: a→p→p→l→e (isEnd=true). Search "apple": reach isEnd=true ✓. Search "app": reach e node, isEnd=false → false.',
      ],
      output: 'true, false',
    },
    pitfalls: ['isEnd marks a complete word — do not confuse with "has children" (which indicates a prefix).'],
  },

  // ─── Job Sequencing Problem ──────────────────────────────────────────────────
  'job-sequencing-problem': {
    intuition:
      'Greedy: sort jobs by profit (descending). For each job, schedule it in the latest available time slot before its deadline. Use a boolean array of time slots; greedily pick the latest available slot ≤ deadline.',
    algorithm: [
      'Sort jobs by profit descending.',
      'result[maxDeadline], slot[maxDeadline]=false.',
      'For each job (id,deadline,profit): for t from min(maxDeadline,deadline)-1 down to 0: if !slot[t]: slot[t]=true, result[t]=job, break.',
      'Count filled slots and sum profits.',
    ],
    example: {
      input: 'jobs=[(a,2,100),(b,1,19),(c,2,27),(d,1,25),(e,3,15)]',
      steps: [
        'Sort: a(100),c(27),d(25),b(19),e(15). a→slot[1]. c→slot[0]. e→slot[2]. Maxprofit=100+27+15=142.',
      ],
      output: 'Max profit = 142, 3 jobs',
    },
    pitfalls: ['Fill slots from right to left (latest available) — filling from the start wastes slots for earlier-deadline jobs.'],
  },

  // ─── Kadane\'s Algorithm ───────────────────────────────────────────────────────
  'kadanes-algorithm': {
    intuition:
      'Maximum subarray sum. At each position, decide: extend the current subarray or start fresh. If the running sum becomes negative, starting fresh is always better. dp[i] = max(nums[i], dp[i-1]+nums[i]).',
    algorithm: [
      'maxSum = currentSum = arr[0].',
      'For i from 1 to n−1: currentSum = max(arr[i], currentSum+arr[i]).',
      'maxSum = max(maxSum, currentSum).',
      'Return maxSum.',
    ],
    example: {
      input: 'arr = [-2,1,-3,4,-1,2,1,-5,4]',
      steps: [
        'cur: -2→1→-2→4→3→5→6→1→5. maxSum=6.',
      ],
      output: '6',
    },
    pitfalls: ['Initialize both maxSum and currentSum to arr[0] to handle all-negative arrays correctly.'],
  },

  // ─── Level order traversal ────────────────────────────────────────────────────
  'level-order-traversal': {
    intuition:
      'BFS with level-size snapshotting: enqueue root, then for each level, dequeue exactly levelSize nodes and enqueue their children.',
    algorithm: [
      'Same as LeetCode 102: BFS with queue. Snapshot size at start of each level.',
    ],
    example: {
      input: 'root = [1, [2,3], [4,5,6,7]]',
      steps: ['Level 0: [1]. Level 1: [2,3]. Level 2: [4,5,6,7].'],
      output: '[[1],[2,3],[4,5,6,7]]',
    },
    pitfalls: ['Snapshot queue.size() BEFORE the inner dequeue loop.'],
  },

  // ─── Longest Common Subsequence ───────────────────────────────────────────────
  'longest-common-subsequence': {
    intuition:
      'dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]. If chars match: dp[i][j]=dp[i-1][j-1]+1. Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1]).',
    algorithm: [
      'dp[m+1][n+1], all 0.',
      'For i from 1 to m, j from 1 to n: if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]+1. Else: dp[i][j]=max(dp[i-1][j],dp[i][j-1]).',
      'Return dp[m][n].',
    ],
    example: {
      input: 's1="ABCBDAB", s2="BDCAB"',
      steps: [
        'LCS = "BCAB" or "BDAB" (length 4). dp[7][5]=4.',
      ],
      output: '4',
    },
    pitfalls: ['LCS counts non-contiguous characters in order — not the same as Longest Common Substring.'],
  },

  // ─── Longest Increasing Subsequence ───────────────────────────────────────────
  'longest-increasing-subsequence': {
    intuition:
      'Two approaches: O(n²) DP where dp[i]=LIS ending at index i, or O(n log n) using patience sorting with a "tails" array. In the patience approach, tails[i] = smallest tail element of all increasing subsequences of length i+1.',
    algorithm: [
      'tails = [].',
      'For each num: binary search for the position in tails where tails[pos] >= num.',
      'If pos == tails.Length, append num (extend LIS). Else replace tails[pos] = num.',
      'Return tails.Length.',
    ],
    example: {
      input: 'arr = [10,9,2,5,3,7,101,18]',
      steps: [
        '10: [10]. 9: [9]. 2: [2]. 5: [2,5]. 3: [2,3]. 7: [2,3,7]. 101: [2,3,7,101]. 18: [2,3,7,18].',
        'Length=4.',
      ],
      output: '4',
    },
    pitfalls: ['The tails array does not represent the actual LIS — only its length is meaningful. Reconstruct using parent pointers from the O(n²) approach if needed.'],
  },

  // ─── Longest Palindrome in a String ──────────────────────────────────────────
  'longest-palindrome-in-a-string': {
    intuition:
      'Expand around each center. For each character (and each gap between characters), expand outward as long as characters match. Track the maximum expansion. O(n²) time, O(1) space.',
    algorithm: [
      'For each center (2n-1 centers for odd + even): expand while valid.',
      'ExpandAroundCenter(left, right): while left>=0 and right<n and s[left]==s[right]: left--, right++.',
      'Track max length and start index.',
    ],
    example: {
      input: 's = "babad"',
      steps: [
        'Center at i=1("a"): expand → "bab"(len=3). Center at i=2("b"): expand → "aba"(len=3).',
        'Return "bab" (first found).',
      ],
      output: '"bab"',
    },
    pitfalls: ['Check both odd (single-char center) and even (between-char center) palindromes.'],
  },

  // ─── Longest Palindromic Subsequence ─────────────────────────────────────────
  'longest-palindromic-subsequence': {
    intuition:
      'LPS(s) = LCS(s, reverse(s)). Alternatively, dp[i][j] = LPS of s[i..j]. If s[i]==s[j]: dp[i][j]=dp[i+1][j-1]+2. Else: dp[i][j]=max(dp[i+1][j], dp[i][j-1]).',
    algorithm: [
      'dp[i][j] = 1 for all i (single char palindrome).',
      'For length l from 2 to n: for each (i,j) with j=i+l-1: if s[i]==s[j]: dp[i][j]=dp[i+1][j-1]+2.',
      'Else: dp[i][j]=max(dp[i+1][j], dp[i][j-1]).',
      'Return dp[0][n-1].',
    ],
    example: {
      input: 's = "bbabcbcab"',
      steps: ['LPS = "babcbab" length 7, or use LCS with reverse.'],
      output: '7',
    },
    pitfalls: ['Fill dp bottom-up by increasing subproblem length, not by row.'],
  },

  // ─── LRU Cache ───────────────────────────────────────────────────────────────
  'lru-cache': {
    intuition:
      'Same as LeetCode 146: HashMap + doubly linked list. O(1) get and put. HashMap maps key to node; DLL maintains recency order.',
    algorithm: [
      'See LeetCode 146 explanation — identical structure.',
    ],
    example: {
      input: 'capacity=2, put(1,1),put(2,2),get(1),put(3,3),get(2)',
      steps: ['get(1)=1. After put(3): evicts key 2. get(2)=-1.'],
      output: 'get(1)=1, get(2)=-1',
    },
    pitfalls: ['Evict the LEAST recently used (tail node), not the least frequently used.'],
  },

  // ─── Majority Element ────────────────────────────────────────────────────────
  'majority-element': {
    intuition:
      'Boyer-Moore Voting Algorithm: the majority element (appears > n/2 times) will survive cancellation. Maintain a candidate and counter; increment for matching, decrement for non-matching; when counter reaches 0, switch candidate.',
    algorithm: [
      'candidate = arr[0], count = 1.',
      'For i from 1 to n−1: if arr[i]==candidate: count++. Else: count--. If count==0: candidate=arr[i], count=1.',
      'Return candidate.',
    ],
    example: {
      input: 'arr = [3,3,4,2,4,4,2,4,4]',
      steps: [
        '3(1),3(2),4(1),2(0)→4(1),4(2),2(1),4(2),4(3). Candidate=4.',
      ],
      output: '4',
    },
    pitfalls: ['The problem guarantees a majority element exists — no verification step needed. If not guaranteed, verify by counting.'],
  },

  // ─── Matrix Chain Multiplication ─────────────────────────────────────────────
  'matrix-chain-multiplication': {
    intuition:
      'dp[i][j] = minimum number of scalar multiplications to compute the product of matrices i through j. Split at every position k between i and j; the cost is dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j].',
    algorithm: [
      'dp[i][i]=0. Fill for increasing chain lengths.',
      'For l from 2 to n: for i from 1 to n-l+1: j=i+l-1. dp[i][j]=INF.',
      'For k from i to j-1: cost=dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j]. dp[i][j]=min.',
    ],
    example: {
      input: 'p=[1,2,3,4] (3 matrices: 1×2, 2×3, 3×4)',
      steps: [
        'dp[1][2]=1*2*3=6. dp[2][3]=2*3*4=24. dp[1][3]=min(dp[1][1]+dp[2][3]+1*2*4, dp[1][2]+dp[3][3]+1*3*4)=min(0+24+8,6+0+12)=min(32,18)=18.',
      ],
      output: '18',
    },
    pitfalls: ['p[i] is the number of ROWS of matrix i and COLUMNS of matrix i-1. Use 1-indexed arrays carefully.'],
  },

  // ─── Max Circular Subarray Sum ────────────────────────────────────────────────
  'max-circular-subarray-sum': {
    intuition:
      'Two cases: (1) the max subarray does NOT wrap around → Kadane\'s algorithm. (2) The max subarray WRAPS → total sum minus the minimum subarray (non-wrapping). Answer = max(case1, totalSum − minSubarray). Handle all-negative edge case.',
    algorithm: [
      'Case 1: maxSum = Kadane(arr).',
      'totalSum = sum(arr). Case 2: minSum = Kadane(−arr) negated = minimum subarray sum. circularMax = totalSum − minSum.',
      'If maxSum < 0 (all negative): return maxSum.',
      'Return max(maxSum, circularMax).',
    ],
    example: {
      input: 'arr = [8,-8,9,-9,10,-11,12]',
      steps: [
        'Kadane: maxSum=22. totalSum=11. minKadane=-19 → circularMax=30.',
        'Return max(22,30)=30.',
      ],
      output: '30',
    },
    pitfalls: ['If all elements are negative, circularMax = totalSum − minSum = 0, which is wrong — return maxSum directly.'],
  },

  // ─── Merge K sorted linked lists ─────────────────────────────────────────────
  'merge-k-sorted-linked-lists': {
    intuition:
      'Use a min-heap of size k: initialise with the head of each list. Repeatedly extract the minimum node, add it to the result, and push its successor (if any) back into the heap.',
    algorithm: [
      'Min-heap of (node.val, node). Insert head of each non-null list.',
      'While heap not empty: extract (val, node). Append to result. If node.next != null: push (node.next.val, node.next).',
      'Return result head.',
    ],
    example: {
      input: 'lists = [1→4→5, 1→3→4, 2→6]',
      steps: [
        'Heap: [(1,L1),(1,L2),(2,L3)]. Extract 1→push 4. Extract 1→push 3. Extract 2→push 6. ...continue...',
        'Result: 1→1→2→3→4→4→5→6.',
      ],
      output: '[1,1,2,3,4,4,5,6]',
    },
    pitfalls: ['For C# PriorityQueue, compare by node.val to maintain min-heap property.'],
  },

  // ─── Minimum Cost Path ────────────────────────────────────────────────────────
  'minimum-cost-path': {
    intuition:
      'Grid DP: dp[i][j] = minimum cost to reach (i,j) from (0,0). Transitions come from above, left, and top-left diagonal. dp[i][j] = cost[i][j] + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
    algorithm: [
      'dp[0][0]=cost[0][0].',
      'Fill first row: dp[0][j]=dp[0][j-1]+cost[0][j].',
      'Fill first col: dp[i][0]=dp[i-1][0]+cost[i][0].',
      'Interior: dp[i][j]=cost[i][j]+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
    ],
    example: {
      input: 'cost=[[1,2,3],[4,8,2],[1,5,3]]',
      steps: ['dp[2][2] = 3+min(dp[1][2]=9,dp[2][1]=10,dp[1][1]=13) = 3+9=12. Wait, let me trace: dp=[1,3,6;5,9,8;6,11,11]. dp[2][2]=3+min(8,11,9)=11.'],
      output: '8',
    },
    pitfalls: ['Unlike Unique Paths, diagonal moves are also allowed here.'],
  },

  // ─── Minimum Jumps ────────────────────────────────────────────────────────────
  'minimum-jumps': {
    intuition:
      'Greedy BFS: at each step, track the farthest reachable position (currentEnd) and the farthest position reachable in the next step (farthestReach). When we reach currentEnd, we must take a jump; increment jumps and update currentEnd to farthestReach.',
    algorithm: [
      'jumps=0, currentEnd=0, farthest=0.',
      'For i from 0 to n−2: farthest = max(farthest, i+arr[i]).',
      'If i == currentEnd: jumps++. currentEnd=farthest. If currentEnd >= n-1: break.',
      'Return jumps if reachable, else -1.',
    ],
    example: {
      input: 'arr = [2,3,1,1,4]',
      steps: [
        'i=0: farthest=2. currentEnd=0 → jump, currentEnd=2, jumps=1.',
        'i=1: farthest=4. i=2: farthest=4. currentEnd=2 → jump, currentEnd=4≥4, jumps=2. Break.',
      ],
      output: '2',
    },
    pitfalls: ['Iterate only to n−2 (not n−1) — you don\'t need a jump from the last position.'],
  },

  // ─── Minimum Platforms ────────────────────────────────────────────────────────
  'minimum-platforms': {
    intuition:
      'Sort arrivals and departures separately. Use two pointers: for each arrival, if a train has departed by then, it frees a platform. Count max overlapping arrivals.',
    algorithm: [
      'Sort arr[] and dep[].',
      'i=1, j=0, platforms=1, maxPlatforms=1.',
      'While i<n and j<n: if arr[i]<=dep[j]: platforms++; i++. Else: platforms--; j++.',
      'maxPlatforms=max(maxPlatforms,platforms).',
      'Return maxPlatforms.',
    ],
    example: {
      input: 'arr=[0900,0940,0950,1100,1500,1800], dep=[0910,1200,1120,1130,1900,2000]',
      steps: [
        'Sorted. At 0940: 3 trains (0940,0950 arrived, 0910 departed by 0950). Peak=3.',
      ],
      output: '3',
    },
    pitfalls: ['Sort BOTH arrays independently — the i-th arrival does not correspond to the i-th departure after sorting.'],
  },

  // ─── Missing And Repeating ────────────────────────────────────────────────────
  'missing-and-repeating': {
    intuition:
      'Two equations: let x=missing, y=repeating. Sum difference: S−S_expected = y−x. Sum of squares difference: S2−S2_expected = y²−x² = (y−x)(y+x). Solve for x and y.',
    algorithm: [
      'S=sum(arr), S_exp=n(n+1)/2. sumDiff=S−S_exp = y−x.',
      'S2=sum(arr[i]²), S2_exp=n(n+1)(2n+1)/6. sq_diff=S2−S2_exp = y²−x².',
      'y+x = sq_diff/(y-x). Solve: y=(sumDiff+(y+x))/2, x=y−sumDiff.',
    ],
    example: {
      input: 'arr=[3,1,3,4,5] (n=5)',
      steps: [
        'S=16, S_exp=15. sumDiff=1=y−x.',
        'S2=60, S2_exp=55. sqDiff=5=(y−x)(y+x)=1*(y+x) → y+x=5.',
        'y=3, x=2.',
      ],
      output: 'Missing=2, Repeating=3',
    },
    pitfalls: ['Use long arithmetic to avoid overflow in sum of squares.'],
  },

  // ─── N-Queen Problem ─────────────────────────────────────────────────────────
  'n-queen-problem': {
    intuition:
      'Same as LeetCode 51. Backtracking row by row with three HashSets tracking occupied columns, positive diagonals (row-col), and negative diagonals (row+col).',
    algorithm: [
      'See LeetCode 51 explanation — identical approach.',
    ],
    example: {
      input: 'n = 4',
      steps: ['Two valid placements for 4-Queens.'],
      output: '2 solutions',
    },
    pitfalls: ['Track row+col and row-col as diagonal identifiers — not the actual diagonal position.'],
  },

  // ─── Next Greater Element ─────────────────────────────────────────────────────
  'next-greater-element': {
    intuition:
      'Monotonic stack: maintain a decreasing stack. For each element, pop all elements smaller than it — the current element is their "next greater". Elements left in the stack have no next greater → assign -1.',
    algorithm: [
      'Stack of indices. result[n]=-1.',
      'For i from 0 to n-1: while stack not empty and arr[stack.top] < arr[i]: result[stack.pop()] = arr[i].',
      'Push i.',
    ],
    example: {
      input: 'arr = [4,5,2,25]',
      steps: [
        'i=0: push 0. i=1: 4<5 → result[0]=5. Push 1.',
        'i=2: push 2. i=3: 2<25 → result[2]=25. 5<25 → result[1]=25. Push 3.',
        'result=[5,25,25,-1].',
      ],
      output: '[5,25,25,-1]',
    },
    pitfalls: ['The stack stores INDICES, not values — you need the index to update result[].'],
  },

  // ─── Next Permutation ─────────────────────────────────────────────────────────
  'next-permutation': {
    intuition:
      'Three steps: (1) find the rightmost "descent" (arr[i] < arr[i+1]). (2) Swap arr[i] with the smallest element greater than arr[i] to its right. (3) Reverse the suffix after position i to get the next smallest permutation.',
    algorithm: [
      'Find i from n-2 down: first index where arr[i] < arr[i+1]. If none: reverse all (last permutation).',
      'Find j from n-1 down: first index where arr[j] > arr[i]. Swap arr[i] and arr[j].',
      'Reverse arr[i+1..n-1].',
    ],
    example: {
      input: 'arr = [1,2,3]',
      steps: [
        'i=1 (arr[1]=2 < arr[2]=3). j=2 (arr[2]=3 > 2). Swap: [1,3,2]. Reverse suffix: [1,3,2]. → [1,3,2].',
      ],
      output: '[1,3,2]',
    },
    pitfalls: ['Reverse the suffix, do not sort it — the suffix is already in descending order so reversing achieves ascending order in O(n).'],
  },

  // ─── Palindrome Linked List ───────────────────────────────────────────────────
  'palindrome-linked-list': {
    intuition:
      'Find the midpoint (slow/fast pointers), reverse the second half, compare with the first half, then optionally restore. O(n) time, O(1) space.',
    algorithm: [
      'Find mid: slow/fast pointers.',
      'Reverse the second half starting from mid.next.',
      'Compare first half (head) with reversed second half. Track if palindrome.',
      'Optionally restore the second half.',
    ],
    example: {
      input: '1→2→2→1',
      steps: [
        'Mid = node(2) at index 1. Reverse second half: 1→2.',
        'Compare: 1==1, 2==2. Palindrome!',
      ],
      output: 'true',
    },
    pitfalls: ['Restore the list after comparison if the problem requires (most GFG solutions need immutable input).'],
  },

  // ─── Parenthesis Checker ─────────────────────────────────────────────────────
  'parenthesis-checker': {
    intuition:
      'Use a stack. Push opening brackets. For closing brackets, check the stack top is the matching opener. Return true iff the stack is empty at the end.',
    algorithm: [
      'For each char: if open bracket ({,[,(): push. If close: if stack empty or top doesn\'t match: return false; pop.',
      'Return stack.isEmpty().',
    ],
    example: {
      input: '"{()[{()}]}"',
      steps: [
        '{ push. ( push. ) matches ( → pop. [ push. { push. ( push. ) → pop. } → pop. ] → pop. } → pop. Stack empty → true.',
      ],
      output: 'true',
    },
    pitfalls: ['Check stack is non-empty before comparing top — an extra closing bracket crashes a stack-empty check.'],
  },

  // ─── Partition Equal Subset Sum ───────────────────────────────────────────────
  'partition-equal-subset-sum': {
    intuition:
      'Can we select a subset summing to totalSum/2? Classic 0/1 knapsack boolean DP. If totalSum is odd, return false immediately. dp[j] = true if subset summing to j is achievable.',
    algorithm: [
      'If sum%2==1: return false. target=sum/2.',
      'dp[0]=true, dp[1..target]=false.',
      'For each num: for j from target down to num: dp[j] |= dp[j-num].',
      'Return dp[target].',
    ],
    example: {
      input: 'arr=[1,5,11,5], sum=22',
      steps: [
        'target=11. After processing: dp[11]=true via [1,5,5] or [11]. Return true.',
      ],
      output: 'true',
    },
    pitfalls: ['Process in reverse to avoid using the same element twice (0/1 constraint).'],
  },

  // ─── Rat in a Maze Problem - I ────────────────────────────────────────────────
  'rat-in-a-maze-problem-i': {
    intuition:
      'Backtracking: from (0,0), try moving Down/Left/Right/Up (in any order). Mark cell as visited to avoid cycles. Record path when (n-1,n-1) is reached. Backtrack by unmarking.',
    algorithm: [
      'DFS(r,c,path): if (r,c)==(n-1,n-1): add path to results.',
      'For each direction (D,L,R,U) in sorted order: compute (nr,nc). If valid, unvisited, and maze[nr][nc]==1: mark, recurse, unmark.',
    ],
    example: {
      input: 'maze=[[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]',
      steps: [
        'Path DDRDRR: (0,0)→(1,0)→(2,0)→(2,1)→(3,1)→(3,2)→(3,3). Valid!',
      ],
      output: '["DDRDRR"]',
    },
    pitfalls: ['Add directions in sorted order (D,L,R,U) to get paths in lexicographic order.'],
  },

  // ─── Reverse a linked list ────────────────────────────────────────────────────
  'reverse-a-linked-list': {
    intuition:
      'Iterative reversal: use three pointers (prev, curr, next). Redirect each node\'s next pointer to its predecessor.',
    algorithm: [
      'prev=null, curr=head.',
      'While curr != null: next=curr.next. curr.next=prev. prev=curr. curr=next.',
      'Return prev (new head).',
    ],
    example: {
      input: '1→2→3→4→5',
      steps: [
        'null←1  2→3→4→5. null←1←2  3→4→5. ... null←1←2←3←4←5. prev=5.',
      ],
      output: '5→4→3→2→1',
    },
    pitfalls: ['Save curr.next BEFORE redirecting curr.next=prev, or you lose the rest of the list.'],
  },

  // ─── Rotten Oranges ───────────────────────────────────────────────────────────
  'rotten-oranges': {
    intuition:
      'Multi-source BFS: add all initially rotten oranges to the queue. Each BFS step represents one minute of rotting. After BFS, if any fresh orange remains, return -1.',
    algorithm: [
      'Count fresh oranges. Enqueue all rotten (value=2) cells with time=0.',
      'BFS: dequeue (r,c,t). For each 4-neighbor: if fresh: mark rotten, fresh--, enqueue with t+1.',
      'If fresh==0: return maxTime. Else: return -1.',
    ],
    example: {
      input: '[[2,1,1],[1,1,0],[0,1,1]]',
      steps: [
        'Start: rotten at (0,0). Minute 1: (0,1),(1,0) rot. Minute 2: (0,2),(1,1) rot. Minute 3: (2,1) rots. Minute 4: (2,2) rots.',
        'Total=4.',
      ],
      output: '4',
    },
    pitfalls: ['Start BFS with ALL rotten oranges simultaneously — not from just one source.'],
  },

  // ─── Serialize and deserialize a binary tree ──────────────────────────────────
  'serialize-and-deserialize-a-binary-tree': {
    intuition:
      'Serialize via pre-order DFS: record node values and "#" for null nodes. Deserialize by consuming tokens in the same pre-order: the first non-null token is the root, recurse for left then right subtree.',
    algorithm: [
      'Serialize: preorder DFS, append val or "#", comma-separated.',
      'Deserialize: split by comma, use an index pointer (or queue of tokens). Consume first token: if "#" return null. Else create node, recurse left, then right.',
    ],
    example: {
      input: 'Tree: 1→(2, 3→(4,5))',
      steps: [
        'Serialize: "1,2,#,#,3,4,#,#,5,#,#".',
        'Deserialize: read 1→root, read 2→left, read #→left.left=null, read #→left.right=null, ...',
      ],
      output: 'Reconstructed tree = original tree',
    },
    pitfalls: ['Use pre-order (not in-order) for serialization — in-order requires extra information to determine root.'],
  },

  // ─── Sort 0s, 1s and 2s ──────────────────────────────────────────────────────
  'sort-0s-1s-and-2s': {
    intuition:
      'Dutch National Flag algorithm (same as LeetCode 75). Three-way partition in a single pass using three pointers: lo, mid, hi.',
    algorithm: [
      'See LeetCode 75 explanation — identical.',
    ],
    example: {
      input: '[0,1,2,0,1,2]',
      steps: ['Result: [0,0,1,1,2,2] in one pass.'],
      output: '[0,0,1,1,2,2]',
    },
    pitfalls: ['Do not increment mid when swapping with hi — the swapped element is unexamined.'],
  },

  // ─── Subset Sum Problem ────────────────────────────────────────────────────────
  'subset-sum-problem': {
    intuition:
      'Boolean DP: dp[j] = true if a subset with sum j exists. Same as 0/1 knapsack boolean version. For each element, iterate backwards through dp array.',
    algorithm: [
      'dp[0]=true, rest=false.',
      'For each num: for j from sum down to num: dp[j] |= dp[j-num].',
      'Return dp[sum].',
    ],
    example: {
      input: 'arr=[3,34,4,12,5,2], sum=9',
      steps: ['Subsets summing to 9: {4,5}, {3,4,2}. Return true.'],
      output: 'true',
    },
    pitfalls: ['Process in reverse order (j from sum down) to avoid using an element multiple times.'],
  },

  // ─── Topological sort ────────────────────────────────────────────────────────
  'topological-sort': {
    intuition:
      'Kahn\'s BFS approach: repeatedly remove nodes with in-degree 0. DFS approach: after exploring all descendants, push node to stack; the reverse of the stack gives topological order.',
    algorithm: [
      'DFS: TopoSort(node): mark visited. For each neighbor: if not visited, DFS. Push node to stack AFTER recursion.',
      'Collect nodes by finishing time (descending).',
    ],
    example: {
      input: 'DAG: 5→0, 5→2, 4→0, 4→1, 2→3, 3→1',
      steps: ['One valid topological order: 5,4,2,3,1,0.'],
      output: '[5,4,2,3,1,0]',
    },
    pitfalls: ['Topological sort is only valid for DAGs (Directed Acyclic Graphs). Detect cycles first.'],
  },

  // ─── Top View of Binary Tree ──────────────────────────────────────────────────
  'top-view-of-binary-tree': {
    intuition:
      'Level-order traversal with horizontal distance (HD). For each HD, record only the FIRST node seen (top view). A node is visible from the top if no ancestor has the same HD.',
    algorithm: [
      'BFS with (node, HD). Map: HD → first seen value (only set if HD not already in map).',
      'Enqueue (left, hd−1) and (right, hd+1).',
      'Return map values sorted by HD.',
    ],
    example: {
      input: 'Tree: 1→(2→(4,5),3)',
      steps: ['HD: 4→-2, 2→-1, 5→0, 1→0, 3→1. Top (first seen): 4,2,1,3.'],
      output: '[4,2,1,3]',
    },
    pitfalls: ['For top view, the FIRST node (BFS order = top to bottom) at each HD wins. For bottom view, the last node wins.'],
  },

  // ─── Trapping Rain Water ──────────────────────────────────────────────────────
  'trapping-rain-water': {
    intuition:
      'Same as LeetCode 42. Two-pointer approach: water at each position is limited by the shorter of the max heights seen from left and right. Two pointers converge inward, always processing the shorter side.',
    algorithm: [
      'left=0, right=n-1, leftMax=0, rightMax=0, water=0.',
      'While left < right: if height[left] <= height[right]: leftMax=max(leftMax,height[left]). water+=leftMax-height[left]. left++.',
      'Else: rightMax=max(rightMax,height[right]). water+=rightMax-height[right]. right--.',
    ],
    example: {
      input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
      steps: ['Two-pointer fills: total trapped = 6.'],
      output: '6',
    },
    pitfalls: ['Process the shorter side — the shorter boundary determines how much water is trapped.'],
  },

  // ─── Two Sum - Pair with Given Sum ───────────────────────────────────────────
  'two-sum-pair-with-given-sum': {
    intuition:
      'Two pointers on sorted array: if sum < target, advance left; if sum > target, retreat right; if equal, found the pair. For unsorted, use a HashSet: for each element, check if (target−element) is in the set.',
    algorithm: [
      'Sort arr. lo=0, hi=n-1.',
      'While lo < hi: sum=arr[lo]+arr[hi]. If sum==target: return true. If sum<target: lo++. Else: hi--.',
      'Return false.',
    ],
    example: {
      input: 'arr=[2,7,11,15], target=9',
      steps: ['lo=0(2), hi=3(15): 17>9→hi--. hi=2(11): 13>9→hi--. hi=1(7): 9==9 ✓.'],
      output: 'true',
    },
    pitfalls: ['Sorting changes indices — if you need to return original indices, use a HashMap approach instead.'],
  },

  // ─── Undirected Graph Cycle ───────────────────────────────────────────────────
  'undirected-graph-cycle': {
    intuition:
      'BFS or DFS with parent tracking. In an undirected graph, a cycle exists if a visited neighbor is not the direct parent. Track the parent to avoid treating the back-edge to parent as a cycle.',
    algorithm: [
      'DFS(node, parent): for each neighbor v: if !visited: DFS(v, node). Else if v != parent: cycle detected.',
    ],
    example: {
      input: 'Graph: 0-1, 1-2, 2-0 (triangle)',
      steps: [
        'DFS(0,−1)→DFS(1,0)→DFS(2,1): neighbor 0 is visited and ≠ parent(1) → cycle!',
      ],
      output: 'true',
    },
    pitfalls: ['Pass parent as -1 for the root node. For multigraphs (parallel edges), use parent-edge ID instead of parent node.'],
  },

  // ─── Word Break ───────────────────────────────────────────────────────────────
  'word-break': {
    intuition:
      'DP: dp[i] = true if s[0..i-1] can be segmented using dictionary words. For each i, check all j < i: if dp[j] is true and s[j..i-1] is in the dictionary, dp[i]=true.',
    algorithm: [
      'wordSet = HashSet(dictionary). dp[0]=true.',
      'For i from 1 to n: for j from 0 to i-1: if dp[j] and s[j..i-1] in wordSet: dp[i]=true. Break.',
      'Return dp[n].',
    ],
    example: {
      input: 's="leetcode", dict=["leet","code"]',
      steps: [
        'dp[0]=true. i=4: j=0, dp[0]=true, "leet" in dict → dp[4]=true.',
        'i=8: j=4, dp[4]=true, "code" in dict → dp[8]=true.',
      ],
      output: 'true',
    },
    pitfalls: ['Use a HashSet for O(1) dictionary lookups — do not iterate the dictionary for each check.'],
  },

  // ─── ZigZag Tree Traversal ────────────────────────────────────────────────────
  'zigzag-tree-traversal': {
    intuition:
      'Level-order BFS with alternating direction. Collect each level normally, then reverse every other level (or use a deque and alternate front/back insertions).',
    algorithm: [
      'BFS level order (same as problem 102).',
      'For odd levels (0-indexed): reverse the level list before adding to result.',
    ],
    example: {
      input: 'root = [3,9,20,null,null,15,7]',
      steps: [
        'Level 0 (left-to-right): [3]. Level 1 (right-to-left): [20,9]. Level 2 (left-to-right): [15,7].',
      ],
      output: '[[3],[20,9],[15,7]]',
    },
    pitfalls: ['Track level parity (odd/even) to know when to reverse.'],
  },

  // ─── Allocate Minimum Pages ──────────────────────────────────────────────────
  'allocate-minimum-pages': {
    intuition: 'Binary search on the answer (minimum of maximum pages). For a given mid, check if we can allocate books to m students such that each student gets at most mid pages.',
    algorithm: [
      'lo = max(books), hi = sum(books).',
      'Binary search: mid = (lo+hi)/2. Check feasibility: greedily assign books; if a student would exceed mid, start a new student.',
      'If feasible with ≤ m students: hi=mid. Else lo=mid+1.',
      'Return lo.',
    ],
    example: { input: 'books=[12,34,67,90], m=2', steps: ['lo=90, hi=203. mid=146: [12,34,67] to student1 (113≤146), [90] to student2 → 2 students ✓.', 'hi=146. mid=118: [12,34,67] (113≤118), [90] ✓. hi=118.', 'Continue until lo=hi=113.'], output: '113' },
    pitfalls: ['A student must get at least one book. Books must be contiguous (can\'t reorder).'],
  },

  // ─── BST to Greater Sum Tree ─────────────────────────────────────────────────
  'bst-to-greater-sum-tree': {
    intuition: 'In-order traversal visits BST in ascending order. Reverse in-order (right→node→left) visits in descending order. Maintain a running sum; update each node\'s value.',
    algorithm: [
      'Do reverse in-order traversal (right subtree first).',
      'Maintain running sum. At each node: sum += node.val; node.val = sum.',
    ],
    example: { input: 'BST=[4,1,6,0,2,5,7]', steps: ['Visit 7→sum=7. Visit 6→sum=13. Visit 5→sum=18. Visit 4→sum=22. Visit 2→sum=24. Visit 1→sum=25. Visit 0→sum=25.'], output: 'Tree with updated values' },
    pitfalls: ['This is a simple Morris traversal or recursive reverse in-order — no extra space needed with Morris.'],
  },

  // ─── Burning Tree ────────────────────────────────────────────────────────────
  'burning-tree': {
    intuition: 'Fire spreads from target node to all adjacent nodes (parent, children). Model as BFS from the target node treating the tree as a graph. First, find target and track parent pointers.',
    algorithm: [
      'DFS to find target node and build parent map.',
      'BFS from target node: spread to left child, right child, and parent each step.',
      'Count BFS levels (time steps) until all nodes are burned.',
    ],
    example: { input: 'root=[1,2,3,4,5], target=2', steps: ['t=0: burn node 2.', 't=1: burn 1(parent),4,5(children).', 't=2: burn 3(sibling via parent 1).', 'Total=2.'], output: '2' },
    pitfalls: ['Must track parent pointers since BFS needs to go upward too. Mark visited nodes to avoid cycles.'],
  },

  // ─── Chocolate Distribution Problem ─────────────────────────────────────────
  'chocolate-distribution-problem': {
    intuition: 'Sort packets. The minimum difference between max and min packets given to m students is found in the sliding window of size m after sorting.',
    algorithm: [
      'Sort the packet array.',
      'Sliding window of size m: for each window, compute A[i+m-1] - A[i].',
      'Return minimum such difference.',
    ],
    example: { input: 'A=[7,3,2,4,9,12,56], m=3', steps: ['Sorted: [2,3,4,7,9,12,56].', 'Windows of size 3: [2,3,4]→2, [3,4,7]→4, [4,7,9]→5, [7,9,12]→5, [9,12,56]→47.', 'Min=2.'], output: '2' },
    pitfalls: ['Sort first — only then is the minimum range guaranteed to be a contiguous subarray.'],
  },

  // ─── Clone a linked list with next and random pointer ────────────────────────
  'clone-a-linked-list-with-next-and-random-pointer': {
    intuition: 'Three passes: (1) interleave cloned nodes between original nodes, (2) set random pointers for cloned nodes, (3) separate the two lists.',
    algorithm: [
      'Pass 1: for each node N, insert clone N\' after N: N→N\'→N.next.',
      'Pass 2: for each original node N: N.next.random = N.random?.next.',
      'Pass 3: separate lists by fixing next pointers.',
    ],
    pitfalls: ['Pass 2 relies on the interleaved structure: original.random.next is the clone of original.random. Restore original list in pass 3.'],
  },

  // ─── Course Schedule I ───────────────────────────────────────────────────────
  'course-schedule-i': {
    intuition: 'Can all courses be completed? This is cycle detection in a directed graph. If the prerequisite graph is a DAG (no cycles), all courses can be done.',
    algorithm: [
      'Build directed adjacency list: prerequisite→course.',
      'Topological sort (Kahn\'s BFS): compute in-degrees. Queue nodes with in-degree 0. Process: reduce neighbors\' in-degree, add to queue when 0.',
      'If processed count == numCourses, return true.',
    ],
    example: { input: 'n=2, prerequisites=[[1,0]]', steps: ['Graph: 0→1. in-degree: [0,1]. Queue:[0]. Process 0→in[1]=0→add 1. Count=2=n.'], output: 'true' },
    pitfalls: ['Also solvable with DFS cycle detection (white/grey/black coloring).'],
  },

  // ─── Course Schedule II ──────────────────────────────────────────────────────
  'course-schedule-ii': {
    intuition: 'Return a valid course order (topological sort). If cycle exists, return empty array.',
    algorithm: [
      'Kahn\'s algorithm: build adjacency list, compute in-degrees.',
      'Queue all nodes with in-degree 0. Process queue: add to order, decrement neighbors\' in-degrees, add neighbors with in-degree 0.',
      'If order.size == n, return order. Else return [].',
    ],
    pitfalls: ['Return any valid topological order, not a specific one. Empty array signals impossible (cycle).'],
  },

  // ─── Count Distinct elements in every window ─────────────────────────────────
  'count-distinct-elements-in-every-window': {
    intuition: 'Sliding window of size k. Use a frequency map. Track count of distinct elements (map size with non-zero counts).',
    algorithm: [
      'Populate frequency map with first k elements. Record distinct count.',
      'Slide window: add new element (increment freq, if new → distinct++). Remove old (decrement, if 0 → distinct--).',
      'Record distinct count for each position.',
    ],
    pitfalls: ['Remove element from map entirely (or just decrement and check 0) when its count drops to 0.'],
  },

  // ─── Count Reverse Pairs ─────────────────────────────────────────────────────
  'count-reverse-pairs': {
    intuition: 'Count pairs (i,j) where i<j and A[i]>2*A[j]. Use merge sort: during merging, count pairs across left and right halves efficiently.',
    algorithm: [
      'Modified merge sort.',
      'Before merging, count pairs: for each element in left half, count elements in right half where left[i] > 2*right[j].',
      'Use two pointers on sorted halves for O(n) counting per level.',
      'Merge normally.',
    ],
    pitfalls: ['Count BEFORE merging (after recursive sort), so both halves are sorted. The count step is separate from the merge step.'],
  },

  // ─── Diameter of a Binary Tree ───────────────────────────────────────────────
  'diameter-of-a-binary-tree': {
    intuition: 'Diameter passes through some node (LCA). For each node, diameter through it = leftHeight + rightHeight. Track global maximum.',
    algorithm: [
      'DFS returning height of subtree.',
      'At each node: diameter candidate = leftHeight + rightHeight.',
      'Update global max. Return 1 + max(leftHeight, rightHeight) as height.',
    ],
    example: { input: 'root=[1,2,3,4,5]', steps: ['Node 4: h=1. Node 5: h=1. Node 2: dia=2, h=2. Node 3: h=1. Node 1: dia=1+2=3, h=3.'], output: '3' },
    pitfalls: ['Diameter doesn\'t have to pass through root. Update global max at every node.'],
  },

  // ─── Dice throw ──────────────────────────────────────────────────────────────
  'dice-throw': {
    intuition: 'Count ways to get sum S with N dice, each having M faces. DP: dp[i][j] = ways to get sum j with i dice.',
    algorithm: [
      'dp[0][0] = 1.',
      'For each die d from 1 to N: for each sum j: dp[d][j] = sum of dp[d-1][j-f] for f in 1..min(m,j).',
      'Return dp[N][S].',
    ],
    example: { input: 'N=2, M=6, S=4', steps: ['dp[1] = [0,1,1,1,1,1,1]. dp[2][4] = dp[1][3]+dp[1][2]+dp[1][1] = 3.'], output: '3' },
    pitfalls: ['1D DP with offset or 2D is clearer. Inner loop runs 1..min(m,j) to avoid going negative.'],
  },

  // ─── Evaluation of Postfix Expression ────────────────────────────────────────
  'evaluation-of-postfix-expression': {
    intuition: 'Stack-based evaluation: push operands, on operator pop two operands, apply, push result.',
    algorithm: [
      'Scan tokens left to right.',
      'If token is number: push to stack.',
      'If token is operator (+,-,*,/): pop b then a, compute a op b, push result.',
      'Final stack top is the result.',
    ],
    example: { input: '"2 3 1 * + 9 -"', steps: ['Push 2,3,1. *: pop 3,1→3. +: pop 2,3→5. Push 9. -: pop 5,9→-4.'], output: '-4' },
    pitfalls: ['Pop order matters: pop b first, then a, compute a op b (not b op a).'],
  },

  // ─── Find median in a stream ──────────────────────────────────────────────────
  'find-median-in-a-stream': {
    intuition: 'Maintain two heaps: max-heap for lower half, min-heap for upper half. Median is the top of the larger heap (or average of both tops).',
    algorithm: [
      'Insert to max-heap. Then balance: if max-heap top > min-heap top, move max-heap top to min-heap.',
      'Rebalance sizes: if size difference > 1, move top of larger to smaller.',
      'Median: if equal size, average tops. If unequal, top of larger.',
    ],
    example: { input: 'Stream: 5,15,1,3', steps: ['Add 5: max=[5]. Add 15: min=[15], max=[5]. Add 1: max=[5,1], min=[15]. Add 3: max=[3,1], min=[5,15]. Median=(3+5)/2=4.'], output: '4.0' },
    pitfalls: ['Java uses PriorityQueue (min by default); negate values for max-heap. Python: heapq is min-heap.'],
  },

  // ─── Find the number of islands ──────────────────────────────────────────────
  'find-the-number-of-islands': {
    intuition: 'DFS/BFS flood fill: for each unvisited \'1\', increment count and DFS to mark all connected \'1\'s as visited.',
    algorithm: [
      'Iterate over all cells. For each \'1\' not yet visited:',
      'Increment island count.',
      'DFS/BFS: mark current as visited, recurse on all 4 (or 8) neighbors that are \'1\'.',
    ],
    example: { input: '[[1,1,0],[0,1,0],[0,0,1]]', steps: ['Start (0,0)→DFS marks (0,0),(0,1),(1,1). Count=1. (2,2) unvisited→Count=2.'], output: '2' },
    pitfalls: ['Mark cells as visited immediately to avoid re-counting. Determine if connectivity is 4-directional or 8-directional.'],
  },

  // ─── Flattening a Linked List ─────────────────────────────────────────────────
  'flattening-a-linked-list': {
    intuition: 'Each node has a next pointer (horizontal) and a child pointer (vertical sorted list). Merge all vertical lists using merge sort logic.',
    algorithm: [
      'Recursively flatten from right to left.',
      'Merge current node\'s child list with the already-flattened rest.',
      'Return merged sorted list.',
    ],
    pitfalls: ['After merging, the result uses child pointers, not next pointers. Set next to null in the merged result.'],
  },

  // ─── Flood fill Algorithm ────────────────────────────────────────────────────
  'flood-fill-algorithm': {
    intuition: 'From a starting pixel, paint it and all connected pixels of the same color with a new color. DFS/BFS from start.',
    algorithm: [
      'If starting pixel\'s color already equals new color, return (avoid infinite loop).',
      'DFS from (sr,sc): set image[r][c]=newColor. Recurse on 4 neighbors with old color.',
    ],
    example: { input: 'image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, newColor=2', steps: ['Fill connected 1s: (0,0),(0,1),(0,2),(1,0),(1,1),(2,0) become 2.'], output: '[[2,2,2],[2,2,0],[2,0,1]]' },
    pitfalls: ['Check if start pixel\'s color == new color and skip to avoid infinite recursion.'],
  },

  // ─── Gold Mine Problem ────────────────────────────────────────────────────────
  'gold-mine-problem': {
    intuition: 'DP: you can enter from any row in column 0 and move right, right-up, or right-down. Find path maximizing gold collected.',
    algorithm: [
      'dp[i][j] = max gold reachable at cell (i,j) coming from left column.',
      'For each column j from 1: for each row i: dp[i][j] = grid[i][j] + max(dp[i-1][j-1], dp[i][j-1], dp[i+1][j-1]).',
      'Return max over all dp[i][n-1].',
    ],
    pitfalls: ['Boundary checks for first/last rows. Can start from any cell in column 0. Must move left to right only.'],
  },

  // ─── Gray Code ────────────────────────────────────────────────────────────────
  'gray-code': {
    intuition: 'n-bit Gray code: i-th value = i XOR (i>>1). Or build iteratively: mirror and prefix with 0/1.',
    algorithm: [
      'Iterative: start with [0]. For each step i from 1 to n: for j from current.size-1 to 0, append current[j] | (1<<(i-1)).',
      'Or formula: for i in 0..2^n-1, gray[i] = i ^ (i>>1).',
    ],
    example: { input: 'n=2', steps: ['Step 0: [0]. Step 1: [0,1]. Step 2: [00,01,11,10] = [0,1,3,2].'], output: '[0,1,3,2]' },
    pitfalls: ['Successive values differ by exactly 1 bit. The XOR formula i^(i>>1) directly gives the i-th Gray code.'],
  },

  // ─── Implement Atoi ──────────────────────────────────────────────────────────
  'implement-atoi': {
    intuition: 'Parse integer from string: skip whitespace, handle sign, parse digits, clamp to INT range.',
    algorithm: [
      'Skip leading whitespace.',
      'Check sign (+ or -).',
      'Parse digits: result = result*10 + digit. Stop at non-digit.',
      'Clamp: if > INT_MAX return INT_MAX; if < INT_MIN return INT_MIN.',
    ],
    pitfalls: ['Overflow during parsing: check before multiplying. Empty string or all-whitespace returns 0.'],
  },

  // ─── Implement Pow ───────────────────────────────────────────────────────────
  'implement-pow': {
    intuition: 'Fast exponentiation (binary exponentiation): x^n = (x^(n/2))^2, halving n each time.',
    algorithm: [
      'If n==0: return 1. If n<0: x=1/x, n=-n.',
      'If n is even: return pow(x*x, n/2).',
      'If n is odd: return x * pow(x*x, n/2).',
    ],
    example: { input: 'x=2.0, n=10', steps: ['pow(2,10)=pow(4,5)=4*pow(16,2)=4*pow(256,1)=4*256=1024.'], output: '1024.0' },
    pitfalls: ['Handle n=INT_MIN carefully (overflow on negation). Use long for n.'],
  },

  // ─── Inorder Traversal ────────────────────────────────────────────────────────
  'inorder-traversal': {
    intuition: 'Visit left subtree, then root, then right subtree. For iterative: use stack to simulate call stack.',
    algorithm: [
      'Recursive: inorder(left), visit root, inorder(right).',
      'Iterative: push all left nodes to stack. Pop, add to result, then push all left nodes of right subtree.',
    ],
    pitfalls: ['Morris traversal achieves O(1) space by temporarily modifying tree links.'],
  },

  // ─── Intersection Point in Y Shaped Linked Lists ─────────────────────────────
  'intersection-point-in-y-shaped-linked-lists': {
    intuition: 'Two pointers: switch to the other head when reaching null. They\'ll meet at the intersection after traversing both lists\' full lengths.',
    algorithm: [
      'a = headA, b = headB.',
      'While a != b: a = (a == null) ? headB : a.next; b = (b == null) ? headA : b.next.',
      'Return a (intersection or null).',
    ],
    pitfalls: ['If no intersection, both become null simultaneously after traversing both full lists, so while loop terminates.'],
  },

  // ─── Josephus problem ─────────────────────────────────────────────────────────
  'josephus-problem': {
    intuition: 'Mathematical recurrence: J(1)=0; J(n)=(J(n-1)+k)%n. The 0-indexed survivor position builds from n=1.',
    algorithm: [
      'pos = 0.',
      'For i from 2 to n: pos = (pos + k) % i.',
      'Return pos + 1 (convert to 1-indexed).',
    ],
    example: { input: 'n=5, k=2', steps: ['J(1)=0. J(2)=(0+2)%2=0. J(3)=(0+2)%3=2. J(4)=(2+2)%4=0. J(5)=(0+2)%5=2. 1-indexed=3.'], output: '3' },
    pitfalls: ['0-indexed formula; add 1 at end for 1-indexed answer.'],
  },

  // ─── K-th element of two Arrays ──────────────────────────────────────────────
  'k-th-element-of-two-arrays': {
    intuition: 'Binary search on one array. Take some elements from first array and k-take from second. Ensure the partition is valid.',
    algorithm: [
      'Binary search: lo=max(0,k-n2), hi=min(k,n1).',
      'mid1 elements from arr1, mid2=k-mid1 from arr2.',
      'Check: arr1[mid1-1]<=arr2[mid2] and arr2[mid2-1]<=arr1[mid1].',
      'The kth element is max(arr1[mid1-1], arr2[mid2-1]).',
    ],
    pitfalls: ['Handle boundary cases where mid1=0 or mid1=n1 (use -infinity/+infinity sentinels).'],
  },

  // ─── k-th Smallest in BST ────────────────────────────────────────────────────
  'k-th-smallest-in-bst': {
    intuition: 'In-order traversal of BST visits nodes in sorted ascending order. The k-th node visited is the k-th smallest.',
    algorithm: [
      'In-order DFS: traverse left, visit node (decrement k), traverse right.',
      'When k reaches 0, store current node value.',
    ],
    example: { input: 'BST=[5,3,6,2,4], k=3', steps: ['In-order: 2,3,4,5,6. 3rd = 4.'], output: '4' },
    pitfalls: ['Can early-exit once k reaches 0. For iterative, use a stack and counter.'],
  },

  // ─── LCS of three strings ─────────────────────────────────────────────────────
  'lcs-of-three-strings': {
    intuition: 'Extension of LCS: 3D DP. dp[i][j][k] = LCS of first i chars of s1, j chars of s2, k chars of s3.',
    algorithm: [
      'If s1[i-1]==s2[j-1]==s3[k-1]: dp[i][j][k] = dp[i-1][j-1][k-1] + 1.',
      'Else: dp[i][j][k] = max(dp[i-1][j][k], dp[i][j-1][k], dp[i][j][k-1]).',
      'Return dp[n1][n2][n3].',
    ],
    pitfalls: ['3D DP has O(n³) time and space. Can be space-optimized but logic is clearer in 3D.'],
  },

  // ─── Largest BST ─────────────────────────────────────────────────────────────
  'largest-bst': {
    intuition: 'For each subtree, check if it\'s a valid BST and track its size. Return max BST size found. Each subtree return: (isBST, size, min, max).',
    algorithm: [
      'DFS returning (isBST, size, minVal, maxVal) for each subtree.',
      'A node\'s subtree is BST if both children are BSTs, node.val > left.max, node.val < right.min.',
      'BST size = left.size + right.size + 1. Track global maximum.',
    ],
    pitfalls: ['If subtree is not BST, return size=0 so its ancestors can\'t count it. Propagate min/max correctly.'],
  },

  // ─── Left View of Binary Tree ─────────────────────────────────────────────────
  'left-view-of-binary-tree': {
    intuition: 'BFS level order: first node of each level is visible from left. Or DFS with level tracking: first visit at each level is left view.',
    algorithm: [
      'BFS: for each level, add the first node\'s value to result.',
      'Or DFS: pass level. If level == result.size(), add current node value (first visit at this level).',
    ],
    pitfalls: ['DFS should visit left child first to ensure leftmost node is recorded first.'],
  },

  // ─── Level Order in spiral form ──────────────────────────────────────────────
  'level-order-in-spiral-form': {
    intuition: 'Alternate direction each level. Use two stacks: one for left-to-right levels, one for right-to-left. Or BFS with a direction flag.',
    algorithm: [
      'Use two stacks s1 (current) and s2 (next).',
      'Left-to-right level: push right then left child to s2.',
      'Right-to-left level: push left then right child to s2.',
      'Swap stacks after each level.',
    ],
    pitfalls: ['When printing left-to-right, push children right-then-left to next stack (stack reverses order).'],
  },

  // ─── Linked List Group Reverse ────────────────────────────────────────────────
  'linked-list-group-reverse': {
    intuition: 'Reverse every k nodes. For each group of k, reverse the sublist then connect to next group.',
    algorithm: [
      'Check if at least k nodes remain; if not, leave as-is.',
      'Reverse k nodes using prev/curr/next.',
      'head.next = reverseKGroup(next_group, k).',
      'Return new head of this group.',
    ],
    pitfalls: ['After reversal, old head of group becomes the tail. Connect it to recursively processed next group.'],
  },

  // ─── Longest Common Increasing Subsequence ────────────────────────────────────
  'longest-common-increasing-subsequence': {
    intuition: 'Combine LCS and LIS. dp[j] = length of LCIS ending with B[j]. For each A[i], update dp[j] for B[j]==A[i] using best candidate from previous elements.',
    algorithm: [
      'For each i (A): best = 0. For each j (B):',
      'If A[i] == B[j]: dp[j] = best + 1.',
      'If A[i] > B[j]: best = max(best, dp[j]).',
      'Return max(dp).',
    ],
    pitfalls: ['Track "best" separately to avoid using updated dp values in same outer iteration.'],
  },

  // ─── Longest Common Substring ────────────────────────────────────────────────
  'longest-common-substring': {
    intuition: 'DP: dp[i][j] = length of longest common substring ending at s1[i-1] and s2[j-1]. If chars match, dp[i][j]=dp[i-1][j-1]+1. Track global max.',
    algorithm: [
      'dp[i][j] = 0 if s1[i-1] != s2[j-1], else dp[i-1][j-1]+1.',
      'Track max(dp[i][j]) across all i,j.',
    ],
    example: { input: 's1="ABCBDAB", s2="BDCABA"', steps: ['dp fills up. Max common substring is "AB" or "BD" of length 2? Actually "BCB"/"BDCAB" → "BCA"? Let me recalculate: longest = "AB"=2... actually "ABCB" vs "BDCABA" → "AB"=2.'], output: '2' },
    pitfalls: ['Unlike LCS, must be contiguous — reset dp[i][j]=0 on mismatch, no max with adjacent cells.'],
  },

  // ─── Longest Consecutive Subsequence ─────────────────────────────────────────
  'longest-consecutive-subsequence': {
    intuition: 'Add all elements to a HashSet. For each number n where n-1 is NOT in the set (it\'s a sequence start), count how long the streak goes.',
    algorithm: [
      'Add all nums to HashSet.',
      'For each n where set doesn\'t contain n-1: count streak = 1, while set contains n+streak: streak++.',
      'Update max streak.',
    ],
    example: { input: '[100,4,200,1,3,2]', steps: ['Start=1: 1,2,3,4 → streak=4. Start=100: streak=1. Start=200: streak=1.'], output: '4' },
    pitfalls: ['Only start counting from sequence start (n-1 not in set) — avoids O(n²) repetition.'],
  },

  // ─── Longest valid Parentheses ───────────────────────────────────────────────
  'longest-valid-parentheses': {
    intuition: 'Use a stack to find the length of the longest valid parentheses substring. Push indices; on \')\', pop matching \'(\'; if stack empty, push current as new base.',
    algorithm: [
      'Push -1 as base index onto stack.',
      'For \'(\': push index.',
      'For \')\': pop. If stack empty: push current index as new base. Else: length = i - stack.top(). Update max.',
    ],
    example: { input: '"()(()"', steps: ['i=0 \'(\' push. i=1 \')\' pop, stack=[−1], len=1−(−1)=2. i=2,3 push. i=4 \')\' pop, stack=[1], len=4−1=3.'], output: '4... (recalc: "(()" → len=2 from last two)' },
    pitfalls: ['Initialize stack with -1 as sentinel. Also solvable with DP (dp[i] = length ending at i) or two passes.'],
  },

  // ─── Lowest Common Ancestor in a BST ─────────────────────────────────────────
  'lowest-common-ancestor-in-a-bst': {
    intuition: 'BST property: LCA is the first node where paths to n1 and n2 diverge. If both values are less than current node, LCA is in left subtree; if both greater, in right; else current is LCA.',
    algorithm: [
      'While root != null:',
      'If n1 < root.val and n2 < root.val: root = root.left.',
      'If n1 > root.val and n2 > root.val: root = root.right.',
      'Else return root.',
    ],
    pitfalls: ['Only valid for BST. For general binary tree, use the standard LCA algorithm.'],
  },

  // ─── Majority Element II ─────────────────────────────────────────────────────
  'majority-element-ii': {
    intuition: 'Find all elements appearing more than ⌊n/3⌋ times. At most 2 such elements exist. Use Boyer-Moore voting with 2 candidates.',
    algorithm: [
      'Maintain two candidates and their counts.',
      'For each element: if it matches candidate1 or 2, increment their count. If a count is 0, replace. Else decrement both.',
      'Verify the two candidates by counting occurrences.',
    ],
    pitfalls: ['After voting, must verify — candidates might not actually exceed n/3 (voting finds the POTENTIAL candidates, not guaranteed majority).'],
  },

  // ─── Max rectangle ───────────────────────────────────────────────────────────
  'max-rectangle': {
    intuition: 'Build histograms row by row and apply "largest rectangle in histogram" for each row.',
    algorithm: [
      'Maintain heights[] array. For each row: update heights (increment if cell=1, reset to 0 if cell=0).',
      'For each row\'s heights, compute largest rectangle using stack-based approach.',
    ],
    example: { input: '[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]', steps: ['Row 0 heights=[1,0,1,0,0]→area=1. Row 1=[2,0,2,1,1]→area=3. Row 2=[3,1,3,2,2]→area=6.'], output: '6' },
    pitfalls: ['Use the histogram approach for each row. The largest rectangle in histogram uses a monotone stack.'],
  },

  // ─── Maximum Product Subarray ─────────────────────────────────────────────────
  'maximum-product-subarray': {
    intuition: 'Track both maximum and minimum product ending at each position (negative × negative = positive). Max at each step = max of: current element alone, max*current, min*current.',
    algorithm: [
      'maxProd = minProd = result = nums[0].',
      'For each num from index 1: tmp = maxProd. maxProd = max(num, maxProd*num, minProd*num). minProd = min(num, tmp*num, minProd*num).',
      'result = max(result, maxProd).',
    ],
    example: { input: '[2,3,-2,4]', steps: ['max=2,min=2. max=6,min=6. max=-2,min=-12. max=4,min=-48. Result=6.'], output: '6' },
    pitfalls: ['Must track minimum product because negative × negative = positive. Save tmp before updating maxProd.'],
  },

  // ─── Maximum path sum from any node ──────────────────────────────────────────
  'maximum-path-sum-from-any-node': {
    intuition: 'Path can go through any node, using both subtrees. DFS: at each node, best path = max(0, leftGain) + max(0, rightGain) + node.val. Track global max.',
    algorithm: [
      'DFS returns the maximum gain (single path down) from this node.',
      'At node: leftGain = max(0, dfs(left)). rightGain = max(0, dfs(right)).',
      'Candidate = leftGain + rightGain + val. Update global max.',
      'Return val + max(leftGain, rightGain) (can only choose one side for parent path).',
    ],
    pitfalls: ['Return val + max(left,right) to parent (can\'t split the path). Update global max with both sides locally.'],
  },

  // ─── Maximum sum of Non-adjacent nodes ───────────────────────────────────────
  'maximum-sum-of-non-adjacent-nodes': {
    intuition: 'Tree DP: for each node, two states — include node (can\'t include children) or exclude (take max of including/excluding each child).',
    algorithm: [
      'DFS returns (include, exclude) for each subtree.',
      'include = node.val + sum(exclude of each child).',
      'exclude = sum(max(include, exclude) for each child).',
      'For root: return max(include, exclude).',
    ],
    pitfalls: ['This is house-robber on a tree. Return a pair (take, skip) from each subtree.'],
  },

  // ─── Median in a row-wise sorted Matrix ──────────────────────────────────────
  'median-in-a-row-wise-sorted-matrix': {
    intuition: 'Binary search on value range [lo, hi]. For a given mid, count elements ≤ mid using binary search on each row. Median found when count == (m*n+1)/2.',
    algorithm: [
      'lo = matrix[0][0], hi = max last elements.',
      'Binary search: mid = (lo+hi)/2. Count = sum of upper_bound(mid) across all rows.',
      'If count < (m*n+1)/2: lo=mid+1. Else hi=mid.',
      'Return lo.',
    ],
    pitfalls: ['Integer median for odd total. Binary search on values, not indices. Count elements ≤ mid (not <).'],
  },

  // ─── Median of two sorted arrays ────────────────────────────────────────────
  'median-of-two-sorted-arrays': {
    intuition: 'Binary search on the smaller array. Partition both arrays such that left half has (m+n)/2 elements and max(left) ≤ min(right).',
    algorithm: [
      'Ensure len(A) ≤ len(B). Binary search on A: lo=0, hi=len(A).',
      'partA=mid, partB=(m+n+1)/2 - partA.',
      'Check: maxLeftA ≤ minRightB and maxLeftB ≤ minRightA.',
      'If valid: median = max(maxLeft) for odd total, or (max(maxLeft)+min(minRight))/2 for even.',
    ],
    pitfalls: ['Use ±infinity for boundary partitions (partA=0 or partA=len). Ensure binary search on shorter array.'],
  },

  // ─── Merge Sort for Linked List ──────────────────────────────────────────────
  'merge-sort-for-linked-list': {
    intuition: 'Split linked list in half (using slow/fast pointer), recursively sort each half, merge the two sorted halves.',
    algorithm: [
      'Find middle using slow/fast pointers.',
      'Split: mid.next = null.',
      'Recursively sort left and right halves.',
      'Merge two sorted lists.',
    ],
    pitfalls: ['For splitting, stop slow pointer one before middle (so splitting is correct). No random access, so must find middle each time.'],
  },

  // ─── Merge two sorted linked lists ──────────────────────────────────────────
  'merge-two-sorted-linked-lists': {
    intuition: 'Use a dummy head. Compare heads of both lists, append smaller, advance that list\'s pointer.',
    algorithm: [
      'Create dummy node. curr = dummy.',
      'While both lists non-null: compare heads, append smaller to curr.next, advance pointer.',
      'Append remaining non-null list.',
      'Return dummy.next.',
    ],
    pitfalls: ['Don\'t forget to attach the remaining list after one list is exhausted.'],
  },

  // ─── Middle of a Linked List ─────────────────────────────────────────────────
  'middle-of-a-linked-list': {
    intuition: 'Floyd\'s slow/fast pointer: slow advances one step, fast advances two. When fast reaches end, slow is at middle.',
    algorithm: [
      'slow = fast = head.',
      'While fast != null and fast.next != null: slow = slow.next; fast = fast.next.next.',
      'Return slow.',
    ],
    pitfalls: ['For even length lists, this returns the second middle. Adjust termination condition if first middle is needed.'],
  },

  'maximum-sum-rectangle': {
    intuition: 'Extend Kadane algorithm to 2D. Fix left and right column boundaries, compress rows into 1D array using prefix sums, then apply Kadane on the 1D array.',
    algorithm: [
      'Fix left col l from 0 to n-1.',
      'For each l, scan right col r from l to n-1: accumulate column sums into 1D temp array.',
      'Apply Kadane on temp to find max subarray sum.',
    ],
    example: { input: '4x5 matrix', steps: ['Fix l=1,r=3. Column sums form 1D array. Kadane finds max subarray.'], output: 'Max sum rectangle' },
    pitfalls: ['Time O(n^2 * m). Track row boundaries by storing start/end in Kadane.'],
  },

  'minimum-spanning-tree': {
    intuition: 'Find MST using Kruskal (sort edges, union-find) or Prim (greedy, min-heap). Minimum total edge weight connecting all vertices.',
    algorithm: [
      "Kruskal: sort edges by weight. For each edge: if endpoints in different components (Union-Find), add to MST.",
      "Prim: start from any node. Use min-heap to always extend with cheapest edge to unvisited node.",
    ],
    pitfalls: ['Kruskal needs sorted edges + union-find. Prim is better for dense graphs.'],
  },

  'number-of-distinct-islands': {
    intuition: 'BFS/DFS each island, normalize its shape by recording relative path from starting cell. Use a set of shapes to count distinct islands.',
    algorithm: [
      'DFS from each unvisited 1. Record path directions (UDLR) including backtracking steps.',
      'Normalize: subtract starting cell coordinates from all cell coordinates.',
      'Add normalized shape to a set.',
    ],
    pitfalls: ['Record backtrack steps in path to distinguish shapes that have same cells but different traversal. Or use relative coordinates.'],
  },

  'power-set': {
    intuition: 'Generate all 2^n subsets. Iterate from 0 to 2^n-1; each bit pattern represents inclusion/exclusion of elements.',
    algorithm: [
      'For mask from 0 to 2^n-1: build subset from bits set in mask.',
      'Or recursive: for each element, include or exclude in subset.',
    ],
    pitfalls: ['Result size is 2^n. Iterative bitmask approach is clean for small n.'],
  },

  'preorder-traversal': {
    intuition: 'Visit root, then left subtree, then right subtree. Iterative: use stack, push right child before left.',
    algorithm: [
      'Recursive: visit node, recurse left, recurse right.',
      'Iterative: stack. Push root. While stack non-empty: pop, visit, push right, push left.',
    ],
    pitfalls: ['Push right before left in stack so left is processed first.'],
  },

  'remove-loop-in-linked-list': {
    intuition: 'Detect loop with Floyd cycle detection. Find loop start, then carefully remove the link without losing the rest of the list.',
    algorithm: [
      'Floyd: slow and fast pointers. If they meet, loop exists.',
      'Find loop start: reset one pointer to head, advance both one step at a time until they meet.',
      'Remove: traverse loop from start to find the node just before start. Set its next to null.',
    ],
    pitfalls: ['When resetting to find loop start, both pointers move at same speed. The node just before start is found by traversing the loop.'],
  },

  'reverse-a-doubly-linked-list': {
    intuition: 'Swap prev and next pointers for every node. The old tail becomes the new head.',
    algorithm: [
      'Traverse: for each node, swap node.prev and node.next.',
      'Return the last node visited as new head.',
    ],
    pitfalls: ['Swap pointers, do not reassign values. The last processed node (old tail) is the new head.'],
  },

  'spiral-traversal-of-matrix': {
    intuition: 'Layer-by-layer traversal. Use four boundaries (top, bottom, left, right) and shrink them as layers are processed.',
    algorithm: [
      'top=0, bottom=m-1, left=0, right=n-1.',
      'While top<=bottom && left<=right: traverse top row, right col, bottom row, left col. Shrink boundaries.',
    ],
    pitfalls: ['Check boundaries before traversing bottom row and left column to avoid duplicates on single row/column cases.'],
  },

  'stock-buy-and-sell': {
    intuition: 'Multiple transactions allowed. Buy and sell greedily: capture every upward price movement.',
    algorithm: [
      'Scan prices: if prices[i] > prices[i-1], add the difference to profit.',
    ],
    pitfalls: ['This greedy equals sum of all positive consecutive differences. No cooldown or transaction limit.'],
  },

  'tree-boundary-traversal': {
    intuition: 'Three parts: left boundary (excluding leaves), all leaves (left to right), right boundary (excluding leaves, bottom to top).',
    algorithm: [
      'Left boundary: traverse left spine, add non-leaf nodes.',
      'Leaves: DFS in-order, add leaf nodes.',
      'Right boundary: traverse right spine, add non-leaf nodes in reverse.',
    ],
    pitfalls: ['Avoid double-counting root (if leaf) or leaf nodes in boundary traversal. Reverse right boundary before adding.'],
  },

  'vertical-order-traversal': {
    intuition: 'BFS/DFS with (column, row) coordinates. Group nodes by column. Within same column, sort by row then value.',
    algorithm: [
      'DFS or BFS, track (node, row, col).',
      'Map from col -> sorted list of (row, val).',
      'Output columns in sorted col order.',
    ],
    pitfalls: ['Multiple nodes at same (row,col) must be sorted by value. Sort within column by row then value.'],
  },

  'word-search': {
    intuition: 'DFS/backtracking from each cell. Mark cells visited to avoid reuse. Unmark on backtrack.',
    algorithm: [
      'For each cell (i,j): DFS with index into word.',
      'At each step: check bounds, match, not visited. Mark visited. Recurse in 4 directions. Unmark.',
    ],
    pitfalls: ['Mark cell as visited during recursion, unmark after. Check character match before recursing.'],
  },

  'zero-sum-subarrays': {
    intuition: 'Use prefix sums. If prefix[i] == prefix[j], subarray i+1..j has sum 0. Count pairs with same prefix sum.',
    algorithm: [
      'Compute prefix sums.',
      'Map from sum -> count of occurrences. Count += freq[prefix[i]] before incrementing.',
      'Include 0 in map initially (empty prefix).',
    ],
    pitfalls: ['Include prefix sum 0 in initial map to count subarrays starting from index 0.'],
  },

  'form-the-largest-number': {
    intuition: 'Custom sort: compare pairs of numbers by which concatenation is larger (ab vs ba as strings).',
    algorithm: [
      'Convert numbers to strings.',
      'Sort with comparator: a+b vs b+a (string concatenation comparison).',
      'Concatenate. Edge case: if result starts with 0, return "0".',
    ],
    pitfalls: ['Edge case: all zeros -> return "0". Comparator must compare concatenation strings, not individual values.'],
  },

  'generate-binary-numbers': {
    intuition: 'BFS: start with "1". For each number, append "0" and "1" to get next numbers. Queue-based generation.',
    algorithm: [
      'Queue with "1".',
      'For i from 1 to n: dequeue s, add to result, enqueue s+"0" and s+"1".',
    ],
    pitfalls: ['This generates binary representations in order 1,10,11,100,101,...'],
  },

  'smallest-distinct-window': {
    intuition: 'Find smallest window containing all distinct characters of the string. Sliding window.',
    algorithm: [
      'Count distinct chars total. Sliding window maintaining frequency map.',
      'Expand right until all distinct chars covered. Shrink left while maintaining coverage. Track minimum window.',
    ],
    pitfalls: ['Window must contain all distinct characters of the original string, not just some.'],
  },

  'interleaved-strings': {
    intuition: 'DP: dp[i][j] = true if s1[0..i-1] and s2[0..j-1] can interleave to form s3[0..i+j-1].',
    algorithm: [
      'dp[0][0]=true.',
      'dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1]).',
    ],
    pitfalls: ['Length check: |s1|+|s2| must equal |s3|. 2D DP, not greedy.'],
  },

  'insert-interval': {
    intuition: 'Insert new interval and merge overlapping. Process existing intervals: add non-overlapping, merge overlapping with new interval.',
    algorithm: [
      'Add all intervals that end before newInterval starts.',
      'Merge all overlapping: newInterval = [min(starts), max(ends)].',
      'Add remaining intervals.',
    ],
    pitfalls: ['Overlapping condition: interval.start <= newInterval.end. Merge updates newInterval boundaries.'],
  },

  'fixing-two-nodes-of-a-bst': {
    intuition: 'Find two swapped nodes in BST in-order traversal. In sorted in-order, swapped nodes appear as violations. First violation: first > second. Second violation: third > fourth (or same pair).',
    algorithm: [
      'In-order traversal, track previous node.',
      'First violation (prev > curr): first = prev, second = curr.',
      'Second violation (prev > curr): second = curr (update second only).',
      'Swap values of first and second.',
    ],
    pitfalls: ['If only one violation, nodes are adjacent in in-order. If two violations, first was from first violation, second from second.'],
  },

  'k-sum-paths': {
    intuition: 'Count paths from any node to any descendant with sum k. Use prefix sum map (similar to subarray sum = k).',
    algorithm: [
      'DFS with current prefix sum and a map of prefix sum counts.',
      'At each node: check if (currentSum - k) is in map. Add currentSum to map. Recurse. Remove from map.',
    ],
    pitfalls: ['Paths go downward only (parent to child). Remove from map on backtrack to avoid counting across branches.'],
  },

  'largest-square-formed-in-a-matrix': {
    intuition: 'DP: dp[i][j] = side length of largest square with bottom-right corner at (i,j). Recurrence: min(left, top, top-left)+1 if cell is 1.',
    algorithm: [
      'dp[i][j] = 0 if mat[i][j]==0.',
      'dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 if mat[i][j]==1.',
      'Answer = max(dp[i][j]).',
    ],
    pitfalls: ['Same as Maximal Square (LC 221). Answer is max side length, not area.'],
  },

  'merge-without-extra-space': {
    intuition: 'Merge two sorted arrays without extra space. Use gap method: compare elements gap apart, swap if out of order. Reduce gap each iteration.',
    algorithm: [
      'gap = ceil((m+n)/2).',
      'While gap > 0: compare pairs (i, i+gap) across both arrays, swap if out of order. gap = ceil(gap/2). Stop when gap=0.',
    ],
    pitfalls: ['Gap halves each iteration (Shell sort inspired). Handle indices carefully when gap crosses array boundary.'],
  },

  'maximum-sum-combination': {
    intuition: 'Find top k maximum sums where each sum uses one element from each of two arrays. Use a max-heap with already-seen pair tracking.',
    algorithm: [
      'Sort both arrays descending.',
      'Max-heap starting with (A[0]+B[0], 0, 0).',
      'Pop max, add to result, push (i+1,j) and (i,j+1) if not seen.',
    ],
    pitfalls: ['Use a visited set to avoid duplicate pairs. K iterations yields top K sums.'],
  },

  'search-in-a-rotated-sorted-array': {
    intuition: 'Binary search on rotated array. At each step, one half is always sorted. Determine which half and whether target is in it.',
    algorithm: [
      'lo=0, hi=n-1.',
      'If A[mid]==target: return mid.',
      'If left half sorted (A[lo]<=A[mid]): if target in [A[lo],A[mid]], hi=mid-1 else lo=mid+1.',
      'Else right half sorted: if target in [A[mid],A[hi]], lo=mid+1 else hi=mid-1.',
    ],
    pitfalls: ['Handle equal elements edge case (duplicates variant needs different approach). Always determine which half is sorted first.'],
  },

  'duplicate-subtrees': {
    intuition: 'Serialize each subtree to a string. Use a frequency map; when a serialization is seen twice, add the root to result.',
    algorithm: [
      'Post-order DFS: serialize = left_serial + "," + right_serial + "," + root.val.',
      'Map of serialization -> count. If count becomes 2: add root to result.',
    ],
    pitfalls: ['Add to result only when count == 2 (not 3,4,...) to avoid duplicates in output.'],
  },

  'is-binary-tree-heap': {
    intuition: 'Check two properties: complete binary tree (all levels full except last, last filled left to right) and max-heap property (parent >= children).',
    algorithm: [
      'BFS level order. Once a non-full node is seen, all subsequent nodes must be leaves (completeness check).',
      'For each node: check node.val >= children values (max-heap property).',
    ],
    pitfalls: ['Both conditions must hold simultaneously. Completeness check: after first missing child, no more children should appear.'],
  },

  'postorder-traversal': {
    intuition: 'Visit left, right, then root. Iterative: two-stack method or reverse pre-order trick.',
    algorithm: [
      'Iterative two-stack: stack1 starts with root. Pop to stack2, push left then right child to stack1. Drain stack2.',
      'Or: modified pre-order (root, right, left), reverse result.',
    ],
    pitfalls: ['Two-stack method is intuitive. Reverse-preorder trick is clever but less obvious.'],
  },

  'number-of-ways-to-arrive-at-destination': {
    intuition: 'Dijkstra with count tracking. Along with shortest distance, track number of ways to reach each node with that distance.',
    algorithm: [
      'Dijkstra: dist[], ways[] arrays. ways[0]=1, dist[0]=0.',
      'When relaxing edge: if new dist < dist[v]: update dist[v], ways[v]=ways[u].',
      'If new dist == dist[v]: ways[v] += ways[u].',
      'Return ways[n-1] % MOD.',
    ],
    pitfalls: ['Count updates only when relaxation succeeds or equals current best. MOD required since count can be large.'],
  },

  'find-kth-rotation': {
    intuition: 'In a sorted rotated array, the minimum element is at index k (rotation count). Binary search for minimum element position.',
    algorithm: [
      'Binary search for the pivot (minimum element).',
      'If A[mid] > A[hi]: pivot is in right half. lo=mid+1.',
      'Else pivot in left half. hi=mid.',
      'Return lo (index of minimum = rotation count).',
    ],
    pitfalls: ['For sorted rotated array [3,4,5,1,2], rotation count = index of minimum = 3.'],
  },

  'check-if-array-is-sorted-and-rotated': {
    intuition: 'A sorted rotated array has at most one "drop" (where arr[i] > arr[i+1]). Count drops; if <= 1 (including wrap-around), return true.',
    algorithm: [
      'Count positions where arr[i] > arr[(i+1)%n].',
      'If count <= 1: return true.',
    ],
    pitfalls: ['Check wrap-around: arr[n-1] > arr[0] is also a potential drop. Only one drop allowed.'],
  },

  'k-sized-subarray-maximum': {
    intuition: 'Sliding window maximum. Monotone deque maintains candidates for maximum in decreasing order.',
    algorithm: [
      'Deque of indices (decreasing values). For each element: remove indices out of window from front. Remove elements smaller than current from back. Add current index.',
      'Front of deque is max of current window.',
    ],
    pitfalls: ['Remove from front if index out of window range. Deque stores indices, not values.'],
  },

  'distance-of-nearest-cell-having-1': {
    intuition: 'Multi-source BFS from all cells with value 1 simultaneously. BFS naturally gives shortest distances.',
    algorithm: [
      'Add all cells with value 1 to queue with distance 0.',
      'BFS: expand to 4 neighbors, distance = parent distance + 1.',
    ],
    pitfalls: ['Multi-source BFS from all 1-cells simultaneously gives minimum distance to nearest 1 for each cell.'],
  },

  'smallest-positive-missing': {
    intuition: 'Rearrange: place each number i at index i-1 if 1<=i<=n. Then scan for first index where arr[i]!=i+1.',
    algorithm: [
      'Cyclic sort: while arr[i] != i+1 and arr[i] in [1,n] and arr[i] != arr[arr[i]-1]: swap arr[i] with arr[arr[i]-1].',
      'Scan: first i where arr[i] != i+1, return i+1. If all placed: return n+1.',
    ],
    pitfalls: ['Ignore duplicates during cyclic sort (check arr[i]!=arr[arr[i]-1] before swap). Answer in range [1,n+1].'],
  },

  'longest-subarray-with-sum-k': {
    intuition: 'Find longest subarray with sum exactly k. Use prefix sum hash map: if prefix[i]-k seen before, subarray from that index+1 to i has sum k.',
    algorithm: [
      'Map: prefix_sum -> first index. Initialize {0: -1}.',
      'For each i: if (prefix[i]-k) in map: candidate length = i - map[prefix[i]-k]. Update max.',
      'If prefix[i] not in map: map[prefix[i]] = i.',
    ],
    pitfalls: ['Store first occurrence of each prefix sum (don\'t overwrite). Works for both positive and negative integers.'],
  },

  'next-greater-element-in-circular-array': {
    intuition: 'Extend the array conceptually by doubling it. Use monotone stack. For circular array, simulate double traversal.',
    algorithm: [
      'Traverse array twice (0 to 2n-1) using index % n.',
      'Monotone stack. For i in second pass: pop stack elements smaller than current, assign result.',
      'First pass builds stack; second pass resolves remaining.',
    ],
    pitfalls: ['Only assign result on first n elements. Traverse 2n times to handle circular wrap.'],
  },

  'stock-buy-and-sell-max-one-transaction-allowed': {
    intuition: 'Track minimum price seen so far. At each day, profit = price - min_so_far. Track maximum profit.',
    algorithm: [
      'min_price = prices[0], max_profit = 0.',
      'For each price: max_profit = max(max_profit, price - min_price). min_price = min(min_price, price).',
    ],
    pitfalls: ['Must buy before selling. Update min_price at the end (or in same step since profit uses current price).'],
  },

  'stock-buy-and-sell-max-2-transactions-allowed': {
    intuition: 'DP with states. Track best profit with at most 2 transactions. Two passes: forward for best single transaction up to day i, backward for best single transaction from day i.',
    algorithm: [
      'Forward pass: best1[i] = max profit from single transaction in prices[0..i].',
      'Backward pass: best2[i] = max profit from single transaction in prices[i..n-1].',
      'Answer = max(best1[i] + best2[i+1]) for all i.',
    ],
    pitfalls: ['Two transactions can share a day boundary. DP states: buy1, sell1, buy2, sell2.'],
  },

  'stock-buy-and-sell-with-cooldown': {
    intuition: 'DP: after selling, must wait one day. States: held (own stock), sold (just sold today), rest (cooldown passed).',
    algorithm: [
      'held = -infinity, sold = 0, rest = 0.',
      'For each price: new_held = max(held, rest - price). new_sold = held + price. new_rest = max(rest, sold).',
      'Return max(sold, rest) at end.',
    ],
    pitfalls: ['After selling (sold state), next day must be rest (cannot buy). After rest, can buy or rest.'],
  },

  'stock-span-problem': {
    intuition: 'Span = number of consecutive days <= current price ending at today. Use monotone stack of (price, span) pairs.',
    algorithm: [
      'Stack of (price, span). For each price p: span = 1. While stack not empty and stack.top.price <= p: span += stack.top.span. Pop.',
      'Push (p, span). Record span.',
    ],
    pitfalls: ['Store span in stack entry to avoid recomputing. Each element is processed at most twice.'],
  },

  'optimal-strategy-for-a-game': {
    intuition: 'DP: both players play optimally. dp[i][j] = max coins first player can collect from coins[i..j].',
    algorithm: [
      'dp[i][j]: if player takes coins[i], opponent plays optimally on [i+1,j]: dp[i+1][j] gives opponent max, player gets sum[i..j]-dp[i+1][j].',
      'If player takes coins[j]: similarly dp[i][j-1].',
      'dp[i][j] = max(coins[i] + sum[i+1][j] - dp[i+1][j], coins[j] + sum[i][j-1] - dp[i][j-1]).',
    ],
    pitfalls: ['dp[i][j] = what first player gets. Use range sum to compute what remains. Both pick optimally.'],
  },

  'wildcard-pattern-matching': {
    intuition: 'DP: dp[i][j] = true if pattern[0..i-1] matches string[0..j-1]. Handle * (matches any sequence) and ? (matches single char).',
    algorithm: [
      'dp[0][0] = true. dp[i][0] = dp[i-1][0] && pattern[i-1]==\'*\'.',
      'If pattern[i-1] is \'?\' or equal: dp[i][j] = dp[i-1][j-1].',
      'If pattern[i-1] is \'*\': dp[i][j] = dp[i-1][j] (match 0 chars) || dp[i][j-1] (match more chars).',
    ],
    pitfalls: ['\'*\' can match empty string. dp[i-1][j] = * matches empty. dp[i][j-1] = * absorbs one more char.'],
  },

  'shortest-path-in-weighted-undirected-graph': {
    intuition: 'Dijkstra on weighted undirected graph. Standard shortest path from source to all vertices.',
    algorithm: [
      'Min-heap with (dist, node). dist[] = infinity. dist[src] = 0.',
      'Process: pop min, relax all neighbors. Update dist if shorter path found.',
    ],
    pitfalls: ['Mark visited or check if dist[u] > current dist when popping to avoid redundant processing.'],
  },

  'safe-states': {
    intuition: 'A node is safe if all paths from it eventually lead to a terminal node (no cycle reachable). Use reverse graph + topological sort or DFS coloring.',
    algorithm: [
      'DFS with colors: white(0), gray(in-progress), black(safe).',
      'If node is gray when revisited: cycle ? not safe. If black: safe.',
      'Color each node after DFS as black (safe) if no cycle found.',
    ],
    pitfalls: ['A node is safe if it\'s not on a cycle and doesn\'t lead to a cycle. Coloring: gray=visiting, black=confirmed safe.'],
  },

  'longest-substring-with-distinct-characters': {
    intuition: 'Sliding window with at most k distinct characters (or all distinct). HashSet tracks current window characters.',
    algorithm: [
      'Window [l,r] with set of characters.',
      'Expand r. If duplicate: shrink l until unique.',
      'Track max window size.',
    ],
    pitfalls: ['Set vs frequency map: set suffices if all distinct; map needed for generic k distinct.'],
  },

  'koko-eating-bananas': {
    intuition: 'Binary search on eating speed k. At speed k, hours needed = sum(ceil(pile/k)). Find minimum k where hours <= H.',
    algorithm: [
      'lo=1, hi=max(piles).',
      'Feasibility(k): sum(ceil(pile/k)) <= H.',
      'Return minimum feasible k.',
    ],
    pitfalls: ['ceil(pile/k) = (pile+k-1)/k in integer arithmetic. Binary search on speed, not on hours.'],
  },

  'path-with-minimum-effort': {
    intuition: 'Binary search on maximum effort. Or Dijkstra where edge weight = abs(height difference) and we minimize the maximum edge on the path.',
    algorithm: [
      'Dijkstra with effort[i][j] = min effort to reach (i,j). effort = max(current_effort, abs(height diff)).',
      'Min-heap by effort. Return effort[m-1][n-1].',
    ],
    pitfalls: ['Minimize the maximum difference, not sum of differences. Use modified Dijkstra with max as combination operator.'],
  },

  'split-array-largest-sum': {
    intuition: 'Binary search on the largest sum. Check if we can split array into at most k subarrays where each sum <= mid.',
    algorithm: [
      'lo=max(nums), hi=sum(nums).',
      'Feasibility(mid): greedily fill subarrays, count splits. If splits <= k, feasible.',
      'Return minimum feasible mid.',
    ],
    pitfalls: ['Greedy: keep adding to current subarray until exceeds mid, then start new subarray. Count total subarrays needed.'],
  },

  'minimum-cost-of-ropes': {
    intuition: 'Greedy: always merge two smallest ropes. Use a min-heap. Total cost = sum of all intermediate merge costs.',
    algorithm: [
      'Add all lengths to min-heap.',
      'While heap size > 1: pop two smallest, merge cost = sum, push back. Add cost to total.',
    ],
    pitfalls: ['Same as Huffman encoding / minimum cost to combine. Greedy with min-heap gives optimal solution.'],
  },

  'target-sum': {
    intuition: 'Assign + or - to each number to reach target. DP on subset sums. Let P = set with +, total - P = negative set. Then 2P - total = target ? P = (target+total)/2.',
    algorithm: [
      'If (target+total) is odd or |target| > total: return 0.',
      'Count subsets with sum = (target+total)/2.',
    ],
    pitfalls: ['Transform to subset count problem. (target+total) must be even. Handle negative target by taking absolute value check.'],
  },

  'the-celebrity-problem': {
    intuition: 'A celebrity knows nobody but everyone knows them. Find such a person in O(n). Eliminate non-celebrities using two-pointer.',
    algorithm: [
      'Start with candidate=0. For each i from 1 to n-1: if knows(candidate, i), candidate=i.',
      'Verify: candidate knows no one (except self) and everyone knows candidate.',
    ],
    pitfalls: ['One pass to find candidate, one pass to verify. Candidate can only be the person who was never "known by no one".'],
  },

  'travelling-salesman-problem': {
    intuition: 'TSP: find minimum cost Hamiltonian cycle. DP with bitmask states: dp[mask][i] = min cost to visit exactly the nodes in mask, ending at node i.',
    algorithm: [
      'dp[1][0] = 0 (starting at node 0, visited only node 0).',
      'For each mask, for each node i in mask: for each j not in mask: dp[mask|(1<<j)][j] = min(dp[mask][j], dp[mask][i] + dist[i][j]).',
      'Answer = min(dp[(1<<n)-1][i] + dist[i][0]) for all i.',
    ],
    pitfalls: ['Time O(2^n * n^2). Feasible only for n <= 20. Final step: return to start node.'],
  },

  'unique-paths-in-a-grid': {
    intuition: 'Count paths from top-left to bottom-right in a grid with obstacles. DP: dp[i][j] = paths to reach (i,j).',
    algorithm: [
      'dp[0][0]=1 if not obstacle. dp[i][j] = dp[i-1][j] + dp[i][j-1] if not obstacle, else 0.',
    ],
    pitfalls: ['If start or end is obstacle: return 0. Check cell is open before adding paths.'],
  },

  'ways-to-reach-the-nth-stair': {
    intuition: 'Climb 1 or 2 stairs at a time. dp[n] = dp[n-1] + dp[n-2]. Fibonacci sequence with dp[1]=1, dp[2]=2.',
    algorithm: [
      'dp[0]=1, dp[1]=1. dp[i] = dp[i-1] + dp[i-2].',
    ],
    pitfalls: ['Base cases: 0 stairs = 1 way (empty), 1 stair = 1 way, 2 stairs = 2 ways. Can also generalize to k steps.'],
  },

  'print-anagrams-together': {
    intuition: 'Group strings that are anagrams of each other. Use sorted string as key.',
    algorithm: [
      'For each string: sort its characters to get key.',
      'Group by key using a map. Return groups.',
    ],
    pitfalls: ['Maintain insertion order for group stability. Sort each string O(L*logL) where L is max length.'],
  },

  'huffman-encoding': {
    intuition: 'Build optimal prefix-free code using a min-heap. Combine two least frequent symbols repeatedly.',
    algorithm: [
      'Min-heap of (frequency, node). While size > 1: pop two, create parent with sum frequency, push back.',
      'Assign codes by traversing tree: left=0, right=1.',
    ],
    pitfalls: ['Huffman tree can be non-unique if frequencies are equal. Output the codes for each character.'],
  },

  'construct-tree-from-inorder-preorder': {
    intuition: 'Preorder[0] is root. Find it in inorder to split left and right subtrees. Recurse.',
    algorithm: [
      'Root = preorder[0]. Index in inorder = k. Left subtree size = k.',
      'Recurse: left = (preorder[1..k], inorder[0..k-1]). Right = (preorder[k+1..], inorder[k+1..]).',
    ],
    pitfalls: ['Use a hash map for O(1) inorder lookups. Pass index ranges instead of slices.'],
  },

  'row-with-max-1s': {
    intuition: 'Find row with maximum 1s in a binary matrix where each row is sorted. Start from top-right corner, move left (1s) or down (0s).',
    algorithm: [
      'Start at (0, n-1). If cell is 1: move left (col--), update max row. If 0: move down (row++).',
    ],
    pitfalls: ['O(m+n) algorithm. Since rows are sorted, once you find a 1, all elements to the left are also 1.'],
  },

  'peak-element': {
    intuition: 'Binary search. A peak exists where arr[mid] > arr[mid-1] and arr[mid+1]. If arr[mid] < arr[mid+1]: peak is on right. Else: peak is on left or at mid.',
    algorithm: [
      'lo=0, hi=n-1.',
      'If arr[mid] < arr[mid+1]: lo=mid+1 (ascending, peak on right).',
      'Else: hi=mid (peak at mid or left).',
      'Return lo.',
    ],
    pitfalls: ['Assume arr[-1]=arr[n]=-infinity. A peak always exists. Binary search converges to a peak.'],
  },

  'count-subarrays-with-given-xor': {
    intuition: 'Prefix XOR. If prefix[r] XOR prefix[l-1] = k, then XOR of subarray [l,r] = k. Count pairs.',
    algorithm: [
      'Map from prefix_xor -> count. Initialize {0: 1}.',
      'For each element: prefix_xor ^= element. Count += map[prefix_xor ^ k]. Map[prefix_xor]++.',
    ],
    pitfalls: ['Initialize map with {0:1} for empty prefix. For each position, check if (current_xor ^ k) was seen before.'],
  },

  'longest-alternating-subsequence': {
    intuition: 'Greedy: count transitions between increases and decreases. Track last direction.',
    algorithm: [
      'If n==0: return 0. result=1, dir=0 (none yet).',
      'For each consecutive pair: if up and dir!=up: result++, dir=up. If down and dir!=down: result++, dir=down.',
    ],
    pitfalls: ['Just count direction changes. Equal elements don\'t contribute. DP also works: up[i] and down[i] arrays.'],
  },

  'permutations-of-a-string': {
    intuition: 'Backtracking: fix each character at the current position, recurse for remaining. Use swap-based or selection approach.',
    algorithm: [
      'For each index i from current to end: swap str[i] with str[current]. Recurse on current+1. Swap back.',
      'When current == end: add to result.',
    ],
    pitfalls: ['For distinct permutations: use a set to avoid duplicates, or sort and skip duplicates.'],
  },

  'weighted-job-scheduling': {
    intuition: 'DP on jobs sorted by end time. dp[i] = max profit using jobs from 1..i. Either take job i (binary search for last compatible job) or skip.',
    algorithm: [
      'Sort jobs by end time.',
      'dp[i] = max(dp[i-1], profit[i] + dp[last_compatible_job]).',
      'Binary search for last job ending <= start[i].',
    ],
    pitfalls: ['Job i is compatible with job j if end[j] <= start[i]. Binary search on sorted end times.'],
  },

  'find-all-triplets-with-zero-sum': {
    intuition: 'Sort array. For each element, use two pointers to find pairs summing to negation of that element.',
    algorithm: [
      'Sort. For each i from 0 to n-3: lo=i+1, hi=n-1.',
      'While lo<hi: if sum==0 record, lo++, hi--. Skip duplicates. If sum<0: lo++. If sum>0: hi--.',
    ],
    pitfalls: ['Skip duplicates to avoid repeated triplets. Same as 3Sum (LC 15).'],
  },

  'the-painters-partition-problemii': {
    intuition: 'Same as Capacity to Ship / Split Array Largest Sum. Binary search on maximum length any one painter paints.',
    algorithm: [
      'lo=max(boards), hi=sum(boards).',
      'Feasibility(mid): greedily assign boards, count painters needed <= k.',
      'Return minimum feasible mid.',
    ],
    pitfalls: ['Greedy: fill each painter as much as possible without exceeding mid. Count total painters needed.'],
  },

  'shortest-common-supersequence': {
    intuition: 'Build SCS from LCS DP table. LCS characters appear once; non-LCS characters from both strings each appear once.',
    algorithm: [
      'Build LCS DP table. Trace from (m,n) to (0,0).',
      'If s1[i]==s2[j]: take char, go diagonal. If from top: take s2[j]. If from left: take s1[i].',
      'Append remaining chars. Reverse.',
    ],
    pitfalls: ['Trace DP table carefully. Characters not in LCS must still appear in SCS.'],
  },

  'minimum-days-to-make-m-bouquets': {
    intuition: 'Binary search on number of days. At d days, count bouquets possible = sum of floor(consecutive_bloomed / k). Find minimum d.',
    algorithm: [
      'lo=min(bloomDay), hi=max(bloomDay).',
      'Feasibility(d): count bouquets. If >= m: feasible.',
    ],
    pitfalls: ['If n < m*k: impossible, return -1. Reset streak when flower not yet bloomed.'],
  },

  'nonoverlapping-intervals': {
    intuition: 'Minimum removals = n - max non-overlapping intervals. Greedy: sort by end time. Keep intervals with earliest end that don\'t overlap.',
    algorithm: [
      'Sort by end time. Track last end.',
      'If start >= last_end: keep it, update last_end.',
      'Else: remove it (count removal).',
    ],
    pitfalls: ['Sort by END time for greedy. This maximizes kept intervals, minimizing removals.'],
  },

  'number-of-distinct-subsequences': {
    intuition: 'DP: dp[i][j] = distinct subsequences of t[0..j-1] in s[0..i-1].',
    algorithm: [
      'dp[i][0] = 1 (empty subsequence). dp[0][j] = 0 for j>0.',
      'If s[i-1]==t[j-1]: dp[i][j] = dp[i-1][j-1] + dp[i-1][j].',
      'Else: dp[i][j] = dp[i-1][j].',
    ],
    pitfalls: ['Can match with current char or skip it. Optimize to O(n) space with 1D array.'],
  },

  'subarrays-with-sum-k': {
    intuition: 'Count subarrays with sum equal to k. Prefix sum + hashmap: count of prefix sums seen so far.',
    algorithm: [
      'Map {0:1}. running_sum=0, count=0.',
      'For each num: running_sum += num. count += map[running_sum-k]. map[running_sum]++.',
    ],
    pitfalls: ['Works for negative numbers too. Initialize map with {0:1} for subarrays starting at index 0.'],
  },

  'majority-vote': {
    intuition: 'Boyer-Moore Voting Algorithm. Find element appearing more than n/2 times.',
    algorithm: [
      'candidate=None, count=0.',
      'For each num: if count==0, candidate=num. if num==candidate, count++ else count--.',
      'Verify candidate (count passes are needed if majority not guaranteed).',
    ],
    pitfalls: ['Algorithm finds candidate for majority. If majority not guaranteed, verify in second pass.'],
  },

  'optimal-binary-search-tree': {
    intuition: 'Interval DP. dp[i][j] = minimum cost BST for keys i..j. Cost = sum of frequencies * depth.',
    algorithm: [
      'dp[i][j] = min over k in i..j: dp[i][k-1] + dp[k+1][j] + sum(freq[i..j]).',
      'Build for increasing interval lengths.',
    ],
    pitfalls: ['Key insight: adding a root k adds sum(freq[i..j]) to all nodes (depth increases by 1). Use precomputed prefix sums.'],
  },

  'count-derangements': {
    intuition: 'Derangement = permutation where no element appears in original position. D(n) = (n-1)*(D(n-1)+D(n-2)). DP.',
    algorithm: [
      'D(1)=0, D(2)=1.',
      'D(n) = (n-1) * (D(n-1) + D(n-2)).',
    ],
    pitfalls: ['Recurrence: place element i either in position of element j or element that was in j\'s position. Modular arithmetic needed for large n.'],
  },

  'anagram-palindrome': {
    intuition: 'A string can form a palindrome if at most one character has odd frequency.',
    algorithm: [
      'Count character frequencies.',
      'Count characters with odd frequency. If count <= 1: return true.',
    ],
    pitfalls: ['Even-length strings: all frequencies must be even. Odd-length: exactly one odd frequency allowed.'],
  },

  'flip-to-maximize-1s': {
    intuition: 'Find the longest subarray of 1s if you can flip one 0. Equivalent to longest subarray with at most one 0.',
    algorithm: [
      'Sliding window with at most one 0. Track last position of 0.',
      'When second 0 found: move left pointer past previous 0.',
    ],
    pitfalls: ['If no 0 exists: return n (all 1s already). Track previous 0 position for correct left pointer update.'],
  },

  'largest-number-in-k-swaps': {
    intuition: 'Greedy: find maximum digit in the remaining string, swap it to current position. Repeat for k swaps.',
    algorithm: [
      'For each position from left: find max digit in remaining str. If larger than current: swap, k--.',
      'If multiple max positions, swap rightmost to preserve future swaps.',
    ],
    pitfalls: ['Backtracking needed for optimal result. Greedy may not always be optimal without exhaustive search.'],
  },

  'sum-of-subarray-minimum': {
    intuition: 'For each element, find how many subarrays have it as minimum using monotone stack. Count subarrays where arr[i] is minimum = left_count * right_count.',
    algorithm: [
      'For each i: left[i] = distance to previous smaller (or equal) element. right[i] = distance to next smaller element.',
      'Contribution of arr[i] = arr[i] * left[i] * right[i].',
    ],
    pitfalls: ['Handle equal elements: use strictly less on one side to avoid double counting. Result mod 10^9+7.'],
  },

  'mobile-numeric-keypad': {
    intuition: 'Count N-digit sequences on phone keypad where consecutive digits are adjacent (including same). DP.',
    algorithm: [
      'adjacency: 0->[0,8], 1->[1,2,4], 2->[2,1,3,5], etc.',
      'dp[digit][len] = count of sequences of length len ending at digit.',
      'dp[d][l] = sum of dp[adj][l-1] for adj in adjacency[d].',
    ],
    pitfalls: ['0 is adjacent to 0 and 8. * and # are not used. Base: dp[d][1]=1 for all digits 0-9.'],
  },

  'painting-the-fence': {
    intuition: 'Count ways to paint n fences with k colors where no more than 2 consecutive fences have the same color.',
    algorithm: [
      'same[i] = ways where last two have same color.',
      'diff[i] = ways where last two have different color.',
      'same[i] = diff[i-1]. diff[i] = (same[i-1] + diff[i-1]) * (k-1).',
      'Answer = same[n] + diff[n].',
    ],
    pitfalls: ['No 3 consecutive same. After same, must differ. After diff, can either (but not 3rd same).'],
  },

  'stock-buy-and-sell-max-k-transactions-allowed': {
    intuition: 'DP: dp[i][j] = max profit with at most i transactions up to day j.',
    algorithm: [
      'dp[i][j] = max(dp[i][j-1], max over m < j of (dp[i-1][m] + prices[j] - prices[m])).',
      'Optimize: track max(dp[i-1][m] - prices[m]) as we scan j.',
    ],
    pitfalls: ['O(k*n) with optimization. If 2k >= n: unlimited transactions (same as problem II).'],
  },

  'count-all-triplets-with-given-sum-in-sorted-array': {
    intuition: 'Sort array. For each element, use two pointers on the rest. Count pairs summing to target-arr[i].',
    algorithm: [
      'For each i: lo=i+1, hi=n-1.',
      'If arr[lo]+arr[hi] < target-arr[i]: lo++. If > target: hi--. If ==: count pairs (handle duplicates).',
    ],
    pitfalls: ['When sum matches, count all valid (lo,hi) pairs with those values (use while loops to count duplicates).'],
  },

  'generate-all-binary-strings': {
    intuition: 'Backtracking: generate all 2^n binary strings recursively.',
    algorithm: [
      'DFS with current string. At each step: append 0 or 1, recurse to length n, backtrack.',
    ],
    pitfalls: ['Total 2^n strings. Use StringBuilder for efficiency.'],
  },

  'container-with-most-water': {
    intuition: 'Two pointers from both ends. Area = min(height[l], height[r]) * (r-l). Move the shorter side inward.',
    algorithm: [
      'l=0, r=n-1. max_area=0.',
      'While l<r: area = min(height[l],height[r])*(r-l). max_area = max. Move shorter side.',
    ],
    pitfalls: ['Moving shorter side can only increase area. Moving taller side can only decrease width without gain.'],
  },

  'longest-prefix-suffix': {
    intuition: 'Find length of longest proper prefix of s that is also a suffix. This is the last value in the KMP failure function.',
    algorithm: [
      'Compute KMP failure function (partial match table).',
      'Return lps[n-1] where lps is the prefix function array.',
    ],
    pitfalls: ['Must be proper prefix/suffix (not the whole string). KMP preprocessing gives this directly.'],
  },

  'search-pattern-kmpalgorithm': {
    intuition: 'KMP: precompute failure function for pattern. Use it to skip unnecessary comparisons in text.',
    algorithm: [
      'Compute lps[] (longest proper prefix-suffix) for pattern.',
      'Scan text with two pointers. On mismatch: use lps to skip back in pattern.',
    ],
    pitfalls: ['lps[i] = length of longest prefix of pattern[0..i] that is also a suffix. O(m+n) total.'],
  },

  'shortest-path-in-undirected-graph': {
    intuition: 'BFS on unweighted graph gives shortest path in terms of edge count.',
    algorithm: [
      'BFS from source. dist[] = -1 initially. dist[src]=0.',
      'BFS level by level. Return dist[].',
    ],
    pitfalls: ['BFS guarantees shortest path in unweighted graph. Returns -1 for unreachable nodes.'],
  },

  'minimum-window-subsequence': {
    intuition: 'Find smallest window in S that contains T as a subsequence. DP: dp[i][j] = start index of smallest window in S[0..i] containing T[0..j].',
    algorithm: [
      'Two-pointer: for each occurrence of T[0] in S, extend to find full T match, then shrink from start.',
      'Forward: find first index where S[i..] contains T. Backward: from that end, find last occurrence of T match.',
    ],
    pitfalls: ['Not substring but subsequence. Forward-backward two-pass approach is O(n*m).'],
  },

  'clone-an-undirected-graph': {
    intuition: 'BFS/DFS with a HashMap from original node to clone. For each original node, create clone and process its neighbors.',
    algorithm: [
      'Map: original -> clone. BFS queue.',
      'For each neighbor of original: if not in map, create clone and add to queue. Add clone to cloneNode.neighbors.',
    ],
    pitfalls: ['Use visited map to avoid infinite loops in cyclic graphs.'],
  },
  'nth-fibonacci-number': {
    intuition: 'Fibonacci: F(n) = F(n-1) + F(n-2). Use DP or matrix exponentiation for large n.',
    algorithm: [
      'Iterative: a=0, b=1. For i in 2..n: c=a+b, a=b, b=c. Return b.',
    ],
    pitfalls: ['Large n needs modular arithmetic. Matrix exponentiation gives O(log n).'],
  },

  'implementing-dijkstra-set-1-adjacency-matrix': {
    intuition: 'Dijkstra shortest path from source. Min-heap + relaxation.',
    algorithm: [
      'dist[] = Infinity. dist[src]=0. Min-heap. Relax edges greedily.',
    ],
    pitfalls: ['Works for non-negative weights. Use priority queue for O((V+E) log V).'],
  },

  'strongly-connected-components': {
    intuition: "Kosaraju's algorithm: two DFS passes. First on original graph, second on reversed graph in finish order.",
    algorithm: [
      'DFS on original, push finish order to stack.',
      'Transpose graph. DFS in reverse finish order. Each DFS = one SCC.',
    ],
    pitfalls: ['Or use Tarjan algorithm (one DFS, low-link values).'],
  },

  'check-for-balanced-tree': {
    intuition: 'Height-balanced: for every node, |height(left) - height(right)| <= 1. Post-order DFS returning -1 if unbalanced.',
    algorithm: [
      'DFS returns height. If |leftH - rightH| > 1: propagate -1 upward.',
    ],
    pitfalls: ['Bottom-up check avoids redundant computation. Return -1 as sentinel for unbalanced.'],
  },

  'shortest-source-to-destination-path': {
    intuition: 'BFS on grid from source. First time reaching destination = shortest path.',
    algorithm: [
      'BFS from (0,0). Return steps when reaching (n-1,m-1).',
    ],
    pitfalls: ['BFS guarantees shortest path in unweighted grid. Return -1 if unreachable.'],
  },

  'rat-in-a-maze-problem': {
    intuition: 'Find all paths from (0,0) to (n-1,n-1). Backtracking: try all 4 directions.',
    algorithm: [
      'DFS with visited array. At each cell: try D/L/R/U. Add path char. Backtrack if stuck.',
    ],
    pitfalls: ['Sort directions for lexicographically smallest paths. Mark visited to avoid cycles.'],
  },

  'word-boggle': {
    intuition: 'Find all dictionary words in grid using DFS from each cell. Trie for efficient prefix checking.',
    algorithm: [
      'Build Trie from dictionary. DFS from each cell: explore all 8 directions, check Trie prefix.',
      'When complete word found: add to result.',
    ],
    pitfalls: ['Mark visited cells during DFS, unmark on backtrack. Use Trie to prune dead-end prefixes.'],
  },

  'ways-to-tile-a-floor': {
    intuition: 'Count ways to tile 2xN floor with 1x2 tiles. Classic DP: dp[n] = dp[n-1] + dp[n-2] (Fibonacci-like).',
    algorithm: [
      'dp[0]=1, dp[1]=1. dp[n] = dp[n-1] + dp[n-2].',
    ],
    pitfalls: ['Tile horizontally (1 way for last 2 cols) or vertically (1 way for last col). Fibonacci recurrence.'],
  },

  'longest-k-unique-characters-substring': {
    intuition: 'Longest substring with exactly k unique characters. Sliding window with character frequency map.',
    algorithm: [
      'Window [l,r]. Frequency map. Expand r. If distinct > k: shrink l. If distinct == k: update max.',
    ],
    pitfalls: ['Exactly k distinct (not at most). Keep window with exactly k unique chars.'],
  },

  'sudoku-solver': {
    intuition: 'Fill empty cells (.) satisfying Sudoku constraints. Backtracking with row/col/box tracking.',
    algorithm: [
      'Find next empty cell. Try digits 1-9. If valid: place and recurse. Backtrack on failure.',
    ],
    pitfalls: ['Box index = (r/3)*3 + c/3. Check row, column, and 3x3 box for each digit.'],
  },

  'spirally-traversing-a-matrix': {
    intuition: 'Traverse matrix in spiral order: right, down, left, up, shrinking boundaries.',
    algorithm: [
      'top=0, bottom=m-1, left=0, right=n-1. Process each boundary layer inward.',
    ],
    pitfalls: ['Check boundaries after each direction to avoid double-counting single rows/columns.'],
  },

  'rotate-by-90-degree': {
    intuition: 'Rotate matrix 90 degrees clockwise: transpose then reverse each row.',
    algorithm: [
      'Transpose: swap matrix[i][j] and matrix[j][i]. Reverse each row.',
    ],
    pitfalls: ['For counter-clockwise: reverse each row then transpose. Or transpose and reverse each column.'],
  },

  'search-a-2d-matrix': {
    intuition: 'Search in matrix where rows and columns are sorted. Start at top-right corner: move left if too large, down if too small.',
    algorithm: [
      'Start at (0, n-1). While in bounds: if match: true. If too large: col--. If too small: row++.',
    ],
    pitfalls: ['O(m+n) staircase search. Start at top-right or bottom-left.'],
  },

  'minimum-cost-to-connect-all-points': {
    intuition: 'Minimum spanning tree on points using Manhattan distance. Prim or Kruskal.',
    algorithm: [
      'Prim: start from point 0. For each step: add closest unvisited point. Update distances.',
    ],
    pitfalls: ['Manhattan distance = |x1-x2| + |y1-y2|. Prim with array is O(n^2), acceptable for n<=1000.'],
  },

  'construct-binary-tree-from-parent-array': {
    intuition: 'Build binary tree from parent array where parent[i] = parent of node i (-1 for root).',
    algorithm: [
      'Create all nodes. For each i: if parent[i] == -1: root = i. Else: attach i as left or right child of parent[i].',
    ],
    pitfalls: ['Create nodes first, then link. Root has parent = -1.'],
  },

  'array-to-bst': {
    intuition: 'Convert sorted array to height-balanced BST. Recursively use middle element as root.',
    algorithm: [
      'mid = (lo + hi) / 2. root = arr[mid]. root.left = build(lo, mid-1). root.right = build(mid+1, hi).',
    ],
    pitfalls: ['Same as LC 108. Middle element as root ensures balance.'],
  },

  'count-pairs-whose-sum-is-less-than-target': {
    intuition: 'Count pairs with sum < target. Sort + two pointers.',
    algorithm: [
      'Sort. l=0, r=n-1. If nums[l]+nums[r] < target: count += r-l, l++. Else: r--.',
    ],
    pitfalls: ['When sum < target: all pairs with r fixed from l to r-1 also qualify. Count += r-l.'],
  },

  'boolean-matrix': {
    intuition: 'Set entire row and column to 1 if any 1 found. Two-pass with row/col markers.',
    algorithm: [
      'First pass: mark rows and cols that have 1. Second pass: set entire marked rows/cols to 1.',
    ],
    pitfalls: ['Use extra O(m+n) space for markers. Or use first row/col as markers (O(1) space).'],
  },

  'set-matrix-zeroes': {
    intuition: 'Set entire row and column to 0 if element is 0. Mark rows/cols first, then zero them.',
    algorithm: [
      'Find all (r,c) with 0. Collect rows and cols to zero. Zero them in second pass.',
    ],
    pitfalls: ['Do not zero while scanning (would create false zeros). Mark first, zero second.'],
  },

  'minimum-number-of-platforms-required-for-a-railway-station': {
    intuition: 'Maximum trains at station simultaneously. Sort arrivals and departures, two-pointer count overlapping intervals.',
    algorithm: [
      'Sort arrivals[], departures[]. Two pointers i (arrivals), j (departures).',
      'If arrivals[i] <= departures[j]: platform++, i++. Else: platform--, j++. Track max.',
    ],
    pitfalls: ['Classic interval scheduling. Minimum platforms = maximum overlap at any time.'],
  },

  'maximum-index': {
    intuition: 'Find max j-i where arr[j] >= arr[i]. Precompute left min array and right max array.',
    algorithm: [
      'leftMin[i] = min of arr[0..i]. rightMax[i] = max of arr[i..n-1].',
      'Two pointers on leftMin and rightMax. When leftMin[i] <= rightMax[j]: update ans, j++. Else i++.',
    ],
    pitfalls: ['Brute force O(n^2). Optimal: precompute + two pointers O(n).'],
  },

  'minimum-sum-partition': {
    intuition: 'Partition set into two subsets with minimum absolute difference. Subset sum DP.',
    algorithm: [
      'dp[i] = can we form sum i from the array. Find achievable sums closest to total/2.',
      'Answer = min(|total - 2*s|) for achievable s.',
    ],
    pitfalls: ['Standard subset sum DP. Target = total/2. Find closest achievable sum.'],
  },

  'leaders-in-an-array': {
    intuition: 'An element is a leader if it is greater than all elements to its right. Scan right to left.',
    algorithm: [
      'maxRight = arr[n-1]. Last element is always leader. Scan right to left: if arr[i] >= maxRight: leader, update maxRight.',
    ],
    pitfalls: ['Rightmost element is always a leader. Track running max from right.'],
  },

  'add-binary-strings': {
    intuition: 'Add two binary strings. Simulate binary addition with carry, right to left.',
    algorithm: [
      'Traverse both strings from right. Add digits + carry. Append result%2, carry = result/2.',
      'If lengths differ, continue with remaining digits. Append final carry if non-zero.',
    ],
    pitfalls: ['Use character arithmetic: digit = char - 48. Reverse result at end.'],
  },

  'ancestors-in-binary-tree': {
    intuition: 'Print all ancestors of a given node in binary tree. DFS that returns true when target found; nodes on return path are ancestors.',
    algorithm: [
      'Recursive DFS. If found in left or right subtree: print current node and return true.',
    ],
    pitfalls: ['Post-order DFS. Print node only after confirming target is in its subtree.'],
  },

  'array-duplicates': {
    intuition: 'Find all duplicates in an array of integers 1..n. Mark visited by negating at index nums[i]-1.',
    algorithm: [
      'For each num: idx = abs(num)-1. If nums[idx] < 0: it is a duplicate. Else: negate nums[idx].',
    ],
    pitfalls: ['Classic O(n) time O(1) space using sign-flip trick. Restore if needed after.'],
  },

  'articulation-point-ii': {
    intuition: 'Find all articulation points (cut vertices) in undirected graph. DFS with disc/low arrays.',
    algorithm: [
      'DFS tracking discovery time disc[] and low[] (earliest reachable ancestor).',
      'Node u is AP if: (1) root with 2+ children, or (2) non-root with child v where low[v] >= disc[u].',
    ],
    pitfalls: ['Root special case: it is AP iff it has 2+ DFS children. Track parent to avoid parent edge as back edge.'],
  },

  'bitonic-point': {
    intuition: 'Find the peak element in a bitonic (first increasing then decreasing) array. Binary search.',
    algorithm: [
      'Binary search: if arr[mid] > arr[mid+1]: peak in left half (inclusive). Else: in right half.',
    ],
    pitfalls: ['Guaranteed single peak. Binary search on the inflection point. Edge: first or last element.'],
  },

  'bst-with-dead-end': {
    intuition: 'Check if BST has a dead end: a leaf node where we cannot insert any new node. Track valid insertion range at each node.',
    algorithm: [
      'DFS passing [minVal, maxVal] range. At leaf: dead end if maxVal - minVal == 1.',
    ],
    pitfalls: ['Start range [1, INF] (positive integers only). Dead end when no integer fits between min and max.'],
  },

  'candy': {
    intuition: 'Distribute minimum candies so each child gets at least 1 and children with higher rating than neighbor get more. Two-pass greedy.',
    algorithm: [
      'Left pass: if ratings[i] > ratings[i-1]: candies[i] = candies[i-1]+1. Else: candies[i]=1.',
      'Right pass: if ratings[i] > ratings[i+1]: candies[i] = max(candies[i], candies[i+1]+1).',
    ],
    pitfalls: ['Same as LC 135. Two passes (left-to-right then right-to-left). Answer = sum of candies array.'],
  },

  'circle-of-strings': {
    intuition: 'Check if strings can be chained in a circle (each string starts with last char of previous). Eulerian circuit in directed graph.',
    algorithm: [
      'Build directed graph: edge from first char to last char of each string.',
      'Check: (1) all nodes with non-zero degree are connected (ignore zero-degree), (2) in-degree == out-degree for all nodes.',
    ],
    pitfalls: ['Eulerian circuit exists iff graph is connected (among used nodes) and all in-degrees equal out-degrees.'],
  },

  'count-set-bits': {
    intuition: 'Count total set bits from 1 to n. Use pattern: bits in range [0, 2^k-1] = k * 2^(k-1).',
    algorithm: [
      'Find highest bit k. Count contribution of each bit position separately.',
      'For bit i: count = (n/(2^(i+1))) * 2^i + max(0, n%(2^(i+1)) - 2^i + 1).',
    ],
    pitfalls: ['O(log n) solution. Or Brian Kernighan per number: O(n log n). Use mathematical approach for large n.'],
  },

  'count-the-number-of-possible-triangles': {
    intuition: 'Count triplets forming valid triangles. Sort + two pointers: for each largest side, count valid pairs.',
    algorithm: [
      'Sort array. For each k (largest side) from n-1 down to 2: two pointers i=0, j=k-1.',
      'If arr[i]+arr[j] > arr[k]: all pairs (i, i+1..j-1, k) valid, count += j-i, j--. Else i++.',
    ],
    pitfalls: ['Triangle inequality: sum of two smaller sides > largest. Sort first; largest side is arr[k].'],
  },

  'decode-the-string': {
    intuition: 'Decode run-length encoded string like "3[b2[ca]]". Stack-based decoding for nested encodings.',
    algorithm: [
      'Use two stacks: one for strings, one for numbers.',
      'On digit: build number. On "[": push current string and number. On "]": repeat top string by top number, append to previous.',
    ],
    pitfalls: ['Same as LC 394. Handle multi-digit numbers. Build current string char by char between brackets.'],
  },

  'frog-jump': {
    intuition: 'Frog jumps on stones; can jump k-1, k, or k+1 from current position. DP to check if last stone reachable.',
    algorithm: [
      'HashMap: stone -> set of valid jump sizes to reach it.',
      'For each jump k from current stone: if stone+k-1, stone+k, stone+k+1 exist: add to their sets.',
    ],
    pitfalls: ['Same as LC 403. Use HashMap<stone, Set<jump>>. Only works if first jump is exactly 1.'],
  },

  'generate-ip-addresses': {
    intuition: 'Generate all valid IPv4 addresses from a string of digits. Backtracking with 4 parts.',
    algorithm: [
      'Backtrack: place 3 dots. Each segment must be valid (0-255, no leading zeros except "0" itself).',
    ],
    pitfalls: ['Same as LC 93. Prune: segment > 255 or has leading zero. Exactly 4 segments, all digits used.'],
  },

  'get-min-from-stack': {
    intuition: 'Stack that supports getMin() in O(1). Maintain auxiliary min stack.',
    algorithm: [
      'Push: push to main stack; push min(val, minStack.top()) to minStack.',
      'Pop: pop both stacks. GetMin: return minStack.top().',
    ],
    pitfalls: ['Same as LC 155. Min stack always has current minimum at top. Both stacks stay in sync.'],
  },

  'k-closest-points-to-origin': {
    intuition: 'Find k closest points to origin by Euclidean distance. Max-heap of size k, or quickselect.',
    algorithm: [
      'Max-heap of size k on distance. For each point: if heap.size < k or dist < heap.top: add, pop if > k.',
      'Or quickselect: partial sort to find k smallest.',
    ],
    pitfalls: ['Compare dist^2 to avoid sqrt. Same as LC 973. O(n log k) with heap, O(n) with quickselect.'],
  },

  'k-largest-elements': {
    intuition: 'Find k largest elements in an array. Min-heap of size k.',
    algorithm: [
      'Maintain min-heap of size k. For each element: if > heap.top or heap.size < k: add, pop if > k.',
      'Result = heap contents.',
    ],
    pitfalls: ['Min-heap (not max-heap) for efficiency. O(n log k). Or sort descending, take first k.'],
  },

  'kth-smallest': {
    intuition: 'Find kth smallest element in unsorted array. Quickselect or min-heap.',
    algorithm: [
      'Quickselect: partition around pivot. If pivot index == k-1: return. Else recurse left or right.',
    ],
    pitfalls: ['Quickselect O(n) average, O(n^2) worst. For guaranteed O(n log k): use max-heap of size k.'],
  },

  'largest-divisible-subset': {
    intuition: 'Find largest subset where every pair (i,j) satisfies subset[i] % subset[j] == 0 or vice versa. Sort + LIS-style DP.',
    algorithm: [
      'Sort array. dp[i] = length of largest divisible subset ending at i.',
      'dp[i] = max(dp[j]+1) for all j < i where nums[i] % nums[j] == 0. Track parent pointers to reconstruct.',
    ],
    pitfalls: ['Same as LC 368. Sort first so divisibility is transitive downward. O(n^2) DP.'],
  },

  'largest-number-in-one-swap': {
    intuition: 'Make the largest number by performing at most one swap of two digits.',
    algorithm: [
      'From right to left: track the max digit seen so far and its position.',
      'From left to right: find first digit smaller than max digit to its right. Swap. Return result.',
    ],
    pitfalls: ['Same as LC 670. Scan right-to-left for max. Then left-to-right for first improvement opportunity.'],
  },

  'max-sum-increasing-subsequence': {
    intuition: 'Find maximum sum of increasing subsequence. LIS-style DP on sums.',
    algorithm: [
      'dp[i] = max sum of increasing subsequence ending at i.',
      'dp[i] = max(dp[j] + nums[i]) for all j < i where nums[j] < nums[i]. Base: dp[i] = nums[i].',
    ],
    pitfalls: ['Track sum, not length. O(n^2) DP. Answer = max(dp[]).'],
  },

  'missing-in-array': {
    intuition: 'Find missing number in array of 1..n. XOR approach: XOR all 1..n with all array elements.',
    algorithm: [
      'XOR all elements from 1 to n, then XOR all array elements. Result is the missing number.',
    ],
    pitfalls: ['Alternative: sum = n*(n+1)/2 - sum(array). XOR approach avoids overflow.'],
  },

  'non-repeating-character': {
    intuition: 'Find first non-repeating character in a string. Frequency array + second pass.',
    algorithm: [
      'Count frequency of each character. Scan string left to right: return first char with freq == 1.',
    ],
    pitfalls: ['Two passes: first count, then find. O(n) time. Return -1 if all repeat.'],
  },

  'number-of-occurrence': {
    intuition: 'Count occurrences of a target in sorted array. Binary search for leftmost and rightmost positions.',
    algorithm: [
      'Find first occurrence (lower_bound). Find last occurrence (upper_bound - 1).',
      'Count = last - first + 1 if first <= last.',
    ],
    pitfalls: ['Two binary searches. Same as LC 34. Check if target exists before computing count.'],
  },

  'palindrome-sentence': {
    intuition: 'Check if a sentence is a palindrome ignoring non-alphanumeric characters and case.',
    algorithm: [
      'Two pointers l=0, r=len-1. Skip non-alphanumeric. Compare lowercased. If mismatch: false.',
    ],
    pitfalls: ['Same as LC 125. Filter and compare. toLowerCase for case-insensitive check.'],
  },

  'pascal-triangle': {
    intuition: 'Generate Pascal triangle up to n rows. Each element = sum of two above.',
    algorithm: [
      'row[0] = row[end] = 1. For i in 1..end-1: row[i] = prevRow[i-1] + prevRow[i].',
    ],
    pitfalls: ['Same as LC 118. Build row by row. Each row has one more element than previous.'],
  },

  'predecessor-and-successor': {
    intuition: 'Find in-order predecessor and successor of a key in BST.',
    algorithm: [
      'BST search: if key < root: successor = root, recurse left. If key > root: predecessor = root, recurse right.',
      'If key == root: predecessor = rightmost of left subtree; successor = leftmost of right subtree.',
    ],
    pitfalls: ['Track predecessor and successor during BST traversal, not just at exact match.'],
  },

  'product-array-puzzle': {
    intuition: 'For each index i, product of all elements except nums[i]. No division, O(1) extra space.',
    algorithm: [
      'Left pass: result[i] = product of all elements left of i.',
      'Right pass: multiply result[i] by running product of all elements right of i.',
    ],
    pitfalls: ['Same as LC 238. Two passes. result[0]=1 (no elements left), result[n-1]=1 (no elements right).'],
  },

  'pythagorean-triplet': {
    intuition: 'Check if array contains a Pythagorean triplet (a^2 + b^2 = c^2). Square elements, sort, two-pointer.',
    algorithm: [
      'Square all elements and sort. For each c (largest), two pointers a=0, b=c-1.',
      'If a^2 + b^2 == c^2: true. If <: a++. If >: b--.',
    ],
    pitfalls: ['After squaring, problem reduces to: find triplet where largest = sum of other two. Standard two-pointer.'],
  },

  'queue-reversal': {
    intuition: 'Reverse a queue using a stack. Push all elements to stack, then pop back to queue.',
    algorithm: [
      'Dequeue all into stack. Then pop from stack back into queue.',
    ],
    pitfalls: ['Stack reverses order. Alternative: recursive approach using call stack.'],
  },

  'reverse-words': {
    intuition: 'Reverse the words in a sentence. Split by spaces, reverse word list, join.',
    algorithm: [
      'Split on whitespace. Reverse array of words. Join with single space.',
    ],
    pitfalls: ['Handle multiple spaces and leading/trailing spaces. Same as LC 151.'],
  },

  'root-to-leaf-paths': {
    intuition: 'Print all root-to-leaf paths in a binary tree. DFS tracking current path.',
    algorithm: [
      'DFS. Append current node to path. At leaf: print/store path. Backtrack by removing last node.',
    ],
    pitfalls: ['Use list to track path. Backtrack: remove last element after both recursive calls return.'],
  },

  'stickler-thief': {
    intuition: 'Maximum sum of non-adjacent elements (house robber). DP: include or skip each element.',
    algorithm: [
      'dp[i] = max(dp[i-1], dp[i-2] + arr[i]). Base: dp[0]=arr[0], dp[1]=max(arr[0],arr[1]).',
    ],
    pitfalls: ['Same as LC 198. Cannot pick two consecutive elements. O(n) time, O(1) space with two variables.'],
  },

  'stickler-thief-ii': {
    intuition: 'Circular house robber: houses arranged in circle so first and last are adjacent. Run linear robber twice.',
    algorithm: [
      'Case 1: rob houses 0..n-2. Case 2: rob houses 1..n-1. Answer = max of both cases.',
    ],
    pitfalls: ['Same as LC 213. Cannot rob both first and last. Solve two linear sub-problems.'],
  },

  'second-largest': {
    intuition: 'Find second largest element in array without sorting. Single pass tracking max and second max.',
    algorithm: [
      'max1 = max2 = INT_MIN. For each num: if num > max1: max2=max1, max1=num. Else if num > max2 and num != max1: max2=num.',
    ],
    pitfalls: ['Handle duplicates: second largest must be strictly less than largest. Return -1 if no second largest exists.'],
  },

  'segregate-0s-and-1s': {
    intuition: 'Move all 0s to left and 1s to right in one pass. Dutch national flag with two values.',
    algorithm: [
      'Two pointers: left=0, right=n-1. While left < right: skip 0s from left, skip 1s from right. Swap and advance both.',
    ],
    pitfalls: ['O(n) single pass. No auxiliary space. Similar to partition step in quicksort.'],
  },

  'single-number': {
    intuition: 'Find element that appears once when all others appear twice. XOR of all elements cancels pairs.',
    algorithm: [
      'result = 0. For each num: result ^= num. Return result.',
    ],
    pitfalls: ['XOR is self-inverse: a^a=0, a^0=a. Same as LC 136. O(n) time, O(1) space.'],
  },

  'square-root-of-a-number': {
    intuition: 'Integer square root (floor). Binary search in range [1, n].',
    algorithm: [
      'Binary search: if mid*mid == n: return mid. If mid*mid < n: ans=mid, lo=mid+1. Else hi=mid-1.',
    ],
    pitfalls: ['Use long to avoid overflow in mid*mid. Same as LC 69. Return floor value.'],
  },

  'symmetric-tree': {
    intuition: 'Check if binary tree is a mirror of itself. Recursive pair comparison.',
    algorithm: [
      'isMirror(left, right): both null=true; one null=false; values differ=false; recurse: isMirror(left.left,right.right) && isMirror(left.right,right.left).',
    ],
    pitfalls: ['Same as LC 101. Compare outer pair and inner pair simultaneously.'],
  },

  'toeplitz-matrix': {
    intuition: 'Check if matrix is Toeplitz: every diagonal from top-left to bottom-right has same value.',
    algorithm: [
      'For each cell (i,j) not in first row/col: check matrix[i][j] == matrix[i-1][j-1].',
    ],
    pitfalls: ['Same as LC 766. Only check non-boundary cells. O(m*n) time.'],
  },

  'top-k-frequent-in-array': {
    intuition: 'Find k most frequent elements. HashMap frequency count + min-heap of size k.',
    algorithm: [
      'Count frequencies. Min-heap of size k on frequency. For each element: add to heap, pop if size > k.',
      'Result = heap contents.',
    ],
    pitfalls: ['Same as LC 347. Min-heap keeps top-k most frequent. Bucket sort gives O(n) alternative.'],
  },

  'total-decoding-messages': {
    intuition: 'Count ways to decode digit string (1=A..26=Z). DP with one and two digit choices.',
    algorithm: [
      'dp[i] = ways to decode s[0..i-1]. dp[i] += dp[i-1] if s[i-1] valid single. dp[i] += dp[i-2] if s[i-2..i-1] in 10..26.',
    ],
    pitfalls: ['Same as LC 91. Handle leading zeros: "0" alone is invalid. "10","20" are valid two-digit decodings.'],
  },

  'transpose-of-matrix': {
    intuition: 'Transpose: swap matrix[i][j] and matrix[j][i] for all i < j.',
    algorithm: [
      'For i in 0..n-1: for j in i+1..n-1: swap(matrix[i][j], matrix[j][i]).',
    ],
    pitfalls: ['Only swap upper triangle to avoid double-swapping. For non-square: create new matrix.'],
  },

  'validate-an-ip-address': {
    intuition: 'Validate IPv4: four octets 0-255 separated by dots, no leading zeros.',
    algorithm: [
      'Split on ".". Must have exactly 4 parts. Each part: numeric, no leading zero, value 0-255.',
    ],
    pitfalls: ['Empty parts, leading zeros (except "0" itself), non-numeric chars are all invalid. Same as LC 468.'],
  },

  'missing-element-of-ap': {
    intuition: 'Find missing element in arithmetic progression. Binary search on expected vs actual difference.',
    algorithm: [
      'Common diff d = (arr[n-1] - arr[0]) / n. Binary search: if arr[mid] == arr[0]+mid*d: missing in right half. Else left half.',
    ],
    pitfalls: ['Exactly one element is missing. Compute d carefully. Binary search on index deviation.'],
  },

  'move-all-zeroes-to-end': {
    intuition: 'Move all zeros to end while maintaining relative order of non-zeros. Two-pointer in-place.',
    algorithm: [
      'pos=0. For each num: if non-zero: arr[pos++]=num. Fill arr[pos..n-1] with 0.',
    ],
    pitfalls: ['Same as LC 283. Single pass for non-zeros, then fill zeros. No extra space needed.'],
  },

  'multiply-two-strings': {
    intuition: 'Multiply two large numbers represented as strings. Grade school multiplication.',
    algorithm: [
      'Result has at most m+n digits. For each pair (i,j): result[i+j+1] += (s1[i]-48)*(s2[j]-48).',
      'Propagate carry right to left. Strip leading zeros.',
    ],
    pitfalls: ['Same as LC 43. Use int array of size m+n. Handle carry propagation. Check for "0" inputs.'],
  },

  'n-meetings-in-one-room': {
    intuition: 'Maximum meetings in one room (activity selection). Greedy: sort by end time, greedily pick non-overlapping.',
    algorithm: [
      'Sort by end time. Track last end. For each meeting: if start > last end: select, update last end.',
    ],
    pitfalls: ['Classic interval scheduling. Sort by end, not start. O(n log n). Same as LC 435 complement.'],
  },

  'next-smallest-palindrome': {
    intuition: 'Find the smallest palindrome larger than given number. Mirror the left half; if not larger, increment middle.',
    algorithm: [
      'Copy left half to right half (mirrored). If result <= original: increment middle digit and propagate carry, re-mirror.',
      'Handle all-9s edge case: result is 10...01.',
    ],
    pitfalls: ['Three cases: direct mirror works, mirror < original (increment mid), all nines. Careful carry handling.'],
  },

  'pairs-with-difference-k': {
    intuition: 'Count pairs with difference exactly k. Sort + binary search, or hashset.',
    algorithm: [
      'For each element x: check if x+k exists in set. Avoid double counting.',
    ],
    pitfalls: ['k=0: count pairs of equal elements. k>0: check each element for x+k. Use set for O(n) lookup.'],
  },

  'police-and-thieves': {
    intuition: 'Maximum number of police-thief pairs where each can catch within k distance. Two-pointer on sorted positions.',
    algorithm: [
      'Collect positions of police and thieves. Sort both. Two pointers: match if |p-t| <= k.',
    ],
    pitfalls: ['If not matched (distance too large): advance the pointer with smaller position. Count successful matches.'],
  },

  'rotate-array': {
    intuition: 'Rotate array to the right by k steps. Three-reversal trick.',
    algorithm: [
      'k = k % n. Reverse all. Reverse first k. Reverse rest.',
    ],
    pitfalls: ['Same as LC 189. Handle k >= n with modulo. Three reversals = O(n) in-place.'],
  },

  'search-in-a-sorted-matrix': {
    intuition: 'Search in matrix where each row is sorted and first element of row > last of previous. Binary search treating as 1D.',
    algorithm: [
      'Treat m x n matrix as sorted array of m*n elements. Binary search with index mapping: row=mid/n, col=mid%n.',
    ],
    pitfalls: ['Same as LC 74. 1D binary search with 2D index conversion. O(log(m*n)).'],
  },

  'sorted-subsequence-of-size-3': {
    intuition: 'Find any three indices i<j<k where arr[i]<arr[j]<arr[k]. Track prefix minimum and suffix maximum.',
    algorithm: [
      'leftMin[i] = min of arr[0..i]. rightMax[i] = max of arr[i..n-1].',
      'For each j: if leftMin[j] < arr[j] < rightMax[j]: found.',
    ],
    pitfalls: ['Similar to LC 334 (increasing triplet subsequence). O(n) with two auxiliary arrays.'],
  },

  'sorting-elements-of-an-array-by-frequency': {
    intuition: 'Sort elements by frequency (descending). For equal frequency, sort by value (ascending or first occurrence).',
    algorithm: [
      'Count frequencies. Sort with custom comparator: primary=freq desc, secondary=value asc.',
    ],
    pitfalls: ['Stable sort ensures consistent ordering for equal frequencies. Use HashMap for frequencies.'],
  },

  'sum-pair-closest-to-target': {
    intuition: 'Find pair with sum closest to target. Sort + two pointers tracking minimum difference.',
    algorithm: [
      'Sort. l=0, r=n-1. Track minDiff and best pair. If sum < target: l++. If sum > target: r--. If equal: return.',
    ],
    pitfalls: ['Same as LC 1679 variant. Sort first. Update best when |sum - target| < minDiff.'],
  },

  'strings-rotations-of-each-other': {
    intuition: 'Check if two strings are rotations of each other. If s2 is in s1+s1, they are rotations.',
    algorithm: [
      'If lengths differ: false. Else: check if s2 is substring of (s1+s1).',
    ],
    pitfalls: ['Same as LC 796. KMP or indexOf on concatenated string. O(n) with KMP, O(n^2) with naive substring.'],
  },

  'maximum-connected-group': {
    intuition: 'Find maximum 1s after flipping one 0 in binary matrix. For each 0: sum of neighboring component sizes + 1.',
    algorithm: [
      'Union-Find to label connected components and their sizes.',
      'For each 0: collect unique neighboring component roots. Sum their sizes + 1.',
    ],
    pitfalls: ['Same as LC 827. Union-Find tracks component sizes. Avoid double-counting same component neighbors.'],
  },

  'minimum-deletions': {
    intuition: 'Minimum deletions to make string have distinct character frequencies. Sort frequencies, greedily decrement.',
    algorithm: [
      'Count frequencies. Sort descending. For each freq: if already used: decrement until unique or 0.',
    ],
    pitfalls: ['Same as LC 1647. Use a set of used frequencies. Greedy: reduce until you find unused frequency or 0.'],
  },

  'meeting-rooms': {
    intuition: 'Check if a person can attend all meetings (no overlaps). Sort by start, check for overlaps.',
    algorithm: [
      'Sort intervals by start. For i in 1..n-1: if intervals[i].start < intervals[i-1].end: overlap, return false.',
    ],
    pitfalls: ['Same as LC 252. Sort by start time. Overlap if next start < previous end.'],
  },

  'meeting-rooms-iii': {
    intuition: 'Find the room holding the most meetings when n rooms available. Assign to earliest-free room, track counts.',
    algorithm: [
      'Sort meetings by start. Min-heap of (end_time, room_id) for busy rooms; sorted set of free rooms.',
      'For each meeting: free rooms whose end <= start. Assign to lowest-indexed free room. Track count per room.',
    ],
    pitfalls: ['Same as LC 2402. Two priority queues: free rooms (sorted by id) and busy rooms (sorted by end time).'],
  },

  'minimum-weight-cycle': {
    intuition: 'Find minimum weight cycle in undirected weighted graph. For each edge, find shortest path between its endpoints without using that edge.',
    algorithm: [
      'For each edge (u,v,w): remove edge, run Dijkstra from u to v. Cycle weight = dist(u,v) + w.',
      'Return minimum such weight.',
    ],
    pitfalls: ['O(E * (V+E) log V). Alternatively: shortest cycle via modified BFS/Dijkstra from each node.'],
  },

  'minimum-height-roots': {
    intuition: 'Find root(s) of tree that minimize height (minimum height trees). Topological leaf-trimming.',
    algorithm: [
      'Repeatedly remove leaf nodes (degree 1) until 1 or 2 nodes remain. Those are the MHT roots.',
    ],
    pitfalls: ['Same as LC 310. At most 2 answers (center of tree). Trim leaves layer by layer like BFS.'],
  },

  '2d-difference-array': {
    intuition: 'Apply range updates on a 2D matrix efficiently. Difference array lets you add value to submatrix in O(1) then reconstruct in O(m*n).',
    algorithm: [
      'For update (r1,c1,r2,c2,val): diff[r1][c1]+=val, diff[r1][c2+1]-=val, diff[r2+1][c1]-=val, diff[r2+1][c2+1]+=val.',
      'Reconstruct: prefix sum row-wise then column-wise.',
    ],
    pitfalls: ['2D extension of 1D difference array. Four corners of the rectangle update. O(1) per update, O(m*n) to reconstruct.'],
  },

  '2d-submatrix-sum-queries': {
    intuition: 'Answer submatrix sum queries in O(1) using 2D prefix sums.',
    algorithm: [
      'prefix[i][j] = sum of matrix[0..i-1][0..j-1]. Query(r1,c1,r2,c2) = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1].',
    ],
    pitfalls: ['Inclusion-exclusion principle. Build prefix in O(m*n), each query O(1). Same as LC 304.'],
  },

  'all-subsets-xor-sum': {
    intuition: 'Sum of XOR of all subsets equals (bitwise OR of all elements) * 2^(n-1).',
    algorithm: [
      'Compute OR of all elements. Multiply by 2^(n-1).',
    ],
    pitfalls: ['Mathematical insight: each bit that appears in any element contributes 2^(n-1) to the total XOR sum.'],
  },

  'alternate-positive-and-negative-numbers': {
    intuition: 'Rearrange array so positive and negative numbers alternate. Two-pointer or collect and interleave.',
    algorithm: [
      'Collect positives and negatives separately. Interleave: place at even/odd indices.',
      'If counts differ: append remaining at end.',
    ],
    pitfalls: ['Maintain relative order if required. If counts differ, extras go at end. O(n) with extra space.'],
  },

  'alternative-sorting': {
    intuition: 'Sort such that first element is max, second is min, third is second max, etc. Sort then interleave.',
    algorithm: [
      'Sort ascending. Two pointers: left=0 (min side), right=n-1 (max side). Alternately pick from right then left.',
    ],
    pitfalls: ['Pick largest first at odd positions, smallest at even positions (or vice versa per problem spec).'],
  },

  'and-in-range': {
    intuition: 'Bitwise AND of all numbers from L to R. Common prefix of L and R in binary.',
    algorithm: [
      'While L != R: R >>= 1, L >>= 1, count shifts. Answer = L << count.',
    ],
    pitfalls: ['Same as LC 201. Shift both right until equal (find common prefix). Shift result back left.'],
  },

  'assign-mice-holes': {
    intuition: 'Assign n mice to n holes to minimize maximum distance. Sort both, match greedily.',
    algorithm: [
      'Sort mice positions and hole positions. Pair mice[i] with holes[i]. Answer = max(|mice[i]-holes[i]|).',
    ],
    pitfalls: ['Greedy: sorted pairing minimizes max distance. Proof by exchange argument.'],
  },

  'balancing-consonants-and-vowels-ratio': {
    intuition: 'Find substring where count of vowels equals count of consonants. Prefix count difference + hashmap.',
    algorithm: [
      'Track running (vowels - consonants). Use hashmap to find subarrays with difference = 0.',
    ],
    pitfalls: ['Reduce to "subarray with sum 0" via encoding vowels as +1 and consonants as -1. Hashmap of first occurrence.'],
  },

  'brackets-in-matrix-chain-multiplication': {
    intuition: 'Print the parenthesization of matrix chain multiplication with optimal order. Reconstruct from DP split table.',
    algorithm: [
      'Standard MCM DP: dp[i][j] = min operations. split[i][j] = optimal split point k.',
      'Reconstruct: recursively print (A_i..A_k)(A_{k+1}..A_j) using split table.',
    ],
    pitfalls: ['Same DP as matrix chain multiplication but with full parenthesization output. Recursion on split[][].'],
  },

  'bridge-edge-in-a-graph': {
    intuition: 'Check if a specific edge (u,v) is a bridge. Remove it, check if v is still reachable from u.',
    algorithm: [
      'Remove edge (u,v). BFS/DFS from u. If v not reachable: it is a bridge.',
    ],
    pitfalls: ['Simple approach: single DFS after removing edge. Or use Tarjan bridge algorithm for all bridges at once.'],
  },

  'case-specific-sorting-of-strings': {
    intuition: 'Sort string keeping uppercase letters at their original positions and lowercase at theirs, but each group sorted independently.',
    algorithm: [
      'Extract uppercase chars and sort. Extract lowercase chars and sort.',
      'Rebuild: place sorted uppercase at original uppercase positions, sorted lowercase at original lowercase positions.',
    ],
    pitfalls: ['Do not mix cases. Keep position types fixed; only sort within each type group.'],
  },

  'check-for-power': {
    intuition: 'Check if a number is a power of 2 (or given base k). Bit trick for power of 2.',
    algorithm: [
      'Power of 2: n > 0 && (n & (n-1)) == 0.',
      'Power of k: repeatedly divide by k; check remainder is 0 and quotient reaches 1.',
    ],
    pitfalls: ['Edge case: n=1 is k^0 for any k. n=0 is never a power. For k=1: only n=1.'],
  },

  'chocolate-pickup-ii': {
    intuition: 'Two robots collect chocolates from grid, starting at (0,0) and (0,n-1), moving down each step. 3D DP.',
    algorithm: [
      'dp[row][c1][c2] = max chocolates when robot1 at col c1 and robot2 at col c2 on given row.',
      'Transition: try all 9 combinations of moves (3 choices each). If c1==c2: count once.',
    ],
    pitfalls: ['Same as LC 1463. Since both on same row, only track (row, c1, c2). Count shared cell once.'],
  },

  'coin-piles': {
    intuition: 'Find maximum coins collectible where you pick coins from adjacent piles with given rules.',
    algorithm: [
      'DP or greedy based on problem constraints. If picking alternating: max sum of every other element.',
    ],
    pitfalls: ['Read constraints carefully: specific rule about which piles can be combined. Often a DP on sorted piles.'],
  },

  'consecutive-1s-not-allowed': {
    intuition: 'Count binary strings of length n with no two consecutive 1s.',
    algorithm: [
      'dp[i][0] = strings of length i ending in 0. dp[i][1] = strings ending in 1.',
      'dp[i][0] = dp[i-1][0] + dp[i-1][1]. dp[i][1] = dp[i-1][0]. Answer = dp[n][0] + dp[n][1].',
    ],
    pitfalls: ['Fibonacci-like recurrence. dp[n] = fib(n+2). Answer grows as Fibonacci sequence.'],
  },

  'construct-an-array-from-its-pair-sum-array': {
    intuition: 'Given pairSum[i] = arr[i]+arr[i+1], recover original array. Use first two pair sums to find first element.',
    algorithm: [
      'arr[0]+arr[1]=pairSum[0], arr[1]+arr[2]=pairSum[1], arr[0]+arr[2]=pairSum[2].',
      'arr[0] = (pairSum[0]-pairSum[1]+pairSum[2])/2. Derive rest: arr[i+1] = pairSum[i] - arr[i].',
    ],
    pitfalls: ['Solve system of equations for first element. All pair sums must be consistent.'],
  },

  'count-subset-with-target-sum-ii': {
    intuition: 'Count subsets with given sum where array may have duplicates. DP with proper handling of duplicate elements.',
    algorithm: [
      'Sort array. DP similar to 0-1 knapsack: dp[j] = count of subsets with sum j.',
      'For each num: update dp right-to-left (0-1 knapsack style).',
    ],
    pitfalls: ['Same as LC 416 count variant. Handle duplicates: 0-1 knapsack treats each element independently.'],
  },

  'count-unique-vowel-strings': {
    intuition: 'Count strings of length n containing all 5 vowels at least once. Inclusion-exclusion on vowel alphabet.',
    algorithm: [
      'Total strings with exactly all 5 vowels = inclusion-exclusion: subtract missing one vowel, add back two missing, etc.',
    ],
    pitfalls: ['Stars and bars with inclusion-exclusion. Or DP: dp[i][mask] = strings of length i containing vowels in mask.'],
  },

  'cutting-binary-string': {
    intuition: 'Minimum cuts to partition binary string into parts each representing a power of 2. DP with precomputed valid substrings.',
    algorithm: [
      'Precompute: for each substring, check if it is a power of 2 (no leading zeros, convert and check).',
      'DP: dp[i] = min cuts for s[0..i-1]. dp[i] = min(dp[j]+1) for all j where s[j..i-1] is power of 2.',
    ],
    pitfalls: ['Check power of 2 carefully: no leading zeros. Large binary strings need BigInteger or string comparison.'],
  },

  'expression-contains-redundant-bracket-or-not': {
    intuition: 'Check if expression has redundant brackets like ((a+b)). Stack-based: if operator found before closing bracket, brackets are non-redundant.',
    algorithm: [
      'Push everything except ")". On ")": pop until "(". If top after "(" pop has no operator: redundant.',
    ],
    pitfalls: ['Redundant bracket: closing bracket pops "()" with no operator between them. Track operator presence between brackets.'],
  },

  'find-h-index': {
    intuition: 'Find H-index: max h such that researcher has h papers with >= h citations. Sort descending, find crossover.',
    algorithm: [
      'Sort citations descending. For each i: if citations[i] >= i+1: h = i+1. Else break.',
    ],
    pitfalls: ['Same as LC 274. Sort descending, h-index is the largest i where citations[i] >= i+1 (1-indexed).'],
  },

  'game-of-xor': {
    intuition: 'XOR of XOR of all subarrays. Mathematical: element at index i contributes based on count of subarrays containing it.',
    algorithm: [
      'Element arr[i] appears in (i+1)*(n-i) subarrays. If this count is odd: XOR it into result.',
    ],
    pitfalls: ['Count occurrences: arr[i] is in subarrays starting at 0..i ending at i..n-1. Multiply counts.'],
  },

  'game-with-string': {
    intuition: 'Minimize maximum frequency after removing k characters. Priority queue on frequency counts.',
    algorithm: [
      'Count frequencies. Max-heap. Remove k characters from highest-frequency chars one by one.',
      'Actually: greedily reduce top frequencies. Max-heap, pop top, decrement, push back. Repeat k times.',
    ],
    pitfalls: ['Greedy: always remove from most frequent. After k removals, answer = top of heap.'],
  },

  'largest-subarray-of-0s-and-1s': {
    intuition: 'Find largest subarray with equal count of 0s and 1s. Replace 0 with -1, find max subarray with sum=0.',
    algorithm: [
      'Replace 0s with -1. Prefix sum approach: find max (j-i) where prefix[i] == prefix[j].',
      'HashMap stores first occurrence index of each prefix sum.',
    ],
    pitfalls: ['Same as LC 525. Transform then use prefix sum hashmap. Initialize map with {0: -1}.'],
  },

  'last-moment-before-all-ants-fall-out': {
    intuition: 'Ants on a plank walk to edges; when they collide they reverse. Key insight: collision = pass-through. Answer = max distance any ant travels.',
    algorithm: [
      'Ignore collisions (ants just pass through). Max time = max(max(left_positions), max(n - right_positions)).',
    ],
    pitfalls: ['Same as LC 1503. Collision = pass-through trick. Just find the ant that takes longest to reach its end.'],
  },

  'left-rotate-matrix-k-times': {
    intuition: 'Left rotate each row of matrix by k positions. Use modulo to handle k > cols.',
    algorithm: [
      'For each row: new_row[i] = old_row[(i+k) % n].',
    ],
    pitfalls: ['Rotate left by k = rotate right by (n-k). Build new array or use reversal trick.'],
  },

  'linked-list-matrix': {
    intuition: 'Construct a linked list from matrix in diagonal order. Traverse diagonals from bottom-left to top-right.',
    algorithm: [
      'Collect diagonals (d = row+col is constant per diagonal). Sort diagonals by index.',
      'Link nodes in order: diagonal 0, then 1, etc.',
    ],
    pitfalls: ['Each diagonal has d = row+col. Within diagonal: row decreases as col increases. Build linked list in traversal order.'],
  },

  'ncr': {
    intuition: 'Compute nCr (binomial coefficient) mod p. Pascal triangle DP or Fermat little theorem with modular inverse.',
    algorithm: [
      'Pascal: dp[i][j] = dp[i-1][j-1] + dp[i-1][j] mod p.',
      'For large n: precompute factorials and modular inverses. nCr = n! * modinv(r!) * modinv((n-r)!) mod p.',
    ],
    pitfalls: ['Pascal for small n. Modular inverse for large n (when p is prime use Fermat: a^(p-2) mod p).'],
  },

  'number-of-bst-from-array': {
    intuition: 'Count structurally unique BSTs from given array. Sort array; count depends only on subtree sizes.',
    algorithm: [
      'After sorting, this equals Catalan number C(n) = C(2n,n)/(n+1). Or DP: dp[n] = sum(dp[i]*dp[n-1-i]).',
    ],
    pitfalls: ['Unique BSTs from n distinct values = nth Catalan number. Same as LC 96.'],
  },

  'add-1-to-a-linked-list-number': {
    intuition: 'Add 1 to number stored in linked list. Reverse list, add 1 with carry, reverse back. Or recursively carry from end.',
    algorithm: [
      'Recursive: add 1 to last node. If sum >= 10: carry = 1, node.val = 0. Propagate carry back.',
      'If carry remains after head: insert new node with value 1 at front.',
    ],
    pitfalls: ['Reverse-add-reverse is simpler iteratively. Recursive carry propagation is cleaner but uses O(n) stack.'],
  },

  'all-numbers-with-specific-difference': {
    intuition: 'Find all pairs in array with absolute difference equal to k. Sort + two pointers or hashset lookup.',
    algorithm: [
      'Sort array. Two pointers i=0, j=1. If diff == k: record, advance both. If diff < k: j++. Else i++.',
    ],
    pitfalls: ['Handle duplicates carefully. If k=0: find all duplicate pairs. Sort + two-pointer avoids duplicates naturally.'],
  },

  'ascii-range-sum': {
    intuition: 'Sum of ASCII values of characters in a given range. Iterate and accumulate.',
    algorithm: [
      'For each character in string within range [l, r]: add its ASCII value to sum.',
    ],
    pitfalls: ['Straightforward string scan with index bounds. Cast char to int for ASCII value.'],
  },

  'closest-three-sum': {
    intuition: 'Find triplet with sum closest to target. Sort + two pointers for each anchor.',
    algorithm: [
      'Sort. For each i: two pointers l=i+1, r=n-1. Track minimum |sum-target|. Move pointers based on comparison.',
    ],
    pitfalls: ['Same as LC 16. Sort first. Update closest on each iteration. Early exit if exact match found.'],
  },

  'count-increasing-subarrays': {
    intuition: 'Count number of strictly increasing subarrays. For each run of length L: contributes L*(L+1)/2 subarrays.',
    algorithm: [
      'Track run length of current increasing sequence. When broken: count += run*(run+1)/2, reset run=1.',
      'Add final run at end.',
    ],
    pitfalls: ['A run of length L has L*(L+1)/2 strictly increasing subarrays (length 1,2,...,L). Sum over all runs.'],
  },

  'count-indices-to-balance-even-and-odd-sums': {
    intuition: 'Count indices where prefix sum of even-indexed and odd-indexed elements are equal.',
    algorithm: [
      'Running evenSum and oddSum. At each index: if evenSum == oddSum: increment count.',
    ],
    pitfalls: ['Update running sums based on current index parity. Check equality after each update.'],
  },

  'count-pairs-sum-in-matrices': {
    intuition: 'Count pairs (one from each matrix) whose sum equals a target. Sort one matrix, binary search or two-pointer.',
    algorithm: [
      'Flatten and sort matrix1. For each element in matrix2: binary search for (target - elem) in matrix1.',
    ],
    pitfalls: ['O(m*n * log(m*n)). Alternatively: one sorted ascending, one sorted descending, two-pointer on flattened arrays.'],
  },

  'count-the-coprimes': {
    intuition: 'Count pairs of indices (i, j) where gcd(arr[i], arr[j]) == 1 (coprime). Euler totient / brute force for small arrays.',
    algorithm: [
      'For each pair (i,j): if gcd(arr[i], arr[j]) == 1: count++.',
      'Optimization: precompute gcd or use inclusion-exclusion on prime factors.',
    ],
    pitfalls: ['Brute force O(n^2 log max) is often acceptable. For large arrays: sieve-based approach.'],
  },

  'count-ways-to-nth-stairorder-does-not-matter': {
    intuition: 'Count ways to reach nth stair using steps 1 or 2 (order does NOT matter). Same as coin change count with coins {1,2}.',
    algorithm: [
      'dp[i] = number of unordered ways to reach stair i. dp[i] = dp[i-1] + (i%2==0 ? 1 : 0) ... actually: floor(n/2) + 1.',
    ],
    pitfalls: ['Unordered: only care about how many 2-steps used. If k two-steps: uses 2k + (n-2k) one-steps. k = 0..n/2, so answer = floor(n/2) + 1.'],
  },

  'count-x-in-range-of-a-sorted-array': {
    intuition: 'Count occurrences of x in sorted rotated array. Binary search for left and right bounds.',
    algorithm: [
      'Use lower_bound and upper_bound binary search to find first and last positions of x.',
      'Count = upper_bound - lower_bound.',
    ],
    pitfalls: ['Two binary searches. Handle rotated sorted array by adjusting search range.'],
  },

  'coverage-of-all-zeros-in-a-binary-matrix': {
    intuition: 'Find minimum number of flips to cover all zeros. BFS from all ones simultaneously (multi-source BFS).',
    algorithm: [
      'Multi-source BFS from all 1-cells. For each 0-cell: distance = BFS steps to reach it.',
      'Minimum flips = max distance to cover all zeros.',
    ],
    pitfalls: ['Standard multi-source BFS. Each 0 is "covered" when a 1 spreads to it. Count layers needed.'],
  },

  'delete-alternate-nodes': {
    intuition: 'Delete every alternate node in linked list (keep first, delete second, keep third, etc.).',
    algorithm: [
      'Traverse: curr = head. While curr and curr.next: curr.next = curr.next.next. curr = curr.next.',
    ],
    pitfalls: ['Simple pointer manipulation. Ensure the "next" link skips the deleted node cleanly.'],
  },

  'delete-node-in-doubly-linked-list': {
    intuition: 'Delete a node from doubly linked list given a pointer to it.',
    algorithm: [
      'node.prev.next = node.next (if prev exists). node.next.prev = node.prev (if next exists).',
      'Handle head/tail edge cases.',
    ],
    pitfalls: ['O(1) deletion if pointer given. Update both prev and next neighbor pointers.'],
  },

  'deletion-and-reverse-in-circular-linked-list': {
    intuition: 'Delete a node from and reverse a circular linked list.',
    algorithm: [
      'Delete: find node before target (traverse until next == target). Relink to skip target.',
      'Reverse: standard linked list reverse but reconnect last node to new head.',
    ],
    pitfalls: ['Circular: tail.next == head. On deletion: traverse the full circle to find predecessor. On reverse: fix the circularity after reversal.'],
  },

  'design-minmax-queue': {
    intuition: 'Queue supporting O(1) min and max queries. Use two deques (one for min, one for max) alongside main queue.',
    algorithm: [
      'Enqueue x: pop from back of minDeque while back > x; pop from back of maxDeque while back < x. Push to both.',
      'Dequeue: if front of minDeque == front of queue: pop minDeque. Same for maxDeque. Pop main queue.',
    ],
    pitfalls: ['Monotonic deques maintain min and max. Front of each deque is current min/max. O(1) amortized per operation.'],
  },

  'difference-check': {
    intuition: 'Check if two strings are anagrams or differ in exactly one character transposition.',
    algorithm: [
      'Count character frequency difference. If all zeros: anagram. If exactly two chars differ by symmetric amounts: single swap.',
    ],
    pitfalls: ['Sort both and compare, or use frequency array difference. Edge case: same string with repeated characters.'],
  },

  'distribute-candies': {
    intuition: 'Distribute minimum candies satisfying neighbor rating constraint. Two-pass greedy.',
    algorithm: [
      'Left pass: if ratings[i] > ratings[i-1]: candies[i] = candies[i-1]+1. Right pass: if ratings[i] > ratings[i+1]: candies[i] = max(candies[i], candies[i+1]+1).',
    ],
    pitfalls: ['Same as LC 135. Two directional passes. Sum of all candies array is the answer.'],
  },

  'divisible-by-13': {
    intuition: 'Check if large number (given as string) is divisible by 13. Iterative modulo on digits.',
    algorithm: [
      'Process digit by digit: remainder = (remainder * 10 + digit) % 13.',
    ],
    pitfalls: ['Standard modular arithmetic for large numbers. O(n) where n = number of digits.'],
  },

  'elements-in-range-a-b': {
    intuition: 'Count or find elements in a sorted array within range [a, b]. Binary search for lower and upper bounds.',
    algorithm: [
      'lower = lower_bound(a), upper = upper_bound(b). Count = upper - lower.',
    ],
    pitfalls: ['Two binary searches. Same as LC 34 extended to a range. O(log n).'],
  },

  'equalize-the-towers': {
    intuition: 'Minimum cost to equalize tower heights where cost = sum of |final - original| for each tower.',
    algorithm: [
      'Optimal target height minimizes total deviation. For sum of absolute deviations: target = median.',
    ],
    pitfalls: ['Median minimizes L1 distance. Sort towers, take median, compute cost. O(n log n).'],
  },

  'exactly-one-swap': {
    intuition: 'Check if string can become another with exactly one swap of characters.',
    algorithm: [
      'Find positions of differences. If 2 differences: check swapping those positions makes strings equal.',
      'If 0 differences: must have at least one duplicate character (swap same chars).',
    ],
    pitfalls: ['Exactly 2 diff positions: verify cross-swap. 0 differences: valid only if duplicate char exists for identity swap.'],
  },

  'extract-the-number-from-the-string': {
    intuition: 'Extract all numeric substrings from a string and compute their sum or return them.',
    algorithm: [
      'Scan: when digit found, collect consecutive digits to form number. Add to result.',
    ],
    pitfalls: ['Handle multi-digit numbers by accumulating. Use isDigit check. Parse each numeric run.'],
  },

  'facing-the-sun': {
    intuition: 'Count buildings that can see the sunrise (no taller building to the left). Scan left to right tracking max height.',
    algorithm: [
      'maxH = 0. For each building: if height > maxH: count++, maxH = height.',
    ],
    pitfalls: ['First building always sees sun. Each subsequent: sees sun only if taller than all previous. O(n).'],
  },

  'farthest-smaller-right': {
    intuition: 'For each element, find the farthest index to the right with a smaller value. Monotonic stack + precomputed suffix.',
    algorithm: [
      'Process from right to left. For each i: binary search in stack for largest j > i with arr[j] < arr[i].',
    ],
    pitfalls: ['Different from next smaller element (farthest not nearest). Binary search in monotone stack for furthest valid index.'],
  },

  'find-only-repetitive-element-from-1-to-n-1': {
    intuition: 'Array of length n with values 1..n-1, one repeated. XOR or sum formula to find duplicate.',
    algorithm: [
      'Sum formula: duplicate = sum(array) - n*(n-1)/2.',
      'XOR: XOR all array elements with 1..n-1. Remaining XOR is the duplicate.',
    ],
    pitfalls: ['Sum can overflow for large n; use long. XOR is clean and O(n) O(1).'],
  },

  'find-rectangle-with-corners-as-1': {
    intuition: 'Find if any rectangle exists with all four corners as 1 in binary matrix. For each row pair, check column overlap.',
    algorithm: [
      'For each row: store set of column indices with 1. For each pair of rows: if two cols are 1 in both rows: rectangle found.',
    ],
    pitfalls: ['O(m^2 * n) with hashset per row. For each row pair: intersect their column sets. If intersection >= 2: true.'],
  },

  'form-a-palindrome': {
    intuition: 'Minimum insertions to make string a palindrome. LPS (Longest Palindromic Subsequence) DP.',
    algorithm: [
      'min_insertions = n - LPS(s). LPS = LCS(s, reverse(s)).',
    ],
    pitfalls: ['Same as LC 516 complement. LPS via LCS with reversed string. O(n^2) DP.'],
  },

  'generate-permutations-of-an-array': {
    intuition: 'Generate all permutations of an array. Backtracking with swap-at-current-position.',
    algorithm: [
      'Backtrack: swap arr[start] with arr[i] for i in start..n-1. Recurse with start+1. Swap back.',
    ],
    pitfalls: ['Same as LC 46. O(n! * n) total. For unique elements only. For duplicates: sort and skip duplicates.'],
  },

  'get-minimum-squares': {
    intuition: 'Minimum number of perfect squares summing to n. BFS or DP.',
    algorithm: [
      'DP: dp[i] = min(dp[i - j*j] + 1) for all j where j*j <= i. Base: dp[0]=0.',
    ],
    pitfalls: ['Same as LC 279. Precompute squares up to sqrt(n). O(n * sqrt(n)) DP. BFS gives same result.'],
  },

  'graph-diameter': {
    intuition: 'Find diameter of a graph (longest shortest path between any two nodes). Two BFS for trees; Floyd-Warshall for general graphs.',
    algorithm: [
      'For tree: BFS from any node to find farthest node u. BFS from u to find farthest node v. Diameter = dist(u,v).',
      'For general graph: Floyd-Warshall, then max of all dist[i][j].',
    ],
    pitfalls: ['Tree diameter: two-BFS trick works perfectly. General graph: O(V^3) Floyd-Warshall.'],
  },

  'group-balls-by-sequence': {
    intuition: 'Group array elements into minimum number of subsequences where each is strictly increasing by 1.',
    algorithm: [
      'Sort array. Use a hashmap: count available sequences ending at value v. Place current in sequence ending at v-1.',
      'If no such sequence: start new one. If no sequence exists when needed: impossible.',
    ],
    pitfalls: ['Same as LC 659 (split into consecutive sequences). Greedy with end-count map.'],
  },

  'happiest-triplet': {
    intuition: 'Find triplet (i,j,k) maximizing arr[i]*arr[j]+arr[j]*arr[k]. Fix middle element j, multiply max left and max right with it.',
    algorithm: [
      'Precompute prefixMax[i] = max(arr[0..i-1]). Precompute suffixMax[i] = max(arr[i+1..n-1]).',
      'For each j: candidate = prefixMax[j]*arr[j] + arr[j]*suffixMax[j]. Track maximum.',
    ],
    pitfalls: ['O(n) with prefix/suffix max arrays. Middle element determines the max possible value.'],
  },

  'identical-linked-lists': {
    intuition: 'Check if two linked lists are identical (same values in same order).',
    algorithm: [
      'Traverse both simultaneously. If values differ or lengths differ: false. If both reach null: true.',
    ],
    pitfalls: ['Simple O(n) comparison. Same as LC 100 but for linked lists.'],
  },

  'implement-k-queues-in-a-single-array': {
    intuition: 'Implement k queues using a single array efficiently. Use free list and index arrays to track fronts, rears, and next.',
    algorithm: [
      'Maintain arrays: front[k], rear[k] (indices in main array), next[n] (next free or next in queue).',
      'Free list manages unused slots. Enqueue: take from free list, link. Dequeue: return to free list.',
    ],
    pitfalls: ['Space-efficient: O(n+k) space for n total elements across k queues. Complex pointer arithmetic.'],
  },

  'insert-in-sorted-circular-linked-list': {
    intuition: 'Insert a value into sorted circular linked list maintaining order.',
    algorithm: [
      'Find insertion point: node where curr.val <= val <= curr.next.val. Or at wrap-around point.',
      'Handle: empty list, value less than min, value greater than max (insert at wrap).',
    ],
    pitfalls: ['Three cases: normal insertion, insert at boundary (new max or new min), empty list. Same as LC 708.'],
  },

  'insert-in-sorted-way-in-a-sorted-dll': {
    intuition: 'Insert a node in sorted doubly linked list maintaining sorted order.',
    algorithm: [
      'Traverse to find correct position. Insert before first node with value >= new value.',
    ],
    pitfalls: ['Update both prev and next pointers of adjacent nodes. Handle insertion at head.'],
  },

  'integral-points-inside-triangle': {
    intuition: 'Count lattice points (integer coordinates) strictly inside a triangle. Pick theorem: I = A - B/2 + 1.',
    algorithm: [
      'A = area via shoelace formula (use abs and integer arithmetic).',
      'B = boundary points on each edge = gcd(|dx|,|dy|). I = A - B/2 + 1.',
    ],
    pitfalls: ['Pick theorem: Interior = Area - Boundary/2 + 1. Area must be computed as integer (multiply by 2 to avoid fractions).'],
  },

  'interleave-the-first-half-of-the-queue-with-second-half': {
    intuition: 'Interleave first half of queue with second half: [1,2,3,4,5,6] -> [1,4,2,5,3,6].',
    algorithm: [
      'Push first half into stack. Enqueue stack elements alternated with second-half dequeues.',
    ],
    pitfalls: ['Use stack for first half reversal. Then interleave: dequeue second-half element, enqueue first pair, repeat.'],
  },

  'intersection-in-y-shaped-lists': {
    intuition: 'Find intersection node of two linked lists forming a Y-shape. Two-pointer length equalization.',
    algorithm: [
      'Get lengths. Advance longer list by length difference. Then advance both until they meet.',
    ],
    pitfalls: ['Same as LC 160. Alternatively: concatenate A+B and B+A � both pointers meet at intersection after equal steps.'],
  },

  'intersection-of-two-arrays-with-duplicate-elements': {
    intuition: 'Find intersection counting multiplicities. Sort both, two-pointer or frequency maps.',
    algorithm: [
      'Sort both. Two pointers: advance smaller, collect equal elements.',
    ],
    pitfalls: ['Same as LC 350. Each element in result appears as many times as it appears in both arrays.'],
  },

  'intersection-of-two-sorted-arrays': {
    intuition: 'Find common elements of two sorted arrays. Two-pointer scan.',
    algorithm: [
      'i=0, j=0. While both in bounds: if equal: add to result, advance both. If arr1[i]<arr2[j]: i++. Else j++.',
    ],
    pitfalls: ['No duplicates in output (each element once). For duplicates: use same two-pointer but skip duplicates after match.'],
  },

  'is-linked-list-length-even': {
    intuition: 'Check if linked list has even length. Count nodes or advance two pointers.',
    algorithm: [
      'Fast pointer: advance by 2 each step. If fast reaches null: even. If fast.next reaches null: odd.',
    ],
    pitfalls: ['O(n/2) with fast pointer. Or simply count and check % 2.'],
  },

  'k-closest-elements': {
    intuition: 'Find k elements closest to a given value in sorted array. Binary search for starting position, then expand window.',
    algorithm: [
      'Binary search for insertion point of x. Expand window of size k using two pointers comparing left and right distances.',
    ],
    pitfalls: ['Same as LC 658. Start with position found by binary search. Prefer left element when distances are equal.'],
  },

  'k-closest-values': {
    intuition: 'Find k elements closest to a target in BST. In-order traversal + sliding window or priority queue.',
    algorithm: [
      'In-order traversal gives sorted sequence. Use deque of size k: if adding new element improves (closer than front): add and pop front if size > k.',
    ],
    pitfalls: ['In-order + deque maintains closest k. Compare new element vs oldest in deque. Stop when distance starts increasing.'],
  },

  'k-pangrams': {
    intuition: 'Check if string can be made a pangram (contains all 26 letters) by adding at most k characters.',
    algorithm: [
      'Count distinct letters present. Missing = 26 - distinct. If missing <= k: yes.',
    ],
    pitfalls: ['Pangram needs all 26 letters. Count unique letters, compute deficit. Simple O(n).'],
  },

  'kth-distance': {
    intuition: 'Count pairs with distance exactly k in array. Sort + sliding window or hashset.',
    algorithm: [
      'For each element x: check if x+k exists in hashset.',
    ],
    pitfalls: ['Same as LC 532. Use set to check x+k. Avoid double counting. k=0: count duplicate pairs.'],
  },

  'kth-element-in-matrix': {
    intuition: 'Find kth smallest element in row-wise and column-wise sorted matrix. Binary search on value.',
    algorithm: [
      'Binary search on value range [matrix[0][0], matrix[n-1][n-1]]. For mid: count elements <= mid.',
      'Count using staircase from top-right: O(n) per count.',
    ],
    pitfalls: ['Same as LC 378. Binary search on answer, not index. Count <= mid in O(n).'],
  },

  'kth-missing-positive-number-in-a-sorted-array': {
    intuition: 'Find kth missing positive integer. Binary search on index: missing before index i = arr[i]-i-1.',
    algorithm: [
      'Binary search: if arr[mid]-mid-1 < k: lo=mid+1. Else hi=mid-1. Answer = lo+k.',
    ],
    pitfalls: ['Same as LC 1539. Missing count before index i = arr[i]-(i+1). Binary search for split point.'],
  },

  'kth-smallest-number-in-multiplication-table': {
    intuition: 'Find kth smallest in m x n multiplication table. Binary search on value, count elements <= mid.',
    algorithm: [
      'Binary search in [1, m*n]. Count(x) = sum of min(x/i, n) for i in 1..m.',
    ],
    pitfalls: ['Same as LC 668. Count how many entries <= x by iterating over rows. O(m log(mn)).'],
  },

  'lcm-triplet': {
    intuition: 'Find triplet with maximum LCM. LCM is maximized by largest three consecutive integers or similar.',
    algorithm: [
      'Check triplets near n: (n,n-1,n-2), (n,n-1,n-3) when n-2 is even, etc. Compute LCM for candidates.',
    ],
    pitfalls: ['Do not just pick three largest; even numbers reduce LCM. Check a few candidate triplets near n.'],
  },

  'length-of-longest-cycle-in-a-graph': {
    intuition: 'Find length of longest cycle in directed graph. DFS with distance array tracking depth of discovery.',
    algorithm: [
      'DFS with dist[] tracking current DFS depth. On back edge to node v: cycle length = dist[u] - dist[v] + 1.',
    ],
    pitfalls: ['Same as LC 2360. Track dist for visited-in-current-DFS nodes. Reset after DFS returns.'],
  },

  'lexicographically-largest-string-after-deleting-k-characters': {
    intuition: 'Get lexicographically largest string by deleting exactly k characters. Greedy with monotonic stack.',
    algorithm: [
      'Use stack. For each char: while stack not empty and top < current and k > 0: pop, k--. Push current.',
      'If k > 0: pop from end. Collect stack as result.',
    ],
    pitfalls: ['Similar to LC 402 but maximizing. Pop smaller characters greedily. Reverse comparison from minimum-removal.'],
  },

  'linked-list-of-strings-forms-a-palindrome': {
    intuition: 'Concatenate all strings in linked list, check if result is a palindrome.',
    algorithm: [
      'Build concatenated string. Two-pointer palindrome check.',
    ],
    pitfalls: ['Concatenate first, then check. O(total length). Or check character by character across nodes.'],
  },

  'longest-bounded-difference-subarray': {
    intuition: 'Find longest subarray where max - min <= k. Sliding window with two monotonic deques.',
    algorithm: [
      'Maintain maxDeque and minDeque. If max-min > k: shrink window from left, removing outdated elements.',
    ],
    pitfalls: ['Same as LC 2401 / 1438. Two deques for running max and min. When constraint violated: advance left pointer.'],
  },

  'longest-common-prefix-of-strings': {
    intuition: 'Find longest common prefix of all strings. Vertical scan or sort and compare first/last.',
    algorithm: [
      'Sort array. LCP of entire array = LCP of first and last string (they differ most after sorting).',
    ],
    pitfalls: ['Same as LC 14. Sort trick reduces to comparing just first and last. O(n log n + m) where m=prefix length.'],
  },

  'longest-periodic-proper-prefix': {
    intuition: 'Find length of longest proper prefix of string that is also a suffix with period dividing string length. KMP failure function.',
    algorithm: [
      'Compute KMP failure function (lps). Answer related to lps[n-1] if length divides n.',
    ],
    pitfalls: ['Period check: if (n % (n - lps[n-1])) == 0: string has period n-lps[n-1]. Longest proper periodic prefix = lps[n-1].'],
  },

  'longest-span-in-two-binary-arrays': {
    intuition: 'Find longest span [i..j] where count of 1s in both arrays are equal. Difference prefix sum + hashmap.',
    algorithm: [
      'Compute running difference (count1_in_A - count1_in_B). Find max span with same difference value using first occurrence map.',
    ],
    pitfalls: ['Reduce to "longest subarray with sum 0" by encoding as +1/-1 per array and tracking difference.'],
  },

  'add-number-linked-lists': {
    intuition: 'Add two numbers stored as linked lists (digits in order). Reverse both, add with carry, reverse result.',
    algorithm: [
      'Reverse both lists. Add digit by digit with carry. If carry remains: add new node. Reverse result list.',
    ],
    pitfalls: ['Same as LC 2 but digits may be stored in forward order. Handle different lengths with zero-padding.'],
  },

  'all-unique-permutations-of-an-array': {
    intuition: 'Generate all unique permutations of array with duplicates. Sort + backtrack with skip-duplicates logic.',
    algorithm: [
      'Sort array. Backtrack: for each position, skip if arr[i]==arr[i-1] and i-1 not used. Swap and recurse.',
    ],
    pitfalls: ['Same as LC 47. Must sort first. Skip duplicate choices at same recursion level to avoid repeat permutations.'],
  },

  'bellmanford': {
    intuition: 'Single-source shortest paths in graph with negative weights. Relax all edges V-1 times.',
    algorithm: [
      'Initialize dist[src]=0, rest=INF. Repeat V-1 times: for each edge (u,v,w): if dist[u]+w < dist[v]: update.',
      'Run one more pass: if any update possible, negative cycle exists.',
    ],
    pitfalls: ['O(VE) time. Works with negative weights unlike Dijkstra. Detect negative cycles in V-th pass.'],
  },

  'bus-conductor': {
    intuition: 'Simulate bus ticketing: given boarding and alighting stops, compute passengers at each stop.',
    algorithm: [
      'For each passenger: increment count at boarding stop, decrement at alighting. Prefix sum gives occupancy.',
    ],
    pitfalls: ['Difference array technique. O(n+m) where m = number of stops. Process boarding/alighting events.'],
  },

  'bus-ticket-change': {
    intuition: 'Check if conductor can give change for all passengers given ticket prices and available coins.',
    algorithm: [
      'Simulate: for each passenger fare, check if exact change can be made from current coins. Update coin counts.',
    ],
    pitfalls: ['Greedy: always use largest denomination first when giving change. Track available coin counts.'],
  },

  'buy-stock-with-transaction-fee': {
    intuition: 'Maximize profit from unlimited stock transactions with a transaction fee. DP: hold/not-hold states.',
    algorithm: [
      'dp: cash = max(cash, hold+price-fee). hold = max(hold, cash-price). Answer is cash.',
    ],
    pitfalls: ['Same as LC 714. Fee charged once per complete transaction. Two-state DP is O(n) time O(1) space.'],
  },

  'casespecific-sorting-of-strings': {
    intuition: 'Sort string keeping uppercase in their positions and lowercase in their positions separately.',
    algorithm: [
      'Extract uppercase letters and positions, extract lowercase letters and positions. Sort each group. Re-place.',
    ],
    pitfalls: ['Two separate sorted sequences. Map back to original case-specific positions. O(n log n).'],
  },

  'check-if-a-string-is-subsequence-of-other': {
    intuition: 'Check if string A is a subsequence of string B. Two-pointer scan.',
    algorithm: [
      'i=0 (pointer in A), j=0 (pointer in B). If B[j]==A[i]: i++. j++ always. If i reaches len(A): true.',
    ],
    pitfalls: ['Same as LC 392. O(n) greedy scan. A is subsequence of B if all chars of A found in order in B.'],
  },

  'check-if-frequencies-can-be-equal': {
    intuition: 'Check if all characters can have equal frequency by removing exactly one character occurrence.',
    algorithm: [
      'Count frequencies. If all equal: valid. If one frequency is 1 more than others and occurs once: remove it.',
      'Special cases: only one distinct char, or all same frequency, or (n-1)/k = uniform after one removal.',
    ],
    pitfalls: ['Multiple edge cases. Valid conditions: 1) all same freq, 2) removing one occurrence makes all equal, 3) one char with freq 1 can be fully removed.'],
  },

  'check-if-two-line-segments-intersect': {
    intuition: 'Check if two line segments intersect using cross product orientation test.',
    algorithm: [
      'Compute orientation of triplets (p1,q1,p2), (p1,q1,q2), (p2,q2,p1), (p2,q2,q1).',
      'General case: segments intersect if orientations differ. Special case: collinear overlap.',
    ],
    pitfalls: ['Use cross product sign for orientation. Handle collinear case with on-segment bounding box check.'],
  },

  'chocolates-pickup': {
    intuition: 'Two people traverse grid from top to bottom simultaneously, maximize total chocolate picked. 3D DP.',
    algorithm: [
      'DP state: (row, col1, col2). Both move down, each can go left/diagonal/right. Sum chocolates (avoid double-counting same cell).',
    ],
    pitfalls: ['Same as LC 1463 (Cherry Pickup II). DP[r][c1][c2]. O(n*m^2) with memoization.'],
  },

  'clone-list-with-next-and-random': {
    intuition: 'Deep clone linked list with next and random pointers. Interleave cloned nodes then separate.',
    algorithm: [
      'Step 1: insert clone after each node. Step 2: set random pointers for clones. Step 3: separate lists.',
    ],
    pitfalls: ['Same as LC 138. O(n) time O(1) extra space using interleaving approach. Avoid using hashmap if O(1) space required.'],
  },

  'closest-neighbour-in-bst': {
    intuition: 'Find value in BST closest to a given target. BST traversal updating minimum difference.',
    algorithm: [
      'Traverse BST. Update closest when |node.val - target| < current min diff. Go left if target < node, else right.',
    ],
    pitfalls: ['BST property guides traversal. Track closest seen so far. O(h) time where h = tree height.'],
  },

  'compare-two-fractions': {
    intuition: 'Compare two fractions a/b and c/d without floating point. Cross multiply: a*d vs c*b.',
    algorithm: [
      'If a*d > b*c: first fraction is larger. If equal: fractions are equal. Else second is larger.',
    ],
    pitfalls: ['Use long multiplication to avoid overflow. Do not divide to decimal � loss of precision.'],
  },

  'construct-an-array-from-its-pairsum-array': {
    intuition: 'Given n*(n-1)/2 pair sums, reconstruct original array. Use first three pair sums to find first three elements.',
    algorithm: [
      'For n>=2: pairSums[0]+pairSums[1]-pairSums[n-1] = 2*arr[0]. Derive arr[0], then arr[i] = pairSum[i-1] - arr[0].',
    ],
    pitfalls: ['Tricky construction: sum of all elements can be found, then individual elements derived. Handle even/odd n carefully.'],
  },

  'construct-tree-from-preorder-postorder': {
    intuition: 'Construct binary tree from preorder and postorder traversals. preorder[0] is root, preorder[1] is left subtree root.',
    algorithm: [
      'Root = preorder[0]. Left root = preorder[1]. Find preorder[1] in postorder to determine left subtree size. Recurse.',
    ],
    pitfalls: ['May not be unique if tree can have nodes with one child. Assume full binary tree for unique solution.'],
  },

  'count-elements-less-than-or-equal-to-k-in-a-sorted-rotated-array': {
    intuition: 'Count elements <= k in sorted rotated array. Binary search to handle rotation.',
    algorithm: [
      'Find rotation pivot. Two binary searches on two sorted halves. Count elements <= k in each half.',
    ],
    pitfalls: ['Sorted rotated array splits into two sorted runs. Apply upper_bound on each half and sum counts.'],
  },

  'count-linked-list-nodes': {
    intuition: 'Count total number of nodes in a linked list.',
    algorithm: [
      'Traverse from head, increment counter at each node until null.',
    ],
    pitfalls: ['Simple O(n) traversal. Edge case: empty list returns 0.'],
  },

  'count-numbers-containing-specific-digits': {
    intuition: 'Count numbers in range [1, n] that contain at least one of the given specific digits.',
    algorithm: [
      'Digit DP: count numbers with all digits NOT in the set, subtract from total n.',
    ],
    pitfalls: ['Complement counting is easier. Count numbers with no forbidden digits using digit DP or combinatorics.'],
  },

  'count-of-distinct-substrings': {
    intuition: 'Count number of distinct substrings of a string. Suffix array + LCP array.',
    algorithm: [
      'Build suffix array. Count = n*(n+1)/2 - sum(LCP array).',
    ],
    pitfalls: ['Total substrings minus duplicates identified by LCP. O(n log n) suffix array. Alternatively: Trie approach.'],
  },

  'count-pairs-with-given-sum': {
    intuition: 'Count pairs in array with given sum. HashMap frequency count.',
    algorithm: [
      'For each element x: count += freq[target-x]. Then freq[x]++.',
    ],
    pitfalls: ['Same as LC 1. Count pairs not elements. Process in one pass: check first, then add to map to avoid counting element with itself.'],
  },

  'count-smaller-elements': {
    intuition: 'For each element, count how many elements to its right are smaller. Merge sort or BIT.',
    algorithm: [
      'BIT/Fenwick tree: process right to left. For each element: query(val-1) gives count of smaller elements seen so far. Update BIT.',
    ],
    pitfalls: ['Same as LC 315. Coordinate compress if values are large. Merge sort approach also O(n log n).'],
  },

  'count-subarray-with-k-odds': {
    intuition: 'Count subarrays with exactly k odd numbers. Prefix sum with at-most-k trick.',
    algorithm: [
      'Count(exactly k) = Count(at most k) - Count(at most k-1). Count at most k: sliding window.',
    ],
    pitfalls: ['Same as LC 1248. Sliding window counts at-most-k. Subtract to get exactly-k. O(n).'],
  },

  'count-the-paths': {
    intuition: 'Count paths in a grid from top-left to bottom-right with obstacles. Standard DP.',
    algorithm: [
      'dp[i][j] = dp[i-1][j] + dp[i][j-1] if not obstacle, else 0.',
    ],
    pitfalls: ['Same as LC 62/63. Handle first row and column initialization. Obstacle sets dp to 0.'],
  },

  'counting-elements-in-two-arrays': {
    intuition: 'For each element in array A, count elements in array B that are less than or equal to it.',
    algorithm: [
      'Sort B. For each element in A: binary search upper_bound in B gives count.',
    ],
    pitfalls: ['Sort B once, then O(log n) per query. Total O((m+n) log n). Output count array.'],
  },

  'expression-add-operators': {
    intuition: 'Add +, -, * operators between digits to make expression equal to target. DFS/backtracking.',
    algorithm: [
      'DFS: try each split point. Track current value and last multiplication term for correct order-of-operations.',
      'When multiplying: current = current - last + last*next.',
    ],
    pitfalls: ['Same as LC 282. Must track last operand to handle * correctly. No leading zeros for multi-digit numbers.'],
  },

  'find-all-possible-palindromic-partitions-of-a-string': {
    intuition: 'Find all ways to partition string so every substring is a palindrome. Backtracking + palindrome precompute.',
    algorithm: [
      'Precompute isPalin[i][j] with DP. Backtrack: at each position, try all palindromic substrings starting here.',
    ],
    pitfalls: ['Same as LC 131. Precompute palindrome table in O(n^2). Backtrack with O(n) palindrome check or use the table.'],
  },

  'find-hindex': {
    intuition: 'Find H-index: maximum h such that researcher has h papers each cited at least h times.',
    algorithm: [
      'Sort citations descending. Find largest h where citations[h-1] >= h.',
    ],
    pitfalls: ['Same as LC 274. Binary search on sorted array or linear scan. H-index is the knee of the citation curve.'],
  },

  'find-k-smallest-sum-pairs': {
    intuition: 'Find k pairs (one from each sorted array) with smallest sums. Min-heap.',
    algorithm: [
      'Push (arr1[0]+arr2[j], 0, j) for j=0..k-1 into min-heap. Pop k times, each time push (arr1[i+1]+arr2[j], i+1, j).',
    ],
    pitfalls: ['Same as LC 373. Initial seeds from first element of arr1 with all of arr2. Pop and expand.'],
  },

  'find-length-of-loop': {
    intuition: 'Find length of cycle in linked list. Floyd detection then count cycle length.',
    algorithm: [
      'Floyd slow/fast: detect cycle. From meeting point, advance one pointer until it returns. Count steps.',
    ],
    pitfalls: ['After cycle detected: keep one pointer at meeting point, advance other until it loops back. O(n).'],
  },

  'find-maximum-volume-of-a-cuboid': {
    intuition: 'Given constraint sum of dimensions = k, maximize volume l*w*h. By AM-GM inequality, cube maximizes volume.',
    algorithm: [
      'For integer dimensions: floor(k/3)^2 * ceil(k/3) adjusted for remainder. Try (q,q,q), (q,q,q+1), (q,q+1,q+1).',
    ],
    pitfalls: ['AM-GM: equal dimensions maximize product. For integer constraints: check two or three candidate triples.'],
  },

  'find-only-repetitive-element-from-1-to-n1': {
    intuition: 'Array of size n with values 1 to n-1, one repeated. Find it using XOR or sum formula.',
    algorithm: [
      'Sum formula: ans = sum(arr) - n*(n-1)/2.',
      'XOR: XOR all elements with 1..n-1. Result is the duplicate.',
    ],
    pitfalls: ['Sum overflow: use long. XOR method is O(n) O(1) with no overflow risk.'],
  },

  'find-the-closest-pair-from-two-arrays': {
    intuition: 'Find pair (one from each sorted array) with sum closest to a target.',
    algorithm: [
      'Two pointers: i starts at end of arr1, j starts at beginning of arr2. Move based on sum vs target.',
    ],
    pitfalls: ['Similar to two-sum on two sorted arrays. O(m+n) after sorting. Track minimum |sum-target|.'],
  },

  'find-the-first-node-of-loop-in-linked-list': {
    intuition: 'Find the node where the cycle begins in linked list. Floyd then entry-point trick.',
    algorithm: [
      'Detect cycle with Floyd. Reset slow to head. Advance both slow and fast one step at a time. They meet at cycle start.',
    ],
    pitfalls: ['Same as LC 142. Mathematical proof: distance from head to cycle entry = distance from meeting point to cycle entry.'],
  },

  'find-the-longest-string': {
    intuition: 'Find longest string in array that is a subsequence of all other strings (or similar constraint).',
    algorithm: [
      'Sort by length. For each string: check if it is subsequence of others. Return longest valid one.',
    ],
    pitfalls: ['Check each candidate string as subsequence of target string. O(n*m) total.'],
  },

  'find-the-sum-of-last-n-nodes-of-the-linked-list': {
    intuition: 'Sum last n nodes of linked list. Two-pointer with gap n, or recursive.',
    algorithm: [
      'Two pointers: advance first pointer n steps. Then advance both until first reaches end. Sum from second pointer.',
    ],
    pitfalls: ['Classic sliding window for linked list. Or convert to array, sum last n elements. O(n).'],
  },

  'indexes-of-subarray-sum': {
    intuition: 'Find starting and ending index of first subarray with sum equal to target (non-negative array). Sliding window.',
    algorithm: [
      'Sliding window: expand right, contract left when sum > target. When sum == target: return [left+1, right+1] (1-indexed).',
    ],
    pitfalls: ['Works for non-negative elements only. For negative elements: prefix sum + hashmap. Return 1-indexed result.'],
  },

  'kpangrams': {
    intuition: 'Check if string can be made a pangram (all 26 letters present) by adding at most k characters.',
    algorithm: [
      'Count distinct letters in string. Missing = 26 - distinct. If missing <= k: yes.',
    ],
    pitfalls: ['Count unique letters using set or frequency array. Simple O(n) scan.'],
  },

  'kth-element-of-two-arrays': {
    intuition: 'Find kth element in the merged sorted sequence of two sorted arrays. Binary search.',
    algorithm: [
      'Binary search: partition arr1 to have i elements and arr2 to have k-i elements. Adjust based on boundary comparisons.',
    ],
    pitfalls: ['Same idea as LC 4 (median of two sorted arrays). O(log(min(m,n))). Handle edge cases for array boundaries.'],
  },

  'kth-largest-sum-contiguous-subarray': {
    intuition: 'Find kth largest sum among all contiguous subarrays. Min-heap of size k.',
    algorithm: [
      'Compute all prefix sums. For each pair (i,j): subarray sum = prefix[j]-prefix[i-1]. Use min-heap of size k.',
    ],
    pitfalls: ['O(n^2 log k) with heap. For large arrays: more advanced approaches needed. All O(n^2) subarray sums considered.'],
  },

  'kth-smallest-in-bst': {
    intuition: 'Find kth smallest element in BST. In-order traversal (left-root-right) yields sorted order.',
    algorithm: [
      'In-order traversal with counter. When counter reaches k: return current node value.',
    ],
    pitfalls: ['Same as LC 230. Iterative in-order with stack or Morris traversal for O(1) space.'],
  },

  'largest-pair-sum': {
    intuition: 'Find the largest sum of any two elements in the array. Linear scan for max and second max.',
    algorithm: [
      'Single pass: track max1 and max2. Answer = max1 + max2.',
    ],
    pitfalls: ['O(n) linear scan. If array can have negatives, simply sort and take last two elements.'],
  },

  'longest-boundeddifference-subarray': {
    intuition: 'Find longest subarray where max - min <= 1 (or some bound). Sliding window with two deques.',
    algorithm: [
      'Two monotonic deques for running max and min. If max-min > limit: advance left pointer.',
    ],
    pitfalls: ['Similar to LC 1438. The bound here is typically 1 (any two elements differ by at most 1). O(n) sliding window.'],
  },

  'longest-string-chain': {
    intuition: 'Longest chain of words where each word adds one letter to the previous. DP with sorted lengths.',
    algorithm: [
      'Sort by length. dp[word] = max(dp[pred]+1) for all predecessors obtained by removing one char.',
    ],
    pitfalls: ['Same as LC 1048. Try removing each character from current word to find predecessor. O(n*L^2) where L = max word length.'],
  },

  'longest-subarray-length': {
    intuition: 'Find length of longest subarray with equal number of 0s and 1s. Prefix sum + hashmap.',
    algorithm: [
      'Encode 0 as -1. Find longest subarray with sum 0 using prefix sum and first-occurrence hashmap.',
    ],
    pitfalls: ['Same as LC 525. Map prefix sum to first index. When same prefix sum seen again: span is a valid subarray.'],
  },

  'longest-subarray-with-atmost-two-distinct-integers': {
    intuition: 'Sliding window: maintain window with at most 2 distinct values.',
    algorithm: [
      'HashMap counts. When distinct count > 2: shrink from left. Track max window size.',
    ],
    pitfalls: ['Same as LC 159. Generalized to k distinct: LC 340. O(n) sliding window.'],
  },

  'longest-subarray-with-majority-greater-than-k': {
    intuition: 'Find longest subarray where more than half of elements are greater than k.',
    algorithm: [
      'Encode: +1 if arr[i]>k, -1 otherwise. Find longest subarray with positive prefix sum.',
    ],
    pitfalls: ['Majority means > n/2 elements. +1/-1 encoding + prefix sum with first-occurrence tracking gives O(n).'],
  },

  'longest-substring-with-k-uniques': {
    intuition: 'Find longest substring with exactly k unique characters. Sliding window.',
    algorithm: [
      'Sliding window with frequency map. Expand right. When distinct > k: shrink left. Track max when distinct == k.',
    ],
    pitfalls: ['Same as LC 395 variant. Exactly k: use at-most-k minus at-most-(k-1). Or direct sliding window.'],
  },

  'look-and-say-pattern': {
    intuition: 'Generate nth term of look-and-say sequence. Iteratively scan and encode runs.',
    algorithm: [
      'Start with "1". Each step: scan runs of same digit, encode as count+digit.',
    ],
    pitfalls: ['Same as LC 38. Build string iteratively n-1 times. Each pass is O(L) where L is current string length.'],
  },

  'make-array-elements-unique': {
    intuition: 'Minimum increment operations to make all array elements distinct. Sort then fix conflicts.',
    algorithm: [
      'Sort array. If arr[i] <= arr[i-1]: set arr[i] = arr[i-1]+1, count the difference as operations.',
    ],
    pitfalls: ['Same as LC 945. Sort, then greedily increment. O(n log n). Track total increments applied.'],
  },

  'make-binary-tree-from-linked-list': {
    intuition: 'Construct complete binary tree from linked list (level-order). BFS with queue.',
    algorithm: [
      'Use queue. Root = first node. For each dequeued node: next list node becomes left child, next becomes right child. Enqueue children.',
    ],
    pitfalls: ['Level-order construction. O(n). Queue always contains the node whose children are to be set.'],
  },

  'make-matrix-beautiful': {
    intuition: 'Make all rows and columns have same sum with minimum increment operations.',
    algorithm: [
      'Target = max of all row sums and column sums. For each row: increment elements to reach target. Adjust columns accordingly.',
    ],
    pitfalls: ['Target is max(maxRowSum, maxColSum). Fill row by row; recalculate column sums. Total ops = n*target - sum(all elements).'],
  },

  'make-strings-equal': {
    intuition: 'Check if string S can be made equal to string T using minimum operations (swap characters).',
    algorithm: [
      'Count mismatches. If both strings differ only in swappable positions: compute minimum swaps needed.',
    ],
    pitfalls: ['Count 01 mismatches and 10 mismatches. Pairs of same-type mismatches need 1 swap each; cross-type mismatches need 2.'],
  },

  'max-dag-edges': {
    intuition: 'Maximum edges that can be added to a DAG without creating a cycle. Count edges in complete DAG minus existing.',
    algorithm: [
      'Complete DAG on n nodes has n*(n-1)/2 edges. Subtract existing edges count.',
    ],
    pitfalls: ['In a DAG with n nodes, maximum edges = n*(n-1)/2 (one direction for each pair). Just subtract current edge count.'],
  },

  'max-distance-between-same-elements': {
    intuition: 'For each value, find maximum distance between first and last occurrence.',
    algorithm: [
      'HashMap: store first occurrence index. For each element: if seen, update max distance = i - firstIndex[val].',
    ],
    pitfalls: ['Only store first occurrence. At each re-occurrence update answer. O(n) single pass.'],
  },

  'max-min-height': {
    intuition: 'Maximize the minimum height in a histogram/array after given operations. Binary search on answer.',
    algorithm: [
      'Binary search on the minimum height h. Check feasibility: can we achieve minimum h with given operations?',
    ],
    pitfalls: ['Binary search + greedy feasibility check. O(n log maxVal).'],
  },

  'max-of-min-for-every-window-size': {
    intuition: 'For each window size k (1..n), find the maximum of the minimum values in all windows of size k.',
    algorithm: [
      'For each element: find the nearest smaller to left (L[i]) and right (R[i]) using monotonic stack.',
      'Element arr[i] is min for windows of size 1..R[i]-L[i]-1. Use this to fill answer array, then propagate max backwards.',
    ],
    pitfalls: ['Same as "Maximum of minimums of every window size". O(n) with two monotonic stack passes + backward propagation.'],
  },

  'max-score-from-subarray-mins': {
    intuition: 'Maximize score = min(arr[i], arr[j]) * (i+j) over all pairs i < j. Greedy or sorted pairs.',
    algorithm: [
      'For adjacent pairs, min is more predictable. Consider all adjacent pairs: score = min(arr[i], arr[i+1]) * (i+i+1).',
    ],
    pitfalls: ['Adjacent elements maximize score because non-adjacent pairs have smaller min. O(n) scan of adjacent pairs.'],
  },

  'max-sum-in-the-configuration': {
    intuition: 'Maximize sum of i*arr[i] over all rotations. Derive from initial sum using formula.',
    algorithm: [
      'Compute initial sum S0. For rotation r+1: Sr+1 = Sr + totalSum - n*arr[n-1-r].',
      'Track maximum over all rotations.',
    ],
    pitfalls: ['O(n) by deriving each rotation sum from previous. Initial O(n) setup then O(n) iterations.'],
  },

  'max-sum-path-in-two-arrays': {
    intuition: 'Two sorted arrays with common elements. Find path (switch between arrays at common elements) with maximum sum.',
    algorithm: [
      'Two pointers. Accumulate sums between common elements. At each common element: take max of both accumulated sums, add common element value.',
    ],
    pitfalls: ['O(m+n) merge-like scan. Key insight: switch paths only at common elements when it is beneficial.'],
  },

  'max-sum-subarray-of-size-k': {
    intuition: 'Find maximum sum subarray of exactly size k. Sliding window.',
    algorithm: [
      'Compute sum of first k elements. Slide: add next, remove leftmost. Track maximum.',
    ],
    pitfalls: ['Classic fixed-size sliding window. O(n). Initial window sum then slide.'],
  },

  'max-xor-subarray-of-size-k': {
    intuition: 'Find maximum XOR of any subarray of size exactly k. Sliding window XOR.',
    algorithm: [
      'Compute XOR of first k elements. Slide: XOR with new element and XOR out oldest. Track maximum XOR.',
    ],
    pitfalls: ['XOR of window: sliding XOR. XOR(arr[i..i+k-1]) = prefix[i+k] XOR prefix[i]. O(n).'],
  },

  'maximise-string-score': {
    intuition: 'Maximize score by splitting string into left and right parts. Score = distinct in left + distinct in right.',
    algorithm: [
      'Precompute suffix distinct counts. Iterate split points: prefix distinct + suffix distinct. Track max.',
    ],
    pitfalls: ['Same as LC 1422 variant. Precompute suffix sets. Iterate split with running prefix set. O(n) with bitset.'],
  },

  'maximize-array-value-after-rearrangement': {
    intuition: 'Rearrange array to maximize sum of |arr[i]-arr[i-1]|. Sort and interleave min/max pattern.',
    algorithm: [
      'Sort. Place first half in even positions, second half in odd positions (or interleave min/max alternately).',
    ],
    pitfalls: ['Maximum sum of absolute differences: sort then rearrange in valley-peak pattern. Final sum = 2*(max_half - min_half).'],
  },

  'maximize-median-after-doing-k-addition-operation': {
    intuition: 'Maximize median of array after adding 1 to k elements. Binary search on answer.',
    algorithm: [
      'Binary search on target median value m. Greedy: count how many elements need incrementing to be >= m. If <= k: feasible.',
    ],
    pitfalls: ['Binary search on answer. Sort array. Count elements < m and determine if k additions suffice to bring median >= m.'],
  },

  'maximize-number-of-1s': {
    intuition: 'Maximize 1s in binary array row by flipping at most one segment. Kadane-style DP.',
    algorithm: [
      'Encode: 0->+1 (gain from flip), 1->-1 (would lose by flipping). Find max subarray sum, add to original 1-count.',
    ],
    pitfalls: ['Flipping a 0 to 1 gains +1, flipping a 1 to 0 costs -1. Kadane on this encoding gives optimal segment to flip.'],
  },

  'maximize-partitions-in-a-string': {
    intuition: 'Split string into maximum partitions where each character appears in only one partition.',
    algorithm: [
      'Track last occurrence of each character. Greedily extend current partition to include all characters in it. Cut when all resolved.',
    ],
    pitfalls: ['Same as LC 763. Track rightmost boundary for current partition. When i == boundary: partition complete.'],
  },

  'maximize-the-cut-segments': {
    intuition: 'Cut rope of length n into maximum pieces of lengths x, y, or z. Unbounded knapsack DP.',
    algorithm: [
      'dp[i] = max(dp[i-x], dp[i-y], dp[i-z]) + 1. Base dp[0]=0. If dp[n] == -INF: return 0.',
    ],
    pitfalls: ['Initialize dp with -INF (not -1 to distinguish impossible). Max cuts is unbounded knapsack count variant.'],
  },

  'maximize-the-minimum-difference-between-k-elements': {
    intuition: 'Select k elements to maximize the minimum gap between consecutive selected elements. Binary search + greedy.',
    algorithm: [
      'Sort. Binary search on minimum gap d. Greedy: greedily pick elements with at least d gap. If can pick k: d is feasible.',
    ],
    pitfalls: ['Same as LC 1870 / allocation problems. Sort, then binary search on gap, greedy feasibility check.'],
  },

  'maximum-difference': {
    intuition: 'Find maximum difference arr[j] - arr[i] where j > i. Track running minimum from left.',
    algorithm: [
      'Scan left to right: maintain minSoFar. maxDiff = max(maxDiff, arr[j] - minSoFar).',
    ],
    pitfalls: ['Same as LC 121. O(n) single pass. Answer must be positive (j > i and arr[j] > arr[i]).'],
  },

  'maximum-nonadjacent-nodes-sum': {
    intuition: 'Maximum sum of non-adjacent nodes in binary tree. Each node: choose include or exclude.',
    algorithm: [
      'For each node: included = node.val + sum of grandchildren sums. Excluded = max children sums. Return max.',
    ],
    pitfalls: ['Same as LC 337 (House Robber III). Pair return: (includeMax, excludeMax). O(n) post-order traversal.'],
  },

  'maximum-nonoverlapping-odd-palindrome-sum': {
    intuition: 'Find maximum sum of non-overlapping odd-length palindromic substrings.',
    algorithm: [
      'DP: for each center, expand palindrome and compute value. DP[i] = max(DP[i-1], DP[j-1] + palindrome_value) where j is start.',
    ],
    pitfalls: ['Combine palindrome detection (Manacher) with non-overlapping interval DP. Consider all odd-length palindromes.'],
  },

  'maximum-number-of-overlapping-intervals': {
    intuition: 'Find maximum number of intervals that overlap at any single point. Sweep line.',
    algorithm: [
      'Events: +1 at start, -1 at end+1. Sort events, process in order, track running sum maximum.',
    ],
    pitfalls: ['Sweep line with events. Sort starts/ends separately or together. Running counter max gives answer.'],
  },

  'maximum-of-minimum-for-every-window-size': {
    intuition: 'For each window size k, find maximum of all window minimums. Monotonic stack for each element span.',
    algorithm: [
      'Use monotonic stack to find previous smaller (L) and next smaller (R) for each element.',
      'Element arr[i] is the minimum for window sizes up to R[i]-L[i]-1. Build answer array then propagate backward.',
    ],
    pitfalls: ['O(n) approach. For each element, it is the minimum of all windows it spans. Fill answer array, then max-propagate from small to large window sizes.'],
  },

  'maximum-path-sum': {
    intuition: 'Find maximum path sum in binary tree. Path can start and end at any node.',
    algorithm: [
      'Post-order DFS. For each node: left gain = max(0, dfs(left)), right gain = max(0, dfs(right)). Update global max with node+left+right. Return node + max(left, right).',
    ],
    pitfalls: ['Same as LC 124. Track global max separately. Return only the best single path for parent use.'],
  },

  'maximum-people-visible-in-a-line': {
    intuition: 'Count people visible from position 0 facing right, given heights. Taller people block shorter ones behind.',
    algorithm: [
      'Scan from right. Monotonic stack of heights. For each person: count shorter people before next taller one.',
    ],
    pitfalls: ['Stack-based simulation. Each person can see all shorter consecutive people plus the first taller one. O(n).'],
  },

  'maximum-product-subset-of-an-array': {
    intuition: 'Find maximum product of any subset. Handle negatives and zeros carefully.',
    algorithm: [
      'Count negatives and zeros. If all zeros: return 0. Remove zeros. If odd number of negatives: remove the negative closest to 0.',
      'Multiply remaining elements.',
    ],
    pitfalls: ['Handle: all zeros, single element, odd count of negatives. Sort to easily identify smallest-magnitude negative.'],
  },

  'maximum-stone-removal': {
    intuition: 'Remove maximum stones such that each row and column keeps at least one stone. Union-Find on shared rows/columns.',
    algorithm: [
      'Connect stones sharing same row or column using Union-Find. For each component of size s: can remove s-1 stones.',
    ],
    pitfalls: ['Same as LC 947. Each connected component can have all-but-one stone removed. Union-Find or DFS to find components.'],
  },

  'maximum-subarray-sum-2': {
    intuition: 'Find maximum sum of any non-empty contiguous subarray. Kadane algorithm.',
    algorithm: [
      'Kadane: maxEndHere = max(arr[i], maxEndHere + arr[i]). maxSoFar = max(maxSoFar, maxEndHere).',
    ],
    pitfalls: ['Standard Kadane. O(n) O(1). Must handle all-negative arrays (answer is the largest single element).'],
  },

  'maximum-sum-of-elements-not-part-of-lis': {
    intuition: 'Find maximum sum of elements NOT in any LIS. Total sum minus minimum sum of elements in some LIS.',
    algorithm: [
      'Find minimum weight LIS (LIS weighted by value, minimizing sum). Answer = totalSum - minLIS_sum.',
    ],
    pitfalls: ['Tricky: minimize sum of LIS, then subtract from total. DP with patience sorting variant to minimize sum.'],
  },

  'maximum-sum-of-nonadjacent-nodes': {
    intuition: 'Maximum sum path in binary tree where no two adjacent (parent-child) nodes are both selected.',
    algorithm: [
      'Same as House Robber on tree. DFS returning (include, exclude) pairs. Parent = max(include grandchildren + node, max children).',
    ],
    pitfalls: ['Same as LC 337. Post-order DP. Two values per node: max sum including it, max sum excluding it.'],
  },

  'maximum-xor-of-two-numbers-in-an-array': {
    intuition: 'Find maximum XOR of any two elements. Trie of binary representations.',
    algorithm: [
      'Build trie of all numbers. For each number, greedily choose the opposite bit at each trie level.',
    ],
    pitfalls: ['Same as LC 421. Trie approach O(32n). Alternative: linear algebra over GF(2) for basis.'],
  },

  'median-in-a-rowwise-sorted-matrix': {
    intuition: 'Find median of matrix where each row is sorted. Binary search on value, count elements <= mid.',
    algorithm: [
      'Binary search on value range [min, max]. Count elements <= mid using binary search on each row. Find smallest value with count > m*n/2.',
    ],
    pitfalls: ['O(r * log(max-min) * log(c)). Counting elements <= x across sorted rows uses binary search per row.'],
  },

  'median-of-bst': {
    intuition: 'Find median of BST. In-order traversal gives sorted sequence; pick middle element(s).',
    algorithm: [
      'Count total nodes n. In-order traversal: when counter reaches (n+1)/2 (and n/2 if even): record values.',
    ],
    pitfalls: ['Two-pass: count nodes, then in-order to find median. Or Morris traversal for O(1) space.'],
  },

  'merge-two-bst-s': {
    intuition: 'Merge two BSTs into one balanced BST. In-order both to get sorted arrays, merge, build balanced BST.',
    algorithm: [
      'In-order traverse both BSTs to get sorted arrays. Merge two sorted arrays. Build balanced BST from sorted array.',
    ],
    pitfalls: ['Three steps: in-order (O(n)), merge (O(m+n)), build balanced BST (O(m+n)). Total O(m+n).'],
  },

  'min-add-to-make-parentheses-valid': {
    intuition: 'Minimum additions to make parenthesis string valid. Track open count and close needed.',
    algorithm: [
      'Scan: open++ for (, open-- for ) if open>0 else close++. Answer = open + close.',
    ],
    pitfalls: ['Same as LC 921. Track unmatched ( and unmatched ). At end: both counts added give minimum additions.'],
  },

  'min-chars-to-add-for-palindrome': {
    intuition: 'Minimum characters to add at front to make string a palindrome. KMP on s + reverse(s).',
    algorithm: [
      'Form string: s + "#" + reverse(s). Compute KMP failure function. Answer = n - lps[last].',
    ],
    pitfalls: ['LPS (longest palindromic suffix) = LPS of s = LCS(s, reverse(s)) starting from beginning. KMP gives this efficiently.'],
  },

  'min-cost-climbing-stairs': {
    intuition: 'Minimum cost to reach top of stairs where you can climb 1 or 2 steps. DP.',
    algorithm: [
      'dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Answer = min(dp[n-1], dp[n-2]).',
    ],
    pitfalls: ['Same as LC 746. Can start from step 0 or step 1. DP is O(n) O(1) with two variables.'],
  },

  'minimal-cost': {
    intuition: 'Minimum cost to make at most k jumps from first to last stone. Greedy or DP.',
    algorithm: [
      'Sort heights. With k jumps allowed: skip the k-1 largest gaps between consecutive stones.',
    ],
    pitfalls: ['Key insight: if you can make k jumps, you skip k-1 intermediate stones choosing the largest height differences.'],
  },

  'minimize-the-heights-i': {
    intuition: 'Minimize difference between max and min tower heights by adding or subtracting k exactly once from each.',
    algorithm: [
      'Sort. For each split point: left towers get +k, right towers get -k. New range = max(arr[i-1]+k, arr[n-1]-k) - min(arr[0]+k, arr[i]-k).',
    ],
    pitfalls: ['Sort, try each split. Must add OR subtract exactly k (not choosing per tower). Check all n split points.'],
  },

  'minimize-the-heights-ii': {
    intuition: 'Same as minimize-the-heights-i but can choose to add OR subtract k for each tower independently.',
    algorithm: [
      'Sort. For each index i: left half gets +k, right half gets -k (or some combination). Try all splits.',
    ],
    pitfalls: ['Sort, iterate split points. At split i: minVal=min(arr[0]+k, arr[i]-k), maxVal=max(arr[i-1]+k, arr[n-1]-k). Track minimum range.'],
  },

  'minimum-cost-to-connect-all-houses-in-a-city': {
    intuition: 'Minimum spanning tree of houses with given edge costs. Prim or Kruskal.',
    algorithm: [
      'Build adjacency list of house connections. Run Prim or Kruskal to find MST. Sum MST edge weights.',
    ],
    pitfalls: ['Standard MST problem. Kruskal: sort edges, union-find. Prim: priority queue. O(E log E) or O(E log V).'],
  },

  'minimum-cost-to-cut-a-board-into-squares': {
    intuition: 'Cut board with minimum cost. Greedy: always make the most expensive cut first.',
    algorithm: [
      'Sort horizontal and vertical cuts descending. Greedily pick most expensive cut. Multiply by current segment count.',
    ],
    pitfalls: ['Greedy works: sort cuts descending. Track h_count (horizontal segments) and v_count. At each step multiply cut cost by segment count on perpendicular axis.'],
  },

  'minimum-cost-to-cut-a-stick-of-length-n': {
    intuition: 'Minimum cost to cut a stick at given positions. Interval DP.',
    algorithm: [
      'Add 0 and n as boundaries. dp[i][j] = min cost to cut stick between positions[i] and positions[j].',
      'dp[i][j] = min over all k in (i,j): dp[i][k] + dp[k][j] + positions[j]-positions[i].',
    ],
    pitfalls: ['Same as LC 1547. Interval DP on sorted cut positions. O(m^3) where m = number of cuts.'],
  },

  'minimum-cost-to-merge-stones': {
    intuition: 'Merge stones with minimum cost where k adjacent stones merge at once. Interval DP.',
    algorithm: [
      'dp[i][j] = min cost to merge all stones from i to j. Merges possible when (j-i) % (k-1) == 0.',
    ],
    pitfalls: ['Same as LC 1000. Interval DP with step k-1. Add prefix sum for fast range sum computation.'],
  },

  'minimum-k-consecutive-bit-flips': {
    intuition: 'Minimum number of k-bit flips to make all bits 1. Greedy sliding window.',
    algorithm: [
      'Sliding window: track flips in current window with a difference array. Flip at position i if current bit is 0 (accounting for flips).',
    ],
    pitfalls: ['Same as LC 995. Use flip difference array to track effect in O(1). O(n) overall.'],
  },

  'minimum-number-of-deletions-and-insertions': {
    intuition: 'Minimum operations (delete from S1, insert into S1) to convert S1 to S2. LCS based.',
    algorithm: [
      'LCS length = L. Deletions = len(S1) - L. Insertions = len(S2) - L. Total = len(S1)+len(S2) - 2*L.',
    ],
    pitfalls: ['Equivalent to edit distance with only insert/delete. LCS gives common subsequence; remaining chars must be deleted/inserted.'],
  },

  'minimum-number-of-workers': {
    intuition: 'Minimum workers to finish all tasks given constraints on task/worker assignments. Bipartite matching or greedy.',
    algorithm: [
      'Sort tasks and workers. Greedy assignment: assign each task to any qualified worker. Binary search for optimal grouping.',
    ],
    pitfalls: ['Problem-specific constraints vary. Common approach: sort and greedy assign with feasibility check.'],
  },

  'minimum-operations-to-connect-hospitals': {
    intuition: 'Minimum edges to add to connect all hospital nodes in a graph. Count connected components, need components-1 edges.',
    algorithm: [
      'Build graph of hospitals. BFS/DFS or Union-Find to count connected components C. Answer = C - 1.',
    ],
    pitfalls: ['Standard connected components problem. MST adds exactly C-1 edges to connect C components.'],
  },

  'minimum-repeat-to-make-substring': {
    intuition: 'Find minimum repetitions of string A to make B a substring. KMP or brute force.',
    algorithm: [
      'Minimum repeats = ceil(len(B)/len(A)). Try this many and one more repetition. Use KMP to check if B is substring.',
    ],
    pitfalls: ['Same as LC 686. Try repeating A exactly ceil(|B|/|A|) and ceil(|B|/|A|)+1 times. KMP search.'],
  },

  'minimum-steps-to-halve-sum': {
    intuition: 'Minimum operations to reduce array sum by half, each operation halves one element. Max-heap greedy.',
    algorithm: [
      'Max-heap. Repeatedly halve the largest element. Count operations until totalReduced >= initialSum/2.',
    ],
    pitfalls: ['Same as LC 2208. Greedy: always halve the largest. Use max-heap with floating point values. O(n log n).'],
  },

  'minimum-sum': {
    intuition: 'Given digits of two numbers, form two numbers with minimum possible sum. Sort digits, alternate assignment.',
    algorithm: [
      'Sort digits. Assign alternately: even-indexed digits to num1, odd-indexed to num2. Sum both.',
    ],
    pitfalls: ['Same as LC 2160. Sorting and alternating gives minimum sum of two numbers. Build numbers digit by digit.'],
  },

  'mirror-tree': {
    intuition: 'Check if binary tree is mirror of itself (symmetric). Recursive left-right comparison.',
    algorithm: [
      'isMirror(left, right): both null -> true. One null -> false. left.val==right.val and isMirror(left.left,right.right) and isMirror(left.right,right.left).',
    ],
    pitfalls: ['Same as LC 101. Recursive or iterative with queue checking pairs. O(n).'],
  },

  'missing-element-in-range': {
    intuition: 'Find elements in range [low, high] missing from array. Hashing or sort + scan.',
    algorithm: [
      'Store all array elements in a set. Iterate range [low, high]: collect elements not in set.',
    ],
    pitfalls: ['O(n + range). Use hashset for O(1) lookups. Output all missing elements in range.'],
  },

  'modify-the-array': {
    intuition: 'Modify array such that no two adjacent elements are equal. If equal, increment one.',
    algorithm: [
      'Scan left to right: if arr[i] == arr[i-1]: arr[i] = arr[i-1]+1.',
    ],
    pitfalls: ['Greedy: resolve conflicts left to right. Each fix may chain, so process sequentially.'],
  },

  'multiply-two-linked-lists': {
    intuition: 'Multiply two numbers represented as linked lists. Build numbers modulo 10^9+7.',
    algorithm: [
      'Traverse each list: num = (num*10 + digit) % MOD. Multiply both modular values.',
    ],
    pitfalls: ['Use modular arithmetic throughout to avoid overflow. Result = (num1 * num2) % MOD.'],
  },

  'nqueen-problem': {
    intuition: 'Place N queens on NxN board so no two attack each other. Backtracking with column/diagonal conflict tracking.',
    algorithm: [
      'Row by row: place queen in valid column. Track used columns, main diagonals (r-c), anti-diagonals (r+c). Backtrack if stuck.',
    ],
    pitfalls: ['Same as LC 51. Sets for O(1) conflict checks. Total solutions = N! / average branching. Return all valid boards.'],
  },

  'nearest-multiple-of-10': {
    intuition: 'Round a number string to nearest multiple of 10. Check last digit and round up or down.',
    algorithm: [
      'If last digit < 5: set to 0. If >= 5: set to 0 and carry +1 through preceding digits.',
    ],
    pitfalls: ['Handle carry propagation. Edge case: all 9s become "100...0". String arithmetic.'],
  },

  'nearly-sorted': {
    intuition: 'Sort a nearly sorted array where each element is at most k positions away from its correct position. Modified insertion sort or min-heap of size k+1.',
    algorithm: [
      'Min-heap of size k+1. Push elements one by one; when heap size > k: pop minimum to output.',
    ],
    pitfalls: ['O(n log k). Same as sorting with bounded disorder. Heap always contains candidates for current minimum.'],
  },

  'next-element-with-greater-frequency': {
    intuition: 'For each element, find the next element to the right with strictly greater frequency.',
    algorithm: [
      'Precompute frequencies. Use monotonic stack: pop when freq[arr[top]] < freq[arr[i]]. Record answer.',
    ],
    pitfalls: ['Two-pass: frequency count, then monotonic stack scan. O(n) total.'],
  },

  'nine-divisors': {
    intuition: 'Count numbers up to n that have exactly 9 divisors. Numbers of form p^8 or p^2*q^2.',
    algorithm: [
      'Sieve primes up to sqrt(n). Count: p^8 <= n gives one form. p^2*q^2 <= n where p!=q gives another. Combine.',
    ],
    pitfalls: ['Exactly 9 divisors: n=p^8 (divisors 1,p,...,p^8) or n=p^2*q^2 (divisors: 3*3=9). Use sieve.'],
  },

  'not-a-subset-sum': {
    intuition: 'Find smallest positive number that cannot be represented as sum of any subset of array.',
    algorithm: [
      'Sort array. Maintain reach=0. For each element: if arr[i] <= reach+1: reach += arr[i]. Else break. Answer = reach+1.',
    ],
    pitfalls: ['Greedy: if sorted arr[i] <= reach+1, then all values 1..reach+arr[i] are reachable. O(n log n).'],
  },

  'nth-natural-number': {
    intuition: 'Find nth natural number that does not contain digit 9. Treat remaining digits 0-8 as base-9 number system.',
    algorithm: [
      'Convert n to base 9. Map each digit 0-8 to digits 0-8 (no 9). That gives the nth number.',
    ],
    pitfalls: ['Base-9 conversion: digits 0,1,2,...,8 map directly. Digit 9 is never used. n in base 9 gives the answer.'],
  },

  'number-of-pairs': {
    intuition: 'Count pairs (i,j) where i < j. If array values can repeat, count using arithmetic or hashmap.',
    algorithm: [
      'For distinct pairs: n*(n-1)/2. For pairs with constraint (like arr[i] < arr[j]): sort + binary search or BIT.',
    ],
    pitfalls: ['Problem-specific. For all pairs i<j: n*(n-1)/2. For pairs with value constraint: count inversions or use BIT.'],
  },

  'number-of-paths-in-a-matrix-with-k-coins': {
    intuition: 'Count paths from top-left to bottom-right collecting exactly k coins. 3D DP.',
    algorithm: [
      'dp[i][j][c] = number of paths to reach (i,j) with exactly c coins collected.',
    ],
    pitfalls: ['O(m*n*k) DP. Transitions: dp[i][j][c] += dp[i-1][j][c-mat[i][j]] + dp[i][j-1][c-mat[i][j]].'],
  },

  'number-of-rectangles-in-a-circle': {
    intuition: 'Count axis-aligned rectangles that fit inside a circle of radius r. Enumerate half-widths and compute valid half-heights.',
    algorithm: [
      'For each half-width w from 1 to r: max half-height h = floor(sqrt(r^2 - w^2)). Count += h * 4 (all combinations of signs and w/h swap if distinct).',
    ],
    pitfalls: ['Count ordered pairs (w,h) with w^2+h^2 <= r^2, w,h >= 1. Each gives distinct rectangle size. Multiply by 4 for all sign combinations.'],
  },

  'occurence-of-an-integer-in-a-linked-list': {
    intuition: 'Count occurrences of a target value in linked list. Linear scan.',
    algorithm: [
      'Traverse list, increment counter each time node.val == target.',
    ],
    pitfalls: ['Simple O(n) traversal. Handle empty list (return 0).'],
  },

  'overlapping-intervals': {
    intuition: 'Find maximum overlap of intervals at any point. Sweep line or sort by start.',
    algorithm: [
      'Sort starts and ends separately. Two pointer sweep: increment count on start, decrement on end. Track max.',
    ],
    pitfalls: ['Same as "meeting rooms II" (LC 253). Sort starts and ends. O(n log n).'],
  },

  'pair-sum-in-bst': {
    intuition: 'Find if BST contains a pair with given sum. Two-pointer using in-order (ascending) and reverse in-order (descending).',
    algorithm: [
      'Two stacks for in-order and reverse in-order iteration. Two-pointer approach: sum < target advance left, else advance right.',
    ],
    pitfalls: ['Same as LC 653. Can also convert to sorted array via in-order, then two-pointer. O(n) time O(h) space.'],
  },

  'pair-with-given-sum-in-a-sorted-array': {
    intuition: 'Check if sorted array has pair summing to target. Two pointers.',
    algorithm: [
      'Left=0, right=n-1. If sum==target: found. If sum<target: left++. If sum>target: right--.',
    ],
    pitfalls: ['Classic two-pointer on sorted array. O(n). Same as LC 167.'],
  },

  'palindrome-substrings': {
    intuition: 'Count all palindromic substrings in a string. Expand around center or Manacher.',
    algorithm: [
      'For each center (n odd + n-1 even centers): expand while palindrome. Count each valid palindrome.',
    ],
    pitfalls: ['Same as LC 647. O(n^2) expand-around-center. O(n) with Manacher algorithm.'],
  },

  'partitions-with-given-difference': {
    intuition: 'Count ways to partition array into two subsets with difference equal to d. Count subsets with sum = (total+d)/2.',
    algorithm: [
      'If (total+d) % 2 != 0: 0. Else target = (total+d)/2. Count subsets summing to target (like 0-1 knapsack count).',
    ],
    pitfalls: ['Same as LC 494 (Target Sum). Transform: S1-S2=d, S1+S2=total => S1=(total+d)/2. Standard subset count DP.'],
  },

  'populate-inorder-successor-for-all-nodes': {
    intuition: 'Set "next" pointer of each BST node to its in-order successor.',
    algorithm: [
      'Reverse in-order (right-root-left). Maintain prev pointer. Set curr.next = prev. Update prev = curr.',
    ],
    pitfalls: ['Reverse in-order sets successors correctly. Or: standard in-order, track previous node and set its next to current.'],
  },

  'possible-words-from-phone-digits': {
    intuition: 'Generate all possible words from phone keypad digit sequence. Backtracking (letter combinations).',
    algorithm: [
      'Map each digit to its letters. Backtrack: for current digit append each letter, recurse for next digit.',
    ],
    pitfalls: ['Same as LC 17. Recursion depth = length of digit string. Total combinations = product of letter counts.'],
  },

  'postfix-evaluation': {
    intuition: 'Evaluate postfix (Reverse Polish Notation) expression. Stack-based evaluation.',
    algorithm: [
      'For each token: if operand push to stack. If operator: pop two operands, apply operator, push result.',
    ],
    pitfalls: ['Same as LC 150. Handle negative numbers. Division should truncate toward zero.'],
  },

  'power-of-k-in-factorial-of-n': {
    intuition: 'Find largest power of k that divides n!. Legendre formula for prime k; factorize k for composite.',
    algorithm: [
      'If k is prime: sum = floor(n/k) + floor(n/k^2) + ...',
      'If k is composite: factorize k = p1^a1 * ... Find min(power_of_pi_in_n! / ai) over all prime factors.',
    ],
    pitfalls: ['Legendre formula for prime powers. For composite k: take minimum ratio across prime factors of k.'],
  },

  'powerful-integer': {
    intuition: 'Find all unique powerful integers: x^i + y^j <= bound for i,j >= 0.',
    algorithm: [
      'Iterate i starting from 0 while x^i <= bound. Iterate j while x^i+y^j <= bound. Collect unique values.',
    ],
    pitfalls: ['Same as LC 970. Handle x=1 or y=1 specially (loop at most once). Use set for uniqueness.'],
  },

  'prime-list': {
    intuition: 'Linked list where each node value is replaced by nearest prime. For each value find closest prime.',
    algorithm: [
      'For each node value: find nearest prime (check prev and next values using primality test).',
    ],
    pitfalls: ['Simple primality test (trial division) for values in range. Walk left and right from each value to find nearest prime.'],
  },

  'prime-pair-with-target-sum': {
    intuition: 'Find all pairs of primes that sum to a given target (Goldbach-style). Sieve + pair finding.',
    algorithm: [
      'Sieve of Eratosthenes up to target. For each prime p <= target/2: if target-p is also prime: output pair.',
    ],
    pitfalls: ['Two primes summing to even number: one must be 2 or both odd. Sieve to target then linear scan.'],
  },

  'print-bracket-number': {
    intuition: 'Number each bracket pair: opening bracket gets number, closing bracket gets matching number. Stack.',
    algorithm: [
      'counter=0, stack. On open bracket: push ++counter, print counter. On close: print top, pop.',
    ],
    pitfalls: ['Simple stack simulation. O(n). Track counter for numbering and stack for matching.'],
  },

  'print-diagonally': {
    intuition: 'Print matrix elements diagonally (anti-diagonal order). Group elements by i+j sum.',
    algorithm: [
      'Elements with same i+j are on same anti-diagonal. Iterate diagonal index 0 to m+n-2. Print elements in each diagonal.',
    ],
    pitfalls: ['Index trick: diagonal d contains elements where row+col=d. Bounds: row in [max(0,d-n+1), min(d,m-1)].'],
  },

  'print-leaf-nodes-from-preorder-traversal-of-bst': {
    intuition: 'Given preorder traversal, identify and print leaf nodes of the BST without constructing the tree.',
    algorithm: [
      'Simulate BST insertion using stack. A node is a leaf if no subsequent node falls in its value range as left/right child.',
    ],
    pitfalls: ['Use stack to track valid range at each position. A preorder element with no children in both directions is a leaf.'],
  },

  'quick-sort-on-linked-list': {
    intuition: 'Apply quicksort to a linked list. Choose pivot, partition, recursively sort sub-lists.',
    algorithm: [
      'Choose last element as pivot. Partition: rearrange elements. Recursively sort left and right parts.',
    ],
    pitfalls: ['Linked list partition requires relinking nodes. Use tail as pivot. O(n log n) average, O(n^2) worst case.'],
  },

  'rat-in-a-maze': {
    intuition: 'Find all paths from top-left to bottom-right in a binary maze. Backtracking with DFS.',
    algorithm: [
      'DFS with visited array. From each cell try all 4 directions. On reaching destination: record path. Backtrack.',
    ],
    pitfalls: ['Same as LC maze problems. Mark visited to avoid cycles. Collect all valid paths.'],
  },

  'remaining-string': {
    intuition: 'Given string, remove all occurrences of a character and return remaining string after kth removal.',
    algorithm: [
      'Count positions of target character. If fewer than k occurrences: return original. Remove first k occurrences.',
    ],
    pitfalls: ['Build result by skipping the kth occurrence (1-indexed). Simple O(n) scan.'],
  },

  'remove-all-occurences-of-duplicates-in-a-linked-list': {
    intuition: 'Remove all nodes that have duplicate values in a linked list.',
    algorithm: [
      'Frequency map: count occurrences. Rebuild list keeping only nodes with count == 1. Or dummy head + skip runs.',
    ],
    pitfalls: ['Same as LC 82. Use dummy head. Skip entire runs of same value. O(n).'],
  },

  'remove-bst-keys-outside-given-range': {
    intuition: 'Remove all BST nodes with values outside [min, max] range.',
    algorithm: [
      'Post-order: if node.val < min return trimBST(node.right, min, max). If > max return trimBST(node.left, min, max). Else recurse both sides.',
    ],
    pitfalls: ['Same as LC 669. Recursive trim: out-of-range nodes are replaced by their subtree that might be in range.'],
  },

  'remove-duplicates': {
    intuition: 'Remove duplicate elements from sorted array in-place.',
    algorithm: [
      'Two pointers: write pointer w=0. For each element arr[i]: if arr[i] != arr[w]: arr[++w] = arr[i]. Return w+1.',
    ],
    pitfalls: ['Same as LC 26. O(n) O(1). Works only on sorted arrays. For unsorted: use hashset.'],
  },

  'remove-duplicates-in-array': {
    intuition: 'Remove duplicates from unsorted array. HashSet approach.',
    algorithm: [
      'Iterate array. Add to set if not seen. Build result from elements first seen.',
    ],
    pitfalls: ['For sorted: two-pointer. For unsorted: hashset maintaining insertion order. O(n).'],
  },

  'remove-half-nodes': {
    intuition: 'Remove all half nodes (nodes with only one child) from binary tree.',
    algorithm: [
      'Post-order: process children first. If node has only left child: return left child. If only right: return right child. Else return node.',
    ],
    pitfalls: ['Half node has exactly one child. Post-order replacement. O(n). Leaf nodes and full nodes are kept.'],
  },

  'remove-spaces': {
    intuition: 'Remove leading, trailing, and extra spaces from string, keeping single space between words.',
    algorithm: [
      'Split by spaces, filter empty tokens, rejoin with single space.',
    ],
    pitfalls: ['Same as LC 151. Or manual two-pointer scan. Handle multiple consecutive spaces and leading/trailing.'],
  },

  'remove-the-balls': {
    intuition: 'Remove balls in pairs of same color, count remaining. Stack-based simulation.',
    algorithm: [
      'Stack: push ball. If top equals current: pop (they cancel). Count remaining stack size.',
    ],
    pitfalls: ['Similar to LC 1047 (remove all adjacent duplicates). Stack simulation O(n). Final stack size is answer.'],
  },

  'reorganize-the-array': {
    intuition: 'Rearrange array so all negative elements appear before positive. Maintain relative order (stable).',
    algorithm: [
      'Two passes: collect negatives maintaining order, then positives. Concatenate.',
    ],
    pitfalls: ['Stable partition. O(n) with extra space. In-place stable partition is O(n log n).'],
  },

  'replace-os-with-xs': {
    intuition: 'Replace all Os in a matrix that are completely surrounded by Xs with Xs. BFS/DFS from border.',
    algorithm: [
      'Mark all Os connected to border as safe (BFS from border). Replace remaining Os with X. Restore safe Os.',
    ],
    pitfalls: ['Same as LC 130. Border-connected Os are safe. Interior-only Os get replaced. O(m*n).'],
  },

  'reverse-an-array': {
    intuition: 'Reverse an array in-place. Two-pointer swap from both ends.',
    algorithm: [
      'Left=0, right=n-1. While left < right: swap, left++, right--.',
    ],
    pitfalls: ['O(n) O(1). Fundamental operation. Same as LC 344 for strings.'],
  },

  'roman-number-to-integer': {
    intuition: 'Convert Roman numeral to integer. Scan right to left; subtract if current < next, else add.',
    algorithm: [
      'Map each symbol to value. Scan from right. If val < prevVal: subtract. Else add. Track prevVal.',
    ],
    pitfalls: ['Same as LC 13. Subtractive notation: IV=4, IX=9 etc. Right-to-left scan handles this naturally.'],
  },

  'roof-top': {
    intuition: 'Find maximum number of consecutive steps that can be climbed going uphill (arr[i+1] > arr[i]).',
    algorithm: [
      'Track current run of increasing steps. Reset on decrease. Track maximum run.',
    ],
    pitfalls: ['Simple linear scan. Reset counter when arr[i] >= arr[i+1]. Maximum consecutive increasing steps.'],
  },

  'root-to-leaf-path-sum': {
    intuition: 'Check if there exists a root-to-leaf path with sum equal to target.',
    algorithm: [
      'DFS: subtract node value from target. At leaf: check if target == 0.',
    ],
    pitfalls: ['Same as LC 112. Recurse with remaining sum. Leaf condition: no children. O(n).'],
  },

  'root-to-leaf-paths-sum': {
    intuition: 'Sum of numbers formed by root-to-leaf paths (each path represents a number).',
    algorithm: [
      'DFS: pass current number = prev * 10 + node.val. At leaf: add to total sum.',
    ],
    pitfalls: ['Same as LC 129. Accumulate number at each level. Sum all leaf values.'],
  },

  'rotate-a-linked-list': {
    intuition: 'Rotate linked list to the right by k positions. Find new tail, relink.',
    algorithm: [
      'Find length n. Normalize k = k%n. If k==0: return head. Find node at position n-k-1 (new tail). New head = new tail.next. Connect old tail to head.',
    ],
    pitfalls: ['Same as LC 61. Handle k >= n with modulo. Make circular then break at right position.'],
  },

  'rotate-and-delete': {
    intuition: 'Alternating operations: rotate array and delete specific element. Simulate rounds.',
    algorithm: [
      'In each round i: rotate right by 1, delete element at position n-i (1-indexed). Repeat until one remains.',
    ],
    pitfalls: ['Simulate O(n^2). Use deque for efficient rotation and deletion.'],
  },

  'rotate-deque-by-k': {
    intuition: 'Rotate a deque by k positions. Pop from front, push to back k times.',
    algorithm: [
      'For clockwise k rotation: move last k elements to front. Or rotate(deque, k) using deque operations.',
    ],
    pitfalls: ['Normalize k = k % size. Deque rotation in O(k) or O(n-k) depending on direction.'],
  },

  'search-in-a-rowcolumn-sorted-matrix': {
    intuition: 'Search in matrix where each row and column is sorted. Start from top-right corner.',
    algorithm: [
      'Start at (0, n-1). If target == mat[r][c]: found. If target < mat[r][c]: c--. If target > mat[r][c]: r++.',
    ],
    pitfalls: ['Same as LC 240. O(m+n) staircase search. Each step eliminates a row or column.'],
  },

  'search-in-a-rowwise-sorted-matrix': {
    intuition: 'Search in matrix where each row is sorted independently. Binary search on each row.',
    algorithm: [
      'For each row: binary search for target. Return true if found in any row.',
    ],
    pitfalls: ['O(m log n). If rows are also connected (end of row < start of next): treat as flat sorted array and binary search O(log mn).'],
  },

  'search-in-an-almost-sorted-array': {
    intuition: 'Search in array where each element may be off by at most 1 position. Modified binary search.',
    algorithm: [
      'Binary search: check mid, mid-1, mid+1. If found: return. If arr[mid-1] > target: hi=mid-2. Else lo=mid+2.',
    ],
    pitfalls: ['Must check three positions at each step. O(log n) with slightly larger constant.'],
  },

  'search-in-fully-rotated-sorted-2d-matrix': {
    intuition: 'Search in fully rotated sorted matrix where element may be anywhere. Check each row or flatten.',
    algorithm: [
      'Since rotation breaks the staircase property, binary search each row independently.',
    ],
    pitfalls: ['Cannot use staircase search on fully rotated matrix. O(m log n) by binary searching each row.'],
  },

  'search-in-rotated-sorted-array': {
    intuition: 'Search in sorted array rotated at an unknown pivot. Modified binary search.',
    algorithm: [
      'Find which half is sorted. If target in sorted half: search there. Else search other half.',
    ],
    pitfalls: ['Same as LC 33. One half is always sorted. Determine which using arr[lo] vs arr[mid]. O(log n).'],
  },

  'search-insert-position-of-k-in-a-sorted-array': {
    intuition: 'Find index to insert k in sorted array (or return existing index). Binary search lower_bound.',
    algorithm: [
      'Binary search: find first position where arr[pos] >= k.',
    ],
    pitfalls: ['Same as LC 35. Binary search lower bound. O(log n).'],
  },

  'search-pattern-rabinkarp-algorithm': {
    intuition: 'Find pattern in text using Rabin-Karp rolling hash algorithm.',
    algorithm: [
      'Compute hash of pattern. Slide window over text: rolling hash. If hash matches: verify character by character.',
    ],
    pitfalls: ['Handle hash collisions with verification. O(n+m) average, O(nm) worst case. Choose large prime and base.'],
  },

  'second-best-minimum-spanning-tree': {
    intuition: 'Find MST with second minimum total weight. Find MST first, then for each non-tree edge try swapping with max tree edge on path.',
    algorithm: [
      'Build MST. For each non-MST edge (u,v,w): second MST cost = MST cost - maxEdge(u,v in MST) + w.',
      'Track max edge on path between any two MST nodes using DFS/LCA preprocessing.',
    ],
    pitfalls: ['Precompute max edge on every tree path with O(n^2) or O(n log n) with LCA. Then check each non-tree edge.'],
  },

  'set-matrix-zeros': {
    intuition: 'Set entire row and column to 0 if any element is 0. In-place O(1) space using first row/col as markers.',
    algorithm: [
      'First pass: mark which rows and columns need zeroing using first row and col. Second pass: zero marked rows/cols.',
    ],
    pitfalls: ['Same as LC 73. Track if first row/col themselves contain zero separately. O(mn) time O(1) space.'],
  },

  'shop-in-candy-store': {
    intuition: 'Buy k candies, for each bought candy get some free. Find min and max cost. Sort + greedy.',
    algorithm: [
      'Sort. Min cost: buy cheapest, get k freebies from most expensive. Max cost: buy most expensive, get freebies from cheapest.',
    ],
    pitfalls: ['Two greedy strategies. Min: pick from front, get free from back. Max: pick from back, get free from front.'],
  },

  'shortest-cycle': {
    intuition: 'Find length of shortest cycle in an undirected graph. BFS from each node.',
    algorithm: [
      'For each node: BFS tracking distances. When back edge found to already-visited node: cycle length = dist[u]+dist[v]+1.',
    ],
    pitfalls: ['O(V*(V+E)). BFS-based cycle detection. Shortest cycle = girth of graph.'],
  },

  'shortest-path-using-atmost-one-curved-edge': {
    intuition: 'Shortest path where one edge can use a curved (alternative) weight. Dijkstra with extra state.',
    algorithm: [
      'State: (node, curved_used). Dijkstra with two layers: one for curved not used, one for curved used.',
    ],
    pitfalls: ['Modified Dijkstra with boolean state for curved edge used. O((V+E) log V).'],
  },

  'smallest-divisor': {
    intuition: 'Find smallest divisor such that sum of ceiling(arr[i]/divisor) <= threshold. Binary search.',
    algorithm: [
      'Binary search on divisor in [1, max(arr)]. For each divisor d: check if sum of ceil(arr[i]/d) <= threshold.',
    ],
    pitfalls: ['Same as LC 1283. Binary search on answer. Ceiling division: (a+b-1)/b or math.ceil. O(n log max).'],
  },

  'smallest-number': {
    intuition: 'Form smallest number from given digits. Sort digits ascending; handle leading zeros.',
    algorithm: [
      'Sort digits ascending. If all zeros: return "0". If first digit is 0: find first non-zero, put it first.',
    ],
    pitfalls: ['For single-digit constraint: just sort and concatenate. Avoid leading zeros (edge case with multiple zeros).'],
  },

  'smallest-positive-missing-number': {
    intuition: 'Find smallest positive integer not in array. Cyclic sort / index marking.',
    algorithm: [
      'Cyclic sort: place each positive integer x at index x-1 (if 1<=x<=n). Then scan for first position where arr[i]!=i+1.',
    ],
    pitfalls: ['Same as LC 41. O(n) time O(1) space. Cyclic sort variant or mark visited by negating.'],
  },

  'smallest-range-in-k-lists': {
    intuition: 'Find smallest range containing at least one element from each of k sorted lists. Min-heap.',
    algorithm: [
      'Push first element of each list into min-heap, track max. Pop min, push next from same list, update max. Range = max-min. Track minimum range.',
    ],
    pitfalls: ['Same as LC 632. O(n log k) where n = total elements. Always maintain one element from each list in heap.'],
  },

  'smallest-window-containing-all-characters': {
    intuition: 'Smallest window in string containing all characters of pattern. Sliding window with frequency map.',
    algorithm: [
      'Need map for pattern. Expand right until all covered. Contract left while still valid. Track min window.',
    ],
    pitfalls: ['Same as LC 76. Two frequency maps or difference tracking. O(n).'],
  },

  'smallest-window-in-a-string-containing-all-the-characters-of-another-string': {
    intuition: 'Same as minimum window substring. Sliding window approach.',
    algorithm: [
      'Frequency map of pattern. Two pointers. Expand right: update counts. When all covered: contract left. Update answer.',
    ],
    pitfalls: ['Identical to LC 76. The longer problem name is the same problem.'],
  },

  'solve-the-sudoku': {
    intuition: 'Solve a 9x9 Sudoku puzzle using backtracking.',
    algorithm: [
      'For each empty cell: try digits 1-9. Check row, col, 3x3 box conflict. Recurse. Backtrack if stuck.',
    ],
    pitfalls: ['Same as LC 37. Use bitmasks for fast conflict checks. Worst case O(9^81) but pruning makes it fast.'],
  },

  'sort-a-k-sorted-doubly-linked-list': {
    intuition: 'Sort doubly linked list where each element is at most k positions from its correct position. Min-heap of size k+1.',
    algorithm: [
      'Add first k+1 nodes to min-heap. Pop minimum to result, add next node from list. Repeat.',
    ],
    pitfalls: ['O(n log k). Same as nearly sorted array but on DLL. Maintain k+1 size heap while traversing.'],
  },

  'sort-a-linked-list-of-0s-1s-and-2s': {
    intuition: 'Sort linked list of 0s, 1s, and 2s. Count and reconstruct, or Dutch National Flag on nodes.',
    algorithm: [
      'Count 0s, 1s, 2s. Overwrite nodes: first count0 nodes get 0, next count1 get 1, rest get 2.',
    ],
    pitfalls: ['Two passes: count then overwrite values. O(n). Alternative: maintain 3 separate lists and merge.'],
  },

  'sort-by-absolute-difference': {
    intuition: 'Sort array by absolute difference from a given value.',
    algorithm: [
      'Custom sort: compare |arr[i]-x| vs |arr[j]-x|. Sort ascending by absolute difference.',
    ],
    pitfalls: ['Standard sort with custom comparator. O(n log n). Stable sort to handle ties.'],
  },

  'sort-in-specific-order': {
    intuition: 'Sort array where odd numbers come first (sorted descending) then even numbers (sorted ascending).',
    algorithm: [
      'Separate odd and even. Sort odds descending, evens ascending. Concatenate odds + evens.',
    ],
    pitfalls: ['Partition then sort each group. O(n log n). Specific ordering depends on problem variant.'],
  },

  'sort-the-given-array-after-applying-the-given-equation': {
    intuition: 'Sort array after applying f(x) = ax^2 + bx + c transformation. Two-pointer from sorted ends.',
    algorithm: [
      'If a >= 0: parabola opens up, min at vertex, max at ends. Two pointers fill result from ends.',
      'If a < 0: max at vertex, fill from middle.',
    ],
    pitfalls: ['Same as LC 360. O(n) two-pointer after O(n log n) sort. Direction depends on sign of a.'],
  },

  'sorted-and-rotated-minimum': {
    intuition: 'Find minimum in sorted and rotated array. Binary search.',
    algorithm: [
      'If arr[mid] > arr[right]: min is in right half. Else min is in left half (including mid).',
    ],
    pitfalls: ['Same as LC 153. O(log n). When no rotation: arr[0] is minimum. Handle duplicates carefully.'],
  },

  'split-an-array-into-two-equal-sum-subarrays': {
    intuition: 'Check if array can be split into two parts with equal sum. Prefix sum check.',
    algorithm: [
      'Total sum must be even. Find index where prefix sum = total/2.',
    ],
    pitfalls: ['O(n). Total odd: impossible. Find split point where prefix sum equals half.'],
  },

  'split-array-in-three-equal-sum-subarrays': {
    intuition: 'Check if array can be split into 3 parts with equal sum. Prefix sum to find two split points.',
    algorithm: [
      'Total sum must be divisible by 3. Find first index with prefix sum = total/3, then find second index with prefix sum = 2*total/3.',
    ],
    pitfalls: ['O(n). Enumerate split points with prefix sum tracking. Return indices (not values).'],
  },

  'split-array-subsequences': {
    intuition: 'Split array into minimum number of consecutive increasing sequences each of length >= 3.',
    algorithm: [
      'Greedy: use frequency map and end-count map. For each x: prefer appending to existing sequence ending at x-1.',
    ],
    pitfalls: ['Same as LC 659. Two maps: count remaining, ends. Greedy append then start new. O(n).'],
  },

  'split-linked-list-alternatingly': {
    intuition: 'Split linked list into two halves alternately (first, third, fifth... and second, fourth, sixth...).',
    algorithm: [
      'Two pointers: odd and even. Advance both skipping one node each. Split: odd.next = null.',
    ],
    pitfalls: ['Same as LC 328 (odd-even list). O(n) O(1). Maintain two separate chains and separate them.'],
  },

  'split-the-array': {
    intuition: 'Split array into two equal-length subarrays each with distinct elements. Frequency check.',
    algorithm: [
      'If n is odd: false. Count frequencies. Each frequency must be <= 2.',
    ],
    pitfalls: ['Same as LC 2965. Each element can appear at most twice (once in each half). O(n).'],
  },

  'stable-marriage-problem': {
    intuition: 'Find stable matching between two groups using Gale-Shapley algorithm.',
    algorithm: [
      'Men propose in order of preference. Women tentatively accept best proposal, reject others. Continue until all matched.',
    ],
    pitfalls: ['Gale-Shapley: O(n^2). Result is man-optimal stable matching. No blocking pair exists.'],
  },

  'stock-buy-and-sell-multiple-transaction-allowed': {
    intuition: 'Maximum profit with unlimited transactions. Sum all positive differences.',
    algorithm: [
      'For each day: if prices[i] > prices[i-1]: profit += prices[i] - prices[i-1].',
    ],
    pitfalls: ['Same as LC 122. Greedy: capture every upward move. O(n) O(1).'],
  },

  'stream-first-nonrepeating': {
    intuition: 'For each character in a stream, find the first non-repeating character so far. Queue + frequency map.',
    algorithm: [
      'Frequency map. Queue of characters in order. On query: remove from front while freq[front] > 1. Front is answer.',
    ],
    pitfalls: ['Maintain order with queue. O(1) amortized per operation. Lazily remove repeated characters from front.'],
  },

  'string-stack': {
    intuition: 'Implement a stack that supports push, pop, and getMin using strings as elements.',
    algorithm: [
      'Standard stack with array or linked list backing. String operations same as any stack.',
    ],
    pitfalls: ['Standard stack implementation. Push = prepend/append. Pop = remove top. O(1) operations.'],
  },

  'subarrays-with-equal-number-of-occurences': {
    intuition: 'Count subarrays where occurrences of x and y are equal. Prefix sum with difference tracking.',
    algorithm: [
      'Encode: +1 for x, -1 for y. Count subarrays with sum 0 using hashmap of prefix sum frequencies.',
    ],
    pitfalls: ['Transform to "subarrays with sum 0". Prefix difference hashmap gives O(n) solution.'],
  },

  'subarray-range-with-given-sum': {
    intuition: 'Find number of subarrays with sum in range [lower, upper]. Prefix sum + sorted structure.',
    algorithm: [
      'Prefix sums. For each j: count i < j where prefix[j]-upper <= prefix[i] <= prefix[j]-lower. Use sorted array or BIT.',
    ],
    pitfalls: ['Same as LC 327. Merge sort or BIT to count inversions in given range. O(n log n).'],
  },

  'subarrays-with-at-most-k-distinct-integers': {
    intuition: 'Count subarrays with at most k distinct integers. Sliding window.',
    algorithm: [
      'Sliding window: expand right. When distinct > k: shrink left. Count = right - left + 1 for each right.',
    ],
    pitfalls: ['Same as LC 992 helper. O(n). For exactly k: atMost(k) - atMost(k-1).'],
  },

  'subarrays-with-first-element-minimum': {
    intuition: 'Count subarrays where the first element is the minimum. Monotonic stack.',
    algorithm: [
      'For each index i: find how far right arr[i] remains the minimum (next smaller element). Count = span length.',
    ],
    pitfalls: ['Use monotonic stack to find next smaller element. For each position, count valid subarrays starting here.'],
  },

  'subset-xor': {
    intuition: 'Find XOR of XOR values of all subsets of array. Result = 0 if n>1 (each element XORed even times), else arr[0].',
    algorithm: [
      'For n>1: XOR of all subset XORs = 0. For n==1: arr[0]. Alternatively: OR of all elements * 2^(n-1).',
    ],
    pitfalls: ['Mathematical insight: each element appears in 2^(n-1) subsets. If n>1: XOR cancels. Result = arr[0] if n==1.'],
  },

  'substrings-of-length-k-with-k1-distinct-elements': {
    intuition: 'Count substrings of length k with exactly k-1 distinct characters. Sliding window.',
    algorithm: [
      'Fixed window of size k. Track distinct character count. When window has exactly k-1 distinct: count++.',
    ],
    pitfalls: ['Fixed-size sliding window. Update frequency map as window slides. O(n).'],
  },

  'substrings-with-k-distinct': {
    intuition: 'Count substrings with exactly k distinct characters. atMost(k) - atMost(k-1).',
    algorithm: [
      'atMost(k): sliding window counting subarrays with at most k distinct chars. Exactly k = atMost(k) - atMost(k-1).',
    ],
    pitfalls: ['Same as LC 992. Two sliding window calls. O(n) total.'],
  },

  'substrings-with-same-first-and-last-characters': {
    intuition: 'Count substrings where first and last character are equal. Frequency of each character.',
    algorithm: [
      'For each character c with frequency f: contributes f*(f+1)/2 substrings (choose 2 positions + all single-char substrings).',
    ],
    pitfalls: ['Count frequency of each character. Single character counts as valid (same first and last). Formula: f*(f+1)/2.'],
  },

  'sum-of-all-substrings-of-a-number': {
    intuition: 'Sum of all substrings of a number string. Each digit d at position i (0-indexed from right) contributes d * i * (n-i) to total.',
    algorithm: [
      'For digit at position i (1-indexed): it appears in (n-i)*i substrings... compute contribution mathematically.',
    ],
    pitfalls: ['Each digit d[i] contributes d[i] * (i+1) * (n-i) * 10^0_weighted. Use contribution formula to avoid O(n^2).'],
  },

  'sum-of-mode': {
    intuition: 'Sum of modes (most frequent elements) in all subarrays or given groups.',
    algorithm: [
      'For each subarray: compute mode and add to total. Or if specific grouping: use frequency maps.',
    ],
    pitfalls: ['For all subarrays: O(n^2) with sliding frequency map. Mode = element with maximum frequency.'],
  },

  'sum-of-nodes-in-bst-range': {
    intuition: 'Sum of all BST node values in range [low, high]. Range sum query on BST.',
    algorithm: [
      'DFS: if node.val < low: go right. If node.val > high: go left. Else: sum += node.val + both subtrees.',
    ],
    pitfalls: ['Same as LC 938. Use BST property to prune. O(n) worst, O(log n + k) average where k = nodes in range.'],
  },

  'sum-of-nodes-on-the-longest-path': {
    intuition: 'Find the sum of nodes on the longest root-to-leaf path. DFS tracking depth and sum.',
    algorithm: [
      'DFS with (depth, sum). At leaf: if depth > maxDepth: update maxDepth and maxSum. If depth == maxDepth: maxSum = max(maxSum, sum).',
    ],
    pitfalls: ['Maximize path length first; among equal-length paths, maximize sum. Single DFS pass.'],
  },

  'sum-of-subarray-minimums': {
    intuition: 'Sum of minimums of all subarrays. Monotonic stack to find span for each element as minimum.',
    algorithm: [
      'For each element: find left boundary (previous smaller or equal) and right boundary (next smaller). Contribution = arr[i] * left_count * right_count.',
    ],
    pitfalls: ['Same as LC 907. Use monotonic stack for O(n). Handle equal elements carefully to avoid double counting.'],
  },

  'sum-of-subarray-ranges': {
    intuition: 'Sum of (max - min) for all subarrays. Sum of all subarray maximums minus sum of all subarray minimums.',
    algorithm: [
      'Use monotonic stack for sum of subarray maximums and sum of subarray minimums separately. Subtract.',
    ],
    pitfalls: ['Same as LC 2104. Two monotonic stack passes (one for max contributions, one for min). O(n).'],
  },

  'sum-of-subarrays': {
    intuition: 'Sum of sums of all subarrays. Each element arr[i] appears in (i+1)*(n-i) subarrays.',
    algorithm: [
      'For each arr[i]: contribution = arr[i] * (i+1) * (n-i). Sum all contributions.',
    ],
    pitfalls: ['O(n) formula. No need to enumerate all O(n^2) subarrays. Multiply by how many times element appears.'],
  },

  'sum-tree': {
    intuition: 'Check if binary tree is a Sum Tree (each node = sum of all nodes in left and right subtrees).',
    algorithm: [
      'For each node: compute subtree sum. If node.val == leftSum + rightSum: continue. Else false.',
    ],
    pitfalls: ['Post-order DFS. Return subtree sum. At each node: check val == left_sum + right_sum.'],
  },

  'sumstring': {
    intuition: 'Check if string can be split into sequence where each number is sum of previous two (like Fibonacci).',
    algorithm: [
      'Try all first two number splits. Verify the rest of string follows sum rule. Return true if any valid split found.',
    ],
    pitfalls: ['O(n^3) with big integer addition. Backtracking on first two choices, then validate remainder greedily.'],
  },

  'summed-matrix': {
    intuition: 'Find value at (i,j) in infinite matrix where matrix[i][j] = i+j. Count frequency of target value.',
    algorithm: [
      'Value k appears at positions where i+j=k, for i,j in [1,n]. Count valid (i,j) pairs.',
    ],
    pitfalls: ['For value k in n*n matrix: i+j=k, 1<=i,j<=n. Count pairs: max(0, min(k-1,n) - max(1,k-n) + 1).'],
  },

  'swap-and-maximize': {
    intuition: 'Maximize sum of arr[i]*arr[i+1] for adjacent pairs by rearranging array.',
    algorithm: [
      'Sort array. Place in alternating pattern: large values at even positions, small at odd (or similar interleaving).',
    ],
    pitfalls: ['Sort and place: to maximize sum of adjacent products, interleave largest and second-largest alternately.'],
  },

  'swap-diagonals': {
    intuition: 'Swap the two main diagonals of a square matrix.',
    algorithm: [
      'For i in 0..n-1: swap mat[i][i] and mat[i][n-1-i].',
    ],
    pitfalls: ['Simple O(n) loop swapping primary and secondary diagonal elements.'],
  },

  'swap-kth-nodes-from-ends': {
    intuition: 'Swap values of kth node from beginning and kth node from end in linked list.',
    algorithm: [
      'Find kth from start (advance k steps). Find kth from end (two pointers). Swap their values.',
    ],
    pitfalls: ['Same as LC 1721. Two-pointer for kth from end. Just swap values, not node pointers.'],
  },

  'the-knights-tour-problem': {
    intuition: 'Find a knight tour visiting every cell exactly once on a chessboard. Backtracking with Warnsdorff heuristic.',
    algorithm: [
      'Backtrack: from each cell try all 8 knight moves. With Warnsdorff: prefer moves with fewer onward moves (accessibility).',
    ],
    pitfalls: ['Pure backtracking is O(8^(n^2)). Warnsdorff heuristic finds tour in O(n^2) in practice.'],
  },

  'the-palindrome-pattern': {
    intuition: 'Find row or column in matrix where mirroring makes entire matrix palindromic. Check each row/column.',
    algorithm: [
      'For each row: check if all columns are palindromic with this row as mirror axis. Similarly for columns.',
    ],
    pitfalls: ['O(n^3) brute force. For each axis candidate: verify palindrome property across all rows and columns.'],
  },

  'total-count': {
    intuition: 'Count elements <= p and elements that need to be replaced to keep array sorted with bounded differences.',
    algorithm: [
      'Sort and binary search for elements <= p. Count is upper_bound(p) index.',
    ],
    pitfalls: ['Depends on exact problem variant. Common: count of elements <= threshold using binary search on sorted array.'],
  },

  'trail-of-ones': {
    intuition: 'Count binary strings of length n with no two consecutive zeros. DP.',
    algorithm: [
      'dp[i][last]: strings of length i ending with digit last. dp[i][1] = dp[i-1][0] + dp[i-1][1]. dp[i][0] = dp[i-1][1].',
    ],
    pitfalls: ['No two consecutive zeros means after a 0 must come a 1. DP with last-digit state. O(n).'],
  },

  'triplet-family': {
    intuition: 'Find if three elements a, b, c exist such that a+b=c (or similar constraint). Sort + two sum.',
    algorithm: [
      'Sort. For each c (largest element): use two-pointer search for pair (a,b) with a+b=c in the prefix.',
    ],
    pitfalls: ['For each element as potential sum: two-pointer in remaining elements. O(n^2) total.'],
  },

  'two-smallests-in-every-subarray': {
    intuition: 'For every contiguous subarray of length >= 2, find the sum of the two smallest elements; return minimum such sum.',
    algorithm: [
      'Minimum sum of two smallest = minimum sum of two adjacent elements in sorted adjacent pairs.',
    ],
    pitfalls: ['Key insight: minimum of (first_min + second_min) over all subarrays equals minimum over adjacent pairs.'],
  },

  'two-swaps': {
    intuition: 'Check if array can be sorted with at most two swaps. Identify out-of-place elements and verify.',
    algorithm: [
      'Compare array with sorted version. Collect mismatched positions. If 0: done. If 2: verify swap fixes it. If 4: verify two swaps fix it. Else: impossible.',
    ],
    pitfalls: ['Count mismatches with sorted array. 0 mismatches: already sorted. 2: one swap. 4: try two swaps. Else: false.'],
  },

  'tywins-war-strategy': {
    intuition: 'Strategically win war by pairing soldiers optimally. Greedy matching.',
    algorithm: [
      'Sort both armies. Greedy: use weakest soldier that can beat opponent. Track wins.',
    ],
    pitfalls: ['Similar to task assignment problem. Sort and match greedily to maximize wins.'],
  },

  'union-of-arrays-with-duplicates': {
    intuition: 'Find union of two arrays (all unique elements from both). HashSet approach.',
    algorithm: [
      'Add all elements from both arrays to a set. Size of set is the union count.',
    ],
    pitfalls: ['O(m+n). Return count of distinct elements across both arrays. Output sorted union.'],
  },

  'union-of-two-sorted-arrays-with-distinct-elements': {
    intuition: 'Merge two sorted arrays keeping only distinct elements. Two-pointer merge.',
    algorithm: [
      'Two pointers. Pick smaller element. Skip duplicates. O(m+n).',
    ],
    pitfalls: ['Merge step of merge sort, but skip duplicates. Check both arrays and result for duplicates.'],
  },

  'unique-knumber-sum': {
    intuition: 'Find sum of unique k-length subarrays or sum of elements appearing exactly once.',
    algorithm: [
      'Count frequency of each element. Sum elements with frequency == 1.',
    ],
    pitfalls: ['Frequency map. O(n). Sum only elements that appear exactly once in the array/substring.'],
  },

  'unique-number-i': {
    intuition: 'Find element appearing odd number of times in array where all others appear even times. XOR.',
    algorithm: [
      'XOR all elements. Elements appearing even times cancel. Result is the unique element.',
    ],
    pitfalls: ['Same as LC 136. XOR of n^n = 0. Single XOR pass O(n) O(1).'],
  },

  'unique-number-ii': {
    intuition: 'Find two elements appearing odd times, all others appear even times. XOR + bit grouping.',
    algorithm: [
      'XOR all to get xor of two targets. Find a set bit. Divide into two groups by this bit. XOR each group.',
    ],
    pitfalls: ['Same as LC 260. Set bit in XOR distinguishes the two unique numbers. O(n) O(1).'],
  },

  'unique-number-iii': {
    intuition: 'Find element appearing once when all others appear three times. Bit counting modulo 3.',
    algorithm: [
      'For each bit position: count how many numbers have this bit set. If count % 3 != 0: unique number has this bit.',
    ],
    pitfalls: ['Same as LC 137. 32-bit scan, each bit modulo 3. O(32n) = O(n).'],
  },

  'urlify-a-given-string': {
    intuition: 'Replace spaces in string with "%20". Process from end to avoid extra shifting.',
    algorithm: [
      'Count spaces. Expand array. Two pointers from end: copy non-space chars, insert "%20" for spaces.',
    ],
    pitfalls: ['Classic CTCI problem. Expand in-place from end to avoid O(n^2) shifting. O(n).'],
  },

  'vertical-tree-traversal': {
    intuition: 'Print binary tree nodes column by column, top to bottom within each column.',
    algorithm: [
      'BFS/DFS with (node, col, row) tracking. Group by column. Within column sort by row, then value.',
    ],
    pitfalls: ['Same as LC 987. Use TreeMap of column -> sorted list. Sort by (row, value) within each column.'],
  },

  'vertical-width-of-a-binary-tree': {
    intuition: 'Find number of distinct column indices in vertical traversal of binary tree.',
    algorithm: [
      'DFS tracking column: left child = col-1, right child = col+1. Track min and max col. Width = max-min+1.',
    ],
    pitfalls: ['O(n) DFS. Track min and max horizontal distance from root. Width = max_col - min_col + 1.'],
  },

  'walls-coloring-ii': {
    intuition: 'Color n walls with k colors minimizing cost where adjacent walls must differ. DP.',
    algorithm: [
      'dp[i][c] = min cost to color walls 1..i with wall i colored c. Transition: min over all c != prev_c.',
    ],
    pitfalls: ['O(nk^2) naive. Optimize to O(nk) by tracking min and second-min of previous row.'],
  },

  'xor-linked-list': {
    intuition: 'Implement doubly linked list using XOR of prev and next pointers to save space.',
    algorithm: [
      'Each node stores XOR(prev, next). To traverse: next = XOR(prev, node.xorVal). Track previous pointer while traversing.',
    ],
    pitfalls: ['XOR trick: address(prev) XOR address(next) stored. Given prev, compute next = stored XOR prev. O(n) traversal.'],
  },

  'xor-pairs-less-than-k': {
    intuition: 'Count pairs (i,j) where i<j and arr[i] XOR arr[j] < k. Trie-based counting.',
    algorithm: [
      'Build trie of binary representations. For each element: count previous elements with XOR < k using trie traversal.',
    ],
    pitfalls: ['Bit by bit trie traversal. At each bit: if k-bit is 1, count subtree with same bit (guaranteed < k), then go to opposite side.'],
  },

  'two-water-jug-problem': {
    intuition: 'Measure exactly d liters using two jugs of capacity m and n. Solvable iff d <= max(m,n) and d is divisible by gcd(m,n). Simulate both strategies (fill larger first or smaller first) and return minimum steps.',
    algorithm: [
      'Check: if d > max(m,n) or d % gcd(m,n) != 0: return -1.',
      'Simulate helper(full, half, d): start with full jug full, empty jug 0. Pour from full to half, empty half when full, refill full when empty. Count steps until either jug equals d.',
      'Return min(helper(m,n,d), helper(n,m,d)) to try both starting configurations.',
    ],
    pitfalls: ['GCD divisibility is necessary and sufficient for solvability. Always try both orientations (which jug to fill first) and take minimum.'],
  },

  // --- Two Equal Sum Subarrays -----------------------------------------------
  'two-equal-sum-subarrays': {
    intuition:
      'We are looking for a cut index after which the sum on the left equals the sum on the right. Instead of computing both halves independently for each candidate cut, maintain two running accumulators: a prefix sum (growing left-to-right) and a suffix sum (shrinking left-to-right). Start with prefix=0 and suffix=total. After including each element in the prefix and excluding it from the suffix, check for equality. If the total sum is odd, no equal-half split can exist, but the loop handles this gracefully � prefix and suffix will never both be whole-number halves.',
    algorithm: [
      'Compute `suff` = sum of all elements in `arr`.',
      'Initialise `pre = 0`.',
      'For each element `x` in `arr`: `pre += x`, `suff -= x`.',
      'If `pre == suff`, return `true`.',
      'After the loop, return `false`.',
    ],
    example: {
      input: 'arr = [1, 2, 3, 3]',
      steps: [
        'Total sum = 9. suff = 9, pre = 0.',
        'x=1: pre=1, suff=8. 1 ? 8.',
        'x=2: pre=3, suff=6. 3 ? 6.',
        'x=3: pre=6, suff=3. 6 ? 3.',
        'x=3: pre=9, suff=0. 9 ? 0.',
        'No equal split found ? return false.',
      ],
      output: 'false',
    },
    pitfalls: [
      'The split point is exclusive of the dividing element � prefix includes up to and including index i, suffix covers i+1 onward.',
      'An odd total sum makes an equal split mathematically impossible; the check `pre == suff` will simply never be true.',
      'This problem does not require the two parts to be contiguous halves of exactly N/2 elements � just that the sums match at some cut point.',
    ],
  },

  // --- Mean of range in array ------------------------------------------------
  'mean-of-range-in-array': {
    intuition:
      'Answering thousands of range-sum queries naively by re-summing the subarray each time would cost O(N) per query. Instead, precompute a prefix sum array in a single O(N) pass so that any range sum [l, r] is retrieved in O(1) as `prefixSum[r] - prefixSum[l-1]`. The mean is then the floor integer division of that sum by the number of elements `(r - l + 1)`.',
    algorithm: [
      'Build prefix sum: `sum[0] = arr[0]`. For i from 1 to N-1: `sum[i] = sum[i-1] + arr[i]`.',
      'For each query [l, r]: compute `total = sum[r] - (l > 0 ? sum[l-1] : 0)`.',
      'Compute `count = r - l + 1`.',
      'Append `total / count` (integer division) to the result list.',
      'Return the result list after processing all queries.',
    ],
    example: {
      input: 'arr = [1, 2, 3, 4, 5], queries = [[0, 2], [1, 3], [0, 4]]',
      steps: [
        'Build prefix sum: [1, 3, 6, 10, 15].',
        'Query [0,2]: total = sum[2] = 6, count = 3 ? mean = 6/3 = 2.',
        'Query [1,3]: total = sum[3] - sum[0] = 10 - 1 = 9, count = 3 ? mean = 9/3 = 3.',
        'Query [0,4]: total = sum[4] = 15, count = 5 ? mean = 15/5 = 3.',
      ],
      output: '[2, 3, 3]',
    },
    pitfalls: [
      'When l = 0, there is no `sum[l-1]` to subtract � guard this with a conditional (use 0 instead).',
      'Java integer division already floors the result, so no explicit floor call is needed.',
      'Do not use long arithmetic unless the array values and length guarantee overflow � for typical GFG constraints int is sufficient.',
    ],
  },

  // --- Buildings with Sunlight -----------------------------------------------
  'buildings-with-sunlight': {
    intuition:
      'A building is visible from the east (left side) if and only if it is at least as tall as every building to its left. Tracking a running maximum \'ptr\' lets us decide visibility in O(1) per building: if arr[i] >= ptr the building is visible and becomes the new tallest seen so far.',
    algorithm: [
      'Initialise ptr = arr[0] and count = 0.',
      'Walk left-to-right from index 0 to n-1.',
      'If arr[i] >= ptr: the building receives sunlight � increment count and update ptr = arr[i].',
      'Return count.',
    ],
    example: {
      input: 'arr = [7, 4, 8, 2, 9]',
      steps: [
        'i=0: arr[0]=7 >= ptr=7 ? visible, count=1, ptr=7.',
        'i=1: arr[1]=4 < ptr=7 ? blocked.',
        'i=2: arr[2]=8 >= ptr=7 ? visible, count=2, ptr=8.',
        'i=3: arr[3]=2 < ptr=8 ? blocked.',
        'i=4: arr[4]=9 >= ptr=8 ? visible, count=3, ptr=9.',
      ],
      output: '3',
    },
    pitfalls: [
      'Use >= (not >) because the code treats an equal-height building as visible; confirm against the specific problem statement.',
      'Start the loop from index 0 (not 1) since the first building always sees the sun and initialises ptr.',
    ],
  },

  // --- Opposite Sign Pair Reduction ------------------------------------------
  'opposite-sign-pair-reduction': {
    intuition:
      'Use a stack to represent the already-reduced prefix. When a new value arrives, only the stack top can interact with it first if signs are opposite. Resolve that conflict by absolute values, and keep going until either the incoming value is destroyed or no more opposite-sign top exists.',
    algorithm: [
      'Initialize an empty stack.',
      'For each value x in the array, repeatedly compare with stack top while signs are opposite.',
      'If |x| > |top|, pop top and continue (x may collide again).',
      'If |x| < |top|, x is destroyed (stop processing current x).',
      'If |x| == |top|, pop top and destroy x (both removed).',
      'If x survives all collisions, push x into stack.',
      'At the end, stack content (bottom to top) is the reduced array.',
    ],
    example: {
      input: 'arr = [5, 10, -5, -20, 7]',
      steps: [
        'Push 5, push 10. Stack: [5, 10].',
        'x = -5 collides with 10. |10| > |5|, so -5 is removed. Stack unchanged.',
        'x = -20 collides with 10, then 5. Since |-20| is larger, both get popped. Push -20. Stack: [-20].',
        'x = 7 collides with -20. |-20| > |7|, so 7 is removed.',
        'Final stack is [-20].',
      ],
      output: '[-20]',
    },
    pitfalls: [
      'Do not compare non-adjacent elements directly; collision order is strictly with current stack top.',
      'Continue the while-loop after popping weaker top values; one element can trigger multiple removals.',
      'Handle equal magnitudes correctly: both elements must be removed.',
    ],
  },

  // --- Common in 3 Sorted Arrays ---------------------------------------------
  'common-in-3-sorted-arrays': {
    intuition:
      'Because all three arrays are sorted, we can move three pointers in one pass instead of checking every pair/triple. At each step, if values are not equal, only pointers at smaller values need to move (they can never catch up unless advanced). This gives linear-time intersection across all three arrays.',
    algorithm: [
      'Initialize i, j, k = 0 for arrays a, b, c.',
      'While all pointers are in range, compare a[i], b[j], c[k].',
      'If all equal, append value to answer only if it is different from the last added value (dedupe), then increment all three pointers.',
      'Otherwise compute mx = max(a[i], b[j], c[k]).',
      'Advance i while a[i] < mx, advance j while b[j] < mx, advance k while c[k] < mx.',
      'Continue until one pointer reaches the end.',
    ],
    example: {
      input: 'a=[1,5,5], b=[3,4,5,5,10], c=[5,5,10,20]',
      steps: [
        'Start: (1,3,5), mx=5. Move i to first 5 and j to first 5.',
        'Now (5,5,5) equal -> add 5, move all pointers.',
        'Again (5,5,5) equal but duplicate output; skip adding due to dedupe check.',
        'Pointers progress until one array ends. Final answer contains only unique commons.',
      ],
      output: '[5]',
    },
    pitfalls: [
      'Do not add duplicates repeatedly; check last inserted value before appending.',
      'Move only pointers with values below current maximum when values differ.',
      'This method requires sorted input arrays; it is invalid for unsorted arrays.',
    ],
  },

  // --- Smallest window containing 0, 1 and 2 --------------------------------
  'smallest-window-containing-0-1-and-2': {
    intuition:
      'We need the shortest substring that contains all three required characters. This is a classic minimum-window pattern: expand right pointer to satisfy the condition, then shrink left pointer as much as possible while still valid. Because each pointer only moves forward, total work is linear.',
    algorithm: [
      'Initialize two pointers i=0 and j=0, plus counters for 0/1/2.',
      'Move j forward; update the counter for s[j].',
      'Whenever all three counters are at least 1, update answer with current window length.',
      'Then move i forward to shrink window, decrementing counter for s[i], until condition breaks.',
      'Continue until j reaches end. If answer was never updated, return -1; otherwise return minimum length.',
    ],
    example: {
      input: 's = "10212"',
      steps: [
        'j=0..2 gives window "102" with counts (1,1,1), answer=3.',
        'Try shrinking from left: removing 1 breaks condition, so stop shrinking.',
        'Continue expanding; windows "021" and "212" also checked.',
        'Minimum valid window length remains 3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Do not stop after first valid window; keep shrinking to get the minimum.',
      'Remember to decrement counts while moving left pointer.',
      'Return -1 when any required character never appears in the string.',
    ],
  },

  // --- Longest Repeating Character Replacement --------------------------------
  'longest-repeating-character-replacement': {
    intuition:
      'At any point in the sliding window, if the window size minus the count of the most-frequent character exceeds k, we cannot make that window valid with at most k replacements. So we track the highest frequency seen so far and use it to decide when the window is too large to shrink. The key insight is that we never shrink maxCount downward � we only need the window to grow.',
    algorithm: [
      'Initialize left = 0, maxCount = 0, maxLength = 0, and a freq[26] array.',
      'Expand right pointer one step at a time; increment freq[s[right] - A] and update maxCount.',
      'While (right - left + 1) - maxCount > k, the window needs more than k replacements: shrink by decrementing freq[s[left] - A] and incrementing left.',
      'Update maxLength = max(maxLength, right - left + 1).',
      'Return maxLength after the full traversal.',
    ],
    example: {
      input: 's = "AABABBA", k = 1',
      steps: [
        'Expand to "AABAB" (size=5, maxCount=3 As): replacements needed = 5-3 = 2 > k. Shrink.',
        'After shrink: "ABAB" (size=4, maxCount=2): 4-2=2 > 1. Shrink again.',
        '"BAB" (size=3, maxCount=2 Bs): 3-2=1 <= k. Valid. maxLength=3.',
        'Continue... "ABBA" (size=4, maxCount=2 Bs): valid. maxLength=4.',
        'Final answer is 4.',
      ],
      output: '4',
    },
    pitfalls: [
      'maxCount is never decremented even as the window shrinks � this is intentional and correct. We only care about windows at least as large as past valid ones.',
      'The condition checks (windowSize - maxCount) > k, not >= k.',
      'Input characters are uppercase A-Z; use s.charAt(i) - \u0027A\u0027 as the index.',
    ],
  },

  // --- Min Swaps to Group 1s -------------------------------------------------
  'min-swaps-to-group-1s': {
    intuition:
      'If total number of ones is `ones`, then after grouping all ones together they must occupy some contiguous window of length `ones`. Inside that window, every zero must be swapped with a one from outside. So we just need the window of length `ones` that already contains the maximum number of ones.',
    algorithm: [
      'Count total ones in array.',
      'If ones == 0 return -1 (cannot group absent ones). If ones == n return 0.',
      'Compute ones count in first window of size `ones`.',
      'Slide the window by one position each step, updating count in O(1).',
      'Track maximum ones seen in any such window as `maxOnes`.',
      'Return `ones - maxOnes`.',
    ],
    example: {
      input: 'arr = [1,0,1,0,1]',
      steps: [
        'ones = 3, so check windows of length 3.',
        'Window [1,0,1] has 2 ones.',
        'Window [0,1,0] has 1 one.',
        'Window [1,0,1] has 2 ones; maxOnes = 2.',
        'Minimum swaps = 3 - 2 = 1.',
      ],
      output: '1',
    },
    pitfalls: [
      'Do not attempt adjacent-swap counting; this problem asks minimum swaps in general, not necessarily adjacent swaps.',
      'Window size is exactly total ones, not a variable length.',
      'Handle edge cases `ones = 0` and `ones = n` explicitly.',
    ],
  },

  // --- Check if an Array is Max Heap -----------------------------------------
  'check-if-an-array-is-max-heap': {
    intuition:
      'In a max heap stored as a 0-indexed array, every node at index i has its parent at (i-1)/2. The heap property requires every child to be = its parent. Scanning children (not parents) is cleaner because every non-root node has exactly one parent � no edge case for nodes with only one child.',
    algorithm: [
      'Loop i from n-1 down to 1 (all non-root indices).',
      'For each i, compute parent = (i-1)/2.',
      'If arr[i] > arr[parent], return false immediately.',
      'If the loop completes without violation, return true.',
    ],
    example: {
      input: 'arr = [90, 15, 10, 7, 12, 2]',
      steps: [
        'i=5: arr[5]=2 <= arr[2]=10 ?',
        'i=4: arr[4]=12 <= arr[1]=15 ?',
        'i=3: arr[3]=7 <= arr[1]=15 ?',
        'i=2: arr[2]=10 <= arr[0]=90 ?',
        'i=1: arr[1]=15 <= arr[0]=90 ?',
      ],
      output: 'true',
    },
    pitfalls: [
      'Do not start loop at i=0 � the root has no parent and (0-1)/2 gives an incorrect index.',
      'Use (i-1)/2 for 0-based indexing; do not use i/2.',
    ],
  },

  // --- Kth Largest in a Stream -----------------------------------------------
  'kth-largest-in-a-stream': {
    intuition:
      'After processing each element we need the k-th largest seen so far. A min-heap of exactly k elements does this in O(log k) per step: the heap always holds the k largest elements, and its minimum (the top) is exactly the k-th largest. Before k elements have been seen, no k-th largest exists, so output -1.',
    algorithm: [
      'Create a min-heap (PriorityQueue with natural order).',
      'For each element in arr: add it to the heap.',
      'If heap size exceeds k, evict the minimum (poll).',
      'If heap size equals k, append heap.peek() to result; otherwise append -1.',
      'Return the result list.',
    ],
    example: {
      input: 'arr = [1, 2, 3, 4, 5], k = 2',
      steps: [
        'i=0: heap=[1], size<2 ? output -1.',
        'i=1: heap=[1,2], size=2 ? output peek=1.',
        'i=2: add 3 ? heap=[1,2,3], evict min ? heap=[2,3] ? output 2.',
        'i=3: add 4 ? heap=[2,3,4], evict min ? heap=[3,4] ? output 3.',
        'i=4: add 5 ? heap=[3,4,5], evict min ? heap=[4,5] ? output 4.',
      ],
      output: '[-1, 1, 2, 3, 4]',
    },
    pitfalls: [
      'Java\'s PriorityQueue is a min-heap by default � no comparator needed here.',
      'Check heap size == k (not >= k) before peeking, since after eviction size is always = k.',
      'Output -1 for early indices � do not peek when the heap has fewer than k elements.',
    ],
  },

  // --- Sum of XOR of all pairs -----------------------------------------------
  'sum-of-xor-of-all-pairs': {
    intuition:
      'XOR of two numbers at bit position i equals 1 only when the two numbers differ at that bit. So instead of checking every pair, count for each bit how many numbers have it set (count1) and how many do not (count0). Every one of the count1 � count0 pairs contributes 2^i to the total XOR sum.',
    algorithm: [
      'Initialise total = 0.',
      'For each bit position i from 0 to 31:',
      '  Count count1 = number of elements in arr with bit i set.',
      '  count0 = n - count1.',
      '  total += count1 * count0 * (1L << i).',
      'Return total.',
    ],
    example: {
      input: 'arr = [1, 2, 3]',
      steps: [
        'Bit 0 (value 1): set in 1,3 ? count1=2, count0=1 ? contribution = 2�1�1 = 2.',
        'Bit 1 (value 2): set in 2,3 ? count1=2, count0=1 ? contribution = 2�1�2 = 4.',
        'All higher bits: count1=0 ? contribution = 0.',
        'Total = 2 + 4 = 6.',
        'Verify: XOR(1,2)=3, XOR(1,3)=2, XOR(2,3)=1 ? sum = 6. ?',
      ],
      output: '6',
    },
    pitfalls: [
      'Use 1L << i (long shift) to avoid int overflow for bit positions = 31.',
      'Multiply count1 * count0 as long before multiplying by the bit value to prevent overflow.',
      'Each unordered pair is counted exactly once because count1 � count0 counts one element from each group per pair.',
    ],
  },

  // --- Size of Binary Tree ---------------------------------------------------
  'size-of-binary-tree': {
    intuition:
      'Tree size means counting how many nodes exist. For every non-null node, count 1 for itself, then recursively count nodes in its left and right subtrees. The recursive decomposition naturally mirrors the tree structure and visits each node exactly once.',
    algorithm: [
      'If root is null, return 0.',
      'Recursively compute leftSize = getSize(root.left).',
      'Recursively compute rightSize = getSize(root.right).',
      'Return leftSize + rightSize + 1 for the current node.',
    ],
    example: {
      input: 'root = [1, 2, 3, 4, 5]',
      steps: [
        'Node 4: left and right are null, so size = 0 + 0 + 1 = 1.',
        'Node 5: similarly, size = 1.',
        'Node 2: size = size(4) + size(5) + 1 = 1 + 1 + 1 = 3.',
        'Node 3: leaf, size = 1.',
        'Node 1: size = size(2) + size(3) + 1 = 3 + 1 + 1 = 5.',
      ],
      output: '5',
    },
    pitfalls: [
      'Do not forget the +1 for the current node; otherwise you only count descendants.',
      'Base case must return 0 for null, not 1.',
      'Deep skewed trees can cause recursion depth issues in constrained environments.',
    ],
  },

  'check-if-subtree': {
    intuition:
      'Two binary trees are identical if and only if their inorder traversals � with explicit null markers � match. So checking whether T2 is a subtree of T1 reduces to checking whether T2\'s inorder serialization appears as a contiguous subsequence inside T1\'s. That subsequence search is solved in linear time with KMP, turning an O(m�n) brute-force comparison into O(m+n).',
    algorithm: [
      'Run inorder(root1, list1): for each null child insert 0 as a sentinel.',
      'Run inorder(root2, list2): same null-marker convention.',
      'Build the KMP LPS (Longest Proper Prefix-Suffix) array for list2.',
      'KMP-scan list1 with list2 as the pattern; if index j reaches list2.size(), a full match was found.',
      'Return true on match, false if the scan exhausts list1.',
    ],
    example: {
      input: 'root1 = [1, 2, 3], root2 = [2]',
      steps: [
        'Inorder(root1): [0, 2, 0, 1, 0, 3, 0] (0 = null marker).',
        'Inorder(root2): [0, 2, 0].',
        'LPS for [0, 2, 0] = [0, 0, 1].',
        'KMP scan: list1[0..2] = [0,2,0] matches list2 fully at j=3.',
        'Match found � root2 is a subtree of root1.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Omitting null markers makes structurally different trees look identical � e.g., a left-only child and a right-only child with the same value produce the same inorder list without markers.',
      'Using 0 as a null sentinel collides with node values that are actually 0; a safer sentinel is a value outside the problem\'s allowed node-value range.',
      'An empty T2 (root2 == null) is always a subtree; the inorder list for null is just [0], and [0] appears in every non-empty tree\'s serialization.',
    ],
  },

  'remove-invalid-parentheses': {
    intuition:
      'We want the minimum number of removals, so we explore strings in order of increasing removals � exactly what BFS does. Level 0 is the original string (zero removals); level 1 removes one character; and so on. The first level that produces any valid string is the answer, because going deeper would require more removals.',
    algorithm: [
      'Initialise a queue with the original string s and a visited HashSet containing s.',
      'Poll a string cur from the queue.',
      'If cur passes the validity check (balanced parentheses), add it to the result and set found=true.',
      'If found is true, skip generating children � we only want results at this minimum level.',
      'Otherwise, try removing each character that is \"(\" or \")\" and enqueue unseen results.',
      'Repeat until the queue is empty; return all collected valid strings.',
    ],
    example: {
      input: 's = "()())()"',
      steps: [
        'Level 0: "()())()" � not valid (unmatched closing paren).',
        'Level 1: try removing each \"(\" or \")\" ? generates candidates like "(())()" and "()()()".',
        '"(())()" � valid. "()()()" � valid. Set found=true.',
        'Continue draining this BFS level but generate no new children.',
        'Return ["(())()", "()()()"].',
      ],
      output: '["(())()", "()()()"]',
    },
    pitfalls: [
      'Without the visited HashSet, the same string can be generated exponentially many times from different removal sequences.',
      'Non-parenthesis characters must be skipped during removal � removing letters changes meaning, not balance.',
      'Setting found=true stops new children being enqueued but does not stop the current level from being fully drained, ensuring all minimum-removal results are collected.',
    ],
  },

  'count-spanning-trees-in-a-graph': {
    intuition:
      'Kirchhoff\'s Matrix-Tree theorem states that the number of spanning trees of a graph equals the absolute value of any cofactor (e.g., the determinant of the (n-1)�(n-1) submatrix) of its Laplacian matrix. The Laplacian captures both the vertex degrees and edge weights, so computing its determinant via Gaussian elimination yields the count in O(n�).',
    algorithm: [
      'Build the Laplacian matrix L: L[u][u] = degree of u; L[u][v] = -count of edges between u and v.',
      'Extract the (n-1)�(n-1) submatrix by removing the last row and column.',
      'Compute the determinant via Gaussian elimination:',
      '  a) For each pivot column i, find the row with the largest absolute value in column i (partial pivoting).',
      '  b) Swap rows if necessary, tracking sign changes (multiply det by -1).',
      '  c) Eliminate all entries below the pivot via row operations.',
      'Multiply the diagonal entries to get the determinant.',
      'Round to the nearest integer and return.',
    ],
    example: {
      input: 'n = 3, edges = [[0,1],[0,2],[1,2]]',
      steps: [
        'Degrees: 0?2, 1?2, 2?2.',
        'Laplacian: [[2,-1,-1],[-1,2,-1],[-1,-1,2]].',
        'Submatrix (remove last row/col): [[2,-1],[-1,2]].',
        'Determinant: 2*2 - (-1)*(-1) = 4 - 1 = 3.',
        'A triangle has exactly 3 spanning trees: each subset of 2 edges.',
      ],
      output: '3',
    },
    pitfalls: [
      'The Laplacian matrix must be constructed correctly: degree on diagonal, negative adjacency off-diagonal.',
      'Determinant computation uses floating-point arithmetic; comparison against zero must use an epsilon (1e-9) to handle rounding errors.',
      'Removing the last row and column is arbitrary (any (n-1)�(n-1) cofactor works), but the code must be consistent.',
    ],
  },

  'max-profit-from-two-machines': {
    intuition:
      'Tasks should be allocated to whichever machine yields more profit for that task. The greedy insight is to process tasks in order of their profit difference |a[i] - b[i]| (largest first), so the most impactful assignments are made while both machines still have capacity. Once a machine is full, all remaining tasks go to the other.',
    algorithm: [
      'Create Task objects storing a[i], b[i], and diff = |a[i] - b[i]|.',
      'Sort tasks by diff descending (highest spread first).',
      'For each task in order:',
      '  Assign to machine A if (a[i] >= b[i] and A has capacity) or machine B is full.',
      '  Otherwise assign to machine B.',
      'Accumulate profit and increment the respective machine counter.',
      'Return total profit.',
    ],
    example: {
      input: 'x = 2, y = 2, a = [3, 1, 4, 2], b = [2, 5, 3, 6]',
      steps: [
        'Diffs: |3-2|=1, |1-5|=4, |4-3|=1, |2-6|=4.',
        'Sorted by diff desc: task(1,5,4), task(2,6,4), task(3,2,1), task(4,3,1).',
        'Task(1,5): b>a, B has cap ? assign B, profit+=5. countB=1.',
        'Task(2,6): b>a, B has cap ? assign B, profit+=6. countB=2.',
        'Task(3,2): B full ? assign A, profit+=3. countA=1.',
        'Task(4,3): B full ? assign A, profit+=4. countA=2.',
        'Total profit = 5+6+3+4 = 18.',
      ],
      output: '18',
    },
    pitfalls: [
      'Sorting by diff ensures the greedy choice is globally optimal � without sorting, a locally suboptimal assignment could waste capacity on a high-diff task.',
      'Machine B fills up before A in this formulation; check countB >= y as the overflow condition.',
      'Both machines must be checked for capacity before deciding assignment; do not assume one always fills first.',
    ],
  },

  'palindrome-pairs': {
    intuition:
      'A concatenation s + t is a palindrome when one side can be mirrored by the other, plus a center piece that is itself palindrome. So for each word, try every split into prefix and suffix. If prefix is palindrome, we need a word equal to reverse(suffix); if suffix is palindrome, we need reverse(prefix). Hash-map lookups make these checks fast.',
    algorithm: [
      'Build a hash map from reversed word to its index.',
      'For each word s at index i, iterate split position j from 0 to s.length().',
      'Let s1 = s[0..j-1], s2 = s[j..end].',
      'If prefix s1 is palindrome and map contains s2 at index != i, return true.',
      'If suffix s2 is palindrome and map contains s1 at index != i, return true.',
      'If no split works for any word, return false.',
    ],
    example: {
      input: 'arr = ["abcd", "dcba", "lls", "s", "sssll"]',
      steps: [
        'Store reversed words: "dcba"?0, "abcd"?1, "sll"?2, "s"?3, "llsss"?4.',
        'For word "abcd" (i=0), split j=0 gives s1="" (palindrome), s2="abcd".',
        'Map contains "abcd" at index 1, and 1 != 0, so pair exists.',
        'Hence "abcd" + "dcba" is a palindrome.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Always enforce i != matchedIndex; otherwise a word may incorrectly pair with itself.',
      'Handle empty prefix/suffix splits (j = 0 or j = len); they are valid and often necessary.',
      'When duplicate words are possible, storing only one index can miss combinations; a list of indices is safer in that variant.',
    ],
  },

  'range-lcm-queries': {
    intuition:
      'A segment tree is perfect for range queries and point updates when the operation is associative. LCM is associative, so merging LCM(left) and LCM(right) at parent nodes builds the tree correctly. Neutral element for LCM is 1; returning 1 for out-of-range queries ensures correctness.',
    algorithm: [
      'Build phase: recursively fill tree bottom-up. Leaf nodes = array elements. Internal nodes = LCM of two children.',
      'Query phase: if range is outside [l,r], return 1. If inside [ql,qr], return tree[idx]. Otherwise, split and merge child LCMs.',
      'Update phase: find the leaf position, set its value, then propagate LCM changes up to root.',
    ],
    example: {
      input: 'arr = [4, 6, 8], queries = [[2, 1, 2], [1, 0, 2], [2, 0, 2]]',
      steps: [
        'Build tree: leaves = 4, 6, 8. parent(4,6)=LCM(4,6)=12. parent(12,8)=LCM(12,8)=24.',
        'Query [2, 1, 2]: ask LCM of range [1,2] = LCM(6,8) = 24.',
        'Update [1, 0, 2]: set arr[0]=2. Update tree: leaf=2, parent(2,6)=6, parent(6,8)=24.',
        'Query [2, 0, 2]: ask LCM of range [0,2] with arr=[2,6,8] ? LCM=24.',
      ],
      output: '[24, 24]',
    },
    pitfalls: [
      'Returning 1 for out-of-range queries (neutral element for LCM) is essential; 0 would wrongly zero out all results.',
      'After update, make sure to propagate the change up the tree, not just update the leaf.',
      'Index mapping: segment tree uses 1-based indexing for simplicity; be consistent with 0-based array and 1-based tree indices.',
    ],
  },

  'mother-vertex': {
    intuition:
      'A mother vertex in a directed graph is one from which all other vertices are reachable. A key insight: if a mother vertex exists, it will always be the last vertex to finish in a DFS traversal (due to the structure of the graph). So we find the last-finished vertex, then verify it by checking if all vertices are reachable from it.',
    algorithm: [
      'Build the adjacency list from the edge list.',
      'Run DFS from each unvisited vertex, tracking the last vertex to finish�this is the candidate.',
      'Reset the visited array.',
      'Run DFS from the candidate vertex.',
      'If all vertices are visited, the candidate is the mother vertex; otherwise, return -1.',
    ],
    example: {
      input: 'V = 4, edges = [[0,1],[0,2],[1,3],[2,3]]',
      steps: [
        'Adjacency: 0?[1,2], 1?[3], 2?[3], 3?[].',
        'DFS traversal: visit 0, then 1, then 3 (finished 3), backtrack, visit 2 (finished 2), backtrack (finished 1), backtrack (finished 0).',
        'Last finished vertex: 0.',
        'Verify: DFS from 0 reaches 1, 2, 3. All 4 vertices reachable.',
        'Return 0 (the mother vertex).',
      ],
      output: '0',
    },
    pitfalls: [
      'Do not assume the first vertex with the highest out-degree is the mother; topology matters.',
      'The last-finished vertex in DFS is the candidate only because of the directed acyclic structure; in cyclic graphs, revisit the approach.',
      'After finding the candidate, always verify it; not all graphs have a mother vertex.',
    ],
  },

  'search-for-subarray': {
    intuition:
      'Naive search would compare the pattern at every position in the text, leading to O(n�m) complexity. The KMP algorithm avoids this by precomputing an LPS array that encodes how to skip positions after a mismatch, leveraging self-overlaps in the pattern.',
    algorithm: [
      'Build LPS array for pattern b: LPS[i] = length of longest proper prefix of b[0..i] that is also a suffix.',
      'Use two pointers: i for text a, j for pattern b.',
      'If a[i] == b[j], increment both pointers.',
      'If j == pattern.length, a match is found; record position (i - j) and set j = LPS[j-1] to find overlapping matches.',
      'If mismatch and j > 0, use j = LPS[j-1] to skip; if j == 0, increment i.',
      'Return all match positions.',
    ],
    example: {
      input: 'a = [1, 2, 3, 1, 2], b = [1, 2]',
      steps: [
        'LPS for b: [0, 0] (no proper prefix-suffix overlap).',
        'i=0, j=0: a[0]=1, b[0]=1 ? match, i++, j++.',
        'i=1, j=1: a[1]=2, b[1]=2 ? match, j=2 (pattern complete). Position 0, reset j=LPS[1]=0.',
        'i=2, j=0: a[2]=3, b[0]=1 ? mismatch, i++.',
        'i=3, j=0: a[3]=1, b[0]=1 ? match, i++, j++.',
        'i=4, j=1: a[4]=2, b[1]=2 ? match, j=2. Position 3.',
        'Result: [0, 3].',
      ],
      output: '[0, 3]',
    },
    pitfalls: [
      'The LPS array is built on the pattern, not the text; it captures internal structure only.',
      'After a match, set j = LPS[j-1] to find overlapping occurrences, not j = 0.',
      'Off-by-one errors in position recording: when j == pattern.length, the match ends at i-1, so starting position is i - j.',
    ],
  },

  'make-the-array-beautiful': {
    intuition:
      'Two adjacent numbers with opposite signs can "cancel" each other out, leaving fewer elements. A stack naturally tracks which elements remain after each cancellation, and we process left-to-right to handle cascading cancellations.',
    algorithm: [
      'Create an empty stack.',
      'For each number in the array:',
      '  If stack is empty, push the number.',
      '  If number and stack top have opposite signs (one =0, one <0), pop the stack (cancel).',
      '  Otherwise, push the number onto the stack.',
      'Pop all elements from the stack into a result list (this reverses order).',
      'Reverse the result list to restore original order.',
      'Return the result list.',
    ],
    example: {
      input: 'arr = [6, -3, 9, 7]',
      steps: [
        'Push 6. Stack: [6].',
        'Next -3: opposite sign to 6, pop 6. Stack: [].',
        'Push 9. Stack: [9].',
        'Push 7. Stack: [9, 7].',
        'Pop to result: [7, 9]. Reverse: [9, 7].',
      ],
      output: '[9, 7]',
    },
    pitfalls: [
      'Sign check must use =0 and <0, not > and <, to handle 0 correctly (0 cancels with both positive and negative).',
      'Remember to reverse the result at the end; popping from a stack inverts order.',
      'Check for empty stack before peeking; an empty stack means no cancellation applies.',
    ],
  },

  'maximum-sum-problem': {
    intuition:
      'The idea is: given a number n, you can either use it directly or "reduce" it by dividing into n/2, n/3, and n/4 (integer division). The goal is to maximize the sum. Recursively, you compute the best outcome for each sub-problem and memoize to avoid redundant calculations.',
    algorithm: [
      'Base case: if n == 0, return 0.',
      'Recursive case: return max(n, maxSum(n/2) + maxSum(n/3) + maxSum(n/4)).',
      'If memoization is available, check memo[n] before computing.',
      'Store result in memo[n] after computing.',
    ],
    example: {
      input: 'n = 10',
      steps: [
        'maxSum(10) = max(10, maxSum(5) + maxSum(3) + maxSum(2)).',
        'maxSum(5) = max(5, maxSum(2) + maxSum(1) + maxSum(1)) = max(5, 4) = 5.',
        'maxSum(3) = max(3, maxSum(1) + maxSum(1) + maxSum(0)) = max(3, 2) = 3.',
        'maxSum(2) = max(2, maxSum(1) + maxSum(0) + maxSum(0)) = max(2, 1) = 2.',
        'maxSum(1) = max(1, 0+0+0) = 1.',
        'maxSum(10) = max(10, 5 + 3 + 2) = max(10, 10) = 10.',
      ],
      output: '10',
    },
    pitfalls: [
      'Integer division in recursion: n/2, n/3, n/4 are floor divisions; for n=5, n/4=1 and n/3=1.',
      'Without memoization, the same sub-problems are recomputed exponentially (e.g., maxSum(5) called multiple times).',
      'Base case matters: ensure n=0 returns 0, not negative or undefined.',
    ],
  },

  'minimum-multiplications-to-reach-end': {
    intuition:
      'Each number from 0 to 999 can be treated as a graph node because every multiplication is taken modulo 1000. From a current node x, multiplying by any arr[i] leads to exactly one next node, so the problem becomes finding the shortest path in an unweighted graph. BFS is the right tool because every edge costs one multiplication.',
    algorithm: [
      'Handle the easy case first: if start == end, return 0.',
      'Create a distance array of size 1000 (or 1001 in this implementation) and initialise all values to infinity.',
      'Set distance[start] = 0 and push start into a queue.',
      'While the queue is not empty:',
      '  Pop the front value curr.',
      '  For every multiplier val in arr, compute next = (curr * val) % 1000.',
      '  If distance[curr] + 1 improves distance[next], update it and enqueue next.',
      '  If next == end, return distance[next] immediately because BFS found the shortest path.',
      'If BFS finishes without reaching end, return -1.',
    ],
    example: {
      input: 'arr = [2, 5, 7], start = 3, end = 30',
      steps: [
        'Start at 3 with distance 0.',
        'From 3, one move gives 6, 15, and 21.',
        'From 6, multiplying by 5 gives 30.',
        'We reached 30 in 2 multiplications: 3 -> 6 -> 30.',
      ],
      output: '2',
    },
    pitfalls: [
      'The graph is over modulo values, not over indices of the array.',
      'Without the distance/visited check, the queue can revisit the same remainder many times and blow up work.',
      'Returning as soon as end is first discovered is valid only because BFS processes states in increasing distance order.',
    ],
  },

  'product-pair': {
    intuition:
      'We need to find two numbers in the array whose product equals the target. A single-pass hash-set approach works: as we iterate, we ask "have I seen the complement of target/current?" If yes, we have a pair. The hash-set prevents revisiting the same number.',
    algorithm: [
      'Create an empty hash-set to track viewed numbers.',
      'For each number in the array:',
      '  If the number is 0: check if target is also 0 (0 * anything = 0). If yes, return true.',
      '  Otherwise: if target is divisible by this number, compute complement = target / number.',
      '  If the complement is in the set, we found a pair, return true.',
      '  Add the current number to the set for future lookups.',
      'If loop completes without finding a pair, return false.',
    ],
    example: {
      input: 'arr = [2, 4, 6, 3], target = 12',
      steps: [
        'num=2: target%2==0, complement=6. Viewed={}, add 2.',
        'num=4: target%4==0, complement=3. Viewed={2}, add 4.',
        'num=6: target%6==0, complement=2. Viewed={2,4}, 2 is in set ? found pair (6,2).',
        'Return true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Zero is a special case: 0 * x = 0 for any x, so the check target==0 must happen separately.',
      'Integer division: target/num is exact only if target%num==0; always check divisibility first.',
      'One-pass order matters: we check before adding to set, so a number does not pair with itself unless it appears twice and target is a perfect square.',
    ],
  },

  'check-if-all-bits-set': {
    intuition:
      'A number has all its bits set in binary if it is of the form 2^k - 1 (e.g., 7 = 0b111, 15 = 0b1111, 31 = 0b11111). The key insight is that n = 2^k - 1 if and only if n + 1 = 2^k. Since a power of 2 has exactly one bit set, we can check (n+1) & n: if n is all-bits-set, then n+1 and n have no overlapping bits, so their AND is 0.',
    algorithm: [
      'Given n, compute m = n + 1.',
      'Check each bit of m by repeatedly dividing by 2 and taking modulo 2.',
      'If m is a power of 2, all bits are 0 except the highest bit (e.g., 8 = 0b1000).',
      'Return true if all intermediate bits are 0; return false if any intermediate bit is 1.',
      'Alternatively, use the bitwise trick: (n+1) & n == 0 iff n is all-bits-set.',
    ],
    example: {
      input: 'n = 7',
      steps: [
        'n = 7 = 0b0111 (three bits set).',
        'n + 1 = 8 = 0b1000 (one bit set, a power of 2).',
        '(n+1) & n = 0b1000 & 0b0111 = 0b0000 = 0 ? ? true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Zero is not all-bits-set; the edge case n=0 should return false.',
      'The modulo-based loop checks if n+1 is a power of 2 by verifying all intermediate bits are 0; off-by-one errors can break this.',
      'Do not confuse "all bits set" with "maximum value"; all-bits-set numbers are sparse (1, 3, 7, 15, 31, ...).',
    ],
  },

  '1s-surrounded-by-0s': {
    intuition:
      'A cell with value 1 is not surrounded if it can reach the border through adjacent 1s. So instead of trying to prove each 1 is enclosed, mark all border-connected 1s first. Whatever 1s remain unmarked are exactly the ones surrounded by 0s.',
    algorithm: [
      'Create a visited matrix of the same size as the grid.',
      'Traverse the first and last column; whenever a border cell contains 1 and is not visited, run DFS from it.',
      'Traverse the first and last row and do the same DFS marking for border 1s.',
      'After all border-connected regions are marked, scan the full grid.',
      'Count every cell where grid[i][j] == 1 and visited[i][j] == false.',
      'Return that count.',
    ],
    example: {
      input: 'grid = [[0,0,0,0],[0,1,1,0],[0,1,0,0],[1,0,0,1]]',
      steps: [
        'Border 1s are at (3,0) and (3,3). DFS from them marks only those cells because they are isolated.',
        'The 1s at (1,1), (1,2), and (2,1) are never reached from the border.',
        'These three cells are enclosed by 0s on every side through their connected component.',
      ],
      output: '3',
    },
    pitfalls: [
      'Do not count border-connected 1s just because the border cell itself is 0; the whole connected component matters.',
      'A visited matrix is necessary unless you mutate the grid in place during DFS.',
      'Remember to scan both rows and columns on the border; missing one side will overcount surrounded cells.',
    ],
  },

  'transform-to-sum-tree': {
    intuition:
      'Each node in a sum tree should store the sum of values in its left and right subtrees from the original tree. This naturally suggests a postorder traversal: compute children first, then update the current node. Returning subtree totals from recursion lets each parent compute its new value in one pass.',
    algorithm: [
      'Define a recursive function solve(node) that returns the total sum of the original subtree rooted at node after transformation.',
      'Base case: if node is null, return 0.',
      'Store old = node.data (original value).',
      'Recursively compute leftSum = solve(node.left) and rightSum = solve(node.right).',
      'Set node.data = leftSum + rightSum (sum-tree requirement).',
      'Return node.data + old so parent receives total original subtree sum.',
      'Call solve(root) from toSumTree(root).',
    ],
    example: {
      input: 'Tree: 10 with left=2 and right=3',
      steps: [
        'Leaf 2: leftSum=0, rightSum=0, node becomes 0, return 0+2=2.',
        'Leaf 3: leftSum=0, rightSum=0, node becomes 0, return 0+3=3.',
        'Root 10: leftSum=2, rightSum=3, node becomes 5, return 5+10=15.',
        'Final transformed tree values: root=5, left=0, right=0.',
      ],
      output: 'Root now stores 5; each leaf stores 0',
    },
    pitfalls: [
      'Use postorder, not preorder; updating parent first would lose needed original child sums.',
      'Store old node value before overwrite, otherwise parent total becomes incorrect.',
      'Space is recursion stack O(h), not O(1), where h is tree height.',
    ],
  },

  'last-coin-in-a-game-of-alternates': {
    intuition:
      'The implementation repeatedly compares the two ends and discards one side each step. If left value is greater than or equal to right, it advances left; otherwise it decreases right. This elimination continues until only one index remains, which is returned as the last coin value.',
    algorithm: [
      'Initialise two pointers i = 0 and j = n - 1.',
      'While i < j:',
      '  If arr[i] >= arr[j], increment i.',
      '  Else decrement j.',
      'When pointers meet, return arr[i] (or arr[j], same index).',
    ],
    example: {
      input: 'arr = [5, 2, 9, 1, 7]',
      steps: [
        'i=0 (5), j=4 (7): 5<7 so j-- -> 3.',
        'i=0 (5), j=3 (1): 5>=1 so i++ -> 1.',
        'i=1 (2), j=3 (1): 2>=1 so i++ -> 2.',
        'i=2 (9), j=3 (1): 9>=1 so i++ -> 3. Pointers meet at index 3.',
      ],
      output: '1',
    },
    pitfalls: [
      'This explanation follows the current elimination logic exactly; if game rules differ, update logic and explanation together.',
      'Use while(i < j); using <= can move pointers past each other and break return index.',
      'Requires non-empty input array; otherwise pointer initialization is invalid.',
    ],
  },

  'elements-in-the-range': {
    intuition:
      'The current solution counts how many array values fall inside [start, end] after sorting. It then compares this count with the target range length (end-start+1). Under this implementation logic, matching counts are treated as complete coverage.',
    algorithm: [
      'Sort the input array in non-decreasing order.',
      'Initialise count = 0.',
      'Traverse each value x in arr:',
      '  If start <= x <= end, increment count.',
      'After traversal, return count == (end - start + 1).',
    ],
    example: {
      input: 'start = 2, end = 4, arr = [5, 2, 3, 4, 8]',
      steps: [
        'Sort arr -> [2, 3, 4, 5, 8].',
        'Values in [2,4] are 2, 3, 4, so count = 3.',
        'Range length is end-start+1 = 3, so function returns true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'This count-based check can produce false positives when duplicates exist and some value in the range is missing.',
      'Sorting is not required for counting alone; it adds O(n log n) time.',
      'Handle invalid ranges (start > end) explicitly if problem constraints allow them.',
    ],
  },

  'minimum-toggle-to-partition': {
    intuition:
      'The implementation evaluates toggle cost by using global counts and running prefix counts while scanning possible partition points. For a split, it computes cost for the pattern left=0 and right=1: flip all 1s seen on the left plus all 0s remaining on the right. The minimum across splits (and baseline uniform cases considered in code) is returned.',
    algorithm: [
      'Count total zeros (cnt_total_0) and ones (cnt_total_1) in the whole array.',
      'Initialise prefix counts till_cnt_0 and till_cnt_1 as 0.',
      'Initialise minToggles with baseline values used in implementation.',
      'Scan array from left to right, updating prefix counts at each element.',
      'For each prefix boundary, compute toggles = till_cnt_1 + (cnt_total_0 - till_cnt_0).',
      'Update minToggles with the minimum observed value.',
      'Return minToggles.',
    ],
    example: {
      input: 'arr = [1, 0, 1, 0]',
      steps: [
        'Totals: zeros=2, ones=2.',
        'After processing prefix [1], till_cnt_1=1, till_cnt_0=0 -> cost = 1 + (2-0) = 3.',
        'After prefix [1,0], till_cnt_1=1, till_cnt_0=1 -> cost = 1 + (2-1) = 2.',
        'Continue all boundaries and keep the minimum cost.',
      ],
      output: '2',
    },
    pitfalls: [
      'The formula shown is specifically for left=0, right=1 partition cost; changing target pattern needs a different expression.',
      'Be consistent with whether split is before or after current index when updating prefix counts.',
      'Duplicates and already-uniform arrays should still be handled by baseline minimum initialization.',
    ],
  },

  'wifi-range': {
    intuition:
      'Each router at position i covers a continuous interval [i-x, i+x] after clamping to the road boundaries. If the union of all router intervals covers every room from 0 to n-1 without gaps, then the WiFi range is sufficient. So this becomes an interval merge / coverage problem.',
    algorithm: [
      'Scan the string from left to right.',
      'For every router character "1" at position i, compute its coverage interval [max(0, i-x), min(n-1, i+x)].',
      'Keep a merged interval [l, r] for the coverage seen so far.',
      'If the first router is seen, initialise [l, r] with its interval.',
      'For later routers, if the new interval starts after a gap from r, return false.',
      'Otherwise extend the merged interval with min(l, lx) and max(r, ry).',
      'At the end, return true only if [l, r] spans the whole road.',
    ],
    example: {
      input: 's = "1000101", x = 1',
      steps: [
        'Router at 0 covers [0,1].',
        'Router at 4 covers [3,5]. There is a gap between 1 and 3.',
        'Because coverage is not continuous, the answer is false.',
      ],
      output: 'false',
    },
    pitfalls: [
      'Clamp every router interval to the road bounds before merging.',
      'Touching intervals count as continuous coverage; only a gap larger than 1 breaks the range.',
      'Do not return true just because the first and last routers exist; the middle must also be covered.',
    ],
  },

  'vertical-sum': {
    intuition:
      'Nodes on the same vertical line have the same horizontal distance from the root. If we assign root distance 0, then left child is -1 and right child is +1 relative to parent. A DFS can accumulate sums per distance in a map, and a sorted map naturally emits columns from left to right.',
    algorithm: [
      'Create a TreeMap<Integer, Integer> map to store column -> sum.',
      'Run DFS with parameters (node, column).',
      'At each node, do map[column] += node.data.',
      'Recurse to left child with column-1.',
      'Recurse to right child with column+1.',
      'After DFS, return the TreeMap values in key order as the vertical sums.',
    ],
    example: {
      input: 'Tree:    1 /\\ 2   3 / \\     4   5',
      steps: [
        'Column -1 has node 2, sum = 2.',
        'Column 0 has nodes 1 and 4, sum = 5.',
        'Column 1 has node 3, sum = 3.',
        'Column 2 has node 5, sum = 5.',
      ],
      output: '[2, 5, 3, 5]',
    },
    pitfalls: [
      'Use a sorted map (TreeMap) if output order must be left-to-right by column.',
      'Column updates must be consistent: left decrements, right increments.',
      'For deep trees, recursion depth can be large; iterative DFS/BFS is an alternative if stack depth is a concern.',
    ],
  },

  'count-sorted-digit-groupings': {
    intuition:
      'We split the digit string into contiguous groups such that group sums are non-decreasing. At each index, choose the next cut position, compute current group sum, and recurse only if current sum is at least the previous group sum. This creates overlapping subproblems based on (index, previousSum), so memoization is effective.',
    algorithm: [
      'Define dfs(i, prevSum) = number of valid ways to partition substring starting at i.',
      'Base case: if i == n, return 1 (a complete valid partition).',
      'Iterate j from i to n-1, accumulating currSum of s[i..j].',
      'If currSum >= prevSum, add dfs(j+1, currSum) to answer.',
      'Memoize result for key (i, prevSum) and return it.',
      'Initial call is dfs(0, -1) so the first group is always allowed.',
    ],
    example: {
      input: 's = "1119"',
      steps: [
        'Possible groupings include [1|1|1|9] with sums 1,1,1,9 and [11|19] with sums 2,10.',
        'Grouping [1|11|9] has sums 1,2,9 and is valid.',
        'Any grouping with decreasing next sum is discarded during DFS checks.',
      ],
      output: '7',
    },
    pitfalls: [
      'Memo key must include both index and previous sum; index alone is insufficient.',
      'Without memoization, recursion becomes exponential due to repeated states.',
      'Be careful with sum accumulation inside loop; reset correctly per DFS call.',
    ],
  },

  'replace-with-xor-of-adjacent': {
    intuition:
      'Each output element depends only on the current original value and the next original value, so the array can be rewritten in place from left to right as long as we preserve the previous original value in a temporary variable. That makes the transformation linear time and constant extra space.',
    algorithm: [
      'Store the original arr[0] in prev.',
      'For each i from 0 to n-2:',
      '  Save arr[i] into temp before overwriting it.',
      '  Set arr[i] = prev XOR arr[i+1].',
      '  Update prev = temp so the next step still knows the original current value.',
      'Set arr[n-1] = arr[n-1] XOR prev for the last position.',
    ],
    example: {
      input: 'arr = [1, 2, 3, 4]',
      steps: [
        'prev = 1.',
        'i=0 -> arr[0] = 1 XOR 2 = 3, prev stays original 1 for next step.',
        'i=1 -> arr[1] = 1 XOR 3 = 2, prev becomes original 2.',
        'i=2 -> arr[2] = 2 XOR 4 = 6, then last element becomes 4 XOR 3 = 7.',
      ],
      output: '[3, 2, 6, 7]',
    },
    pitfalls: [
      'Do not read from the overwritten array values when advancing; always preserve the original current value first.',
      'The last element uses the final saved previous original value, not the updated prefix.',
      'No extra array should be allocated; the point of the task is in-place transformation.',
    ],
  },

  'express-as-consecutive-number-sum': {
    intuition:
      'A positive integer can be expressed as a sum of consecutive integers iff it is not a power of 2. This follows from number theory: if k >= 2 consecutive integers starting at a sum to n, then n = k*(2a+k-1)/2 = k*(a + (k-1)/2). For this to have an integer solution, n must not be purely a power of 2. The bitwise check n & (n-1) != 0 determines if n has more than one bit set.',
    algorithm: [
      'Use the bitwise property: a power of 2 has exactly one bit set.',
      'If n & (n-1) == 0, then n is a power of 2 (including n=1), so return false.',
      'Otherwise, n is not a power of 2, so return true.',
    ],
    example: {
      input: 'n = 15',
      steps: [
        'n = 15 = 0b1111 (four bits set).',
        'n & (n-1) = 15 & 14 = 0b1111 & 0b1110 = 0b1110 = 14 != 0.',
        'So 15 is not a power of 2, return true.',
        '15 can be expressed as 7+8 (consecutive) or 4+5+6 or 1+2+3+4+5.',
      ],
      output: 'true',
    },
    pitfalls: [
      'The number 1 is a special case: it is 2^0, so it cannot be expressed as a sum of k>=2 consecutive integers. n & (n-1) correctly returns 0 for n=1.',
      'The bitwise trick is correct only because of the mathematical relationship between powers of 2 and consecutive-sum expressibility.',
      'This solution assumes n >= 1; negative or zero inputs would need separate handling.',
    ],
  },

  'max-product-subset': {
    intuition:
      'The product is maximized by using all non-zero values except one negative when negatives are odd. If negatives are odd, excluding the negative with the smallest absolute value loses the least magnitude. Zeros are ignored unless they are needed to avoid returning a negative product in edge cases.',
    algorithm: [
      'Count positive, negative, and zero elements while tracking minimum absolute negative value.',
      'If all elements are zero, return 0.',
      'If there is exactly one negative and all others are zero, return 0.',
      'Multiply absolute values of all non-zero numbers modulo 1e9+7.',
      'If negative count is odd, skip exactly one occurrence of the minimum-absolute negative.',
      'Return the computed product.',
    ],
    example: {
      input: 'arr = [-1, -1, -2, 4, 3]',
      steps: [
        'negatives = 3 (odd), positives = 2, zeros = 0.',
        'Minimum absolute negative is 1, so skip one -1.',
        'Multiply remaining absolute values: 1 * 2 * 4 * 3 = 24.',
      ],
      output: '24',
    },
    pitfalls: [
      'Skipping a different negative than the minimum-absolute one reduces the product.',
      'Including zeros in multiplication collapses result to 0 incorrectly.',
      'Edge case with one negative and only zeros must return 0.',
    ],
  },

  'pairs-with-certain-difference': {
    intuition:
      'Since each value can be used at most once, pairing larger numbers first is beneficial when valid. After sorting, if two adjacent large numbers differ by less than k, taking that pair greedily is optimal because skipping it cannot produce a better contribution from those elements later.',
    algorithm: [
      'Sort the array in non-decreasing order.',
      'Traverse from right to left with index i = n-1.',
      'If i-1 exists and arr[i] - arr[i-1] < k, include this pair in sum and decrement i by 2.',
      'Otherwise, decrement i by 1 and continue.',
      'Return the accumulated sum of chosen pair elements.',
    ],
    example: {
      input: 'arr = [3, 5, 10, 15, 17, 12, 9], k = 4',
      steps: [
        'Sort -> [3, 5, 9, 10, 12, 15, 17].',
        'Check (17,15): diff=2<4, take sum += 32.',
        'Check (12,10): diff=2<4, take sum += 22.',
        'Check (9,5): diff=4 not <4, skip 9.',
        'Check (5,3): diff=2<4, take sum += 8.',
      ],
      output: '62',
    },
    pitfalls: [
      'Condition is strictly less than k, not less than or equal to k.',
      'Without sorting, greedy adjacency pairing is invalid.',
      'After taking a pair, move two steps left so elements are not reused.',
    ],
  },

  'subarray-frequency-count-queries': {
    intuition:
      'Each query asks how many times a value x appears in an index range [l, r]. If we store all occurrence indices of each value in sorted order, then every query becomes a count of indices within a range, which can be answered quickly using two binary searches.',
    algorithm: [
      'Build a map from value to a sorted list of its indices while scanning the array once.',
      'For each query [l, r, x], fetch x\'s index list from the map.',
      'If x does not exist in the map, answer is 0.',
      'Otherwise, find first index >= l (lower bound) and last index <= r (upper bound).',
      'Frequency is upper - lower + 1, or 0 if bounds do not overlap.',
    ],
    example: {
      input: 'arr = [1, 2, 1, 3, 1, 2], queries = [[0,5,1],[1,4,2],[2,3,1]]',
      steps: [
        'Preprocess positions: 1 -> [0,2,4], 2 -> [1,5], 3 -> [3].',
        'Query [0,5,1]: positions in range are [0,2,4] -> 3.',
        'Query [1,4,2]: positions in range are [1] -> 1.',
        'Query [2,3,1]: positions in range are [2] -> 1.',
      ],
      output: '[3, 1, 1]',
    },
    pitfalls: [
      'Range endpoints are inclusive; adjust upper-bound math carefully.',
      'A missing value key must return 0 immediately, not cause null access.',
      'Per-query linear scans over the whole array will time out for large input sizes.',
    ],
  },

  'substring-with-max-zero-one-diff': {
    intuition:
      'We need a substring maximizing zeros minus ones. If we map each character to a numeric gain (+1 for 0, -1 for 1), the problem becomes finding the maximum-sum contiguous subarray, which Kadane solves in linear time. If the string contains no 0, every substring has non-positive gain and the required result is -1.',
    algorithm: [
      'Initialize currentSum = 0, best = -1, and a flag hasZero = false.',
      'Traverse characters in the string.',
      'Map 0 to +1 (and set hasZero = true), map 1 to -1.',
      'Update currentSum += mappedValue and best = max(best, currentSum).',
      'If currentSum becomes negative, reset it to 0 (Kadane reset).',
      'If hasZero is false after traversal, return -1; otherwise return best.',
    ],
    example: {
      input: 's = "1100011"',
      steps: [
        'Mapped values: [-1, -1, +1, +1, +1, -1, -1].',
        'Best subarray is the middle block [+1, +1, +1] with sum 3.',
        'That corresponds to substring "000" where zeros-ones = 3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Do not return 0 when all characters are 1; required output is -1.',
      'Reset current sum only when it is negative, not when it is zero.',
      'Character-to-value mapping must be exact: 0 -> +1 and 1 -> -1.',
    ],
  },

}

export default gfgExplanations


