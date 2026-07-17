/**
 * Rich structured explanations for LeetCode problems.
 * When present, the detail page renders these instead of the plain approach comment block.
 * Keys are problem numbers (integers).
 */
export interface RichExplanation {
  /** The key insight  -  why this approach works, in 2-4 sentences. */
  intuition: string
  /** Numbered algorithm steps. Each string is one step. */
  algorithm: string[]
  /** Optional concrete walkthrough of a small example. */
  example?: {
    input: string
    steps: string[]
    output: string
  }
  /** Optional list of common mistakes to avoid. */
  pitfalls?: string[]
}

const explanations: Record<number, RichExplanation> = {

  // --- 4. Median of Two Sorted Arrays -----------------------------------------
  4: {
    intuition:
      'The naive approach merges both arrays and picks the middle element  -  O(m+n). The insight is that we never actually need to merge. Instead, binary search for the correct partition index in the smaller array: once we know how many elements belong in the combined left half, the median falls out directly from the four elements at the boundary.',
    algorithm: [
      'Ensure nums1 is the smaller array (swap if needed) to keep binary search on the shorter side.',
      'Binary search the partition index `cut1` in nums1 from 0 to m. Derive `cut2 = (m+n+1)/2 - cut1` for nums2.',
      'The partition is valid when maxLeft1 <= minRight2 AND maxLeft2 <= minRight1.',
      'If maxLeft1 > minRight2, move cut1 left (high = cut1 - 1). If maxLeft2 > minRight1, move cut1 right (low = cut1 + 1).',
      'Once the partition is valid: if (m+n) is odd, the median is max(maxLeft1, maxLeft2). If even, it is (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.',
    ],
    example: {
      input: 'nums1 = [1, 3], nums2 = [2]',
      steps: [
        'Total length = 3 (odd), so we need 2 elements in the left half.',
        'Binary search: cut1 = 1 -> maxLeft1 = 1, minRight1 = 3. cut2 = 1 -> maxLeft2 = 2, minRight2 = Infinity.',
        'Check: maxLeft1 (1) <= minRight2 (Infinity)  and maxLeft2 (2) <= minRight1 (3)   -  valid partition.',
        'Odd total -> median = max(1, 2) = 2.',
      ],
      output: '2.0',
    },
    pitfalls: [
      'Use INT_MIN / INT_MAX as sentinels when cut1 = 0 or cut1 = m to avoid array out-of-bounds.',
      'Calculate mid as lo + (hi - lo) / 2 to avoid integer overflow when lo + hi is large.',
      'Ensure binary search is on the shorter array so cut2 never goes negative.',
      'For even total length, average the two middle values; for odd length, take max(left partition values) only.',
    ],
  },

  // --- 11. Container With Most Water ------------------------------------------
  11: {
    intuition:
      'Place two pointers at opposite ends and ask: which pointer should move? The area is limited by the shorter side. Moving the taller side inward can only keep or reduce the height limit while reducing width  -  guaranteed to be worse. Moving the shorter side inward may find a taller line that compensates for the reduced width. So always advance the shorter pointer.',
    algorithm: [
      'Initialise left = 0, right = n-1, maxArea = 0.',
      'While left < right: compute area = min(height[left], height[right]) * (right - left).',
      'Update maxArea = max(maxArea, area).',
      'Advance the pointer pointing to the shorter line: if height[left] < height[right] -> left++; else -> right--.',
      'Return maxArea.',
    ],
    example: {
      input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
      steps: [
        'left=0 (h=1), right=8 (h=7): area = 1*8 = 8. height[left]<height[right] -> left++.',
        'left=1 (h=8), right=8 (h=7): area = 7*7 = 49. height[right]<height[left] -> right--.',
        'left=1 (h=8), right=7 (h=3): area = 3*6 = 18. right--.',
        'Continue until left=1, right=6 (h=8): area = 8*5 = 40.',
        'Max found so far is 49  -  no further pair beats it.',
      ],
      output: '49',
    },
    pitfalls: [
      'Do NOT move the pointer with the greater height  -  that is always suboptimal.',
      'The algorithm works because if a better container exists, the two-pointer sweep is guaranteed to visit it.',
    ],
  },

  // --- 15. 3Sum ----------------------------------------------------------------
  15: {
    intuition:
      'Brute force is O(n^3)  -  check every triplet. Sort first: this costs O(n log n) but unlocks the two-pointer technique. With the array sorted, fix one number and reduce the problem to "find a pair summing to its negation"  -  exactly the Two Sum II pattern, solvable in O(n) with two pointers. Total: O(n^2).',
    algorithm: [
      'Sort the array in ascending order.',
      'Iterate i from 0 to n-3. If nums[i] > 0, break early (no three positives can sum to 0).',
      'Skip duplicate values of nums[i]: if i > 0 and nums[i] == nums[i-1], continue.',
      'Set left = i+1, right = n-1. Run two-pointer loop while left < right.',
      'If sum == 0: record [nums[i], nums[left], nums[right]], skip duplicate lefts and rights, then advance both pointers.',
      'If sum < 0: left++ (need a larger value). If sum > 0: right-- (need a smaller value).',
    ],
    example: {
      input: 'nums = [-1, 0, 1, 2, -1, -4]  -> sorted: [-4, -1, -1, 0, 1, 2]',
      steps: [
        'i=0, nums[i]=-4. Two pointers: left=1(-1), right=5(2). Sum=-3 < 0 -> left++.',
        'left=2(-1), right=5(2). Sum=-3 < 0 -> left++. left=3(0), right=5(2). Sum=-2 < 0 -> left++. Exhaust without match.',
        'i=1, nums[i]=-1. left=2(-1), right=5(2). Sum=0  -> record [-1,-1,2]. Skip dups, advance.',
        'left=3(0), right=4(1). Sum=0  -> record [-1,0,1].',
        'i=2, nums[i]=-1 == nums[1] -> skip (duplicate outer).',
      ],
      output: '[[-1,-1,2], [-1,0,1]]',
    },
    pitfalls: [
      'Skip outer duplicates with `i > 0 && nums[i] == nums[i-1]`  -  not `nums[i] == nums[i+1]`.',
      'After finding a match, also skip inner duplicates on both left and right pointers.',
      'The early break `if nums[i] > 0 return` only works because the array is sorted.',
    ],
  },

  // --- 19. Remove Nth Node From End of List -----------------------------------
  19: {
    intuition:
      'To find the nth node from the end without knowing the list length, use a two-pointer gap trick: if fast is exactly n steps ahead of slow, then when fast reaches the tail, slow is precisely at the node we want to remove. A dummy node before head lets us handle removing the head itself cleanly.',
    algorithm: [
      'Create a dummy node pointing to head; initialise both fast and slow at dummy.',
      'Advance fast n+1 steps forward (so the gap between slow and fast is n+1).',
      'Move both fast and slow one step at a time until fast == null.',
      'Now slow.next is the node to delete. Set slow.next = slow.next.next.',
      'Return dummy.next.',
    ],
    example: {
      input: 'head = [1->2->3->4->5], n = 2',
      steps: [
        'dummy->1->2->3->4->5. Advance fast 3 steps: fast=3, slow=dummy.',
        'Move both: fast=4, slow=1. Move both: fast=5, slow=2. Move both: fast=null, slow=3.',
        'slow.next (node 4) is the 2nd from end. slow.next = node 5.',
        'List becomes 1->2->3->5.',
      ],
      output: '[1, 2, 3, 5]',
    },
    pitfalls: [
      'Advance fast n+1 (not n) steps so slow stops one node BEFORE the target.',
      'The dummy node is essential: without it, removing the head (n == list length) requires a special case.',
    ],
  },

  // --- 22. Generate Parentheses -----------------------------------------------
  22: {
    intuition:
      'At each position in the string we have at most two choices: place "(" or ")". The constraints  -  open count <= n and close count <= open count  -  automatically prune all invalid branches, so every leaf of the recursion tree is already a valid string. No post-validation is needed.',
    algorithm: [
      'Recurse with state: (currentString, openCount, closeCount).',
      'Base case: if currentString.Length == 2*n, add it to results.',
      'If openCount < n: recurse with "(" appended and openCount+1.',
      'If closeCount < openCount: recurse with ")" appended and closeCount+1.',
    ],
    example: {
      input: 'n = 2',
      steps: [
        'Start: ("", 0, 0). Can add "(" -> ("(", 1, 0).',
        'From ("(", 1, 0): add "(" -> ("((", 2, 0) or add ")" -> ("()", 1, 1).',
        'From ("((", 2, 0): can only add ")" -> ("(()", 2, 1) -> ("(())", 2, 2) .',
        'From ("()", 1, 1): add "(" -> ("()(", 2, 1) -> ("()()", 2, 2) .',
      ],
      output: '["(())", "()()"]',
    },
    pitfalls: [
      'Do not use close < n as the condition for adding ")". Use close < open  -  otherwise you generate invalid strings like "))(".',
      'The total valid combinations equal the Catalan number C(n), not 2^(2n).',
    ],
  },

  // --- 33. Search in Rotated Sorted Array -------------------------------------
  33: {
    intuition:
      'A rotated sorted array always has at least one "sorted half"  -  either [lo, mid] or [mid, hi]. Once you identify which half is sorted, checking whether the target lies in that range is a simple boundary comparison. This is what standard binary search does, but applied to the sorted half rather than the whole array.',
    algorithm: [
      'Initialise lo = 0, hi = n-1.',
      'While lo <= hi: compute mid = lo + (hi-lo)/2. If nums[mid] == target, return mid.',
      'Determine which half is sorted: if nums[lo] <= nums[mid], the left half [lo, mid] is sorted.',
      'Left sorted: if nums[lo] <= target < nums[mid], search left (hi = mid-1). Else search right (lo = mid+1).',
      'Right sorted (else): if nums[mid] < target <= nums[hi], search right (lo = mid+1). Else search left (hi = mid-1).',
      'Return -1 if not found.',
    ],
    example: {
      input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
      steps: [
        'lo=0, hi=6, mid=3 (nums[mid]=7). nums[lo]=4 <= nums[mid]=7 -> left half sorted.',
        'target=0 not in [4,7] -> search right: lo=4.',
        'lo=4, hi=6, mid=5 (nums[mid]=1). nums[lo]=0 <= nums[mid]=1 -> left half sorted.',
        'target=0 in [0,1] -> search left: hi=4.',
        'lo=4, hi=4, mid=4 (nums[mid]=0) == target. Return 4.',
      ],
      output: '4',
    },
    pitfalls: [
      'Use nums[lo] <= nums[mid] (not strict <) to handle the case where lo == mid.',
      'Duplicate values (problem 81) break this approach  -  requires handling nums[lo] == nums[mid] by shrinking lo.',
    ],
  },

  // --- 56. Merge Intervals -----------------------------------------------------
  56: {
    intuition:
      'If intervals were sorted by start time, any two overlapping intervals would be adjacent. So sort first, then a single linear scan can greedily merge any interval that overlaps with the last recorded merged interval.',
    algorithm: [
      'Sort intervals by start value.',
      'Initialise the result list with the first interval.',
      'For each remaining interval [s, e]: if s <= result.Last.end (overlap), extend: result.Last.end = max(result.Last.end, e).',
      'Otherwise they do not overlap: push [s, e] as a new separate interval.',
      'Return the result list.',
    ],
    example: {
      input: '[[1,3],[2,6],[8,10],[15,18]]',
      steps: [
        'Sort (already sorted). Start with result = [[1,3]].',
        '[2,6]: start 2 <= 3 -> overlap. Extend: result = [[1,6]].',
        '[8,10]: start 8 > 6 -> no overlap. Push: result = [[1,6],[8,10]].',
        '[15,18]: start 15 > 10 -> no overlap. Push: result = [[1,6],[8,10],[15,18]].',
      ],
      output: '[[1,6],[8,10],[15,18]]',
    },
    pitfalls: [
      'When extending, take max(current.end, new.end)  -  the new interval might be entirely contained inside the current one.',
      'Sorting by start is essential; without it, non-adjacent overlapping intervals are missed.',
    ],
  },

  // --- 70. Climbing Stairs ----------------------------------------------------
  70: {
    intuition:
      'To reach step n you must come from step n-1 (one stair) or step n-2 (two stairs). So the total ways equals ways(n-1) + ways(n-2)  -  the Fibonacci recurrence. There is no need for memoization or a full array; two rolling variables suffice.',
    algorithm: [
      'Handle base cases: n=1 -> 1 way. n=2 -> 2 ways.',
      'Initialise prev2 = 1 (ways to reach step 1), prev1 = 2 (ways to reach step 2).',
      'For i from 3 to n: cur = prev1 + prev2; prev2 = prev1; prev1 = cur.',
      'Return prev1.',
    ],
    example: {
      input: 'n = 5',
      steps: [
        'Step 1: 1 way. Step 2: 2 ways. Step 3: 1+2=3 ways.',
        'Step 4: 2+3=5 ways. Step 5: 3+5=8 ways.',
        'Sequence: 1, 2, 3, 5, 8  -  the Fibonacci numbers offset by one.',
      ],
      output: '8',
    },
    pitfalls: [
      'The answer is Fibonacci(n+1), not Fibonacci(n)  -  make sure your base cases match.',
      'Do not create a dp[n+1] array; two variables is sufficient and avoids O(n) space.',
    ],
  },

  // --- 76. Minimum Window Substring -------------------------------------------
  76: {
    intuition:
      'Sliding window: expand the right edge until all required characters are covered, then shrink the left edge to minimise the window size while still covering all characters. Track "how many required characters are still unmet" as a counter to decide when the window is valid  -  this avoids re-scanning the frequency array on every check.',
    algorithm: [
      'Build a frequency count of t in a 128-element int array. Set required = t.Length.',
      'Expand right pointer: for each character s[right], decrement count[s[right]]. If it was > 0 before, decrement required.',
      'When required == 0 (all characters covered): record window if it is smaller than the best so far.',
      'Shrink left pointer: increment count[s[left]]. If it becomes > 0 again, increment required. Advance left.',
      'Repeat until right reaches end of s.',
    ],
    example: {
      input: 's = "ADOBECODEBANC", t = "ABC"',
      steps: [
        'Expand right until required=0: window "ADOBEC" (indices 0 - 5). Record length 6.',
        'Shrink left: remove A -> required=1. Expand right to include next A.',
        'Window "DOBECODEBA"  -  shrink left again until "BANC" (indices 9 - 12). Length 4.',
        'Shrink left: remove B -> required=1. Right exhausted. Best window is "BANC".',
      ],
      output: '"BANC"',
    },
    pitfalls: [
      'Use an int[128] character array instead of a Dictionary for O(1) per character operations.',
      'Decrement count BEFORE checking if it was > 0 (or check > 0 before decrement)  -  order matters for the required counter.',
      'Edge case: if t is longer than s or s is empty, return "" immediately.',
    ],
  },

  // --- 100. Same Tree ----------------------------------------------------------
  100: {
    intuition:
      'Two binary trees are the same if and only if their roots hold the same value AND their left subtrees are the same AND their right subtrees are the same. This directly translates to a recursive definition with simple base cases.',
    algorithm: [
      'Base case: if both nodes are null -> return true (two empty trees are identical).',
      'Base case: if one is null and the other is not -> return false.',
      'Base case: if root values differ -> return false.',
      'Recurse: return IsSameTree(p.left, q.left) AND IsSameTree(p.right, q.right).',
    ],
    example: {
      input: 'p = [1,2,3], q = [1,2,3]',
      steps: [
        'Compare roots: both 1 -> match. Recurse on left children (both 2) and right children (both 3).',
        'Left: both 2 -> match. Their children are null -> base case, return true.',
        'Right: both 3 -> match. Their children are null -> base case, return true.',
        'All checks pass -> return true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Check for null before comparing values  -  accessing .val on null causes a NullReferenceException.',
      'The null check `p == null && q == null` must come before `p == null || q == null` to avoid false negatives.',
    ],
  },

  // --- 102. Binary Tree Level Order Traversal ---------------------------------
  102: {
    intuition:
      'BFS naturally visits nodes level by level. The key trick to group nodes by level: at the start of each BFS iteration, snapshot the current queue size. That size is exactly how many nodes belong to the current level. Process exactly that many nodes before moving to the next level.',
    algorithm: [
      'If root is null, return empty list.',
      'Enqueue root. While the queue is not empty:',
      'Snapshot levelSize = queue.Count.',
      'Dequeue exactly levelSize nodes, add their values to a level list, enqueue their non-null children.',
      'Add the completed level list to the result.',
    ],
    example: {
      input: 'root = [3,9,20,null,null,15,7]',
      steps: [
        'Queue: [3]. levelSize=1. Dequeue 3 -> level=[3]. Enqueue 9,20. Result=[[3]].',
        'Queue: [9,20]. levelSize=2. Dequeue 9 -> enqueue nothing. Dequeue 20 -> enqueue 15,7. Result=[[3],[9,20]].',
        'Queue: [15,7]. levelSize=2. Dequeue both -> level=[15,7]. Result=[[3],[9,20],[15,7]].',
      ],
      output: '[[3],[9,20],[15,7]]',
    },
    pitfalls: [
      'Snapshot queue.Count BEFORE the inner loop  -  dequeuing nodes during the loop changes the count.',
      'Add both left and right children only if non-null to avoid null entries in the queue.',
    ],
  },

  // --- 146. LRU Cache ----------------------------------------------------------
  146: {
    intuition:
      'An LRU cache needs O(1) lookup and O(1) reordering to track recency. A hash map gives O(1) lookup. A doubly-linked list gives O(1) insertion and deletion at any position. Combining both: the map stores key -> node, and the list maintains order from most-recent (head) to least-recent (tail).',
    algorithm: [
      'Create dummy head and tail nodes. Connect them. Map starts empty.',
      'get(key): if not in map, return -1. Otherwise move the node to just after the dummy head and return its value.',
      'put(key, value): if key exists, update value and move to front. If new: insert new node at front.',
      'After inserting a new node: if size > capacity, remove the node just before the dummy tail (LRU) and delete its key from the map.',
      'Helper Remove(node) unlinks a node in O(1). Helper InsertFront(node) inserts after head in O(1).',
    ],
    example: {
      input: 'capacity=2, operations: put(1,1), put(2,2), get(1), put(3,3), get(2)',
      steps: [
        'put(1,1): list = [1]. put(2,2): list = [2,1] (2 is most recent).',
        'get(1): move 1 to front -> list = [1,2]. Return 1.',
        'put(3,3): list full. Evict LRU (tail = 2). list = [3,1].',
        'get(2): key 2 was evicted -> return -1.',
      ],
      output: 'get(1)=1, get(2)=-1',
    },
    pitfalls: [
      'Sentinel dummy head and tail nodes eliminate all null checks in Remove/InsertFront.',
      'Always remove the old node before inserting the updated one to avoid the map having two entries for the same key.',
      'On eviction, remove from BOTH the list and the map or subsequent gets will return stale data.',
    ],
  },

  // --- 160. Intersection of Two Linked Lists -----------------------------------
  160: {
    intuition:
      'If both pointers walk the same total distance (|A| + |B|), they will arrive at the intersection at the same step  -  or both arrive at null together if there is no intersection. Redirecting each pointer to the other list\'s head when it reaches null achieves exactly this total-distance equality with no extra memory.',
    algorithm: [
      'Initialise a = headA, b = headB.',
      'While a != b: advance each by one step. When a reaches null, redirect it to headB. When b reaches null, redirect it to headA.',
      'If the lists intersect, a == b will be the intersection node. If not, both will be null simultaneously (null == null).',
      'Return a (or b).',
    ],
    example: {
      input: 'A = [4,1,8,4,5], B = [5,6,1,8,4,5] (intersect at node with value 8)',
      steps: [
        'a walks A (5 nodes) then B (6 nodes) = 11 steps to reach node 8.',
        'b walks B (6 nodes) then A (5 nodes) = 11 steps to reach node 8.',
        'At step 11, a == b == the intersection node.',
      ],
      output: 'Reference to node with value 8',
    },
    pitfalls: [
      'Compare node references, not node values  -  multiple nodes can have the same value but only one is the true intersection.',
      'The loop exits when a == b (including both being null for non-intersecting lists). Do NOT check a != null.',
    ],
  },

  // --- 189. Rotate Array -------------------------------------------------------
  189: {
    intuition:
      'Rotating right by k means the last k elements move to the front and the first n-k elements shift right. Observe: if you reverse the entire array, then independently reverse the first k elements and the last n-k elements, you get exactly the rotated result. Three reverses, no extra array.',
    algorithm: [
      'Reduce k = k % n to handle rotations larger than the array.',
      'Reverse the entire array.',
      'Reverse the first k elements (indices 0 to k-1).',
      'Reverse the remaining n-k elements (indices k to n-1).',
    ],
    example: {
      input: 'nums = [1,2,3,4,5,6,7], k = 3',
      steps: [
        'Reverse all:        [7,6,5,4,3,2,1]',
        'Reverse first 3:    [5,6,7,4,3,2,1]',
        'Reverse last 4:     [5,6,7,1,2,3,4]',
      ],
      output: '[5,6,7,1,2,3,4]',
    },
    pitfalls: [
      'Reduce k mod n first  -  otherwise k=7 on a 7-element array does nothing but the naive reversal would still run.',
      'k = 0 after reduction means no rotation is needed; the three-reversal still works (each reverse is a no-op or reverses then re-reverses the same range).',
    ],
  },

  // --- 198. House Robber -------------------------------------------------------
  198: {
    intuition:
      'At each house you have two choices: rob it (and skip the previous) or skip it (and keep whatever was best through the previous house). This gives the recurrence dp[i] = max(dp[i-2] + nums[i], dp[i-1]). Only the last two dp values are ever needed, so the array collapses to two variables.',
    algorithm: [
      'If n == 1, return nums[0].',
      'Initialise prev2 = nums[0] (best loot through house 0), prev1 = max(nums[0], nums[1]) (best through house 1).',
      'For i from 2 to n-1: cur = max(prev1, prev2 + nums[i]); prev2 = prev1; prev1 = cur.',
      'Return prev1.',
    ],
    example: {
      input: 'nums = [2,7,9,3,1]',
      steps: [
        'prev2=2, prev1=max(2,7)=7.',
        'i=2 (nums=9): cur=max(7, 2+9)=11. prev2=7, prev1=11.',
        'i=3 (nums=3): cur=max(11, 7+3)=11. prev2=11, prev1=11.',
        'i=4 (nums=1): cur=max(11, 11+1)=12. prev2=11, prev1=12.',
      ],
      output: '12  (rob houses 0,2,4: 2+9+1=12)',
    },
    pitfalls: [
      'Initialise prev1 = max(nums[0], nums[1]) not just nums[1]  -  you might not rob house 1.',
      'Do not reset dp to 0 at any step  -  you always carry forward the best previous answer.',
    ],
  },

  // --- 210. Course Schedule II ------------------------------------------------
  210: {
    intuition:
      'Finding a valid course order is exactly topological sorting of a directed graph. Kahn\'s algorithm (BFS-based) is the cleaner approach: start with all courses that have no prerequisites (in-degree 0), process them one by one, and "unlock" courses whose last prerequisite has just been completed. If a cycle exists, some courses will never reach in-degree 0.',
    algorithm: [
      'Build adjacency list and in-degree array from prerequisites.',
      'Enqueue all nodes with in-degree 0.',
      'Dequeue a course: add it to the result order. For each neighbour, decrement its in-degree.',
      'If a neighbour\'s in-degree reaches 0, enqueue it.',
      'If result.Count == numCourses, return result. Otherwise a cycle exists  -  return [].',
    ],
    example: {
      input: 'numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]',
      steps: [
        'In-degrees: 0->0, 1->1, 2->1, 3->2. Queue: [0].',
        'Dequeue 0: result=[0]. Decrement 1 (->0), 2 (->0). Queue: [1,2].',
        'Dequeue 1: result=[0,1]. Decrement 3 (->1). Queue: [2].',
        'Dequeue 2: result=[0,1,2]. Decrement 3 (->0). Queue: [3].',
        'Dequeue 3: result=[0,1,2,3]. Count=4=numCourses -> valid.',
      ],
      output: '[0,1,2,3]',
    },
    pitfalls: [
      'A cycle is detected by checking result.Count < numCourses at the end, not during BFS.',
      'The order returned is one valid topological order  -  many valid orderings may exist.',
      'Build the graph so edges point FROM prerequisite TO the course that requires it (forward direction).',
    ],
  },

  // --- 213. House Robber II ----------------------------------------------------
  213: {
    intuition:
      'The circular constraint means houses 0 and n-1 cannot both be robbed. Break the circle by solving two independent sub-problems: one excluding the first house, one excluding the last. The answer is the maximum of both. Each sub-problem is the classic linear House Robber.',
    algorithm: [
      'If n == 1, return nums[0].',
      'Define Rob(start, end): run the rolling-variable DP on nums[start..end]. O(n) time, O(1) space.',
      'Return max(Rob(0, n-2), Rob(1, n-1)).',
    ],
    example: {
      input: 'nums = [2,3,2]',
      steps: [
        'Sub-problem 1 (exclude last): Rob([2,3]). Best = 3.',
        'Sub-problem 2 (exclude first): Rob([3,2]). Best = 3.',
        'Return max(3,3) = 3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Do not try to "stitch" the two sub-problems together  -  they are fully independent.',
      'Edge case n=1: return nums[0] before calling Rob, since Rob(0, -1) would have an empty range.',
    ],
  },

  // --- 236. Lowest Common Ancestor --------------------------------------------
  236: {
    intuition:
      'Post-order DFS: we need information from both subtrees before deciding. If a node equals p or q, return it immediately  -  even if the other target is a descendant, the current node is still the LCA. If both left and right recursive calls return non-null, we are at the node where p and q split  -  that\'s the LCA.',
    algorithm: [
      'Base cases: if root is null, return null. If root == p or root == q, return root.',
      'Recurse: left = LCA(root.left, p, q); right = LCA(root.right, p, q).',
      'If both left and right are non-null -> root is the LCA. Return root.',
      'Otherwise return whichever is non-null (the LCA is deeper in that subtree).',
    ],
    example: {
      input: 'root=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=4',
      steps: [
        'DFS left of 3: reaches 5. 5 == p -> return node 5.',
        'From 5, DFS right: reaches 2, then 4. 4 == q -> returns up through 2, then 5.',
        'Back at node 3: left returned node 5 (found p). Dive right of 3: reaches 1,0,8  -  none match p or q -> returns null.',
        'Node 3: left=node5 (non-null), right=null -> return node5 as LCA.',
      ],
      output: 'Node with value 5',
    },
    pitfalls: [
      'The algorithm assumes both p and q exist in the tree. If either is missing, the result is undefined.',
      'Do NOT descend into a subtree after finding one target  -  the early return `if root == p || root == q` handles the ancestor case correctly.',
    ],
  },

  // --- 239. Sliding Window Maximum --------------------------------------------
  239: {
    intuition:
      'The maximum of every window of size k is needed. A naive approach rechecks each window in O(k)  -  O(nk) total. The insight: maintain a monotonically decreasing deque of indices. Any index with a smaller value than the incoming element can never be the maximum for any current or future window, so it is discarded immediately.',
    algorithm: [
      'Use a LinkedList<int> (deque) storing indices. Process each index i from 0 to n-1.',
      'Remove from the front any index <= i-k (outside the current window).',
      'Remove from the back any index whose value is <= nums[i] (they are dominated).',
      'Add i to the back of the deque.',
      'When i >= k-1 (first full window reached): the front of the deque is the index of the window maximum.',
    ],
    example: {
      input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
      steps: [
        'i=0: deque=[0(1)]. i=1: 3>1, remove 0 -> deque=[1(3)]. i=2: -1<3, deque=[1(3),2(-1)]. Window [1,3,-1]: max=nums[1]=3.',
        'i=3: -3<-1, deque=[1(3),2(-1),3(-3)]. Window [3,-1,-3]: max=nums[1]=3.',
        'i=4: 5>everything, clear deque -> deque=[4(5)]. Window [-1,-3,5]: max=5.',
        'i=5: 3<5, deque=[4(5),5(3)]. i=6: 6>3 and 6>5, clear -> deque=[6(6)]. max=6.',
        'i=7: 7>6, clear -> deque=[7(7)]. max=7.',
      ],
      output: '[3,3,5,3,6,7]',
    },
    pitfalls: [
      'Remove from FRONT when out of window. Remove from BACK when dominated. These are two separate conditions, not one.',
      'Each element is pushed and popped at most once  -  total O(n), not O(nk).',
    ],
  },


  // --- 12. Integer to Roman ----------------------------------------------------
  12: {
    intuition:
      'Roman numerals use a fixed set of symbols (I=1, V=5, X=10, L=50, C=100, D=500, M=1000) plus six subtractive combinations (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900). Greedily subtract the largest symbol value that fits, emitting its string each time. Since the symbol list is finite and ordered, a simple loop works.',
    algorithm: [
      'Build parallel arrays: values = [1000,900,500,400,100,90,50,40,10,9,5,4,1], symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"].',
      'Iterate through each (value, symbol) pair.',
      'While num >= value: append symbol to result, subtract value from num.',
      'Return result.',
    ],
    example: {
      input: 'num = 1994',
      steps: [
        '1994 >= 1000 -> append "M", num=994.',
        '994 >= 900  -> append "CM", num=94.',
        '94 >= 90   -> append "XC", num=4.',
        '4 >= 4     -> append "IV", num=0.',
      ],
      output: '"MCMXCIV"',
    },
    pitfalls: [
      'Include the subtractive cases (4, 9, 40, 90, 400, 900) in the value table  -  do not try to detect them dynamically.',
    ],
  },

  // --- 13. Roman to Integer ----------------------------------------------------
  13: {
    intuition:
      'In a valid Roman numeral, a smaller value before a larger value means subtraction; otherwise it means addition. Scan left to right: if the current symbol\'s value is less than the next symbol\'s value, subtract it; otherwise add it.',
    algorithm: [
      'Build a map: I->1, V->5, X->10, L->50, C->100, D->500, M->1000.',
      'Iterate i from 0 to n-1.',
      'If i < n-1 and map[s[i]] < map[s[i+1]]: subtract map[s[i]] from result.',
      'Else: add map[s[i]] to result.',
      'Return result.',
    ],
    example: {
      input: '"MCMXCIV"',
      steps: [
        'M(1000): next is C(100). 1000 > 100 -> add. result=1000.',
        'C(100): next is M(1000). 100 < 1000 -> subtract. result=900.',
        'M(1000): next is X(10). add. result=1900.',
        'X(10): next is C(100). 10 < 100 -> subtract. result=1890.',
        'C(100): next is I(1). add. result=1990.',
        'I(1): next is V(5). 1 < 5 -> subtract. result=1989.',
        'V(5): last. add. result=1994.',
      ],
      output: '1994',
    },
    pitfalls: [
      'The last character always adds  -  the compare-with-next rule handles all subtractive cases automatically.',
    ],
  },

  // --- 14. Longest Common Prefix -----------------------------------------------
  14: {
    intuition:
      'The longest common prefix is the deepest path in a trie where every inserted string still agrees. Build a trie from all strings, then walk from the root while each node has exactly one child and is not marked as the end of a shorter word. Stop at the first branch or word end — the characters collected along that single-child chain are the answer.',
    algorithm: [
      'Insert every string into a trie character by character.',
      'Track child count per node so you can detect branching quickly.',
      'From the root, repeatedly follow the only child while childCount == 1 and the node is not an end-of-word marker.',
      'Append each character along that chain to the answer builder.',
      'Stop when a node has 0 or 2+ children, or when a complete string ends before others diverge.',
      'Return the built prefix (empty string if the first character already differs).',
    ],
    example: {
      input: '["flower","flow","flight"]',
      steps: [
        'Insert all three strings into the trie: shared path f → l → o, then branch at the fourth character.',
        'Walk from root: f (1 child), l (1 child), o (1 child).',
        'At o, the next level has multiple children (w from "flow"/"flower", i from "flight") — stop.',
        'Collected prefix = "fl".',
      ],
      output: '"fl"',
    },
    pitfalls: [
      'Mark end-of-word on nodes; if the shortest string is a prefix of others (e.g. "a", "ab"), stop when you hit that end marker.',
      'Vertical scanning also works, but the trie version matches the C# solution and scales cleanly to prefix-search follow-ups.',
      'Empty input array should return "" immediately before building the trie.',
    ],
  },

  // --- 16. 3Sum Closest -------------------------------------------------------
  16: {
    intuition:
      'Sort the array, then for each fixed element i use two pointers on the remainder. The sorted order lets you deterministically move closer to the target: if the current sum is too small, advance left; if too large, retreat right. Update the closest sum whenever you find a smaller gap.',
    algorithm: [
      'Sort nums.',
      'Initialise closest = nums[0]+nums[1]+nums[2].',
      'For i from 0 to n-3: set left=i+1, right=n-1.',
      'While left < right: compute sum = nums[i]+nums[left]+nums[right]. If |sum-target| < |closest-target|, update closest.',
      'If sum < target -> left++. If sum > target -> right--. If sum == target -> return target.',
      'Return closest.',
    ],
    example: {
      input: 'nums = [-1,2,1,-4], target = 1  -> sorted: [-4,-1,1,2]',
      steps: [
        'i=0(-4): left=1(-1),right=3(2). sum=-3. |diff|=4. sum<target->left++.',
        'left=2(1),right=3(2). sum=-1. |diff|=2. sum<target->left++. Loop ends.',
        'i=1(-1): left=2(1),right=3(2). sum=2. |diff|=1. sum>target->right--. Loop ends.',
        'Closest=2.',
      ],
      output: '2',
    },
    pitfalls: [
      'Early return when sum == target since you cannot get closer than 0.',
    ],
  },

  // --- 25. Reverse Nodes in k-Group -------------------------------------------
  25: {
    intuition:
      'Reverse exactly k nodes at a time, then recurse (or iterate) on the rest. The tricky part is connecting the reversed group back to the previous part and the next group. Use a dummy head to simplify the boundary.',
    algorithm: [
      'Use a dummy node before head. prevGroupTail = dummy.',
      'Count k nodes ahead from the current position. If fewer than k remain, stop.',
      'Reverse the k nodes in-place, keeping track of the new head and new tail of the reversed group.',
      'Connect prevGroupTail.next = newHead and newTail.next = nextGroup.',
      'Advance prevGroupTail to newTail. Repeat.',
    ],
    example: {
      input: 'head = [1->2->3->4->5], k = 2',
      steps: [
        'Group 1: reverse [1,2] -> [2,1]. Connect: dummy->2->1.',
        'Group 2: reverse [3,4] -> [4,3]. Connect: 1->4->3.',
        'Only 1 node [5] left  -  fewer than k=2, leave as-is. Connect: 3->5.',
      ],
      output: '[2,1,4,3,5]',
    },
    pitfalls: [
      'Check there are exactly k nodes left before reversing  -  do not reverse a partial group.',
      'Save the "next group\'s head" before reversing, or you lose the pointer to the rest of the list.',
    ],
  },

  // --- 26. Remove Duplicates from Sorted Array --------------------------------
  26: {
    intuition:
      'The array is sorted, so duplicates are adjacent. Use a slow pointer k that tracks where the next unique element should go. The fast pointer i scans ahead; whenever it finds a value different from the last accepted value, copy it to position k.',
    algorithm: [
      'If array is empty, return 0.',
      'Initialise k = 1 (first element is always unique).',
      'For i from 1 to n-1: if nums[i] != nums[i-1], set nums[k] = nums[i], k++.',
      'Return k.',
    ],
    example: {
      input: 'nums = [1,1,2,3,3]',
      steps: [
        'i=1: 1==1 skip. i=2: 2!=1 -> nums[1]=2, k=2.',
        'i=3: 3!=2 -> nums[2]=3, k=3. i=4: 3==3 skip.',
        'Array first 3 = [1,2,3].',
      ],
      output: 'k = 3',
    },
    pitfalls: [
      'Compare nums[i] with nums[i-1] (not nums[k-1])  -  same result since the sorted property is preserved.',
      'Return k, not k-1; k is a count, not an index.',
    ],
  },

  // --- 27. Remove Element -----------------------------------------------------
  27: {
    intuition:
      'Use two pointers: a slow write pointer k and a fast scan pointer i. Copy nums[i] to nums[k] only when nums[i] != val. This effectively filters out all instances of val in-place.',
    algorithm: [
      'Initialise k = 0.',
      'For i from 0 to n-1: if nums[i] != val, set nums[k] = nums[i], k++.',
      'Return k.',
    ],
    example: {
      input: 'nums = [3,2,2,3], val = 3',
      steps: [
        'i=0: 3==val, skip. i=1: 2!=val -> nums[0]=2, k=1.',
        'i=2: 2!=val -> nums[1]=2, k=2. i=3: 3==val, skip.',
      ],
      output: 'k = 2, nums = [2,2,_,_]',
    },
    pitfalls: [
      'The remaining elements beyond index k do not matter  -  only the first k elements are checked.',
    ],
  },

  // --- 29. Divide Two Integers ------------------------------------------------
  29: {
    intuition:
      'Division without multiplication/division: use bit-shifting to implement exponential doubling. Find the largest multiple of divisor (as a power of 2) that fits in dividend, subtract it, record the multiple, and repeat. This achieves O(log^2 n) instead of O(n) for repeated subtraction.',
    algorithm: [
      'Handle overflow: if dividend == INT_MIN and divisor == -1, return INT_MAX.',
      'Track sign: result is negative if exactly one of dividend/divisor is negative. Work with absolute values.',
      'While |dividend| >= |divisor|: double divisor (shift left) and double count (1 << shift) until it overshoots. Back off one step. Subtract from dividend, add count to result.',
      'Repeat until dividend < divisor.',
      'Apply sign and return.',
    ],
    example: {
      input: 'dividend = 10, divisor = 3',
      steps: [
        'Both positive. |10| >= |3|: 3<<1=6 fits, 6<<1=12 > 10. Back off: subtract 6, result=2. Remaining=4.',
        '|4| >= |3|: 3<<1=6 > 4. Subtract 3, result=3. Remaining=1.',
        '|1| < |3|. Done. result=3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Must handle INT_MIN / -1 = INT_MAX overflow separately.',
      'Use long arithmetic for intermediate values to avoid overflow during doubling.',
    ],
  },

  // --- 32. Longest Valid Parentheses ------------------------------------------
  32: {
    intuition:
      'Use a stack to track indices of unmatched characters. Push -1 as a base sentinel. When ")" is seen and the stack top is a "(" index, pop it (they form a matched pair) and the current valid length is i - stack.Peek(). If the stack becomes empty, push i as the new base.',
    algorithm: [
      'Push -1 onto stack as base.',
      'For each index i: if s[i] == "(", push i.',
      'Else (s[i] == ")"): pop from stack. If stack is empty, push i as new base. Else update maxLen = max(maxLen, i - stack.Peek()).',
      'Return maxLen.',
    ],
    example: {
      input: 's = ")()())"',
      steps: [
        'i=0 ")" : pop -1 -> empty. Push 0 as base.',
        'i=1 "(" : push 1. i=2 ")" : pop 1. Stack=[0]. len=2-0=2.',
        'i=3 "(" : push 3. i=4 ")" : pop 3. Stack=[0]. len=4-0=4.',
        'i=5 ")" : pop 0 -> empty. Push 5 as base.',
        'maxLen=4.',
      ],
      output: '4',
    },
    pitfalls: [
      'The base sentinel (-1 or the index of an unmatched ")") is critical for correct length calculation.',
    ],
  },

  // --- 36. Valid Sudoku --------------------------------------------------------
  36: {
    intuition:
      'Validate each row, each column, and each 3*3 box independently  -  all in one pass. The box index for cell (r,c) is (r/3)*3 + (c/3). Use three arrays of 9 HashSets (or 9*9 boolean arrays), one per constraint type.',
    algorithm: [
      'Allocate rows[9], cols[9], boxes[9]  -  each a HashSet<char>.',
      'Iterate over every cell (r, c). Skip cells containing ".".',
      'Compute boxIdx = (r/3)*3 + c/3.',
      'If the digit already exists in rows[r], cols[c], or boxes[boxIdx] -> return false.',
      'Otherwise add the digit to all three sets.',
      'Return true after the full scan.',
    ],
    example: {
      input: 'A partially filled 9*9 board',
      steps: [
        'For cell (0,0)="5": check rows[0], cols[0], boxes[0]. All empty -> add "5" to each.',
        'For cell (0,3)="5": check rows[0]  -  "5" already there -> return false.',
      ],
      output: 'true / false',
    },
    pitfalls: [
      'The box index formula (r/3)*3 + c/3 uses integer division  -  do not use floating point.',
    ],
  },

  // --- 37. Sudoku Solver -------------------------------------------------------
  37: {
    intuition:
      'Backtracking: find the next empty cell, try digits 1 - 9, check validity with the same three-set approach as problem 36, place the digit and recurse. If recursion returns false (dead end), remove the digit and try the next. When no empty cell remains, the board is solved.',
    algorithm: [
      'Find the first empty cell (containing "."). If none exists, return true (solved).',
      'Try each digit "1" - "9". Check if it is valid in the current row, column, and 3*3 box.',
      'Place the digit, recurse. If recursion returns true, propagate true up.',
      'Backtrack: reset the cell to "." if recursion fails.',
      'If no digit works, return false.',
    ],
    example: {
      input: 'A valid Sudoku puzzle',
      steps: [
        'Find first empty (r=0,c=0). Try "1": valid? Place "1", recurse.',
        'Recursion eventually fails -> backtrack, try "2", ..., try "5": valid, recurse.',
        'Continue until all 81 cells are filled consistently.',
      ],
      output: 'Board filled in-place',
    },
    pitfalls: [
      'Cache row/col/box membership in sets for O(1) checks  -  do not re-scan the board on every placement.',
      'Return immediately when a valid solution is found to avoid unnecessary backtracking.',
    ],
  },

  // --- 38. Count and Say -------------------------------------------------------
  38: {
    intuition:
      'Each term describes the previous term using run-length encoding: count consecutive identical digits and say "count digit". Build each string from the previous one iteratively.',
    algorithm: [
      'Start with s = "1".',
      'Repeat n-1 times: scan s, group consecutive identical characters, build the next string as "count + char" for each group.',
      'Return s.',
    ],
    example: {
      input: 'n = 4',
      steps: [
        'n=1: "1"',
        'n=2: one 1 -> "11"',
        'n=3: two 1s -> "21"',
        'n=4: one 2, one 1 -> "1211"',
      ],
      output: '"1211"',
    },
    pitfalls: [
      'Use a StringBuilder for O(n) string building  -  repeated string concatenation is O(n^2).',
    ],
  },

  // --- 40. Combination Sum II --------------------------------------------------
  40: {
    intuition:
      'Like Combination Sum I (unbounded), but each number can only be used once. Sort to enable duplicate skipping: after choosing candidates[i], skip over any later indices j where candidates[j] == candidates[j-1] at the same recursion depth. This prevents identical combinations.',
    algorithm: [
      'Sort candidates.',
      'Backtrack(start, current, remaining):',
      'If remaining == 0: add current to results.',
      'For i from start to n-1: if i > start and candidates[i] == candidates[i-1], skip (duplicate).',
      'If candidates[i] > remaining, break (sorted -> no later element can work).',
      'Choose candidates[i], recurse with start=i+1 (not i, since each element used once).',
      'Undo the choice.',
    ],
    example: {
      input: 'candidates = [10,1,2,7,6,1,5], target = 8  -> sorted: [1,1,2,5,6,7,10]',
      steps: [
        'Start with []. Choose 1(idx0), recurse: choose 1(idx1) -> [1,1], recurse: choose 6 -> [1,1,6] = 8 .',
        'Back at [1,1]: skip 7 (would be [1,1,7]=9>8). Done.',
        'Back at [1]: skip idx1 (1==1 dup at same level). Choose 2 -> [1,2], choose 5 -> [1,2,5] = 8 .',
        'Also find [2,6] and [1,7].',
      ],
      output: '[[1,1,6],[1,2,5],[1,7],[2,6]]',
    },
    pitfalls: [
      'The duplicate skip condition `i > start && candidates[i] == candidates[i-1]` uses `start`, not 0  -  to allow using the same value at different depth levels.',
      'Recurse with i+1, not i, to enforce "each element at most once".',
    ],
  },

  // --- 44. Wildcard Matching ---------------------------------------------------
  44: {
    intuition:
      'DP table dp[i][j] = true if pattern p[0..j-1] matches string s[0..i-1]. Base: dp[0][0]=true; leading "*"s in p can match empty string. Transition: if p[j-1]=="?" or p[j-1]==s[i-1]: dp[i][j]=dp[i-1][j-1]. If p[j-1]=="*": dp[i][j] = dp[i-1][j] (star matches one more char) OR dp[i][j-1] (star matches nothing).',
    algorithm: [
      'Allocate dp[m+1][n+1] where m=s.Length, n=p.Length.',
      'dp[0][0] = true. For j from 1 to n: if p[j-1]=="*", dp[0][j] = dp[0][j-1].',
      'For i from 1 to m, j from 1 to n:',
      '  if p[j-1]=="?" or p[j-1]==s[i-1]: dp[i][j] = dp[i-1][j-1].',
      '  if p[j-1]=="*": dp[i][j] = dp[i-1][j] || dp[i][j-1].',
      'Return dp[m][n].',
    ],
    example: {
      input: 's = "adceb", p = "*a*b"',
      steps: [
        'Leading "*" in p matches empty. dp[0][1]=true.',
        '"a" in p matches "a" in s. dp[1][2]=true.',
        '"*" matches any sequence -> dp[i][3]=true for all i>=1.',
        '"b" matches "b" (s[4]) using dp[4][3]=true -> dp[5][4]=true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'A "*" can match zero characters  -  include dp[i][j-1] (star matches empty) in the OR condition.',
      'Pattern leading stars must initialise the top row of dp, not just dp[0][0].',
    ],
  },

  // --- 51. N-Queens -----------------------------------------------------------
  51: {
    intuition:
      'Place one queen per row. For each row, try each column; a column is valid if no previously placed queen shares that column, positive diagonal (row-col = constant), or negative diagonal (row+col = constant). Three HashSets track conflicts in O(1).',
    algorithm: [
      'Backtrack row by row, starting at row 0.',
      'For each column col in [0, n-1]: skip if col, row-col, or row+col is already in the conflict sets.',
      'Place queen: add col to cols, row-col to posDiag, row+col to negDiag.',
      'Recurse on row+1. If row+1==n, record the current board.',
      'Remove the queen (backtrack).',
    ],
    example: {
      input: 'n = 4',
      steps: [
        'Row 0: try col 1 (valid). Row 1: col 3 (valid). Row 2: col 0 (valid). Row 3: col 2 (valid). Record [[".Q..","...Q","Q...","..Q."]].',
        'Backtrack to find second solution: [["..Q.","Q...","...Q",".Q.."] ].',
      ],
      output: '2 solutions',
    },
    pitfalls: [
      'Track diagonals as row-col and row+col constants, not as slope comparisons.',
      'Build the board string only when a complete valid placement (row == n) is found.',
    ],
  },

  // --- 52. N-Queens II --------------------------------------------------------
  52: {
    intuition:
      'Same as N-Queens I but count solutions instead of collecting them. The backtracking logic is identical; replace board recording with a counter increment.',
    algorithm: [
      'Same backtracking as N-Queens I, but when row == n: count++.',
      'Return count.',
    ],
    example: {
      input: 'n = 4',
      steps: ['Same search as problem 51 finds 2 complete placements.'],
      output: '2',
    },
    pitfalls: [
      'Bit manipulation alternative: use integer bitmasks for cols/posDiag/negDiag to speed up the inner loop.',
    ],
  },

  // --- 58. Length of Last Word -------------------------------------------------
  58: {
    intuition:
      'Scan from the right: skip trailing spaces, then count characters until another space or the start of the string is reached.',
    algorithm: [
      'Set i = s.Length - 1.',
      'Skip trailing spaces: while i >= 0 and s[i] == " ", i--.',
      'Count word characters: while i >= 0 and s[i] != " ", i--, count++.',
      'Return count.',
    ],
    example: {
      input: '"   fly me   to   the moon  "',
      steps: [
        'Skip trailing spaces at indices 28,27. i=26 ("n").',
        'Count: n,o,o,m = 4. i hits space. count=4.',
      ],
      output: '4',
    },
    pitfalls: ['Do not split by spaces  -  "Hello World   " has a trailing space that confuses Split().'],
  },

  // --- 63. Unique Paths II -----------------------------------------------------
  63: {
    intuition:
      'Same DP as Unique Paths I, but cells with obstacles are set to 0 (no paths through them). The recurrence is: dp[i][j] = (obstacleGrid[i][j]==1) ? 0 : dp[i-1][j] + dp[i][j-1].',
    algorithm: [
      'If start or end has an obstacle, return 0.',
      'Fill dp[0][j]=1 for all j until an obstacle is hit (all 0 after the obstacle).',
      'Fill dp[i][0]=1 for all i until an obstacle is hit.',
      'For each interior cell: dp[i][j] = (obstacle) ? 0 : dp[i-1][j] + dp[i][j-1].',
      'Return dp[m-1][n-1].',
    ],
    example: {
      input: 'obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]',
      steps: [
        'First row: dp=[1,1,1]. First col: dp[1][0]=1, dp[2][0]=1.',
        'dp[1][1]=0 (obstacle). dp[1][2]=dp[0][2]+0=1.',
        'dp[2][1]=dp[1][1]+dp[2][0]=0+1=1. dp[2][2]=dp[1][2]+dp[2][1]=1+1=2.',
      ],
      output: '2',
    },
    pitfalls: [
      'Stop filling the first row/column once an obstacle is encountered  -  all cells beyond it are unreachable.',
    ],
  },

  // --- 66. Plus One ------------------------------------------------------------
  66: {
    intuition:
      'Simulate adding 1 from the rightmost digit. Carry propagates left. The only special case is all 9s (e.g., [9,9,9]) which becomes [1,0,0,0]  -  requiring a new leading digit.',
    algorithm: [
      'Traverse from the last index to 0.',
      'If digits[i] < 9: increment digits[i], return digits (no carry).',
      'Else set digits[i] = 0 (carry).',
      'If the loop completes (all 9s): create int[n+1] with [0]=1, rest 0. Return it.',
    ],
    example: {
      input: '[9,9,9]',
      steps: [
        'i=2: 9->0, carry. i=1: 9->0, carry. i=0: 9->0, carry. Loop ends.',
        'Return [1,0,0,0].',
      ],
      output: '[1,0,0,0]',
    },
    pitfalls: ['Allocating a new array only for the all-9s case; otherwise modify in place.'],
  },

  // --- 67. Add Binary ----------------------------------------------------------
  67: {
    intuition:
      'Add two binary strings digit by digit from right to left, maintaining a carry. The result is built in reverse (or using a StringBuilder prepending at index 0, or reversing at the end).',
    algorithm: [
      'Initialise i=a.Length-1, j=b.Length-1, carry=0, StringBuilder sb.',
      'While i>=0 or j>=0 or carry>0:',
      '  sum = carry + (i>=0 ? a[i--]-"0" : 0) + (j>=0 ? b[j--]-"0" : 0).',
      '  Prepend (sum%2) to sb. carry = sum/2.',
      'Return sb.ToString().',
    ],
    example: {
      input: 'a = "11", b = "1"',
      steps: [
        'i=1,j=0: sum=0+1+1=2. append 0, carry=1.',
        'i=0,j=-1: sum=1+1+0=2. append 0, carry=1.',
        'i=-1,j=-1,carry=1: sum=1. append 1, carry=0.',
        'Reversed: "100".',
      ],
      output: '"100"',
    },
    pitfalls: ['Continue the loop while carry>0 even after both strings are exhausted.'],
  },

  // --- 73. Set Matrix Zeroes ----------------------------------------------------
  73: {
    intuition:
      'Use the first row and first column as in-place marker arrays. Two extra booleans track whether the first row/column themselves should be zeroed. This gives O(1) extra space.',
    algorithm: [
      'Check if row 0 contains a zero (firstRowZero) and if col 0 contains a zero (firstColZero).',
      'For each cell (i,j) with i>0,j>0: if matrix[i][j]==0, set matrix[i][0]=0 and matrix[0][j]=0.',
      'Zero out interior rows and columns using the markers in row 0 and col 0.',
      'If firstRowZero, zero out entire row 0. If firstColZero, zero out entire col 0.',
    ],
    example: {
      input: '[[1,1,1],[1,0,1],[1,1,1]]',
      steps: [
        'Cell (1,1)=0 -> mark matrix[1][0]=0 and matrix[0][1]=0.',
        'Zero row 1 (because matrix[1][0]=0): [0,0,0]. Zero col 1 (because matrix[0][1]=0): col all become 0.',
        'Result: [[1,0,1],[0,0,0],[1,0,1]].',
      ],
      output: '[[1,0,1],[0,0,0],[1,0,1]]',
    },
    pitfalls: [
      'Handle the first row and column LAST  -  their original values are used as markers for the rest of the matrix.',
    ],
  },

  // --- 75. Sort Colors (Dutch National Flag) ----------------------------------
  75: {
    intuition:
      'Three-way partition using Dijkstra\'s Dutch National Flag algorithm: maintain three regions  -  [0, low-1] all 0s, [low, mid-1] all 1s, [high+1, n-1] all 2s  -  expanding them via swaps.',
    algorithm: [
      'Initialise low=0, mid=0, high=n-1.',
      'While mid <= high:',
      '  if nums[mid]==0: swap(mid, low), low++, mid++.',
      '  if nums[mid]==1: mid++ (already in correct region).',
      '  if nums[mid]==2: swap(mid, high), high-- (do NOT increment mid  -  new nums[mid] is unknown).',
    ],
    example: {
      input: '[2,0,2,1,1,0]',
      steps: [
        'mid=0(2): swap(0,5)->[0,0,2,1,1,2], high=4.',
        'mid=0(0): swap(0,0)->same, low=1,mid=1.',
        'mid=1(0): swap(1,1), low=2,mid=2.',
        'mid=2(2): swap(2,4)->[0,0,1,1,2,2], high=3.',
        'mid=2(1): mid=3. mid=3(1): mid=4. 4>3=high, stop.',
      ],
      output: '[0,0,1,1,2,2]',
    },
    pitfalls: [
      'When swapping with high, do NOT increment mid  -  the swapped element from high could be 0, 1, or 2 and needs to be re-examined.',
    ],
  },

  // --- 85. Maximal Rectangle ---------------------------------------------------
  85: {
    intuition:
      'Transform each row into a histogram of consecutive 1s above it. Then the largest rectangle in each histogram (problem 84) gives the largest rectangle ending at that row. Run the histogram approach for each row in O(n) with a stack.',
    algorithm: [
      'Initialise heights[n] = 0.',
      'For each row: if matrix[row][col]=="1", heights[col]++; else heights[col]=0.',
      'Run the largest-rectangle-in-histogram algorithm on heights to get the max area for this row.',
      'Update overall max across all rows.',
    ],
    example: {
      input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
      steps: [
        'After row 0: heights=[1,0,1,0,0]. Max rectangle=1.',
        'After row 1: heights=[2,0,2,1,1]. Max rectangle=3.',
        'After row 2: heights=[3,1,3,2,2]. Max rectangle=6.',
        'After row 3: heights=[4,0,0,3,0]. Max rectangle=4.',
        'Overall max=6.',
      ],
      output: '6',
    },
    pitfalls: [
      'Reset heights[col]=0 when a "0" is encountered  -  consecutive 1s are broken.',
    ],
  },

  // --- 87. Scramble String -----------------------------------------------------
  87: {
    intuition:
      'A string t is a scramble of s if there exists a split point k such that either: (s[0..k] scrambles to t[0..k] AND s[k+1..] scrambles to t[k+1..]), or (s[0..k] scrambles to t[n-k..] AND s[k+1..] scrambles to t[0..n-k-1]). Memoize on (s, t) pairs.',
    algorithm: [
      'If s == t, return true. If sorted(s) != sorted(t), return false (fast prune).',
      'Check memo map for (s, t).',
      'For k from 1 to n-1: try both the non-swapped split and the swapped split.',
      'If any k satisfies either condition, store true in memo and return true.',
      'Store false and return false.',
    ],
    example: {
      input: 's = "great", t = "rgeat"',
      steps: [
        'Try k=1: s[0..0]="g", t[0..0]="r" not scramble. s[0..0]="g" vs t[4..4]="t"  -  no.',
        'Try k=2: s[0..1]="gr" vs t[0..1]="rg"  -  yes (swapped). s[2..4]="eat" vs t[2..4]="eat"  -  yes.',
        'Return true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'The anagram check (sorted chars equal) prunes many impossible branches quickly.',
      'Use a Dictionary<(string,string), bool> for memoization.',
    ],
  },

  // --- 92. Reverse Linked List II ----------------------------------------------
  92: {
    intuition:
      'Reverse only the sublist from position left to right. Navigate to the node just before position left, then perform exactly (right-left) pointer reversals on the sublist, reconnecting the reversed portion back into the original list.',
    algorithm: [
      'Use a dummy node before head. Advance prev to the node at position left-1.',
      'cur = prev.next (start of sublist). For right-left iterations: remove cur.next and insert it right after prev.',
      'Return dummy.next.',
    ],
    example: {
      input: 'head = [1->2->3->4->5], left=2, right=4',
      steps: [
        'prev = node1. cur = node2.',
        'Iteration 1: move node3 after node1. List: 1->3->2->4->5.',
        'Iteration 2: move node4 after node1. List: 1->4->3->2->5.',
      ],
      output: '[1,4,3,2,5]',
    },
    pitfalls: [
      'The "insert after prev" technique (not a full reversal loop) makes reconnection trivial  -  prev.next always points to the new head of the reversed section.',
    ],
  },

  // --- 95. Unique Binary Search Trees II --------------------------------------
  95: {
    intuition:
      'For each value i as root in range [start, end], the left subtree uses [start, i-1] and the right uses [i+1, end]. The total tree count is the Catalan number. Generate all combinations by iterating over every possible root and recursively generating all left and right subtrees.',
    algorithm: [
      'Generate(start, end): if start > end, return [null].',
      'result = [].',
      'For root from start to end: leftTrees = Generate(start, root-1), rightTrees = Generate(root+1, end).',
      'For each (L, R) pair: create node(root, left=L, right=R), add to result.',
      'Return result.',
    ],
    example: {
      input: 'n = 3',
      steps: [
        'Root=1: left=[], right=Generate(2,3)=[{2,null,3},{3,2,null}]. 2 trees.',
        'Root=2: left=[{1}], right=[{3}]. 1 tree.',
        'Root=3: left=Generate(1,2)=[{1,null,2},{2,1,null}], right=[]. 2 trees.',
        'Total 5 trees.',
      ],
      output: '5 distinct BSTs',
    },
    pitfalls: [
      'Returning [null] (a list with one null element) when start>end is critical  -  it means "one way to have an empty subtree".',
    ],
  },

  // --- 99. Recover Binary Search Tree -----------------------------------------
  99: {
    intuition:
      'Exactly two nodes are swapped. An in-order traversal of a BST yields a sorted sequence, so the swap creates at most two "inversions" (positions where arr[i] > arr[i+1]). The first swapped node is at the first inversion\'s larger value; the second is at the last inversion\'s smaller value.',
    algorithm: [
      'In-order traversal, tracking prev node.',
      'If prev.val > curr.val: if first is null, set first=prev. Set second=curr (always update second).',
      'After traversal: swap first.val and second.val.',
    ],
    example: {
      input: 'BST with 3 and 1 swapped: [3,1,4,null,null,2]',
      steps: [
        'In-order visits: 1, 3, 2, 4.',
        'At (3->2): inversion. first=3, second=2.',
        'At (2->next visits correctly). Swap 3.val and 2.val.',
      ],
      output: 'Corrected BST',
    },
    pitfalls: [
      'There may be one or two inversions. Using a single in-order pass and always updating second captures both cases.',
    ],
  },

  // --- 106. Construct Binary Tree from Inorder and Postorder ------------------
  106: {
    intuition:
      'The last element of postorder is always the root. Find it in inorder to split into left and right subtrees. The number of elements in the left inorder slice tells you exactly how many elements belong to the left postorder slice.',
    algorithm: [
      'Build a map: inorder value -> index.',
      'Recurse with (inLeft, inRight, postRight).',
      'Root = postorder[postRight]. Find its inorder index rootIdx.',
      'Left subtree size = rootIdx - inLeft.',
      'Recurse left: (inLeft, rootIdx-1, postRight-1-(inRight-rootIdx)).',
      'Recurse right: (rootIdx+1, inRight, postRight-1).',
    ],
    example: {
      input: 'inorder=[9,3,15,20,7], postorder=[9,15,7,20,3]',
      steps: [
        'Root=3 (postorder last). rootIdx=1 in inorder.',
        'Left: inorder[0..0]=[9], postorder[0..0]=[9] -> root=9.',
        'Right: inorder[2..4]=[15,20,7], postorder[1..3]=[15,7,20] -> root=20, etc.',
      ],
      output: 'Tree [3,9,20,null,null,15,7]',
    },
    pitfalls: ['Use a HashMap for inorder lookups  -  linear search makes this O(n^2).'],
  },

  // --- 107. Binary Tree Level Order Traversal II ------------------------------
  107: {
    intuition:
      'Same BFS level-order as problem 102, but reverse the result list at the end. Reversing a list is O(levels)  -  negligible.',
    algorithm: [
      'Run standard BFS level order (same as problem 102).',
      'Reverse the result list.',
      'Return.',
    ],
    example: {
      input: 'root = [3,9,20,null,null,15,7]',
      steps: [
        'BFS gives [[3],[9,20],[15,7]].',
        'Reverse: [[15,7],[9,20],[3]].',
      ],
      output: '[[15,7],[9,20],[3]]',
    },
    pitfalls: ['Use LinkedList<List<int>> with AddFirst to avoid O(n) reversal entirely.'],
  },

  // --- 108. Convert Sorted Array to BST ----------------------------------------
  108: {
    intuition:
      'The middle element of a sorted array becomes the root of the BST (ensuring height balance). Recurse on the left half for the left subtree and on the right half for the right subtree.',
    algorithm: [
      'If left > right, return null.',
      'mid = left + (right - left) / 2.',
      'Create node with nums[mid].',
      'node.left = Build(left, mid-1). node.right = Build(mid+1, right).',
      'Return node.',
    ],
    example: {
      input: 'nums = [-10,-3,0,5,9]',
      steps: [
        'mid=2 (0) -> root=0.',
        'Left: [-10,-3] -> mid=0(-10)... mid=-10, right: [-3] -> -3.',
        'Right: [5,9] -> mid=5, right: [9] -> 9.',
      ],
      output: 'BST [0,-3,9,-10,null,5]',
    },
    pitfalls: ['For even-length arrays, either mid=(left+right)/2 or mid=(left+right+1)/2 is valid  -  the judge accepts both.'],
  },

  // --- 110. Balanced Binary Tree ------------------------------------------------
  110: {
    intuition:
      'A tree is balanced iff for every node, |height(left) - height(right)| <= 1. Compute height bottom-up; return -1 as a sentinel when imbalance is detected to short-circuit the recursion.',
    algorithm: [
      'Height(node): if null, return 0.',
      'lh = Height(left). If lh == -1, return -1.',
      'rh = Height(right). If rh == -1, return -1.',
      'If |lh - rh| > 1, return -1.',
      'Return max(lh, rh) + 1.',
      'IsBalanced: return Height(root) != -1.',
    ],
    example: {
      input: 'root = [3,9,20,null,null,15,7]',
      steps: [
        'Height(9)=1, Height(20): Height(15)=1, Height(7)=1 -> max+1=2.',
        'Height(3): lh=1, rh=2. |1-2|=1 <= 1 . Return 3.',
      ],
      output: 'true',
    },
    pitfalls: ['Do not compute height separately for balance check and height  -  that creates O(n^2). Combine into one bottom-up pass.'],
  },

  // --- 111. Minimum Depth of Binary Tree ---------------------------------------
  111: {
    intuition:
      'Minimum depth is the depth to the nearest leaf. BFS stops at the first leaf encountered  -  that level is the minimum depth. This avoids exploring the entire tree (DFS would need to).',
    algorithm: [
      'If root is null, return 0.',
      'BFS with a queue, tracking depth.',
      'For each node: if both children are null (leaf), return current depth.',
      'Enqueue non-null children.',
    ],
    example: {
      input: 'root = [2,null,3,null,4,null,5,null,6]',
      steps: [
        'Level 1: node 2 has only right child  -  not a leaf. Level 2: node 3  -  not a leaf. ... Level 5: node 6  -  leaf. Return 5.',
      ],
      output: '5',
    },
    pitfalls: [
      'A node with only one child is NOT a leaf  -  do not return early there.',
      'DFS approach: min(left, right) + 1 fails when one child is null. Must handle: if left == null return right+1 (and vice versa).',
    ],
  },

  // --- 112. Path Sum -----------------------------------------------------------
  112: {
    intuition:
      'DFS: subtract the current node\'s value from the target. At a leaf, check if the remaining target equals zero. Recurse down both children.',
    algorithm: [
      'If root is null, return false.',
      'If leaf (both children null): return root.val == targetSum.',
      'Return HasPathSum(root.left, targetSum - root.val) || HasPathSum(root.right, targetSum - root.val).',
    ],
    example: {
      input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22',
      steps: [
        'Subtract 5->17. Go left: subtract 4->13. Go left: subtract 11->2. Go left: 7!=2 no. Go right: 2==2 .',
      ],
      output: 'true',
    },
    pitfalls: ['Do not return true when reaching null  -  a null node is not a leaf.'],
  },

  // --- 113. Path Sum II --------------------------------------------------------
  113: {
    intuition:
      'Same as Path Sum I but record the current path when a valid leaf is found. Use backtracking to maintain the path: add node before recursion, remove after.',
    algorithm: [
      'DFS(node, remaining, path, result):',
      'If null, return.',
      'Add node.val to path. remaining -= node.val.',
      'If leaf and remaining == 0: add copy of path to result.',
      'Else: recurse left and right.',
      'Remove last element from path (backtrack).',
    ],
    example: {
      input: 'root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22',
      steps: [
        'Path 5->4->11->2: sum=22 . Record [5,4,11,2]. Backtrack.',
        'Path 5->8->4->5: sum=22 . Record [5,8,4,5].',
      ],
      output: '[[5,4,11,2],[5,8,4,5]]',
    },
    pitfalls: ['Add a COPY of path (new List), not a reference  -  otherwise all recorded paths will be mutated by subsequent backtracking.'],
  },

  // --- 114. Flatten Binary Tree to Linked List --------------------------------
  114: {
    intuition:
      'Pre-order traversal visits root -> left -> right. The flattened list follows the same order using right pointers. The Morris-style in-place approach: for each node with a left child, find the rightmost node of the left subtree, link it to the right child, move the left subtree to right, and null out left.',
    algorithm: [
      'curr = root. While curr != null:',
      'If curr.left != null: find the rightmost node of curr.left (call it rightmost).',
      'rightmost.right = curr.right. curr.right = curr.left. curr.left = null.',
      'curr = curr.right.',
    ],
    example: {
      input: 'root = [1,2,5,3,4,null,6]',
      steps: [
        'curr=1. left=2. Rightmost of 2 = 4. Link 4.right=5. 1.right=2, 1.left=null. List:1->2->3->4->5->6.',
        'curr=2. left=3. Rightmost=3. Link 3.right=4. 2.right=3, 2.left=null.',
        'Continue until all left pointers are null.',
      ],
      output: '[1,null,2,null,3,null,4,null,5,null,6]',
    },
    pitfalls: ['Move the left subtree to right BEFORE advancing curr  -  otherwise you lose the right child.'],
  },

  // --- 118. Pascal\'s Triangle --------------------------------------------------
  118: {
    intuition:
      'Each row starts and ends with 1. Interior element [i][j] = [i-1][j-1] + [i-1][j]. Build row by row.',
    algorithm: [
      'result = [[1]].',
      'For row i from 1 to numRows-1: start new row with [1].',
      'For j from 1 to i-1: row[j] = prev[j-1] + prev[j].',
      'Append 1 at the end. Add row to result.',
    ],
    example: {
      input: 'numRows = 5',
      steps: [
        'Row 0: [1]. Row 1: [1,1]. Row 2: [1,2,1]. Row 3: [1,3,3,1]. Row 4: [1,4,6,4,1].',
      ],
      output: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]',
    },
    pitfalls: ['Build each row from the previous row, not by computing binomial coefficients separately.'],
  },

  // --- 120. Triangle -----------------------------------------------------------
  120: {
    intuition:
      'Bottom-up DP: starting from the second-to-last row, each cell becomes its value plus the minimum of the two cells below it. After processing all rows, triangle[0][0] holds the answer. Modify in-place or use a 1D dp array.',
    algorithm: [
      'For row from n-2 down to 0: for col from 0 to row: triangle[row][col] += min(triangle[row+1][col], triangle[row+1][col+1]).',
      'Return triangle[0][0].',
    ],
    example: {
      input: '[[2],[3,4],[6,5,7],[4,1,8,3]]',
      steps: [
        'Row 2: 6+min(4,1)=7, 5+min(1,8)=6, 7+min(8,3)=10. -> [7,6,10].',
        'Row 1: 3+min(7,6)=9, 4+min(6,10)=10. -> [9,10].',
        'Row 0: 2+min(9,10)=11.',
      ],
      output: '11',
    },
    pitfalls: ['Process bottom-up to avoid needing an extra dp array  -  the triangle itself becomes the dp table.'],
  },

  // --- 122. Best Time to Buy and Sell Stock II ---------------------------------
  122: {
    intuition:
      'You can hold at most one share at a time but can trade any number of times. Capture every upward price movement: if prices[i] > prices[i-1], add the difference to profit. This is equivalent to summing all positive day-to-day differences.',
    algorithm: [
      'profit = 0.',
      'For i from 1 to n-1: if prices[i] > prices[i-1], profit += prices[i] - prices[i-1].',
      'Return profit.',
    ],
    example: {
      input: 'prices = [7,1,5,3,6,4]',
      steps: [
        '1->5: +4. 3->6: +3. Total=7.',
      ],
      output: '7',
    },
    pitfalls: ['This greedy works ONLY when transactions are unlimited and there are no fees.'],
  },

  // --- 135. Candy --------------------------------------------------------------
  135: {
    intuition:
      'Two greedy passes: left-to-right ensures a child with higher rating than its left neighbour gets more candy. Right-to-left ensures a child with higher rating than its right neighbour gets more candy. Take the max at each position.',
    algorithm: [
      'Initialise candies[i] = 1 for all i.',
      'Left pass: for i from 1 to n-1: if ratings[i] > ratings[i-1], candies[i] = candies[i-1]+1.',
      'Right pass: for i from n-2 down to 0: if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1]+1).',
      'Return sum(candies).',
    ],
    example: {
      input: 'ratings = [1,0,2]',
      steps: [
        'Init: [1,1,1]. Left pass: ratings[2]=2>0 -> candies[2]=2. -> [1,1,2].',
        'Right pass: ratings[0]=1>0 -> candies[0]=max(1,1+1)=2. -> [2,1,2].',
        'Sum=5.',
      ],
      output: '5',
    },
    pitfalls: ['The right pass must take max(candies[i], candies[i+1]+1)  -  do not blindly overwrite the left-pass value.'],
  },

  // --- 137. Single Number II ----------------------------------------------------
  137: {
    intuition:
      'Every number appears three times except one which appears once. Use two bit-accumulator variables `ones` and `twos` that track bits seen 1 and 2 times mod 3. The state machine transitions ensure bits seen 3 times are zeroed out.',
    algorithm: [
      'ones = 0, twos = 0.',
      'For each num: ones = (ones ^ num) & ~twos. twos = (twos ^ num) & ~ones.',
      'Return ones (contains bits seen exactly once).',
    ],
    example: {
      input: '[2,2,3,2]',
      steps: [
        'After 2: ones=2, twos=0. After 2: ones=0, twos=2. After 3: ones=3, twos=2. After 2: ones=3, twos=0.',
      ],
      output: '3',
    },
    pitfalls: ['The order of updating ones and twos matters  -  compute new ones first, then new twos using the updated ones.'],
  },

  // --- 144. Binary Tree Preorder Traversal -------------------------------------
  144: {
    intuition:
      'Preorder: root -> left -> right. Iterative: push right child first so the left child is processed first (LIFO stack).',
    algorithm: [
      'Push root onto stack.',
      'While stack is not empty: pop node, add to result.',
      'Push node.right (if not null), then node.left (if not null).',
    ],
    example: {
      input: 'root = [1,null,2,3]',
      steps: [
        'Push 1. Pop 1->result=[1]. Push 2. Pop 2->result=[1,2]. Push 3. Pop 3->result=[1,2,3].',
      ],
      output: '[1,2,3]',
    },
    pitfalls: ['Push right BEFORE left so left is popped first.'],
  },

  // --- 145. Binary Tree Postorder Traversal ------------------------------------
  145: {
    intuition:
      'Postorder (left->right->root) is the reverse of a modified preorder (root->right->left). Collect root->right->left using a stack (push left before right), then reverse the result.',
    algorithm: [
      'Push root onto stack.',
      'While not empty: pop node, prepend to result (or push to another stack).',
      'Push node.left (if not null), then node.right (if not null).',
      'Result is root->right->left reversed -> left->right->root.',
    ],
    example: {
      input: 'root = [1,null,2,3]',
      steps: [
        'Pop 1->collect. Push right(2). Pop 2->collect. Push right(null), left(3). Pop 3->collect.',
        'Collected (root->right->left): [1,2,3]. Reversed: [3,2,1].',
      ],
      output: '[3,2,1]',
    },
    pitfalls: ['Reverse or use AddFirst  -  postorder is not a simple stack reversal of preorder.'],
  },

  // --- 162. Find Peak Element ---------------------------------------------------
  162: {
    intuition:
      'A peak exists on the side where the slope is ascending. If nums[mid] < nums[mid+1], the peak is to the right (ascending right); otherwise it\'s to the left or at mid. Binary search narrows to one element  -  that is a peak.',
    algorithm: [
      'lo=0, hi=n-1.',
      'While lo < hi: mid = lo + (hi-lo)/2.',
      'If nums[mid] < nums[mid+1]: lo = mid+1 (peak is right).',
      'Else: hi = mid (peak is left or at mid).',
      'Return lo.',
    ],
    example: {
      input: 'nums = [1,2,3,1]',
      steps: [
        'lo=0,hi=3. mid=1: nums[1]=2 < nums[2]=3 -> lo=2.',
        'lo=2,hi=3. mid=2: nums[2]=3 > nums[3]=1 -> hi=2.',
        'lo=hi=2. Return 2.',
      ],
      output: '2',
    },
    pitfalls: ['Use hi=mid (not mid-1) to include mid as a candidate  -  it might itself be the peak.'],
  },

  // --- 165. Compare Version Numbers -------------------------------------------
  165: {
    intuition:
      'Split both version strings by "." and compare corresponding integer components. If one version has fewer parts, treat missing parts as 0.',
    algorithm: [
      'Split v1 and v2 by ".".',
      'Iterate up to max(len1, len2). Parse each part as int (0 if missing).',
      'If part1 < part2 return -1. If part1 > part2 return 1.',
      'Return 0 if all parts equal.',
    ],
    example: {
      input: 'version1 = "1.01", version2 = "1.001"',
      steps: [
        'Part 0: 1 vs 1  -  equal. Part 1: 01->1 vs 001->1  -  equal.',
        'Return 0.',
      ],
      output: '0',
    },
    pitfalls: ['Parse as int to strip leading zeros  -  "01" and "1" are the same version component.'],
  },

  // --- 166. Fraction to Recurring Decimal -------------------------------------
  166: {
    intuition:
      'Long division: track remainders in a HashMap. When a remainder repeats, the decimal portion from that point is the repeating part. Insert parentheses at the stored position.',
    algorithm: [
      'Handle sign and zero separately. Work with absolute values as long.',
      'Integer part = numerator / denominator. Remainder = numerator % denominator.',
      'While remainder != 0: if remainder in map -> insert "(" at map[remainder] and append ")". Break.',
      'Else store map[remainder] = current position. Multiply remainder by 10. Append (remainder / denominator). remainder %= denominator.',
      'Return result.',
    ],
    example: {
      input: 'numerator=1, denominator=6',
      steps: [
        'Integer part=0. Remainder=1.',
        '1->10/6=1, remainder=4. 4->40/6=6, remainder=4.',
        'Remainder 4 repeats -> insert "(" at position where 4 first appeared. Append ")". -> "0.1(6)".',
      ],
      output: '"0.1(6)"',
    },
    pitfalls: [
      'Use long to avoid overflow  -  INT_MIN / -1 overflows int.',
      'Handle negative results: exactly one of numerator/denominator is negative.',
    ],
  },

  // --- 171. Excel Sheet Column Number -----------------------------------------
  171: {
    intuition:
      'Base-26 number system where A=1, B=2, ..., Z=26 (no zero digit). Scan left to right: result = result * 26 + (char - "A" + 1).',
    algorithm: [
      'result = 0.',
      'For each character c: result = result * 26 + (c - \'A\' + 1).',
      'Return result.',
    ],
    example: {
      input: '"ZY"',
      steps: [
        'Z: 0*26+26=26. Y: 26*26+25=701.',
      ],
      output: '701',
    },
    pitfalls: ['This is like converting a base-26 number but with digits 1 - 26 (not 0 - 25).'],
  },

  // --- 172. Factorial Trailing Zeroes -----------------------------------------
  172: {
    intuition:
      'Trailing zeros come from factors of 10 = 2*5. There are always more factors of 2 than 5 in n!, so count only factors of 5. Every multiple of 5 contributes one 5; every multiple of 25 contributes an extra; every multiple of 125 another, etc.',
    algorithm: [
      'count = 0.',
      'While n >= 5: n /= 5. count += n.',
      'Return count.',
    ],
    example: {
      input: 'n = 25',
      steps: [
        '25/5=5 -> count=5. 5/5=1 -> count=6. 1/5=0 -> stop.',
      ],
      output: '6',
    },
    pitfalls: ['Do not count factors of 2  -  they always exceed factors of 5 in n!.'],
  },

  // --- 174. Dungeon Game --------------------------------------------------------
  174: {
    intuition:
      'Forward DP fails because we don\'t know how much health we\'ll have in the future. Bottom-up DP from the bottom-right: dp[i][j] = minimum health needed when entering cell (i,j) to survive the rest of the journey. dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).',
    algorithm: [
      'dp[i][j] = minimum health needed at (i,j).',
      'Base: dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1]).',
      'Last row/col: only one direction available.',
      'Fill backwards: dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).',
      'Answer is dp[0][0].',
    ],
    example: {
      input: 'dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]',
      steps: [
        'dp[2][2]=max(1,1+5)=6. dp[2][1]=max(1,6-30)=1. dp[2][0]=max(1,1-10)=1.',
        'dp[1][2]=max(1,6-1)=5. dp[1][1]=max(1,min(1,5)+10)=11. dp[1][0]=max(1,min(11,1)+5)=6.',
        'dp[0][2]=max(1,5-3)=2. dp[0][1]=max(1,min(2,11)+3)=5. dp[0][0]=max(1,min(5,6)+2)=7.',
      ],
      output: '7',
    },
    pitfalls: ['Ensure dp values are at least 1  -  you cannot enter a cell with 0 or negative health.'],
  },

  // --- 179. Largest Number -----------------------------------------------------
  179: {
    intuition:
      'To determine which of two numbers a and b should come first, compare the concatenations "ab" and "ba" as strings. If "ab" > "ba", place a before b. Sort all numbers using this comparator, then join.',
    algorithm: [
      'Convert all integers to strings.',
      'Sort with custom comparator: compare(a, b) = (b+a).CompareTo(a+b)  -  descending order (larger concat first).',
      'If the first element of sorted array is "0", return "0" (all zeros case).',
      'Join sorted strings and return.',
    ],
    example: {
      input: '[3,30,34,5,9]',
      steps: [
        'Compare 3 vs 30: "330" vs "303" -> 330>303, 3 first.',
        'Compare 34 vs 3: "343" vs "334" -> 343>334, 34 first.',
        'Sorted: [9,5,34,3,30]. Joined: "9534330".',
      ],
      output: '"9534330"',
    },
    pitfalls: ['The all-zeros edge case: sorted order would give "0000..."  -  return "0" instead.'],
  },

  // --- 202. Happy Number -------------------------------------------------------
  202: {
    intuition:
      'A happy number eventually reaches 1; an unhappy one enters a cycle. Detect the cycle using Floyd\'s tortoise-and-hare algorithm on the sequence of digit-square-sum values. If the slow and fast pointers ever point to 1, it\'s happy.',
    algorithm: [
      'Define Next(n): sum of squares of digits of n.',
      'slow = Next(n), fast = Next(Next(n)).',
      'While slow != fast: slow = Next(slow), fast = Next(Next(fast)).',
      'Return slow == 1.',
    ],
    example: {
      input: 'n = 19',
      steps: [
        '19 -> 1^2+9^2=82 -> 8^2+2^2=68 -> 6^2+8^2=100 -> 1^2+0+0=1. Happy!',
      ],
      output: 'true',
    },
    pitfalls: ['A HashSet of visited values also works and may be clearer; Floyd\'s is O(1) space.'],
  },

  // --- 212. Word Search II -----------------------------------------------------
  212: {
    intuition:
      'Build a Trie from the word list. DFS the board; at each cell, follow the Trie to prune invalid paths immediately. When a Trie node marks the end of a word, record it. Pruning by removing found words from the Trie avoids duplicates.',
    algorithm: [
      'Insert all words into a Trie.',
      'DFS from every cell (r,c) traversing the Trie simultaneously.',
      'If the current Trie node has no child for board[r][c], return (prune).',
      'If the node is a word end, add the word to results and clear the word to avoid duplicates.',
      'Mark cell as visited ("x"), recurse into 4 neighbors, restore cell.',
    ],
    example: {
      input: 'board with "eat","oath","oat","pea"; words=["oath","eat"]',
      steps: [
        'DFS from "o" -> "o"->"a"->"t"->"h". Trie path matches "oath" -> add.',
        'DFS from "e" -> "e"->"a"->"t". Trie path matches "eat" -> add.',
      ],
      output: '["oath","eat"]',
    },
    pitfalls: [
      'Clear node.word after recording to prevent duplicate results.',
      'After DFS, prune leaf Trie nodes to speed up subsequent searches.',
    ],
  },

  // --- 214. Shortest Palindrome -------------------------------------------------
  214: {
    intuition:
      'Find the longest palindromic prefix of s. The shortest palindrome is formed by appending the reverse of the non-palindromic suffix. Use KMP failure function on s + "#" + reverse(s) to find the longest prefix of s that matches a suffix of reverse(s)  -  that\'s the longest palindromic prefix.',
    algorithm: [
      'rev = reverse of s.',
      'Compute KMP failure function for combined = s + "#" + rev.',
      'The failure value at the last position tells us the length of the longest palindromic prefix of s.',
      'Prefix = s[0..lps-1] (palindrome). Suffix = s[lps..] (non-palindromic remainder).',
      'Return reverse(suffix) + s.',
    ],
    example: {
      input: 's = "aacecaaa"',
      steps: [
        'combined = "aacecaaa#aaacecaa".',
        'KMP lps at end = 7. Longest palindromic prefix = "aacecaa" (length 7).',
        'Remaining suffix = "a". Reverse = "a". Return "a" + "aacecaaa" = "aaacecaaa".',
      ],
      output: '"aaacecaaa"',
    },
    pitfalls: ['The "#" separator is critical  -  prevents the KMP from matching across the boundary between s and rev.'],
  },

  // --- 218. The Skyline Problem -------------------------------------------------
  218: {
    intuition:
      'Use a max-heap (sorted set) of active building heights. For each event (start or end of a building), update the heap and emit a keypoint when the maximum height changes. Process starts before ends at the same x-coordinate (to avoid height-0 gaps).',
    algorithm: [
      'Create events: for each building [l,r,h], add (l, -h) for start and (r, h) for end.',
      'Sort events by x; for equal x, starts (negative h) come before ends.',
      'Use a sorted multiset of heights, initialised with [0].',
      'For each event: if start (h<0), insert |h|. If end (h>0), remove h.',
      'If the current max height changes, emit (x, maxHeight) as a keypoint.',
    ],
    example: {
      input: '[[2,9,10],[3,7,15],[5,12,12]]',
      steps: [
        'x=2: add 10. max=10 -> emit [2,10].',
        'x=3: add 15. max=15 -> emit [3,15].',
        'x=5: add 12. max=15 (unchanged).',
        'x=7: remove 15. max=12 -> emit [7,12].',
        'x=9: remove 10. max=12 (unchanged).',
        'x=12: remove 12. max=0 -> emit [12,0].',
      ],
      output: '[[2,10],[3,15],[7,12],[12,0]]',
    },
    pitfalls: ['Sort starts before ends at the same x to avoid premature height-drop keypoints.'],
  },

  // --- 219. Contains Duplicate II ----------------------------------------------
  219: {
    intuition:
      'Use a sliding window of size k maintained as a HashSet. As the window slides, add the new element and check if it was already present. If the window size exceeds k, remove the oldest element.',
    algorithm: [
      'window = HashSet.',
      'For i from 0 to n-1: if window.Contains(nums[i]), return true.',
      'window.Add(nums[i]). If window.Count > k, window.Remove(nums[i-k]).',
      'Return false.',
    ],
    example: {
      input: 'nums = [1,2,3,1], k = 3',
      steps: [
        'i=0: add 1. i=1: add 2. i=2: add 3. i=3: 1 is in window -> return true.',
      ],
      output: 'true',
    },
    pitfalls: ['Check for duplicate BEFORE adding to the window and BEFORE removing the oldest element.'],
  },

  // --- 221. Maximal Square -----------------------------------------------------
  221: {
    intuition:
      'dp[i][j] = side length of the largest square whose bottom-right corner is (i,j). If matrix[i][j]=="1": dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1. The bottleneck is the smallest of the three neighbors. Track max dp value and return max^2.',
    algorithm: [
      'dp[i][j] = 0 if matrix[i][j]=="0".',
      'If i==0 or j==0: dp[i][j] = matrix[i][j]-"0".',
      'Else: dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1.',
      'Track maxSide. Return maxSide^2.',
    ],
    example: {
      input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
      steps: [
        'dp[2][3]: min(dp[1][3]=1, dp[2][2]=1, dp[1][2]=1)+1=2.',
        'dp[2][4]: min(dp[1][4]=1, dp[2][3]=2, dp[1][3]=1)+1=2.',
        'maxSide=2, answer=4.',
      ],
      output: '4',
    },
    pitfalls: ['The min of THREE neighbors (not two)  -  you need all three to be >= k for a k*k square to form.'],
  },

  // --- 222. Count Complete Tree Nodes ------------------------------------------
  222: {
    intuition:
      'In a complete binary tree, count the height by going all-left and all-right. If they\'re equal, the left subtree is a perfect tree of height h-1 (so 2^(h-1)-1 nodes) plus root = 2^h-1 ... or use binary search on the last-level nodes in O(log^2n).',
    algorithm: [
      'Compute leftH (go left) and rightH (go right) from root.',
      'If leftH == rightH: full tree -> return (1 << leftH) - 1.',
      'Else: return CountNodes(root.left) + CountNodes(root.right) + 1.',
    ],
    example: {
      input: 'Complete tree with 6 nodes',
      steps: [
        'Root: leftH=3, rightH=2 -> not full. Recurse.',
        'Root.left: leftH=2, rightH=2 -> full subtree, 3 nodes.',
        'Root.right: leftH=1, rightH=1 -> full subtree, 1 node.',
        'Total = 3+1+1 = 5... (depends on actual tree structure).',
      ],
      output: '6',
    },
    pitfalls: ['Only O(log^2n) recursion depth  -  not O(n). The leftH==rightH check prunes half the tree each time.'],
  },

  // --- 230. Kth Smallest Element in a BST --------------------------------------
  230: {
    intuition:
      'In-order traversal of a BST visits nodes in ascending sorted order. The k-th visited node is the k-th smallest. Stop as soon as k reaches 0.',
    algorithm: [
      'InOrder(node): if null, return.',
      'InOrder(node.left).',
      'k--. If k == 0, record node.val and return.',
      'InOrder(node.right).',
    ],
    example: {
      input: 'BST = [3,1,4,null,2], k = 1',
      steps: [
        'In-order: 1, 2, 3, 4. The 1st is 1.',
      ],
      output: '1',
    },
    pitfalls: ['Decrement k during traversal and stop early  -  do not collect all nodes and index.'],
  },

  // --- 231. Power of Two -------------------------------------------------------
  231: {
    intuition:
      'A power of two in binary has exactly one bit set. The bit trick n & (n-1) clears the lowest set bit. If the result is 0 (and n > 0), only one bit was set -> n is a power of two.',
    algorithm: [
      'Return n > 0 && (n & (n - 1)) == 0.',
    ],
    example: {
      input: 'n = 16',
      steps: ['16 = 100002. n-1=15=011112. 16&15=0. Return true.'],
      output: 'true',
    },
    pitfalls: ['n must be positive  -  0 satisfies n&(n-1)==0 but is not a power of two.'],
  },

  // --- 237. Delete Node in a Linked List ---------------------------------------
  237: {
    intuition:
      'You don\'t have the previous node, but you have the node to delete. Copy the value from the next node into the current node, then skip the next node. The current node effectively becomes the next node.',
    algorithm: [
      'node.val = node.next.val.',
      'node.next = node.next.next.',
    ],
    example: {
      input: 'head = [4,5,1,9], node = 5',
      steps: [
        'Copy 1 (next\'s val) into node. node.next = node.next.next (skip old "1" node).',
        'List: [4,1,9].',
      ],
      output: '[4,1,9]',
    },
    pitfalls: ['This only works because the problem guarantees node is not the tail.'],
  },

  // --- 241. Different Ways to Add Parentheses ----------------------------------
  241: {
    intuition:
      'Each operator divides the expression into a left and right sub-expression. Recursively compute all possible results from each sub-expression, then combine every left result with every right result using the operator. Memoize on the sub-string to avoid recomputation.',
    algorithm: [
      'For each operator (+, -, *) at position i: left = DiffWays(expr[0..i-1]), right = DiffWays(expr[i+1..]).',
      'Combine every l in left with every r in right using the operator. Collect all results.',
      'If no operator found, the expression is a number  -  return [int.Parse(expression)].',
    ],
    example: {
      input: '"2-1-1"',
      steps: [
        'Split at first "-": left=[2], right=DiffWays("1-1")=[0,2]. Combine: 2-0=2, 2-2=0.',
        'Split at second "-": left=DiffWays("2-1")=[1], right=[1]. Combine: 1-1=0... wait, 1-1=0 already counted.',
        'Results: [0, 2].',
      ],
      output: '[0, 2]',
    },
    pitfalls: ['Always return a copy list from the memo  -  not a reference  -  if using memoization.'],
  },

  // --- 257. Binary Tree Paths ---------------------------------------------------
  257: {
    intuition:
      'DFS with backtracking: build the path string as you go down. When you reach a leaf, add the complete path to results.',
    algorithm: [
      'DFS(node, path):',
      'If leaf: result.Add(path + node.val).',
      'Else: DFS(left, path + node.val + "->"); DFS(right, path + node.val + "->").',
    ],
    example: {
      input: 'root = [1,2,3,null,5]',
      steps: [
        'From 1->2->5: path="1->2->5". From 1->3: path="1->3".',
      ],
      output: '["1->2->5","1->3"]',
    },
    pitfalls: ['Use string concatenation or StringBuilder carefully  -  in C# string is immutable so no explicit backtracking needed.'],
  },

  // --- 263. Ugly Number --------------------------------------------------------
  263: {
    intuition:
      'An ugly number has no prime factors other than 2, 3, and 5. Divide n by each of those primes repeatedly until it no longer divides evenly. If what remains is 1, n was ugly; any other remainder (e.g. 7) means a forbidden prime factor. Non-positive n is not ugly.',
    algorithm: [
      'If n <= 0, return false.',
      'For each prime in [2, 3, 5]: while n % prime == 0, set n = n / prime.',
      'After all three loops, return true iff n == 1.',
    ],
    example: {
      input: 'n = 14',
      steps: [
        '14 / 2 = 7. No further division by 2, 3, or 5.',
        'Remaining 7 ≠ 1 → 14 has prime factor 7.',
      ],
      output: 'false',
    },
    pitfalls: [
      'n = 1 is ugly (empty product of 2, 3, 5).',
      'n <= 0 is not ugly.',
      'Check factors in any order; division order does not matter.',
    ],
  },

  // --- 264. Ugly Number II -----------------------------------------------------
  264: {
    intuition:
      'Generate ugly numbers in order using three pointers, each tracking which ugly number to multiply by 2, 3, or 5 next. Always pick the minimum of the three next candidates and advance the corresponding pointer(s).',
    algorithm: [
      'dp[1] = 1. p2 = p3 = p5 = 0.',
      'For i from 1 to n-1: next = min(dp[p2]*2, dp[p3]*3, dp[p5]*5).',
      'dp[i] = next. If dp[p2]*2 == next, p2++. If dp[p3]*3 == next, p3++. If dp[p5]*5 == next, p5++.',
      'Return dp[n-1].',
    ],
    example: {
      input: 'n = 10',
      steps: [
        'Sequence: 1,2,3,4,5,6,8,9,10,12. 10th = 12.',
      ],
      output: '12',
    },
    pitfalls: ['Advance ALL pointers that produced the minimum to avoid duplicates (e.g., 2*3=6=3*2 must advance both p2 and p3).'],
  },

  // --- 273. Integer to English Words ------------------------------------------
  273: {
    intuition:
      'Process 3-digit groups (billions, millions, thousands, units) right to left. Each group is converted by a helper that handles hundreds, tens, and ones separately. Concatenate group strings with their magnitude labels.',
    algorithm: [
      'Define ONES=["","One","Two",...,"Nineteen"], TENS=["","","Twenty",...,"Ninety"].',
      'Helper(n) converts 1 - 999 to words.',
      'Process groups: billions=(num/1e9), millions=(num%1e9/1e6), thousands=(num%1e6/1e3), units=(num%1e3).',
      'For each non-zero group, prepend its words and magnitude label.',
    ],
    example: {
      input: '1234567',
      steps: [
        '1 million + 234 thousand + 567.',
        '"One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven".',
      ],
      output: '"One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"',
    },
    pitfalls: ['Handle 0 -> "Zero" as a special case before the general logic.'],
  },

  // --- 278. First Bad Version ---------------------------------------------------
  278: {
    intuition:
      'Classic binary search for the leftmost true condition. If isBadVersion(mid) is true, the first bad version is at mid or earlier (hi = mid). If false, it\'s after mid (lo = mid+1).',
    algorithm: [
      'lo = 1, hi = n.',
      'While lo < hi: mid = lo + (hi-lo)/2.',
      'If isBadVersion(mid): hi = mid. Else: lo = mid+1.',
      'Return lo.',
    ],
    example: {
      input: 'n = 5, bad = 4',
      steps: [
        'lo=1,hi=5. mid=3: not bad -> lo=4.',
        'lo=4,hi=5. mid=4: bad -> hi=4.',
        'lo=hi=4. Return 4.',
      ],
      output: '4',
    },
    pitfalls: ['Use hi=mid (not mid-1) to not skip the first bad version itself.'],
  },

  // --- 299. Bulls and Cows -----------------------------------------------------
  299: {
    intuition:
      'Bulls: count exact position matches in one pass. Cows: count non-bull digits in secret that appear as non-bull digits in guess. Use two frequency arrays for digits 0 - 9.',
    algorithm: [
      'For each position i: if secret[i]==guess[i], bulls++. Else: sCount[secret[i]]++, gCount[guess[i]]++.',
      'cows = sum over 0 - 9 of min(sCount[d], gCount[d]).',
      'Return "{bulls}A{cows}B".',
    ],
    example: {
      input: 'secret = "1807", guess = "7810"',
      steps: [
        'Position 1: "8"=="8" -> bulls=1. Others: sCount[1,0,7]++, gCount[7,1,0]++.',
        'cows: min(1,1)+min(1,1)+min(1,1)=3.',
      ],
      output: '"1A3B"',
    },
    pitfalls: ['Count non-bull occurrences only  -  do not double-count bull positions in the cow calculation.'],
  },

  // --- 303. Range Sum Query  -  Immutable ----------------------------------------
  303: {
    intuition:
      'Prefix sums let any range sum query run in O(1) after O(n) preprocessing. prefix[i] stores sum of nums[0..i-1], so sum(l,r) = prefix[r+1] - prefix[l]. The array never changes after construction.',
    algorithm: [
      'Build prefix array of length n+1 with prefix[0]=0.',
      'For i from 1 to n: prefix[i] = prefix[i-1] + nums[i-1].',
      'SumRange(l,r): return prefix[r+1] - prefix[l].',
    ],
    example: {
      input: 'nums = [-2,0,3,-5,2,-1], l=0, r=2',
      steps: [
        'prefix = [0,-2,-2,1,-4,-2,-3].',
        'SumRange(0,2) = prefix[3]-prefix[0] = 1-0 = 1.',
      ],
      output: '1',
    },
    pitfalls: [
      'prefix has length n+1; prefix[0]=0 sentinel simplifies range formula.',
      'Use long if values can overflow int in prefix.',
      'Immutable — no updates to nums after build.',
    ],
  },

  // --- 304. Range Sum Query 2D  -  Immutable -------------------------------------
  304: {
    intuition:
      '2D prefix sums: prefix[i][j] = sum of all elements in the rectangle [0,0] to [i-1,j-1]. Region sum uses inclusion-exclusion: sumRegion(r1,c1,r2,c2) = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1].',
    algorithm: [
      'Build prefix[m+1][n+1]. prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1].',
      'SumRegion(r1,c1,r2,c2): return prefix[r2+1][c2+1]-prefix[r1][c2+1]-prefix[r2+1][c1]+prefix[r1][c1].',
    ],
    example: {
      input: '3*3 matrix, query (2,1,4,3)',
      steps: ['Use the 4 corner prefix values with inclusion-exclusion.'],
      output: 'Constant time query',
    },
    pitfalls: ['The inclusion-exclusion formula: add the top-left corner back because it was subtracted twice.'],
  },

  // --- 309. Buy and Sell Stock with Cooldown ----------------------------------
  309: {
    intuition:
      'Three states: "held" (have stock), "sold" (just sold, in cooldown), "rest" (no stock, no cooldown). Transitions: held = max(prev_held, prev_rest - price). sold = prev_held + price. rest = max(prev_rest, prev_sold). Only need the previous day\'s three values.',
    algorithm: [
      'held = -INF, sold = 0, rest = 0.',
      'For each price: newHeld = max(held, rest - price). newSold = held + price. newRest = max(rest, sold).',
      'held=newHeld, sold=newSold, rest=newRest.',
      'Return max(sold, rest).',
    ],
    example: {
      input: 'prices = [1,2,3,0,2]',
      steps: [
        'p=1: held=max(-Infinity,0-1)=-1, sold=-Infinity, rest=0.',
        'p=2: held=max(-1,0-2)=-1, sold=-1+2=1, rest=0.',
        'p=3: held=max(-1,0-3)=-1, sold=-1+3=2, rest=max(0,1)=1.',
        'p=0: held=max(-1,1-0)=1, sold=-1+0=-1, rest=max(1,2)=2.',
        'p=2: held=max(1,2-2)=1, sold=1+2=3, rest=max(2,-1)=2.',
        'Return max(3,2)=3.',
      ],
      output: '3',
    },
    pitfalls: ['Update all three states simultaneously (from previous values)  -  do not read updated values mid-step.'],
  },

  // --- 310. Minimum Height Trees -----------------------------------------------
  310: {
    intuition:
      'The roots of MHTs are the center node(s) of the tree (1 or 2 nodes). Iteratively trim leaf nodes (degree 1) like peeling an onion. The last remaining 1 or 2 nodes are the answer.',
    algorithm: [
      'Build adjacency list and degree array.',
      'Enqueue all leaves (degree == 1).',
      'While remaining nodes > 2: dequeue leaves, decrement neighbor degrees, enqueue new leaves (degree now 1). Remaining -= leaves.Count.',
      'Return remaining node indices.',
    ],
    example: {
      input: 'n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]',
      steps: [
        'Initial leaves: [0,1,2,5]. Trim -> 3 and 4 become new leaves.',
        '2 nodes remain: [3,4]. Return [3,4].',
      ],
      output: '[3,4]',
    },
    pitfalls: ['Stop when 1 or 2 nodes remain  -  do not trim further.'],
  },

  // --- 316. Remove Duplicate Letters -------------------------------------------
  316: {
    intuition:
      'Greedy + monotonic stack: for each character, pop characters from the stack that are greater than the current one AND still appear later in the string (so they can be included later). This ensures the lexicographically smallest result while including each character exactly once.',
    algorithm: [
      'Count remaining occurrences of each character. Track which characters are in the stack (inStack set).',
      'For each character c: decrement count[c]. If c is in stack, skip.',
      'While stack top > c AND count[stack.top] > 0: pop top, remove from inStack.',
      'Push c, add to inStack.',
      'Return stack as string.',
    ],
    example: {
      input: '"cbacdcbc"',
      steps: [
        'c(count: c=4,b=2,a=1,d=1). Process c: stack=[c].',
        'b: c>b and count[c]=3>0 -> pop c. stack=[b].',
        'a: b>a and count[b]=1>0 -> pop b. stack=[a].',
        'c: push. stack=[a,c]. d: push. stack=[a,c,d]. c: in stack skip. b: push. stack=[a,c,d,b]. c: in stack, skip.',
      ],
      output: '"acdb"',
    },
    pitfalls: ['Only pop a character if it still appears later (count > 0)  -  otherwise removing it would lose the character entirely.'],
  },

  // --- 319. Bulb Switcher -------------------------------------------------------
  319: {
    intuition:
      'Bulb i is toggled by all its divisors. A bulb ends ON only if it has an odd number of divisors  -  which happens only for perfect squares. Count of perfect squares <= n = floor(√n).',
    algorithm: [
      'Return (int)Math.Sqrt(n).',
    ],
    example: {
      input: 'n = 3',
      steps: [
        'Perfect squares <= 3: 1. floor(√3)=1.',
        'Only bulb 1 stays on.',
      ],
      output: '1',
    },
    pitfalls: ['Use integer square root carefully  -  floating point sqrt(4) might give 1.9999... for some n.'],
  },

  // --- 326. Power of Three -----------------------------------------------------
  326: {
    intuition:
      'The largest power of 3 that fits in an int is 3^19 = 1,162,261,467. A number n is a power of 3 iff it divides this maximum power exactly.',
    algorithm: [
      'Return n > 0 && 1162261467 % n == 0.',
    ],
    example: {
      input: 'n = 9',
      steps: ['1162261467 % 9 = 0. Return true.'],
      output: 'true',
    },
    pitfalls: ['This only works because 3 is prime  -  the same trick does not apply to composite bases (e.g., 6 is not a power of 2 or 3 but 12 % 6 = 0).'],
  },

  // --- 329. Longest Increasing Path in a Matrix --------------------------------
  329: {
    intuition:
      'DFS with memoization on each cell: memo[i][j] = length of longest increasing path starting at (i,j). Explore all 4 directions, only moving to strictly larger values.',
    algorithm: [
      'memo[m][n] = 0 (uncomputed).',
      'DFS(i,j): if memo[i][j] != 0, return it.',
      'For each neighbor (ni,nj): if matrix[ni][nj] > matrix[i][j], best = max(best, DFS(ni,nj)+1).',
      'memo[i][j] = best. Return.',
      'Answer = max DFS(i,j) over all cells.',
    ],
    example: {
      input: '[[9,9,4],[6,6,8],[2,1,1]]',
      steps: [
        'DFS(2,0)=2 -> 2->6 path. DFS(2,1)=3 -> 1->6->9. Best=4 (1->2->6->9).',
      ],
      output: '4',
    },
    pitfalls: ['Memoize to avoid exponential recomputation  -  each cell is computed at most once.'],
  },

  // --- 330. Patching Array -----------------------------------------------------
  330: {
    intuition:
      'Greedily maintain the range [1, reach] that can be formed from the current elements. If nums[i] <= reach+1, it extends reach to reach+nums[i]. Otherwise, patch by adding reach+1 to the array, doubling reach.',
    algorithm: [
      'reach=0, patches=0, i=0.',
      'While reach < n: if i < nums.Length and nums[i] <= reach+1: reach += nums[i]; i++.',
      'Else: reach += reach+1 (patch); patches++.',
      'Return patches.',
    ],
    example: {
      input: 'nums = [1,3], n = 6',
      steps: [
        'reach=0. nums[0]=1<=1: reach=1.',
        'nums[1]=3<=2? No. Patch: add 2, reach=3. patches=1.',
        'nums[1]=3<=4: reach=6.',
        'reach=6 >= n=6. Done. patches=1.',
      ],
      output: '1',
    },
    pitfalls: ['When patching, always add reach+1 (the smallest uncoverable number)  -  this maximally extends reach.'],
  },

  // --- 331. Verify Preorder Serialization of a Binary Tree --------------------
  331: {
    intuition:
      'Use slot counting: the root consumes 1 slot and produces 2 child slots. A null ("#") consumes 1 slot and produces 0. Start with 1 slot (for the root). The sequence is valid iff slots never go negative and ends at exactly 0.',
    algorithm: [
      'slots = 1.',
      'For each token in preorder.Split(","):',
      '  slots-- (consume one slot). If slots < 0, return false.',
      '  If token != "#": slots += 2 (add two child slots).',
      'Return slots == 0.',
    ],
    example: {
      input: '"9,3,4,#,#,1,#,#,2,#,6,#,#"',
      steps: [
        'slots=1. "9":-1+2=2. "3":1+2=3. "4":2+2=4. "#":3. "#":2. "1":1+2=3. "#":2. "#":1. "2":0+2=2. "#":1. "6":0+2=2. "#":1. "#":0.',
        'slots=0 -> true.',
      ],
      output: 'true',
    },
    pitfalls: ['The slot count must stay non-negative throughout  -  not just be 0 at the end.'],
  },

  // --- 342. Power of Four -------------------------------------------------------
  342: {
    intuition:
      'A power of four is a power of two (n & (n-1) == 0) whose single set bit is in an even position (bits 0, 2, 4, ...). The mask 0x55555555 selects all even-position bits. Combine all three conditions.',
    algorithm: [
      'Return n > 0 && (n & (n-1)) == 0 && (n & 0x55555555) != 0.',
    ],
    example: {
      input: 'n = 16',
      steps: ['16=100002. Power of two . Bit at position 4 (even) . 16 & 0x55555555 = 0x10 != 0 .'],
      output: 'true',
    },
    pitfalls: ['n=2 is a power of two but not four: bit 1 is odd. The mask correctly rejects it.'],
  },

  // --- 344. Reverse String -----------------------------------------------------
  344: {
    intuition:
      'Two-pointer swap: left starts at 0, right at n-1. Swap and move both inward until they meet.',
    algorithm: [
      'lo=0, hi=n-1. While lo < hi: swap(s[lo], s[hi]); lo++; hi--.',
    ],
    example: {
      input: '["h","e","l","l","o"]',
      steps: ['Swap h,o -> ["o","e","l","l","h"]. Swap e,l -> ["o","l","l","e","h"].'],
      output: '["o","l","l","e","h"]',
    },
    pitfalls: ['In-place modification  -  no extra array needed.'],
  },

  // --- 350. Intersection of Two Arrays II --------------------------------------
  350: {
    intuition:
      'Count frequencies in the smaller array via a HashMap. Iterate the larger array: for each element, if it exists in the map with count > 0, add it to results and decrement the count.',
    algorithm: [
      'Build count map from nums1.',
      'For each val in nums2: if count[val] > 0, add to result, decrement count[val].',
      'Return result.',
    ],
    example: {
      input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
      steps: [
        'count={1:2, 2:2}. Process 2: count[2]=1, result=[2]. Process 2: count[2]=0, result=[2,2].',
      ],
      output: '[2,2]',
    },
    pitfalls: ['Unlike problem 349 (unique intersection), here duplicates matter  -  use counts, not a set.'],
  },

  // --- 367. Valid Perfect Square -----------------------------------------------
  367: {
    intuition:
      'Binary search for an integer x such that x^2 == num. Use long to avoid overflow.',
    algorithm: [
      'lo=1, hi=num.',
      'While lo <= hi: mid = lo + (hi-lo)/2. sq = (long)mid*mid.',
      'If sq == num: return true. If sq < num: lo=mid+1. Else: hi=mid-1.',
      'Return false.',
    ],
    example: {
      input: 'num = 16',
      steps: ['mid=8: 64>16 -> hi=7. mid=4: 16==16 -> true.'],
      output: 'true',
    },
    pitfalls: ['Use long for sq  -  mid*mid overflows int for large num.'],
  },

  // --- 368. Largest Divisible Subset -------------------------------------------
  368: {
    intuition:
      'Sort the array. dp[i] = length of the largest divisible subset ending at nums[i]. For nums[i] to extend subset dp[j], we need nums[i] % nums[j] == 0 (since sorted, nums[j] <= nums[i]). Track parent pointers to reconstruct the subset.',
    algorithm: [
      'Sort nums. dp[i]=1, parent[i]=-1.',
      'For i from 1 to n-1: for j from i-1 to 0: if nums[i]%nums[j]==0 and dp[j]+1>dp[i]: dp[i]=dp[j]+1, parent[i]=j.',
      'Find index of max dp value. Trace back using parent pointers.',
    ],
    example: {
      input: 'nums = [1,2,3,6]  -> sorted: [1,2,3,6]',
      steps: [
        'dp[0]=1. dp[1]: 2%1==0 -> dp[1]=2. dp[2]: 3%1==0 -> dp[2]=2. dp[3]: 6%3==0 -> dp[3]=3.',
        'Max at index 3, trace: 6<-3<-1.',
      ],
      output: '[1,3,6]',
    },
    pitfalls: ['Only check divisibility in one direction since array is sorted  -  nums[i] % nums[j] (not nums[j] % nums[i]).'],
  },

  // --- 386. Lexicographical Numbers --------------------------------------------
  386: {
    intuition:
      'Lexicographic order is DFS traversal of a 10-ary trie (each node 0 - 9 as children). Start from 1, go as deep as possible (multiply by 10), backtrack when needed (increment + skip trailing 9s and divisors of 10).',
    algorithm: [
      'curr=1, result=[].',
      'For i from 1 to n: append curr to result.',
      'If curr*10 <= n: curr *= 10.',
      'Else: if curr >= n: curr /= 10. curr++. While curr % 10 == 0: curr /= 10.',
    ],
    example: {
      input: 'n = 13',
      steps: [
        '1->10->11->12->13->(backtrack)->2->3->...->9.',
        'Order: 1,10,11,12,13,2,3,4,5,6,7,8,9.',
      ],
      output: '[1,10,11,12,13,2,3,4,5,6,7,8,9]',
    },
    pitfalls: ['After backtracking, keep dividing by 10 while the number ends in 0 to maintain valid prefix form.'],
  },

  // --- 400. Nth Digit ----------------------------------------------------------
  400: {
    intuition:
      'Digits are grouped by number of digits: 1-digit (1 - 9, 9 numbers, 9 digits total), 2-digit (10 - 99, 90 numbers, 180 digits), etc. Find which group the n-th digit falls in, then the exact number, then the exact digit within that number.',
    algorithm: [
      'digits=1, count=9, start=1.',
      'While n > digits*count: n -= digits*count. digits++. count*=10. start*=10.',
      'The target number is start + (n-1)/digits.',
      'The digit within that number: (n-1) % digits, counted from the left.',
    ],
    example: {
      input: 'n = 11',
      steps: [
        'Group 1 (1-digit): 9 digits. n=11>9 -> n=2, digits=2, start=10.',
        'Number = 10 + (2-1)/2 = 10. Digit index = (2-1)%2 = 1. "10"[1] = "0".',
      ],
      output: '0',
    },
    pitfalls: ['Subtract group total from n before advancing  -  the remaining n indexes within the next group.'],
  },

  // --- 401. Binary Watch -------------------------------------------------------
  401: {
    intuition:
      'Enumerate all valid times (hours 0 - 11, minutes 0 - 59) and count the number of 1-bits in the combined binary representation (hours take 4 bits, minutes take 6 bits). If bit count == num, add the time to results.',
    algorithm: [
      'For h from 0 to 11: for m from 0 to 59: if BitCount(h)+BitCount(m)==num: add "{h}:{m:D2}" to results.',
    ],
    example: {
      input: 'num = 1',
      steps: [
        'h=0,m=1: bits=0+1=1  -> "0:01". h=0,m=2: 1 bit  -> "0:02". ... h=1,m=0: 1+0=1  -> "1:00". Etc.',
      ],
      output: '["0:01","0:02","0:04","0:08","0:16","0:32","1:00","2:00","4:00","8:00"]',
    },
    pitfalls: ['Format minutes with leading zero  -  "0:1" is wrong, must be "0:01".'],
  },

  // --- 405. Convert a Number to Hexadecimal ------------------------------------
  405: {
    intuition:
      'For negative numbers, use two\'s complement (treat as unsigned 32-bit). Process 4 bits at a time (one hex digit) by AND-ing with 0xF and right-shifting. For two\'s complement in C#, cast to uint first.',
    algorithm: [
      'If num == 0, return "0".',
      'Use uint n = (uint)num to handle negatives as 32-bit unsigned.',
      'While n != 0: digit = n & 0xF. Prepend "0123456789abcdef"[digit] to result. n >>= 4.',
      'Return result.',
    ],
    example: {
      input: 'num = 26',
      steps: ['26 & 0xF = 10 -> "a". 26>>4 = 1. 1 & 0xF = 1 -> "1". Result = "1a".'],
      output: '"1a"',
    },
    pitfalls: ['Cast to uint before processing to correctly handle negative numbers via two\'s complement.'],
  },

  // --- 407. Trapping Rain Water II ---------------------------------------------
  407: {
    intuition:
      'Extend problem 42 to 2D: water is trapped by the lowest boundary cell around any inner cell. Use a min-heap (priority queue) initialized with all border cells. BFS/Dijkstra-style: always process the current minimum-height border, push unvisited neighbors, and the water trapped = max(0, borderHeight - cellHeight).',
    algorithm: [
      'Add all border cells to the min-heap with their heights. Mark visited.',
      'While heap is not empty: pop (h, r, c) with minimum height.',
      'For each unvisited neighbor (nr, nc): water += max(0, h - heightMap[nr][nc]).',
      'Push (max(h, heightMap[nr][nc]), nr, nc) to heap. Mark visited.',
    ],
    example: {
      input: 'heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]',
      steps: [
        'Border cells form initial boundary. Inner cells are filled to the boundary height they\'re surrounded by.',
        'Total trapped = 4.',
      ],
      output: '4',
    },
    pitfalls: ['The neighbor is pushed with max(h, heightMap[nr][nc])  -  not the raw neighbor height  -  because the water level cannot drop below the current boundary.'],
  },

  // --- 417. Pacific Atlantic Water Flow ----------------------------------------
  417: {
    intuition:
      'Instead of simulating water flow from each cell to oceans, reverse the problem: BFS/DFS from ocean borders inward (visiting cells that can flow TO the ocean). Cells reachable from both Pacific and Atlantic borders are the answer.',
    algorithm: [
      'pacificQueue = all top row and left column cells. atlanticQueue = all bottom row and right column cells.',
      'BFS from each queue: mark cells reachable from Pacific / Atlantic.',
      'A cell moves to neighbor if neighbor height >= current (water flows uphill in reverse).',
      'Return cells marked by both BFS passes.',
    ],
    example: {
      input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      steps: [
        'Pacific BFS from top/left border expands inward.',
        'Atlantic BFS from bottom/right border expands inward.',
        'Intersection = cells reachable from both.',
      ],
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
    },
    pitfalls: ['Reverse the comparison: neighbor.height >= current.height (in reverse, water can flow uphill).'],
  },

  // --- 416. Partition Equal Subset Sum ----------------------------------------
  416: {
    intuition: 'Can we find a subset summing to exactly half the total? This is a classic 0/1 knapsack: can we fill a knapsack of capacity sum/2 using each number at most once?',
    algorithm: [
      'Compute total. If odd, return false.',
      'Target = total / 2. Create boolean DP array dp[0..target], dp[0]=true.',
      'For each number n, iterate j from target down to n: dp[j] |= dp[j-n].',
      'Return dp[target].',
    ],
    example: { input: 'nums=[1,5,11,5]', steps: ['total=22, target=11.', 'After 1: dp[1]=true.', 'After 5: dp[5]=dp[6]=true.', 'After 11: dp[11]=true.'], output: 'true' },
    pitfalls: ['Iterate j backwards to avoid using same element twice.', 'If total is odd, immediately return false.'],
  },

  // --- 429. N-ary Tree Level Order Traversal -----------------------------------
  429: {
    intuition: 'BFS level-by-level, same as binary tree but each node can have multiple children.',
    algorithm: [
      'Start BFS queue with root.',
      'For each level: record count of nodes in queue, dequeue that many nodes collecting their values, enqueue all their children.',
      'Append each level\'s values to result.',
    ],
    example: { input: 'root=[1,[3,2,4],[5,6]]', steps: ['Level 0: [1].', 'Level 1: [3,2,4].', 'Level 2: [5,6].'], output: '[[1],[3,2,4],[5,6]]' },
    pitfalls: ['Snapshot the queue size before processing each level, otherwise newly added children corrupt level count.'],
  },

  // --- 432. All O`one Data Structure ------------------------------------------
  432: {
    intuition: 'Support inc/dec/getMaxKey/getMinKey in O(1). Use a doubly-linked list of buckets ordered by count, plus a hashmap from key?bucket.',
    algorithm: [
      'Each bucket node holds a count and a set of keys with that count.',
      'HashMap maps key ? its bucket.',
      'Inc(key): move key to bucket(count+1), creating if needed.',
      'Dec(key): move key to bucket(count-1), removing key if count becomes 0.',
      'getMaxKey/getMinKey: return any key from tail/head bucket.',
    ],
    pitfalls: ['Remove empty buckets immediately to keep head/tail valid.', 'Handle the boundary case where a key reaches count 0 on dec.'],
  },

  // --- 440. K-th Smallest in Lexicographical Order -----------------------------
  440: {
    intuition: 'Numbers 1..n in lexicographic order form a 10-ary prefix trie. Count how many numbers fall under a given prefix to decide whether to go deeper or to the next sibling.',
    algorithm: [
      'Start at curr=1, steps taken=1.',
      'While steps < k: count numbers in the subtree rooted at curr (capped at n); if count = k-steps, skip the whole subtree (curr++, steps+=count); else go deeper (curr*=10, steps++).',
      'Return curr.',
    ],
    pitfalls: ['Count uses long arithmetic to avoid overflow when computing prefix boundaries.'],
  },

  // --- 460. LFU Cache ----------------------------------------------------------
  460: {
    intuition: 'Least-Frequently-Used evicts the key with lowest access count (ties broken by LRU). Maintain: key?(value,freq), freq?LinkedHashSet of keys, and a minFreq counter.',
    algorithm: [
      'On get(key): if present, increment its freq, move it to the new freq set, update minFreq. Return value.',
      'On put(key,val): if capacity 0, return. If key exists, update value and call get logic. If at capacity, evict: remove oldest key from freq[minFreq] set. Insert key at freq 1, set minFreq=1.',
    ],
    pitfalls: ['Use LinkedHashSet to maintain insertion order within same frequency (for LRU tie-breaking).', 'Reset minFreq to 1 on every new insert.'],
  },

  // --- 467. Unique Substrings in Wraparound String -----------------------------
  467: {
    intuition: 'Count unique substrings of p that are substrings of the infinite wraparound string "abcdefg...z abcdef...". A substring is valid if it\'s consecutive in wrap-around order.',
    algorithm: [
      'Track current run length of valid consecutive characters.',
      'For each character c, if p[i]-p[i-1]==1 or wraparound (za), extend run; else reset to 1.',
      'Track max run length ending at each character. Answer = sum of these maxes.',
    ],
    example: { input: 'p="zab"', steps: ['z: run=1, max[z]=1.', 'a: z?a is wraparound, run=2, max[a]=2.', 'b: a?b consecutive, run=3, max[b]=3.', 'Total=1+2+3=6.'], output: '6' },
    pitfalls: ['Count by last character to avoid duplicates: each unique substring ending at character c of max length L contributes L unique substrings.'],
  },

  // --- 474. Ones and Zeroes ----------------------------------------------------
  474: {
    intuition: '2D 0/1 knapsack: maximize count of strings selected such that total 0s = m, total 1s = n.',
    algorithm: [
      'dp[i][j] = max strings using at most i zeros and j ones.',
      'For each string with z zeros and o ones, iterate i from m down to z, j from n down to o: dp[i][j] = max(dp[i][j], dp[i-z][j-o]+1).',
    ],
    pitfalls: ['Iterate backwards (both dimensions) to ensure each string is counted at most once.'],
  },

  // --- 476. Number Complement --------------------------------------------------
  476: {
    intuition: 'Flip all bits of the number but only up to its highest set bit. Create a mask of all 1s up to that bit length, then XOR.',
    algorithm: [
      'Find bit length: len = floor(log2(num)) + 1.',
      'Create mask = (1 << len) - 1.',
      'Return num XOR mask.',
    ],
    example: { input: 'num=5 (101)', steps: ['len=3, mask=111=7.', '5 XOR 7 = 010 = 2.'], output: '2' },
    pitfalls: ['Do not flip leading zeros � only bits within the number\'s bit length.'],
  },

  // --- 477. Total Hamming Distance ---------------------------------------------
  477: {
    intuition: 'For each bit position, count how many numbers have 0 vs 1. Every pair of (0,1) contributes 1 to Hamming distance. Total contribution = ones * zeros.',
    algorithm: [
      'For each of 32 bit positions:',
      'Count c = numbers with bit set.',
      'Add c * (n - c) to answer.',
    ],
    example: { input: 'nums=[4,14,2]', steps: ['Bit 1: [0,1,1]?ones=2, zeros=1 ? 2.', 'Bit 2: [1,1,0]?ones=2, zeros=1 ? 2.', 'Bit 3: [0,1,0]?ones=1, zeros=2 ? 2.', 'Total=6.'], output: '6' },
    pitfalls: ['This is O(32n) vs O(n�) naive pairwise.'],
  },

  // --- 479. Largest Palindrome Product -----------------------------------------
  479: {
    intuition: 'Find the largest palindrome made from the product of two n-digit numbers. A palindrome can be expressed as upper*10^n + reverse(upper). Iterate upper from largest down.',
    algorithm: [
      'For n=1, return 9.',
      'Max = 10^n - 1 (largest n-digit number).',
      'For each candidate palindrome (constructed from upper half), check if it has two n-digit factors.',
      'Return result mod 1337.',
    ],
    pitfalls: ['This requires careful construction; use long arithmetic to avoid overflow.'],
  },

  // --- 494. Target Sum ---------------------------------------------------------
  494: {
    intuition: 'Assign + or - to each number. DP: count ways to reach each possible sum. Or reduce to subset sum: let P = positive subset. P - (total-P) = target ? P = (total+target)/2.',
    algorithm: [
      'If (total+target) is odd or |target| > total, return 0.',
      'Find count of subsets summing to (total+target)/2.',
      'Use 1D DP: dp[j] = number of ways to reach sum j.',
      'For each num: iterate j from target down to num: dp[j] += dp[j-num].',
    ],
    example: { input: 'nums=[1,1,1,1,1], target=3', steps: ['total=5, need sum=4.', 'Ways to choose 4 from [1,1,1,1,1] = C(5,4) = 5.'], output: '5' },
    pitfalls: ['dp[0]=1 (empty subset). Check (total+target)%2 == 0 before proceeding.'],
  },

  // --- 498. Diagonal Traverse --------------------------------------------------
  498: {
    intuition: 'For an m�n matrix, traverse diagonals alternating direction. On even diagonals (d%2==0) go up-right, on odd go down-left.',
    algorithm: [
      'For each diagonal d from 0 to m+n-2:',
      'Determine row range: r from max(0, d-n+1) to min(d, m-1).',
      'If d is even, iterate r from end to start (up-right). If odd, start to end (down-left).',
      'Column c = d - r.',
    ],
    pitfalls: ['Don\'t simulate step-by-step; compute row/col directly from diagonal number to avoid boundary checks.'],
  },

  // --- 500. Keyboard Row -------------------------------------------------------
  500: {
    intuition: 'Check if all characters of a word are on the same keyboard row.',
    algorithm: [
      'Map each letter to its row (0,1,2): row1="qwertyuiop", row2="asdfghjkl", row3="zxcvbnm".',
      'For each word, get the row of its first character. Check all other chars are on the same row.',
    ],
    pitfalls: ['Convert to lowercase before checking.'],
  },

  // --- 502. IPO ----------------------------------------------------------------
  502: {
    intuition: 'Greedily pick the most profitable project you can afford. Use a min-heap for capital requirements and a max-heap for profits of affordable projects.',
    algorithm: [
      'Sort projects by capital required.',
      'Use pointer to track which projects are now affordable as capital grows.',
      'For each of k rounds: push all newly affordable projects\' profits to max-heap. Pop max profit. Add to capital.',
    ],
    pitfalls: ['If max-heap is empty (no affordable projects), break early � can\'t make more money.'],
  },

  // --- 508. Most Frequent Subtree Sum ------------------------------------------
  508: {
    intuition: 'Compute subtree sum for every node using post-order DFS, then find the most frequent sum(s).',
    algorithm: [
      'DFS returns sum of subtree rooted at each node.',
      'Store sums in a frequency map.',
      'Find max frequency; collect all sums with that frequency.',
    ],
    pitfalls: ['Multiple sums can tie for max frequency � return all of them.'],
  },

  // --- 513. Find Bottom Left Tree Value ----------------------------------------
  513: {
    intuition: 'BFS level-order, processing right before left. The last node processed is the bottom-right. Or BFS left-before-right and take the last level\'s first element. Simplest: BFS right-to-left, return last node value.',
    algorithm: [
      'BFS with right child before left child.',
      'The last node dequeued is bottom-left.',
      'Return its value.',
    ],
    pitfalls: ['Using right-before-left BFS means the last element is leftmost. Alternatively, track first element of each level in standard BFS.'],
  },

  // --- 515. Find Largest Value in Each Tree Row --------------------------------
  515: {
    intuition:
      'Each tree row is a BFS level. Level-order traversal visits nodes left-to-right, top-to-bottom — so grouping by depth naturally yields one row per level. Track the maximum value seen while processing each level before moving to the next.',
    algorithm: [
      'If root is null, return empty list.',
      'BFS queue starting with root.',
      'For each level: snapshot queue size, initialize rowMax to negative infinity.',
      'Dequeue exactly that many nodes; update rowMax with each value; enqueue non-null children.',
      'Append rowMax to result after finishing the level.',
    ],
    example: {
      input: 'root = [1,3,2,5,3,null,9]',
      steps: [
        'Level 0: nodes [1] -> max = 1.',
        'Level 1: nodes [3,2] -> max = 3.',
        'Level 2: nodes [5,3,9] -> max = 9.',
      ],
      output: '[1, 3, 9]',
    },
    pitfalls: [
      'Initialize row max to Integer.MIN_VALUE — node values can be negative.',
      'Snapshot queue size before the inner loop; dequeuing changes the count mid-level.',
      'Do not mix nodes from different depths in one iteration.',
    ],
  },

  // --- 539. Minimum Time Difference --------------------------------------------
  539: {
    intuition: 'Convert times to minutes, sort, check consecutive differences including wraparound (24*60 - last + first).',
    algorithm: [
      'Parse each "HH:MM" to total minutes.',
      'Sort the minutes array.',
      'Check all consecutive differences. Also check circular difference: 1440 - last + first.',
      'Return minimum difference.',
    ],
    example: { input: '["23:59","00:00"]', steps: ['Convert: [1439, 0]. Sort: [0, 1439].', 'Consecutive diff: 1439. Circular: 1440-1439+0=1.'], output: '1' },
    pitfalls: ['Don\'t forget the wraparound from last time to first time (adding 24*60).'],
  },

  // --- 554. Brick Wall ---------------------------------------------------------
  554: {
    intuition: 'Find the vertical line that crosses the fewest bricks (most edges). Count edge positions using a hashmap, find max edge count, answer = rows - maxEdges.',
    algorithm: [
      'For each row, compute cumulative widths (except last brick).',
      'Increment edge count for each cumulative position.',
      'Find max edge count.',
      'Return totalRows - maxEdgeCount.',
    ],
    pitfalls: ['Don\'t count the outer edges (start of row and end of row are not valid crossing points).'],
  },

  // --- 558. Logical OR of Two Binary Grids Represented as Quad-Trees -----------
  558: {
    intuition: 'Recursively OR two quad-tree nodes. If either is a leaf of 1, result is 1. If both are leaves of 0, result is 0. Otherwise recurse on all four quadrants.',
    algorithm: [
      'If n1 is leaf with val=1 or n2 is leaf with val=1: return leaf(1).',
      'If n1 is leaf with val=0: return n2. If n2 is leaf with val=0: return n1.',
      'Recurse on TL, TR, BL, BR.',
      'If all four children are leaves with same val: collapse to a single leaf.',
    ],
    pitfalls: ['After recursing, check if all four children are uniform leaves to compress the tree.'],
  },

  // --- 567. Permutation in String ----------------------------------------------
  567: {
    intuition: 'Use a sliding window of size len(s1) over s2. Maintain character frequency counts. The window is a permutation of s1 when counts match.',
    algorithm: [
      'Count frequencies of s1 characters.',
      'Maintain a window in s2 of the same length, tracking character counts.',
      'Track "matches" (characters where counts are equal).',
      'Slide the window: add new char, remove old char, update matches. If matches==26, found.',
    ],
    example: { input: 's1="ab", s2="eidbaooo"', steps: ['Check windows "ei","id","db","ba","ao" � "ba" matches freq of "ab".'], output: 'true' },
    pitfalls: ['Track a "matches" counter (number of characters with equal count) for O(1) window validity check.'],
  },

  // --- 592. Fraction Addition and Subtraction ----------------------------------
  592: {
    intuition: 'Parse fractions, accumulate numerator/denominator step by step, simplify using GCD after each step.',
    algorithm: [
      'Parse each fraction (handle + and - signs).',
      'Maintain running numerator/denominator.',
      'Add/subtract: (a/b � c/d) = (a*d � c*b) / (b*d), then simplify by GCD.',
      'Format final result.',
    ],
    pitfalls: ['Handle leading + signs and negative numerators. Always simplify to keep numbers small.'],
  },

  // --- 593. Valid Square -------------------------------------------------------
  593: {
    intuition: 'Four points form a square if the 6 pairwise distances have exactly 2 distinct values: 4 equal sides and 2 equal diagonals, with diagonal� = 2 � side�.',
    algorithm: [
      'Compute all 6 pairwise squared distances.',
      'Sort them. The first 4 should be equal (sides) and last 2 equal (diagonals).',
      'Verify sides > 0 and diagonals = 2 � sides.',
    ],
    pitfalls: ['Use squared distances (int) to avoid floating-point issues. Reject degenerate cases where min distance is 0.'],
  },

  // --- 594. Longest Harmonious Subsequence -------------------------------------
  594: {
    intuition: 'A harmonious subsequence uses elements whose max and min differ by exactly 1. For each value v, the subsequence of v and v+1 has length freq[v]+freq[v+1].',
    algorithm: [
      'Build frequency map.',
      'For each key v, if freq[v+1] exists, candidate = freq[v] + freq[v+1].',
      'Return max candidate.',
    ],
    example: { input: '[1,3,2,2,5,2,3,7]', steps: ['freq={1:1,2:3,3:2,5:1,7:1}.', '1+2: 1+3=4. 2+3: 3+2=5.'], output: '5' },
    pitfalls: ['Only check v+1 (not v-1) to avoid double-counting.'],
  },

  // --- 600. Non-negative Integers without Consecutive Ones ---------------------
  600: {
    intuition: 'Digit DP: count binary numbers up to n with no two consecutive 1s. This relates to Fibonacci � valid k-bit numbers = Fib(k+2).',
    algorithm: [
      'Find binary representation of n.',
      'Use DP with states (position, tight, prev_bit).',
      'At each bit: if we can place 0 freely; if we can place 1 only if prev_bit is 0.',
    ],
    pitfalls: ['Handle the "tight" constraint carefully � when following the exact bits of n vs when we\'re already below n.'],
  },

  // --- 605. Can Place Flowers --------------------------------------------------
  605: {
    intuition: 'Greedily plant flowers: if position i and its neighbors are all 0, plant at i (set flowerbed[i]=1) and continue.',
    algorithm: [
      'Iterate through flowerbed.',
      'At each index i, check flowerbed[i]==0 and (i==0 or flowerbed[i-1]==0) and (i==n-1 or flowerbed[i+1]==0).',
      'If true, plant: set flowerbed[i]=1, count++.',
      'Return count >= n.',
    ],
    pitfalls: ['Modifying the array in-place (marking 1) prevents us from planting at adjacent positions without extra checks.'],
  },

  // --- 611. Valid Triangle Number ----------------------------------------------
  611: {
    intuition: 'Sort, then for each pair (i,j) with j fixed as the largest, find how many i satisfy nums[i]+nums[j-1]>nums[j] using binary search or two pointers.',
    algorithm: [
      'Sort the array.',
      'Fix the largest side c (index k from right): use two pointers l=0, r=k-1.',
      'If nums[l]+nums[r] > nums[k]: all pairs (l..r-1, r) work ? count += r-l, r--. Else l++.',
    ],
    pitfalls: ['Triangle inequality only needs the two smaller sides to sum > largest side (since sorted, others are implied).'],
  },

  // --- 620. Not Boring Movies --------------------------------------------------
  620: {
    intuition: 'SQL: filter id%2=1 (odd id) and description not "boring", order by rating descending.',
    algorithm: [
      'SELECT * FROM cinema WHERE id % 2 = 1 AND description != "boring" ORDER BY rating DESC.',
    ],
    pitfalls: ['Use != or <> for "not boring". ORDER BY rating DESC for descending.'],
  },

  // --- 623. Add One Row to Tree ------------------------------------------------
  623: {
    intuition: 'BFS or DFS to find all nodes at depth d-1, then insert new nodes with value v between those nodes and their children.',
    algorithm: [
      'Special case: if d==1, create new root with val=v, left=old root.',
      'BFS to level d-1. For each node at that level:',
      'Create new_left(v) with new_left.left=node.left, attach to node.left.',
      'Create new_right(v) with new_right.right=node.right, attach to node.right.',
    ],
    pitfalls: ['Handle d=1 separately. Remember new_left.left=old node.left and new_right.right=old node.right.'],
  },

  // --- 624. Maximum Distance in Arrays -----------------------------------------
  624: {
    intuition: 'Maximize max[i] - min[j] where i?j. Greedily track running minimum of first elements and maximum of last elements from previous arrays.',
    algorithm: [
      'Initialize min_val = first[0], max_val = last[0].',
      'For each subsequent array i: ans = max(ans, last[i]-min_val, max_val-first[i]).',
      'Update min_val, max_val with current array.',
    ],
    pitfalls: ['Must update answer BEFORE updating min/max to ensure i?j constraint.'],
  },

  // --- 627. Swap Salary --------------------------------------------------------
  627: {
    intuition:
      'Swap every employee sex from m to f and f to m in one SQL UPDATE. Use CASE or IF — no temporary column needed.',
    algorithm: [
      'UPDATE Salary SET sex = CASE WHEN sex = \'m\' THEN \'f\' ELSE \'m\' END;',
      'Alternatively: SET sex = IF(sex = \'m\', \'f\', \'m\').',
      'Single statement updates all rows atomically.',
    ],
    example: {
      input: 'Rows with sex m and f mixed',
      steps: ['Each m becomes f; each f becomes m in one pass.'],
      output: 'All sex values toggled',
    },
    pitfalls: [
      'Assume only m and f appear in the column.',
      'One UPDATE — no temp table required.',
      'CASE must cover both branches.',
    ],
  },


  // --- 632. Smallest Range Covering Elements from K Lists ----------------------
  632: {
    intuition: 'Use a min-heap containing one element from each list. Track global max. Smallest range containing one element from each list = [heap_min, global_max]. Advance the list with the minimum element.',
    algorithm: [
      'Initialize: push first element of each list, track max of those elements.',
      'current range = [min_heap.min, max].',
      'Pop min, push next from same list, update max.',
      'Repeat until any list is exhausted. Return smallest range seen.',
    ],
    pitfalls: ['When you can\'t advance the list with minimum (exhausted), stop � can\'t shrink further.'],
  },

  // --- 633. Sum of Square Numbers ----------------------------------------------
  633: {
    intuition: 'Two-pointer: set lo=0, hi=floor(sqrt(c)). Check lo�+hi�==c, adjust pointers.',
    algorithm: [
      'lo = 0, hi = (int)sqrt(c).',
      'While lo <= hi: compute sum = lo�+hi�. If sum==c return true. If sum<c lo++. Else hi--.',
    ],
    pitfalls: ['Use long arithmetic to avoid overflow when squaring. lo can equal hi (same number twice).'],
  },

  // --- 641. Design Circular Deque ----------------------------------------------
  641: {
    intuition: 'Circular buffer with head and tail pointers. Support front/rear insert and delete in O(1).',
    algorithm: [
      'Fixed-size array of capacity k+1 (or k with a count variable).',
      'head points to front; tail to one past rear.',
      'InsertFront: head = (head-1+size)%size; arr[head]=val. InsertLast: arr[tail]=val; tail=(tail+1)%size.',
      'DeleteFront: head=(head+1)%size. DeleteLast: tail=(tail-1+size)%size.',
    ],
    pitfalls: ['Use k+1 size to distinguish empty (head==tail) from full ((tail+1)%size==head).'],
  },

  // --- 646. Maximum Length of Pair Chain ---------------------------------------
  646: {
    intuition: 'Greedy: sort by end value. Greedily select the chain pair whose end is smallest (classic interval scheduling).',
    algorithm: [
      'Sort pairs by their end (second) value.',
      'curr = pairs[0], count = 1.',
      'For each subsequent pair p: if p.start > curr.end, take it: count++, curr=p.',
    ],
    pitfalls: ['Sort by end value, not start value. Strictly greater (not >=) to extend the chain.'],
  },

  // --- 650. 2 Keys Keyboard ----------------------------------------------------
  650: {
    intuition: 'The minimum steps to get n \'A\'s is the sum of prime factors of n. Each prime factor p means: copy current and paste (p-1) more times.',
    algorithm: [
      'Factor n into primes.',
      'Sum of all prime factors (with multiplicity) = minimum operations.',
    ],
    example: { input: 'n=6', steps: ['6 = 2�3. Start with 1 A. Copy+Paste once ? 2A (2 steps). Copy+Paste twice ? 6A (3 steps). Total = 5.'], output: '5' },
    pitfalls: ['n=1 ? 0 operations (already have 1 A). Each prime factor p costs p operations.'],
  },

  // --- 657. Robot Return to Origin ---------------------------------------------
  657: {
    intuition:
      'The robot only moves on a 2D grid. Track net displacement in x (L/R) and y (U/D). After all moves, the robot returns to the origin exactly when both coordinates are zero.',
    algorithm: [
      'Initialize x = 0, y = 0.',
      'For each character: L decrements x, R increments x, U increments y, D decrements y.',
      'Return true iff x == 0 and y == 0 after the full string.',
    ],
    example: {
      input: 'moves = "UD"',
      steps: ['U: y=1. D: y=0. x stays 0.'],
      output: 'true',
    },
    pitfalls: [
      'Empty moves string returns true.',
      'Only final displacement matters, not visit order.',
      'Input is always valid moves only.',
    ],
  },

  // --- 658. Find K Closest Elements --------------------------------------------
  658: {
    intuition: 'Binary search for the starting position of the window of size k. The optimal window starts where arr[mid] is closer to x than arr[mid+k].',
    algorithm: [
      'Binary search: lo=0, hi=len-k.',
      'While lo < hi: mid = (lo+hi)/2. If x-arr[mid] > arr[mid+k]-x: lo=mid+1. Else hi=mid.',
      'Return arr[lo..lo+k].',
    ],
    pitfalls: ['Comparison: prefer arr[mid+k]-x over x-arr[mid] when equal (left-biased window). Hi = len-k, not len-1.'],
  },

  // --- 664. Strange Printer ----------------------------------------------------
  664: {
    intuition: 'Interval DP: dp[i][j] = minimum turns to print s[i..j]. If s[k]==s[i] for some k in (i,j], we can merge those turns.',
    algorithm: [
      'dp[i][i] = 1 for all i.',
      'For length l=2..n, for each i: j=i+l-1. dp[i][j] = dp[i][j-1]+1 (print j separately).',
      'For each k in [i,j-1] where s[k]==s[j]: dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j-1]).',
    ],
    pitfalls: ['When s[k]==s[j], we can extend the print at position k to cover j for free, so subtract one turn.'],
  },

  // --- 670. Maximum Swap -------------------------------------------------------
  670: {
    intuition: 'Swap at most one pair of digits to maximize. For each digit from left to right, find if there\'s a larger digit to its right (rightmost occurrence). Swap with first such opportunity.',
    algorithm: [
      'Store last occurrence index of each digit (0-9).',
      'From left to right, for each digit d: check if there\'s a larger digit (9 down to d+1) whose last occurrence is to the right.',
      'If found, swap and return.',
    ],
    example: { input: 'num=2736', steps: ['Last[6]=3, last[7]=2, last[3]=1, last[2]=0.', 'Index 0: digit=2, check 9..3: 7 at idx 2 > 0 ? swap. 7236.'], output: '7236' },
    pitfalls: ['Use the rightmost occurrence of the larger digit to ensure maximum gain.'],
  },

  // --- 678. Valid Parenthesis String -------------------------------------------
  678: {
    intuition: 'Track the range [lo, hi] of possible open bracket counts. \'(\' increases both, \')\' decreases both, \'*\' expands range. If hi<0 at any point, invalid. Return lo==0 at end.',
    algorithm: [
      'lo=0, hi=0.',
      'For each char: if \'(\': lo++,hi++. If \')\': lo--,hi--. If \'*\': lo--,hi++.',
      'lo = max(lo, 0) (can\'t have negative open count).',
      'If hi < 0: return false.',
      'Return lo == 0.',
    ],
    example: { input: '"(*)"', steps: ['(: lo=1,hi=1. *: lo=0,hi=2. ): lo=-1?0, hi=1. End lo=0 ?.'], output: 'true' },
    pitfalls: ['Clamp lo to 0 after each step. If hi goes negative, it\'s impossible.'],
  },

  // --- 684. Redundant Connection -----------------------------------------------
  684: {
    intuition: 'Find the edge that creates a cycle in an undirected graph (tree + 1 extra edge). Use Union-Find: the edge whose two endpoints are already connected is the answer.',
    algorithm: [
      'Initialize Union-Find with n nodes.',
      'For each edge (u,v): if find(u)==find(v), return this edge (creates a cycle). Else union(u,v).',
    ],
    pitfalls: ['Return the LAST such edge if multiple exist. Process in order and return the first edge that unites two already-connected nodes.'],
  },

  // --- 689. Maximum Sum of 3 Non-Overlapping Subarrays -------------------------
  689: {
    intuition: 'Three non-overlapping subarrays of size k. Precompute sliding window sums. For each middle window j, find the best left (max in [0..j-k]) and best right (max in [j+k..n-k]).',
    algorithm: [
      'Compute sums[] of all k-length windows.',
      'left[i] = index of max window in sums[0..i].',
      'right[i] = index of max window in sums[i..n-k].',
      'Iterate j from k to n-2k: try left[j-k], j, right[j+k]; update best.',
    ],
    pitfalls: ['For ties, prefer leftmost (build left L to R, right R to L with strict greater).'],
  },

  // --- 693. Binary Number with Alternating Bits --------------------------------
  693: {
    intuition: 'Check if binary representation alternates 0s and 1s. n XOR (n>>1) should be all 1s (2^k - 1 for some k).',
    algorithm: [
      'Compute m = n XOR (n >> 1).',
      'Check if m is of form 2^k - 1 (all 1s in binary): (m & (m+1)) == 0.',
    ],
    example: { input: 'n=5 (101)', steps: ['5 XOR 2 = 7 (111).', '7 & 8 = 0 ?.'], output: 'true' },
    pitfalls: ['This works because alternating bits XOR with their neighbor (shift right) produces all 1s.'],
  },

  // --- 696. Count Binary Substrings --------------------------------------------
  696: {
    intuition: 'Count substrings with equal consecutive 0s and 1s. Group consecutive same characters. For adjacent groups of sizes a and b, min(a,b) valid substrings.',
    algorithm: [
      'Group characters into run-length encoding (consecutive same chars).',
      'For each pair of adjacent groups with sizes a and b: add min(a,b) to answer.',
    ],
    example: { input: '"00110011"', steps: ['Groups: [2,2,2,2]. Adjacent pairs: min(2,2)=2 each. Total=6.'], output: '6' },
    pitfalls: ['Only need to track previous group size, not all groups.'],
  },

  // --- 700. Search in a Binary Search Tree -------------------------------------
  700: {
    intuition: 'BST property: if val < node.val, go left; if val > node.val, go right; if equal, found.',
    algorithm: [
      'While node != null: if val==node.val return node. If val<node.val, node=node.left. Else node=node.right.',
      'Return null if not found.',
    ],
    pitfalls: ['Simple BST search � O(h) time. For balanced BST, O(log n).'],
  },

  // --- 703. Kth Largest Element in a Stream ------------------------------------
  703: {
    intuition: 'Maintain a min-heap of size k. The kth largest is always the heap minimum.',
    algorithm: [
      'Constructor: add all initial elements, keeping heap size = k.',
      'Add(val): push val. If heap size > k, pop minimum. Return heap top.',
    ],
    pitfalls: ['Initialize by adding all elements and trimming to k, not just inserting first k.'],
  },

  // --- 706. Design HashMap -----------------------------------------------------
  706: {
    intuition: 'Array of buckets with chaining. Use modulo hashing. Each bucket is a list of (key,value) pairs.',
    algorithm: [
      'SIZE=1000 buckets. Hash = key % SIZE.',
      'put(k,v): find bucket, search for key; update if found, append if not.',
      'get(k): find bucket, search for key.',
      'remove(k): find bucket, remove matching entry.',
    ],
    pitfalls: ['Avoid using Java\'s built-in HashMap � implement from scratch. Use LinkedList or ArrayList per bucket.'],
  },

  // --- 707. Design Linked List -------------------------------------------------
  707: {
    intuition: 'Implement singly or doubly linked list with a dummy head for easier insertions/deletions.',
    algorithm: [
      'Maintain dummy head node and size.',
      'get(index): traverse from head to index.',
      'addAtHead/addAtTail: special cases of addAtIndex.',
      'addAtIndex(i,val): traverse to node before i, insert.',
      'deleteAtIndex(i): traverse to node before i, skip the target.',
    ],
    pitfalls: ['Always validate index bounds. Doubly linked list makes deleteAtIndex and addAtTail O(1) with tail pointer.'],
  },

  // --- 709. To Lower Case ------------------------------------------------------
  709: {
    intuition:
      'Convert every uppercase letter in the string to lowercase and leave all other characters unchanged. ASCII uppercase A–Z are codes 65–90; lowercase a–z are 97–122 — the offset is 32. In interviews you can mention `ToLowerCase()` in C# or implement the manual loop to show you understand character codes.',
    algorithm: [
      'Allocate a result builder (or char array) the same length as the input.',
      'For each character c: if c is between \'A\' and \'Z\', append (char)(c + 32).',
      'Otherwise append c unchanged (digits, symbols, already-lowercase letters).',
      'Return the built string.',
    ],
    example: {
      input: 's = "Hello"',
      steps: [
        'H is uppercase → h (72 + 32 = 104).',
        'e, l, l, o are already lowercase → unchanged.',
      ],
      output: '"hello"',
    },
    pitfalls: [
      'Do not subtract 32 — that would upper-case lowercase letters incorrectly.',
      'Non-letters must pass through unchanged (spaces, punctuation, digits).',
      'Unicode letters outside ASCII need culture-aware APIs; this problem assumes ASCII.',
    ],
  },

  // --- 712. Minimum ASCII Delete Sum for Two Strings ---------------------------
  712: {
    intuition: 'DP similar to LCS but minimizing deleted ASCII sum. dp[i][j] = min delete cost to make s1[0..i] == s2[0..j].',
    algorithm: [
      'dp[0][0]=0. dp[i][0]=dp[i-1][0]+s1[i-1] (delete s1 chars). dp[0][j]=dp[0][j-1]+s2[j-1].',
      'If s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1].',
      'Else: dp[i][j]=min(dp[i-1][j]+s1[i-1], dp[i][j-1]+s2[j-1]).',
    ],
    pitfalls: ['Unlike LCS (maximize), here we minimize deletion cost. ASCII value is used, not count 1.'],
  },

  // --- 725. Split Linked List in Parts -----------------------------------------
  725: {
    intuition: 'Divide linked list of length n into k parts as evenly as possible. First (n%k) parts get one extra node.',
    algorithm: [
      'Count length n. base = n/k, extra = n%k.',
      'For each part i: size = base + (i < extra ? 1 : 0). Extract that many nodes, break the link.',
    ],
    pitfalls: ['Store the next node before breaking the link. Handle n < k (some parts will be null).'],
  },

  // --- 726. Number of Atoms ----------------------------------------------------
  726: {
    intuition: 'Parse chemical formula recursively. Use a stack to handle nested parentheses. Each (...) multiplied by following number.',
    algorithm: [
      'Use stack of Maps. Push new map on \'(\'. On \')\': pop map, multiply counts by following number, merge into top of stack.',
      'On element: parse name and count, add to current top map.',
      'Sort resulting map and format output.',
    ],
    pitfalls: ['Element names start with uppercase, followed by lowercase letters. Numbers default to 1 if absent.'],
  },

  // --- 729. My Calendar I ------------------------------------------------------
  729: {
    intuition: 'Maintain a sorted list of booked intervals. On book(s,e), check for overlap with neighbors.',
    algorithm: [
      'Use TreeMap with start?end entries.',
      'Find floorKey(start) ? check if that booking\'s end > start (overlap).',
      'Find ceilingKey(start) ? check if that booking\'s start < end (overlap).',
      'If no overlap, insert.',
    ],
    pitfalls: ['Check both floor (booking that starts before) and ceiling (booking that starts after) for overlaps.'],
  },

  // --- 731. My Calendar II -----------------------------------------------------
  731: {
    intuition: 'Allow double booking but not triple. Track single and double bookings as sorted interval lists.',
    algorithm: [
      'Maintain list of double-booked and single-booked intervals.',
      'On book(s,e): check if new interval overlaps with any double-booked interval ? reject.',
      'Add overlaps of new interval with single-booked intervals to double-booked.',
      'Add new interval to single-booked.',
    ],
    pitfalls: ['Order matters: check double first. Overlap = max(s1,s2) < min(e1,e2).'],
  },

  // --- 744. Find Smallest Letter Greater Than Target ---------------------------
  744: {
    intuition: 'Binary search for the smallest letter in the (circular) sorted array that is strictly greater than target.',
    algorithm: [
      'Binary search: find first letter > target.',
      'If no such letter exists, wrap around and return letters[0].',
    ],
    pitfalls: ['Wraparound: if all letters = target, return letters[0] (circular).'],
  },

  // --- 752. Open the Lock ------------------------------------------------------
  752: {
    intuition: 'BFS on the state space of 4-digit combinations. Each state has 8 neighbors (turn each of 4 wheels �1). Find shortest path from "0000" to target.',
    algorithm: [
      'Add deadends to visited set.',
      'BFS from "0000": generate 8 neighbors (wheel�1 mod 10).',
      'Skip visited and deadends.',
      'Return steps when target is reached.',
    ],
    example: { input: 'deadends=["0201","0101","0102","1212","2002"], target="0202"', steps: ['BFS explores states, avoiding deadends, finds shortest path.'], output: '6' },
    pitfalls: ['If "0000" is in deadends, return -1 immediately. Use bidirectional BFS for speed.'],
  },

  // --- 763. Partition Labels ---------------------------------------------------
  763: {
    intuition: 'Each character can only appear in one partition. Greedy: extend the current partition\'s end to the last occurrence of each character seen.',
    algorithm: [
      'Precompute last occurrence of each character.',
      'Scan left to right: track current partition end = max of last occurrences of chars seen.',
      'When i == current end, finalize partition.',
    ],
    example: { input: '"ababcbacadefegdehijhklij"', steps: ['a last=8, b last=5, c last=7 ? first partition ends at 8.', 'd last=14, e last=15 ? second partition ends at 15.', 'Third partition is rest.'], output: '[9,7,8]' },
    pitfalls: ['One pass suffices: track end = max(end, last[c]) as you scan.'],
  },

  // --- 769. Max Chunks To Make Sorted ------------------------------------------
  769: {
    intuition: 'The array is a permutation of 0..n-1. We can cut after index i if max(arr[0..i]) == i, meaning all elements up to i are in their correct range.',
    algorithm: [
      'Track running maximum.',
      'At each index i: if max == i, we can make a cut here, increment chunk count.',
      'Return chunk count.',
    ],
    example: { input: '[1,0,2,3,4]', steps: ['i=0: max=1?0. i=1: max=1=1 ? chunk. i=2: max=2=2 ? chunk. i=3,4 ? chunks. Total=4.'], output: '4' },
    pitfalls: ['Only works for permutation of 0..n-1 (no duplicates). Different approach needed for 769 vs 768.'],
  },

  // --- 778. Swim in Rising Water -----------------------------------------------
  778: {
    intuition: 'Find path from (0,0) to (n-1,n-1) minimizing the maximum elevation encountered. Use modified Dijkstra with min-heap, or binary search + BFS.',
    algorithm: [
      'Min-heap with (elevation, row, col). Start with (grid[0][0], 0, 0).',
      'Pop minimum elevation node. If reached destination, return current time.',
      'Push unvisited neighbors; time for each = max(current_time, grid[r][c]).',
    ],
    pitfalls: ['Track maximum elevation along the path (not sum). Use modified Dijkstra where distance is max, not sum.'],
  },

  // --- 781. Rabbits in Forest --------------------------------------------------
  781: {
    intuition: 'Rabbit says "x others have my color" ? group of x+1 same-colored rabbits. Greedily pack rabbits into groups of size x+1.',
    algorithm: [
      'Frequency count: freq[x] = how many rabbits said x.',
      'For each x: groups = ceil(freq[x] / (x+1)). Add groups*(x+1) to answer.',
    ],
    example: { input: '[1,1,2]', steps: ['x=1: freq=2, groups=ceil(2/2)=1 ? 2 rabbits. x=2: freq=1, groups=ceil(1/3)=1 ? 3 rabbits. Total=5.'], output: '5' },
    pitfalls: ['Use ceiling division: (freq[x] + x) / (x+1).'],
  },

  // --- 784. Letter Case Permutation --------------------------------------------
  784: {
    intuition:
      'Each letter can be lower or upper case; digits stay fixed. Backtracking explores both branches for every letter position. At the end of the string, append the built combination to the answer list.',
    algorithm: [
      'DFS from index 0 with a mutable char array (or StringBuilder).',
      'If current char is a digit, append as-is and recurse to index + 1.',
      'If current char is a letter, recurse once with lowercase and once with uppercase (toggle with XOR 32 or ToLower/ToUpper).',
      'When index == length, add the current string to results.',
    ],
    example: {
      input: 's = "a1b2"',
      steps: [
        'Branch a → A; digit 1 fixed; branch b → B; digit 2 fixed.',
        'Four combinations: a1b2, a1B2, A1b2, A1B2.',
      ],
      output: '["a1b2","a1B2","A1b2","A1B2"]',
    },
    pitfalls: [
      'Do not branch on digits — only letters double the search tree.',
      'Total combinations up to 2^(number of letters) — fine for small inputs.',
      'Copy the char array when branching if using shared mutable state.',
    ],
  },

  // --- 788. Rotated Digits -----------------------------------------------------
  788: {
    intuition:
      'A rotated digit is valid only for 0, 1, 2, 5, 6, 8, 9 (3, 4, 7 break when flipped upside-down). A "good" number must use only valid digits and contain at least one of 2, 5, 6, or 9 so that rotating 180° produces a different number — all 0/1/8 digits would look the same.',
    algorithm: [
      'Loop n from 1 to N inclusive.',
      'For each n, scan digits: reject if any digit is 3, 4, or 7.',
      'Track whether any digit is 2, 5, 6, or 9 (forces rotation to differ).',
      'If both checks pass, increment the count.',
      'Return total count.',
    ],
    example: {
      input: 'N = 10',
      steps: [
        '1, 2, 5, 6, 9 are good among 1..10 (2→5, 5→2, 6→9, 9→6 when rotated).',
        '0 is invalid as a positive integer in the range; 3, 4, 7 have bad digits.',
      ],
      output: '4',
    },
    pitfalls: [
      'Digits 3, 4, 7 invalidate the entire number.',
      'A number made only of 0, 1, 8 rotates to itself — exclude unless a 2/5/6/9 appears.',
      'Leading zeros do not appear in the integer range 1..N.',
    ],
  },

  // --- 796. Rotate String ------------------------------------------------------
  796: {
    intuition:
      'String rotation means shifting characters cyclically — e.g. "abcde" rotated by 2 is "cdeab". Key insight: every rotation of B appears as a contiguous substring inside B+B, so A is a rotation of B iff lengths match and A occurs in B+B.',
    algorithm: [
      'If A.Length != B.Length, return false immediately.',
      'Concatenate B + B into one string.',
      'Return whether that concatenation contains A as a substring (IndexOf / KMP).',
    ],
    example: {
      input: 's = "rotation", goal = "tionrota"',
      steps: [
        'Lengths both 8 — OK.',
        'goal + goal contains "rotation" as substring starting at index 3.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Always check equal lengths first — avoids false positives on different sizes.',
      'Empty strings: two empty strings are rotations of each other.',
      'IndexOf is O(n²) worst case; KMP is O(n) if interviewer asks for optimization.',
    ],
  },

  // --- 799. Champagne Tower ----------------------------------------------------
  799: {
    intuition: 'Simulate champagne flow: excess liquid from cup (r,c) splits equally to (r+1,c) and (r+1,c+1). Track amount in each cup; amount in any cup is capped at 1 when queried.',
    algorithm: [
      'dp[r][c] = amount poured into cup.',
      'For each row r, for each cup c: overflow = max(0, dp[r][c]-1). dp[r+1][c] += overflow/2; dp[r+1][c+1] += overflow/2.',
      'Return min(1, dp[query_row][query_glass]).',
    ],
    pitfalls: ['Cups overflow when > 1, not >= 1. Return min(1, amount) for partial fill.'],
  },

  // --- 802. Find Eventual Safe States ------------------------------------------
  802: {
    intuition: 'A node is safe if it\'s not part of a cycle and can\'t reach a cycle. Use DFS with states: unvisited, in-progress, safe, unsafe.',
    algorithm: [
      'For each unvisited node, DFS to detect cycles.',
      'Mark node as in-progress. Recurse on neighbors. If any neighbor is in-progress ? cycle ? unsafe.',
      'After all neighbors processed without cycle: mark safe.',
      'Return all safe nodes sorted.',
    ],
    pitfalls: ['Memoize: once a node is marked safe/unsafe, don\'t re-visit. Terminal nodes (out-degree 0) are automatically safe.'],
  },

  // --- 807. Max Increase to Keep City Skyline ----------------------------------
  807: {
    intuition: 'Each building can be increased to min(rowMax, colMax) without changing the skyline from either direction.',
    algorithm: [
      'Compute rowMax[i] = max of row i, colMax[j] = max of col j.',
      'For each (i,j): allowed = min(rowMax[i], colMax[j]). Increase = allowed - grid[i][j].',
      'Sum all increases.',
    ],
    pitfalls: ['Limit is the minimum of the two maximums (most restrictive constraint).'],
  },

  // --- 820. Short Encoding of Words --------------------------------------------
  820: {
    intuition: 'Build a trie of reversed words. A word needs its own entry only if it\'s not a suffix of another word. Count total characters for words that are trie leaves.',
    algorithm: [
      'Build suffix trie (insert reversed words).',
      'Leaves of the trie are words not suffixed by others.',
      'Sum up length+1 for each leaf.',
      'Alternative: put all words in a set; for each word\'s suffix, if it\'s also in set, remove it.',
    ],
    pitfalls: ['Two words sharing a suffix share a trie path. Only leaves contribute to the encoded length.'],
  },

  // --- 821. Shortest Distance to a Character -----------------------------------
  821: {
    intuition: 'Two-pass: first scan left-to-right tracking last seen c position; then right-to-left. Take minimum.',
    algorithm: [
      'Pass 1 (L?R): for each i, distance[i] = i - last_c_position (8 if not seen yet).',
      'Pass 2 (R?L): for each i from right, distance[i] = min(distance[i], next_c_position - i).',
    ],
    pitfalls: ['Initialize last_c_position as -infinity (or a very negative number) in pass 1 to handle positions before the first c.'],
  },

  // --- 825. Friends Of Appropriate Ages ----------------------------------------
  825: {
    intuition: 'For a person A to friend B: age[B] = 0.5*age[A]+7 must be false, age[B] > age[A] must be false, age[B] > 100 and age[A] < 100 must be false. Count valid pairs.',
    algorithm: [
      'Sort ages. For each pair (A,B) with A!=B, check the 3 conditions.',
      'Or: use frequency count by age (1-120). For each age pair (a,b), count[a]*count[b] pairs (minus if a==b, subtract count[a] for self-friending).',
    ],
    pitfalls: ['The condition simplifies to: age[B] > 0.5*age[A]+7 AND age[B] = age[A]. Persons don\'t friend themselves.'],
  },

  // --- 832. Flipping an Image --------------------------------------------------
  832: {
    intuition: 'Reverse each row then flip each bit. Optimize: process two pointers from ends; if they\'re the same, flip both; if different, no-op (they\'re already flipped-inverted).',
    algorithm: [
      'For each row, use two pointers l and r. While l <= r: if A[l]==A[r], flip both (XOR with 1). If different, leave as-is (reverse+invert cancel out).',
    ],
    example: { input: '[[1,1,0],[1,0,1],[0,0,0]]', steps: ['Row 0: [0,0,1]. Row 1: [0,1,0]. Row 2: [1,1,1].'], output: '[[0,0,1],[0,1,0],[1,1,1]]' },
    pitfalls: ['The combined reverse-then-flip can be done in one pass. If outer pair equal, they become (1-val, 1-val). If different, they become (1,0) from (0,1) or (0,1) from (1,0) � unchanged.'],
  },

  // --- 838. Push Dominoes ------------------------------------------------------
  838: {
    intuition: 'Simulate forces: propagate R forces rightward and L forces leftward. Each position gets (rightForce, leftForce); compare to determine final state.',
    algorithm: [
      'Compute forces[i] from left: R pushes positive force rightward, L resets to 0, L itself gets -INF.',
      'Compute from right: L pushes negative force leftward.',
      'Combine: if forces[i]>0 ? R, <0 ? L, ==0 ? \'.\' (or if R+L, they cancel).',
    ],
    pitfalls: ['Forces decay: each step away from the domino, force decreases by 1. Or use two-pass approach treating forces as distances.'],
  },

  // --- 856. Score of Parentheses -----------------------------------------------
  856: {
    intuition: 'Use a stack to track running scores. \'(\' pushes 0 (new context). \')\' pops: if top was 0, contribute 1; else double the popped value. Add to new top.',
    algorithm: [
      'Initialize stack with [0].',
      'For \'(\': push 0.',
      'For \')\': v = pop(). top += v == 0 ? 1 : 2*v.',
      'Return stack[0].',
    ],
    example: { input: '"(()(()))"', steps: ['Push(0)(0)?pop 0?top+=1?[0,1]. Push(0)?pop 0?top+=1?[0,2]. Pop 2?top+=4?[4].'], output: '6' },
    pitfalls: ['Empty pairs "()" score 1. Non-empty "(X)" score 2*score(X). The stack approach handles arbitrary nesting.'],
  },

  // --- 860. Lemonade Change ----------------------------------------------------
  860: {
    intuition: 'Greedy: maintain counts of $5 and $10 bills. When customer pays $10, give $5 change. When customer pays $20, prefer $10+$5 over three $5s.',
    algorithm: [
      'Count five and ten dollar bills.',
      '$5 ? five++.',
      '$10 ? if five==0 return false; five--, ten++.',
      '$20 ? if ten>0 and five>0: ten--, five--; else if five>=3: five-=3; else return false.',
    ],
    pitfalls: ['For $20, prefer using $10+$5 change over three $5 bills to preserve $5 for future $10 customers.'],
  },

  // --- 862. Shortest Subarray with Sum at Least K ------------------------------
  862: {
    intuition: 'Prefix sums + monotone deque. For each index j, find the largest i < j where prefix[j]-prefix[i] >= k and j-i is minimized.',
    algorithm: [
      'Compute prefix sums.',
      'Use monotone increasing deque of indices.',
      'For each j: while deque front satisfies prefix[j]-prefix[front] >= k: update answer with j-front, pop front.',
      'While deque back has prefix[back] >= prefix[j]: pop back (useless). Push j.',
    ],
    pitfalls: ['Unlike sliding window, values can be negative so two-pointer doesn\'t work. The deque maintains increasing prefix sums.'],
  },

  865: {
    intuition: 'Find the LCA of all deepest nodes. DFS returns (depth, subtree_root). If left and right depths match, LCA is current node. Otherwise return side with greater depth.',
    algorithm: [
      'DFS returns (depth, lca_node).',
      'If left.depth == right.depth: return (left.depth+1, current_node).',
      'If left.depth > right.depth: return (left.depth+1, left.lca).',
      'Else: return (right.depth+1, right.lca).',
    ],
    pitfalls: ['This is equivalent to finding LCA of all nodes at maximum depth.'],
  },

  866: {
    intuition: 'All even-digit palindromes (except 11) are divisible by 11 and thus not prime. Search only odd-length palindromes.',
    algorithm: [
      'For each odd length from 1,3,5,...: generate all palindromes of that length.',
      'For each palindrome >= N: check if prime. If prime, return it.',
    ],
    pitfalls: ['Even-digit palindromes except 11 are never prime. Skip even lengths.'],
  },

  868: {
    intuition: 'Find maximum distance between consecutive set bits in binary representation.',
    algorithm: [
      'Track position of previous set bit.',
      'Iterate through bits: when set bit found, update max gap with current_pos - prev_pos. Set prev_pos = current_pos.',
    ],
    example: { input: 'n=22 (10110)', steps: ['Set bits at positions 1,2,4. Gaps: 1,2. Max=2.'], output: '2' },
    pitfalls: ['If only one set bit, return 0.'],
  },

  869: {
    intuition: 'Check if any permutation of digits of n forms a power of 2. Compare sorted-digit form of n with sorted-digit forms of all powers of 2 up to 10^9.',
    algorithm: [
      'Compute digit frequency of n.',
      'For each power of 2 (1,2,4,...,2^29): compare digit frequencies.',
      'Return true if any match.',
    ],
    pitfalls: ['Compare digit counts not values. Leading zeros are invalid but not a concern since powers of 2 never start with 0.'],
  },

  873: {
    intuition: 'DP: dp[j][i] = length of longest Fibonacci subsequence ending with A[j],A[i]. For each pair (j,i), look up if A[i]-A[j] exists earlier.',
    algorithm: [
      'Build index map: value to index.',
      'For each pair i>j: if A[i]-A[j] exists at index k < j: dp[i][j] = dp[j][k]+1 (or 3 if base).',
      'Return max(dp) if >= 3 else 0.',
    ],
    pitfalls: ['Minimum valid Fibonacci length is 3. Return 0 if max dp value is less than 3.'],
  },

  874: {
    intuition: 'Simulate robot movement on infinite grid. HashSet for obstacles. Track direction with enum/array. Track max squared distance from origin.',
    algorithm: [
      'Encode obstacles as hashable pairs.',
      'Directions: N,E,S,W. -2: turn right (dir=(dir+1)%4). -1: turn left (dir=(dir+3)%4).',
      'For moves: step one at a time, stop if next cell is obstacle.',
    ],
    pitfalls: ['Track maximum distance, not final distance. Step one cell at a time to detect obstacles properly.'],
  },

  878: {
    intuition: 'Binary search on value. Count of magical numbers <= x is floor(x/a)+floor(x/b)-floor(x/lcm(a,b)). Find nth magical number.',
    algorithm: [
      'lcm = a*b/gcd(a,b). lo=1, hi=n*min(a,b).',
      'Binary search: find smallest x where count(x) >= n.',
      'Return x % (10^9+7).',
    ],
    pitfalls: ['Binary search upper bound is n*min(a,b). Return result mod 10^9+7.'],
  },

  880: {
    intuition: 'Work backward from total length. When k lands in a repeated block, use modulo. Track lengths without materializing the string.',
    algorithm: [
      'Compute length at each step (capped to avoid overflow).',
      'Walk backward: if char is digit d, k = ((k-1) % size_before) + 1. If char is letter and k == current size: return that letter.',
    ],
    pitfalls: ['String can be astronomically large. Only track lengths. Use modulo to reduce k.'],
  },

  884: {
    intuition:
      'A word is uncommon if it appears exactly once across both sentences combined. Concatenate both strings, count global frequencies, and return every word whose count equals one. Words appearing in both sentences twice still fail the uniqueness test.',
    algorithm: [
      'Split sentence A and B on spaces into word lists.',
      'Combine into one list (or count both in one pass).',
      'Build frequency map word -> count.',
      'Collect all keys where count == 1.',
      'Return as string array (order typically does not matter).',
    ],
    example: {
      input: 's = "s apple is apple", t = "s orange is orange"',
      steps: [
        'Counts: s=1, apple=2, is=2, orange=2 — only "s" has count 1.',
      ],
      output: '["s"]',
    },
    pitfalls: [
      'Count globally across both sentences — not per-sentence uniqueness.',
      'Punctuation is absent in problem constraints; split on whitespace only.',
      'Words with count 0 never appear; only count == 1 qualifies.',
    ],
  },

  885: {
    intuition: 'Simulate spiral traversal: move right 1, down 1, left 2, up 2, right 3... Pattern increases every 2 turns. Add only valid grid cells.',
    algorithm: [
      'Directions: E,S,W,N. Step sizes: 1,1,2,2,3,3,4,4,...',
      'Move in current direction, add valid cells. Change direction, repeat.',
    ],
    pitfalls: ['Continue even when outside grid. Only add cells that are within bounds.'],
  },

  889: {
    intuition: 'Root is preorder[0]. Left subtree root is preorder[1]. Find it in postorder to determine left subtree size. Recurse.',
    algorithm: [
      'Root = preorder[0]. If length 1, return root.',
      'Left root = preorder[1]. Find in postorder, size = its index + 1.',
      'Recurse on left and right portions.',
    ],
    pitfalls: ['Result not necessarily unique - any valid tree accepted when split is ambiguous.'],
  },

  892: {
    intuition: 'Each stack of h cubes: top and bottom faces plus 4 sides minus shared internal faces. Adjacent stacks reduce area by 2*min(h1,h2).',
    algorithm: [
      'For each cell with h>0: add 2 + 4*h.',
      'For each adjacent cell pair: subtract 2*min(h1,h2).',
    ],
    pitfalls: ['Count both top and bottom (2), plus 4*h sides, minus internal vertically stacked faces already handled by 4h+2 formula.'],
  },

  898: {
    intuition: 'Maintain set of all OR values of subarrays ending at current position. Size bounded by 32 (bits can only be set, not cleared). Union all sets for answer.',
    algorithm: [
      'cur = empty set.',
      'For each A[i]: new_cur = {x|A[i] for x in cur} union {A[i]}.',
      'Add new_cur elements to result set.',
      'Return result set size.',
    ],
    pitfalls: ['Set size is O(32) per position since ORs are monotonically non-decreasing.'],
  },

  902: {
    intuition: 'Digit DP: count numbers up to N using only digits in D. Count by length then by digit-by-digit with tight constraint.',
    algorithm: [
      'For lengths < len(N): each position has |D| choices. Sum |D|^1 + ... + |D|^(len-1).',
      'For same length: iterate digit by digit, count choices less than current digit of N, multiply by |D|^remaining. If current digit in D, continue tight.',
    ],
    pitfalls: ['Handle tight constraint carefully. No leading zeros issue since D contains only 1-9.'],
  },

  904: {
    intuition: 'Longest subarray with at most 2 distinct values. Sliding window with frequency map.',
    algorithm: [
      'Window [l,r] with frequency map.',
      'Expand r, add fruit type. Shrink l while more than 2 distinct types.',
      'Track max window size.',
    ],
    example: { input: 'fruits=[1,2,1,2,3]', steps: ['[1,2,1,2] size 4. Add 3: shrink to [2,3]. Max=4.'], output: '4' },
    pitfalls: ['Remove from map only when count reaches 0.'],
  },

  905: {
    intuition:
      'Partition the array in-place so all even numbers appear before odd numbers. Two pointers from both ends swap misplaced elements — even values belong on the left, odd on the right. Relative order within evens or odds does not need to be preserved.',
    algorithm: [
      'Set lo = 0, hi = n - 1.',
      'While lo < hi: if A[lo] is even, lo++. Else if A[hi] is odd, hi--. Else swap A[lo] and A[hi], then lo++ and hi--.',
      'Return the modified array.',
    ],
    example: {
      input: 'nums = [3,1,2,4]',
      steps: [
        'Swap 3 and 4 → [4,1,2,3]. lo advances past 4, hi past 3.',
        '1 and 3 are odd/even pair → swap → [4,3,2,1] or similar partition.',
      ],
      output: '[4,2,3,1] (any valid even-before-odd order)',
    },
    pitfalls: [
      'Use modulo 2 to test parity: n % 2 == 0.',
      'O(n) time, O(1) extra space — do not allocate a second array unless allowed.',
      'Stable order is not required by the problem.',
    ],
  },

  908: {
    intuition:
      'Each element may be increased or decreased by at most k. The smallest achievable spread is max(A) - min(A) - 2*k — we can raise the minimum by k and lower the maximum by k. If that value is negative, the answer is 0.',
    algorithm: [
      'Find min and max of the array.',
      'Compute candidate = max - min - 2 * k.',
      'Return max(0, candidate).',
    ],
    example: {
      input: 'nums = [1,3,6], k = 3',
      steps: [
        'max - min = 5. With k = 3, can shrink spread by 6 at most in theory, but bound is 2k = 6.',
        '5 - 6 = -1 → clamp to 0.',
      ],
      output: '0',
    },
    pitfalls: [
      'Result is never negative — use max(0, ...).',
      'Single-element array always yields 0.',
      'k = 0 means no change; return max - min.',
    ],
  },

  909: {
    intuition: 'BFS on positions 1..n^2. Convert position to board coordinates (boustrophedon layout). Minimum dice rolls to reach n^2.',
    algorithm: [
      'BFS from position 1. For each pos: try dice 1-6.',
      'Convert to (row,col): row from bottom, alternating direction per row.',
      'Follow snakes/ladders. Return level when n^2 reached.',
    ],
    pitfalls: ['Row 0 is the bottom row. Even rows from bottom go left-to-right, odd rows right-to-left (or vice versa based on n). Off-by-one is common.'],
  },

  912: {
    intuition:
      'LeetCode expects O(n log n) sorting. Merge sort guarantees O(n log n) worst case and is stable. QuickSort can degrade to O(n²) on sorted or adversarial input unless you randomize pivots — merge sort is the safer interview default here.',
    algorithm: [
      'Define MergeSort(arr, lo, hi): if lo >= hi return.',
      'mid = (lo + hi) / 2. Recurse on [lo, mid] and [mid+1, hi].',
      'Merge the two sorted halves into a temp buffer with two pointers.',
      'Copy merged segment back into arr.',
      'Call MergeSort on full array and return arr.',
    ],
    example: {
      input: 'nums = [5,2,3,1]',
      steps: [
        'Split [5,2|3,1] -> [5|2] and [3|1].',
        'Merge to [2,5] and [1,3], then final merge -> [1,2,3,5].',
      ],
      output: '[1, 2, 3, 5]',
    },
    pitfalls: [
      'Naive Lomuto QuickSort may TLE — prefer merge sort or randomized quicksort.',
      'Merge step needs O(n) auxiliary space per level.',
      'In-place merge sort variants exist but standard top-down merge is clearest.',
    ],
  },

  916: {
    intuition: 'Universal word must contain all characters of every word in B. Precompute max-frequency requirement per character across all B words.',
    algorithm: [
      'maxFreq[c] = max frequency of c over all words in B.',
      'For each word in A: check if its freq >= maxFreq for all chars.',
    ],
    pitfalls: ['Take MAX frequency per char across B words - one word must satisfy all requirements.'],
  },

  917: {
    intuition:
      'Reverse only the letters in the string; keep non-letters (digits, punctuation) in place. Two pointers from both ends swap letter pairs after skipping non-letters inward.',
    algorithm: [
      'Convert string to char array. Set lo = 0, hi = n - 1.',
      'While lo < hi: advance lo past non-letters; advance hi past non-letters.',
      'If lo < hi, swap s[lo] and s[hi]. Increment lo and decrement hi.',
      'Return new string from char array.',
    ],
    example: {
      input: 's = "ab-cd"',
      steps: [
        'Letters at indices 0,1,3,4 are a,b,c,d. Non-letters: hyphen stays at index 2.',
        'Swap a↔d and b↔c around the fixed hyphen → "dc-ba".',
      ],
      output: '"dc-ba"',
    },
    pitfalls: [
      'Re-check lo < hi after skipping — pointers can cross.',
      'Only swap when both positions hold letters.',
      'Strings are immutable in Java — use char[] in place.',
    ],
  },

  921: {
    intuition:
      'Scan left to right maintaining how many unmatched opening parentheses remain. A closing bracket without a matching open must be fixed by inserting an open earlier; leftover opens need closing brackets appended. Minimum additions = unmatched opens + unmatched closes.',
    algorithm: [
      'Initialize open = 0, close = 0.',
      'For each char: if \'(\', open++. If \')\' and open > 0, open-- (match). Else close++ (unmatched close).',
      'Return open + close.',
    ],
    example: {
      input: 's = "())"',
      steps: [
        '\'(\' → open=1. \')\' → open=0. \')\' → close=1 (no open to match).',
        'Need 1 insert for extra close; 0 leftover opens.',
      ],
      output: '1',
    },
    pitfalls: [
      'Greedy: always match a close with the nearest pending open.',
      'Do not count matched pairs toward additions.',
      'Empty string needs 0 additions.',
    ],
  },

  928: {
    intuition: 'For each non-initial node, find which initial nodes exclusively reach it. Removing that initial node saves this node.',
    algorithm: [
      'BFS from each non-initial node through non-initial nodes to find connected initial nodes.',
      'If exactly one initial node reaches this non-initial node, removing it saves it.',
      'Return initial node saving the most non-initial nodes (ties broken by index).',
    ],
    pitfalls: ['Nodes reachable from multiple initial nodes cannot be saved by removing one.'],
  },

  944: {
    intuition:
      'Each column must be non-decreasing top to bottom (lexicographically sorted as strings). If any column has a character above a smaller character in the next row, delete that entire column. Count how many columns fail this check.',
    algorithm: [
      'For each column index j from 0 to max width - 1:',
      'Scan rows i from 0 to n-2: if strs[i][j] > strs[i+1][j], increment delete count and break inner loop.',
      'Return total columns marked for deletion.',
    ],
    example: {
      input: 'strs = ["cba","daf","ghi"]',
      steps: [
        'Column 0: c>d — delete. Column 1: a<a? a<f OK. Column 2: b<i OK.',
        'Only column 0 is unsorted.',
      ],
      output: '1',
    },
    pitfalls: [
      'Delete whole columns, not individual cells.',
      'Rows may differ in length — problem usually pads or uses same width.',
      'O(n * m) scan is sufficient.',
    ],
  },

  947: {
    intuition: 'Stones sharing row or column form connected components. Each component of size k allows k-1 removals.',
    algorithm: [
      'Union-Find: union stones sharing row, union stones sharing column.',
      'Answer = total stones - number of components.',
    ],
    pitfalls: ['Use row index and col index (offset by max_row) as union targets, or directly union stone indices.'],
  },

  951: {
    intuition: 'Two trees are flip-equivalent if one can be made identical to the other by flipping some node children.',
    algorithm: [
      'DFS: base cases (both null, one null, different values).',
      'Return (flipEquiv(l1,l2) && flipEquiv(r1,r2)) || (flipEquiv(l1,r2) && flipEquiv(r1,l2)).',
    ],
    pitfalls: ['Check both direct and flipped child combinations.'],
  },

  955: {
    intuition: 'Greedy: track which rows are already strictly sorted. A column violates only if it breaks an unsettled row.',
    algorithm: [
      'sorted[i] = false initially (row i vs i+1 not yet determined).',
      'For each column: check if any unsettled row i has strs[i][j] > strs[i+1][j]. If yes, delete column. If no, update sorted for rows where strs[i][j] < strs[i+1][j].',
    ],
    pitfalls: ['Only unsettled rows can create violations.'],
  },

  959: {
    intuition: 'Scale grid 3x. Slash characters fill specific cells. Count connected components of 0s.',
    algorithm: [
      '3n x 3n grid. "/" fills (0,2),(1,1),(2,0) in each cell. "\\" fills (0,0),(1,1),(2,2).',
      'BFS/DFS to count connected components of 0 cells.',
    ],
    pitfalls: ['3x scaling simplifies boundary handling significantly.'],
  },

  973: {
    intuition: 'Find k points with smallest Euclidean distance. Max-heap of size k or QuickSelect.',
    algorithm: [
      'Max-heap size k: for each point compute x^2+y^2. Push, pop if size > k.',
      'Remaining points in heap are the k closest.',
    ],
    pitfalls: ['Compare squared distances to avoid sqrt. QuickSelect gives O(n) average.'],
  },

  976: {
    intuition:
      'For three sides to form a triangle, the sum of the two smaller sides must exceed the largest side (triangle inequality). Sort descending so the first triple checked has the largest possible perimeter. The first valid consecutive triple after sorting is optimal.',
    algorithm: [
      'Sort array in descending order.',
      'For i from 0 to n-3: let a = A[i], b = A[i+1], c = A[i+2].',
      'If a < b + c, return a + b + c (largest sides first maximizes sum).',
      'If inequality fails, skip — a is too large relative to b and c; try next i.',
      'Return 0 if no triple satisfies the inequality.',
    ],
    example: {
      input: 'nums = [2,1,2]',
      steps: [
        'Sorted desc: [2,2,1]. Check 2 < 2+1 -> true.',
      ],
      output: '5',
    },
    pitfalls: [
      'Only check consecutive triples after sorting — non-consecutive triples cannot beat the greedy choice.',
      'Use long for sum if values are large (not needed for typical constraints).',
      'Strict inequality: equality (a == b+c) is NOT a valid triangle.',
    ],
  },

  981: {
    intuition: 'For each key, store sorted (timestamp, value) list. Binary search for largest timestamp <= t.',
    algorithm: [
      'Map<key, list of (timestamp, value)>. Set appends (timestamps are strictly increasing).',
      'Get: binary search for largest timestamp <= t. Return empty string if not found.',
    ],
    pitfalls: ['Timestamps guaranteed increasing on set - no sorting needed.'],
  },

  983: {
    intuition: 'DP over days. Non-travel days cost equals previous day. Travel days take minimum of 1-day, 7-day, 30-day pass options.',
    algorithm: [
      'Travel day set. dp[d] = min cost through day d.',
      'Non-travel day: dp[d] = dp[d-1].',
      'Travel day: dp[d] = min(dp[d-1]+cost[0], dp[max(0,d-7)]+cost[1], dp[max(0,d-30)]+cost[2]).',
    ],
    pitfalls: ['Iterate over calendar days (1 to max travel day), not just travel day indices.'],
  },

  995: {
    intuition: 'Greedy left-to-right: when current bit is 0, flip window of size k. Use difference array to track running flip count in O(n).',
    algorithm: [
      'flipCount running total. delta[] difference array.',
      'For each i: flipCount += delta[i]. If (nums[i]+flipCount)%2==0: must flip here. If i+k>n: return -1. Increment flipCount, delta[i+k]--.',
    ],
    pitfalls: ['Difference array makes tracking O(1) per position. Must flip only when current effective bit is 0.'],
  },

  998: {
    intuition: 'Insert val at end of array. Walk right spine: if val > current node, new node becomes root with current node as left child.',
    algorithm: [
      'If root is null or val > root.val: return new TreeNode(val, root, null).',
      'root.right = insertIntoMaxTree(root.right, val). Return root.',
    ],
    pitfalls: ['Only the rightmost spine is affected by appending to end of array.'],
  },

  1000: {
    intuition: 'Interval DP. Only possible if (n-1)%(k-1)==0. dp[i][j] = min cost to merge stones[i..j] into minimum possible piles.',
    algorithm: [
      'If (n-1)%(k-1)!=0: return -1.',
      'For interval length l from k to n: for each i, j=i+l-1:',
      'dp[i][j] = min over m (step k-1): dp[i][m]+dp[m+1][j].',
      'If (j-i)%(k-1)==0: dp[i][j] += prefix[j+1]-prefix[i].',
    ],
    pitfalls: ['Merge only k piles at a time. Interval divisibility check prevents invalid merges.'],
  },

  1006: {
    intuition: 'Simulate clumsy factorial with operations *, /, +, - cycling. Use stack to handle operator precedence.',
    algorithm: [
      'Stack-based evaluation. Current op cycles through *,/,+,- for indices 0,1,2,3,...',
      'For *: multiply top. For /: divide top. For +: push positive. For -: push negative.',
      'Sum the stack.',
    ],
    pitfalls: ['Integer division truncates toward zero in C#. First operation starts with *.'],
  },

  1007: {
    intuition: 'Target value must be A[0] or B[0]. For each candidate, greedily count swaps needed.',
    algorithm: [
      'For each candidate (A[0], B[0]): simulate, count swaps. Return min swaps.',
      'If a position has neither value for a candidate: skip that candidate.',
    ],
    pitfalls: ['Only two candidates to try. Return -1 if neither works.'],
  },

  1009: {
    intuition: 'XOR with a mask of all 1s matching the bit length of n. Complement flips all bits in the representation.',
    algorithm: [
      'If n==0: return 1.',
      'Find bit length: mask = (1 << bitLength) - 1.',
      'Return n XOR mask.',
    ],
    pitfalls: ['n=0 is a special case. Mask size equals number of bits in n.'],
  },

  1011: {
    intuition: 'Binary search on ship capacity. Min = max weight, Max = total weight. Check if capacity allows shipping in D days.',
    algorithm: [
      'lo=max(weights), hi=sum(weights).',
      'Feasibility: greedily pack each day. If days <= D, feasible.',
      'Find minimum feasible capacity.',
    ],
    example: { input: 'weights=[1,2,3,4,5,6,7,8,9,10], D=5', steps: ['lo=10, hi=55. Binary search finds 15.'], output: '15' },
    pitfalls: ['Must ship in order. lo must be at least max(weights) to fit any single package.'],
  },

  1014: {
    intuition: 'Maximize A[i]+A[j]+i-j = (A[i]+i) + (A[j]-j) for i<j. Track max (A[i]+i) scanning left to right.',
    algorithm: [
      'maxLeft = A[0]+0.',
      'For j from 1: ans = max(ans, maxLeft + A[j]-j). Then maxLeft = max(maxLeft, A[j]+j).',
    ],
    pitfalls: ['Update maxLeft AFTER computing answer to maintain i<j constraint.'],
  },

  1015: {
    intuition: 'Use modular arithmetic. Track set of remainders mod K seen so far. If remainder 0 appears in 1*K..n*K substring, we found it.',
    algorithm: [
      'For i from 1 to K: num = num*10+1, if num%K==0 return i. Track seen remainders.',
      'Actually: try 1, 11, 111, ... up to K such numbers. If remainder 0 found, return length.',
      'Return -1 if K is even or divisible by 5 (since 111...1 never divisible).',
    ],
    pitfalls: ['If K is even or multiple of 5: return -1 (111...1 shares no factors with 2 or 5). Otherwise answer exists within K steps by pigeonhole.'],
  },

  1018: {
    intuition: 'Track running binary number mod 5. At each bit: num = (num*2 + bit) % 5.',
    algorithm: [
      'num = 0.',
      'For each bit: num = (num*2 + bit) % 5. Append num==0 to result.',
    ],
    pitfalls: ['Mod at every step prevents overflow.'],
  },

  1022: {
    intuition: 'DFS tracking current binary value. At leaf: add value to sum. Pass accumulated value down.',
    algorithm: [
      'DFS(node, cur): cur = cur*2 + node.val.',
      'If leaf: sum += cur. Else recurse on children.',
    ],
    pitfalls: ['Leaf = both children null. Pass value as parameter.'],
  },

  1028: {
    intuition: 'Parse (depth, value) pairs from string. Stack indexed by depth. Each node attaches to parent at depth-1.',
    algorithm: [
      'Parse: count dashes for depth, parse digits for value.',
      'stack[0..n]: stack[depth] = current node at that depth.',
      'Attach new node as left or right child of stack[depth-1]. Update stack[depth].',
    ],
    pitfalls: ['Leftmost child first. Parent is always at depth-1.'],
  },

  1038: {
    intuition: 'Reverse in-order (right, node, left) accumulates sum from largest to smallest BST value.',
    algorithm: [
      'DFS right first, then visit and add running sum, then left.',
      'node.val += runningSum; runningSum = node.val.',
    ],
    pitfalls: ['Traverse right before left to process larger values first.'],
  },

  1039: {
    intuition: 'Interval DP for polygon triangulation. Fix two vertices, choose middle vertex k to minimize total triangle weight product.',
    algorithm: [
      'dp[i][j] = min cost to triangulate vertices i..j.',
      'dp[i][j] = min over k in (i+1..j-1): dp[i][k]+dp[k][j]+values[i]*values[k]*values[j].',
    ],
    pitfalls: ['Base: intervals of size < 3 cost 0. Build up from smaller intervals.'],
  },

  1052: {
    intuition: 'Base satisfied = sum where grumpy[i]==0. Sliding window of size X for maximum extra customers from grumpy minutes.',
    algorithm: [
      'base = sum(customers[i] where grumpy[i]==0).',
      'Window of size X: extra = sum(customers[i] where grumpy[i]==1) in window.',
      'Return base + max(extra).',
    ],
    pitfalls: ['Only add grumpy-minute customers as extra (non-grumpy already in base).'],
  },

  1061: {
    intuition: 'Union-Find: equivalent characters are in same group. Group representative = lexicographically smallest character.',
    algorithm: [
      'Union-Find on 26 chars. For each pair: union, make smaller char the root.',
      'For each char in baseStr: find root and substitute.',
    ],
    pitfalls: ['Always make smaller character root during union to ensure lex-smallest representative.'],
  },

  1072: {
    intuition: 'Normalize each row: if row[0]==1, flip all bits. Rows with same canonical form can be made all-equal with same column flips.',
    algorithm: [
      'For each row: canonical = row itself if row[0]==0, else bitwise complement.',
      'Count max frequency of any canonical pattern.',
    ],
    pitfalls: ['Two complementary rows can both be made uniform by the same flips.'],
  },

  1079: {
    intuition: 'Count all distinct non-empty sequences using backtracking. Character frequency map to handle duplicates.',
    algorithm: [
      'Count char frequencies.',
      'Backtrack: for each char with freq > 0: use it (freq--), increment count, recurse, restore.',
    ],
    pitfalls: ['Each recursive call represents one valid sequence (non-empty). Count all calls.'],
  },

  1080: {
    intuition: 'Post-order prune: remove nodes whose entire subtree paths sum < limit. After pruning children, check if current node becomes an insufficient leaf.',
    algorithm: [
      'DFS(node, remaining=limit-node.val).',
      'Prune left/right children if they return false (no sufficient path).',
      'If both children null: return node.val >= limit (leaf check).',
      'Return true if at least one child path is sufficient.',
    ],
    pitfalls: ['Prune bottom-up. A node with both children pruned becomes a leaf and must be rechecked.'],
  },

  1081: {
    intuition: 'Same as problem 316 (Remove Duplicate Letters). Greedy stack with last-occurrence tracking.',
    algorithm: [
      'Count last occurrence index of each char.',
      'Stack with seen set. For each char: if seen, skip. While top > c and top appears later: pop unseen. Push c, mark seen.',
    ],
    pitfalls: ['Only pop if character appears again later. Ensures all characters remain represented.'],
  },

  1092: {
    intuition: 'SCS = trace LCS DP table. Characters in LCS appear once; others from their respective strings appear once.',
    algorithm: [
      'Build LCS DP table.',
      'Trace from bottom-right: if equal, take char (from LCS). If from top, take s2 char. If from left, take s1 char.',
      'Reverse result.',
    ],
    pitfalls: ['Trace DP table, not just the LCS string. Append remaining chars from both strings after reaching edge.'],
  },

  1105: {
    intuition: 'DP: dp[i] = minimum height for first i books. For each book i, try extending previous shelf by adding books j..i together.',
    algorithm: [
      'dp[i] = dp[i-1] + books[i-1].height (new shelf).',
      'Walk left: while cumulative width fits shelf: dp[i] = min(dp[i], dp[j-1] + max_height_of_books_j_to_i).',
    ],
    pitfalls: ['Max height increases as we add more books to the current shelf going leftward.'],
  },

  1106: {
    intuition: 'Recursive parser or stack-based. Operators !, &, | applied to comma-separated subexpressions in parentheses.',
    algorithm: [
      'Stack: push chars. On closing paren: collect values until open paren, get operator before it. Apply, push result.',
    ],
    pitfalls: ['! has exactly one operand. & is all-true. | is any-true. Commas are just separators.'],
  },

  1110: {
    intuition: 'Post-order DFS. Deleted nodes add non-null children as forest roots. Original root is a root if not deleted.',
    algorithm: [
      'to_delete set. DFS returns node or null.',
      'Recurse on children. If current node deleted: add non-null children to result. Return null.',
      'If parent is null (root) or parent is deleted: add to result.',
    ],
    pitfalls: ['Handle original root as potential forest root. Post-order ensures children handled before parent.'],
  },

  1123: {
    intuition: 'Find LCA of all deepest leaves. Same as problem 865: DFS returning (depth, lca_of_deepest).',
    algorithm: [
      'DFS returns (max_depth, lca_node).',
      'If left.depth == right.depth: return (depth+1, current).',
      'Return from deeper side.',
    ],
    pitfalls: ['If deepest leaves all in one subtree, LCA is not the root.'],
  },

  1128: {
    intuition:
      'A domino [a,b] is equivalent to [b,a]. Normalize each domino to (min, max) so [2,1] and [1,2] share a key. Count pairs of indices with the same normalized domino using combinations: for frequency f, add f×(f−1)/2.',
    algorithm: [
      'For each domino [a,b]: key = (min(a,b), max(a,b)) or min*10+max when values are 1–9.',
      'Increment frequency map for each key.',
      'For each frequency f: add f * (f - 1) / 2 to the answer.',
      'Return total equivalent pairs.',
    ],
    example: {
      input: 'dominoes = [[1,2],[2,1],[3,4],[5,6]]',
      steps: [
        '[1,2] and [2,1] normalize to (1,2) — one pair.',
        '(3,4) and (5,6) each alone — no pairs.',
      ],
      output: '1',
    },
    pitfalls: [
      'Normalize before counting — order of endpoints does not matter.',
      'Use long for answer if domino count is large.',
      'Key encoding min*10+max works when values ≤ 9.',
    ],
  },

  1140: {
    intuition: 'Game DP. dp[i][m] = max stones current player can get from piles[i..end] with current M. Both play optimally.',
    algorithm: [
      'Suffix sums.',
      'If 2*m >= remaining piles: take all.',
      'Else: dp[i][m] = suffixSum[i] - min over x=1..2m of dp[i+x][max(m,x)].',
    ],
    pitfalls: ['Current player maximizes, so subtract opponent optimal from total suffix sum.'],
  },

  1161: {
    intuition: 'BFS level order traversal. Track sum at each level, return 1-indexed level with maximum sum.',
    algorithm: [
      'BFS with queue. For each level: sum all node values.',
      'Track max sum and its level (1-indexed, return smallest if tied).',
    ],
    pitfalls: ['Level is 1-indexed. Return first level with max sum if there are ties.'],
  },

  1189: {
    intuition:
      'Each "balloon" uses one b, one a, one n, and two each of l and o. Count every letter in text, then see how many complete words you can form. The bottleneck is whichever required letter runs out first — l and o each contribute count/2 because two are needed per word.',
    algorithm: [
      'Count frequency of each lowercase letter in text.',
      'Initialize ans to a large value.',
      'For b, a, n: ans = min(ans, count[letter]).',
      'For o and l: ans = min(ans, count[letter] / 2).',
      'Return ans.',
    ],
    example: {
      input: 'text = "nlaebolko"',
      steps: [
        'Counts: b=1, a=1, l=2, o=2, n=1 (and extras).',
        'b, a, n each allow 1 word.',
        'l: 2/2 = 1, o: 2/2 = 1.',
        'Minimum quota = 1 → one "balloon".',
      ],
      output: '1',
    },
    pitfalls: [
      'l and o need integer division by 2 — two per balloon.',
      'Do not forget n — it is easy to only check b, a, l, o.',
      'Initialize ans with int.MaxValue before taking mins.',
    ],
  },

  1190: {
    intuition: 'Stack-based: on close paren, pop until open paren, reverse, push back. Build result from remaining characters.',
    algorithm: [
      'Stack of chars.',
      'On non-) chars: push.',
      'On ): pop until (, reverse, push back.',
      'Build result from stack.',
    ],
    pitfalls: ['O(n^2) with this approach. O(n) with wormhole technique using precomputed bracket pairs.'],
  },

  1200: {
    intuition:
      'After sorting, the minimum absolute difference between any two elements always occurs between neighbors. Scan adjacent pairs for the minimum diff, then collect every pair achieving that diff.',
    algorithm: [
      'Sort nums ascending.',
      'One pass: track minDiff = min(nums[i+1]-nums[i]).',
      'Second pass: add [nums[i], nums[i+1]] whenever nums[i+1]-nums[i] == minDiff.',
      'Return list of pairs (order as in sorted array).',
    ],
    example: {
      input: 'nums = [4,2,1,3]',
      steps: [
        'Sorted: [1,2,3,4]. Adjacent diffs: 1,1,1.',
        'All adjacent pairs have diff 1.',
      ],
      output: '[[1,2],[2,3],[3,4]]',
    },
    pitfalls: [
      'Sort first — unsorted scan misses global minimum diff.',
      'Only compare adjacent elements after sort.',
      'Include all pairs tied for minimum difference.',
    ],
  },

  1233: {
    intuition: 'A folder is a sub-folder of another if the other folder path + "/" is a prefix of it. Sort paths: a sub-folder always comes right after its parent.',
    algorithm: [
      'Sort paths lexicographically.',
      'Scan: for each path, check if it starts with prev_kept + "/". If yes, skip (sub-folder). Else keep and update prev_kept.',
    ],
    pitfalls: ['Must append "/" when checking prefix to avoid "/a/b" matching "/a/bc".'],
  },

  1248: {
    intuition: 'Count subarrays with exactly k odd numbers. Use "exactly k" = "at most k" - "at most k-1" with sliding window.',
    algorithm: [
      'atMost(k): sliding window counting subarrays with at most k odd numbers.',
      'Answer = atMost(k) - atMost(k-1).',
    ],
    pitfalls: ['Direct sliding window for "exactly k" is tricky. Difference of at-most functions is cleaner.'],
  },

  1261: {
    intuition: 'BFS/DFS the contaminated tree. Each node gets value 2*parent or 2*parent+1. Store all recovered values in a HashSet for O(1) find.',
    algorithm: [
      'DFS from root (value 0): left child = 2*val, right child = 2*val+1.',
      'Add all values to a HashSet.',
      'find(target): return target in set.',
    ],
    pitfalls: ['Root value is 0 in contaminated tree, not 0. Wait - original values are replaced with -1; use BFS to assign correct values.'],
  },

  1262: {
    intuition: 'DP: dp[r] = max sum achievable with sum = r (mod 3). For each num, update remainders.',
    algorithm: [
      'dp[0]=0, dp[1]=dp[2]=-infinity initially.',
      'For each num n with n%3==r: new_dp[r] = dp[r], new_dp[(r+1)%3] = max(dp[(r+1)%3], dp[r]+n) ... actually update all three.',
      'Return dp[0].',
    ],
    pitfalls: ['Use temporary dp array per number to avoid using the same number twice.'],
  },

  1266: {
    intuition: 'Sum Manhattan distances between consecutive points. Time = sum of max(|dx|, |dy|) for Chebyshev distance since diagonal moves cost 1.',
    algorithm: [
      'For each consecutive pair (p1, p2): add max(|p1.x-p2.x|, |p1.y-p2.y|) to total.',
    ],
    pitfalls: ['Movement is 8-directional (can move diagonally). Use Chebyshev distance: max(|dx|,|dy|).'],
  },

  1267: {
    intuition: 'A server communicates if it shares a row or column with another server. Count cells that are 1 and in a row/column with at least one other 1.',
    algorithm: [
      'Count servers per row and per column.',
      'For each server: if row_count[r]>1 or col_count[c]>1, it communicates.',
    ],
    pitfalls: ['Two passes: first count rows/cols, then determine communicating servers.'],
  },

  1277: {
    intuition: 'Count all rectangles of 1s in a binary matrix. For each cell (i,j), compute maximal width of consecutive 1s ending at j in each row. Then use histogram approach.',
    algorithm: [
      'For each row r: compute histogram heights (consecutive 1s ending at each column).',
      'For each column j in row r: count rectangles ending at (r,j) by scanning upward while height is maintained.',
    ],
    pitfalls: ['This is O(m^2 * n). Different from largest rectangle � counts all valid ones.'],
  },

  1287: {
    intuition: 'In a sorted array, the element appearing more than 25% of the time must be among the elements at indices n/4, n/2, 3n/4. Check those candidates.',
    algorithm: [
      'Candidates: arr[n/4], arr[n/2], arr[3n/4].',
      'For each candidate: count occurrences using binary search. If count > n/4, return it.',
    ],
    pitfalls: ['Array is sorted so binary search works. The dominant element must appear at one of those three index positions.'],
  },

  1288: {
    intuition:
      'Interval [a,b] is covered by another if that other starts no later and ends no earlier. After sorting by start ascending and end descending, any interval fully covered by a previous one cannot extend the maximum end — so we only count intervals that push the farthest end forward.',
    algorithm: [
      'Sort intervals: primary key start ascending, secondary key end descending.',
      'Track prevEnd = 0 and answer = 0.',
      'For each [start, end]: if end > prevEnd, this interval is not covered — increment answer and set prevEnd = end.',
      'Return answer.',
    ],
    example: {
      input: 'intervals = [[1,4],[3,6],[2,8]]',
      steps: [
        'After sort: [[1,4],[3,6],[2,8]].',
        '[1,4]: end 4 > 0 → count 1, prevEnd = 4.',
        '[3,6]: end 6 > 4 → count 2, prevEnd = 6.',
        '[2,8]: end 8 > 6 → count 3, prevEnd = 8.',
      ],
      output: '3',
    },
    pitfalls: [
      'Sort by end descending when starts tie — otherwise a shorter interval at the same start can hide a longer covering one.',
      'Use end > prevEnd, not start > prevEnd; coverage is about the right endpoint.',
    ],
  },

  1290: {
    intuition: 'Traverse linked list and compute binary number. Or: process bit by bit keeping running value.',
    algorithm: [
      'Traverse: result = result * 2 + node.val.',
      'Return result.',
    ],
    pitfalls: ['Multiply by 2 (left shift) and add current bit as you traverse.'],
  },

  1295: {
    intuition: 'Count numbers with an even number of digits. Check digit count of each number.',
    algorithm: [
      'For each num: count digits (or check if in range 10-99, 1000-9999, etc.).',
      'Count those with even digit length.',
    ],
    pitfalls: ['Simple digit count. Numbers 10-99 (2 digits), 1000-9999 (4 digits), 100000-999999 (6 digits) have even digits.'],
  },

  1298: {
    intuition: 'BFS from all cells. At each step, can open any box whose key is available. Track which keys you have and which boxes are pending.',
    algorithm: [
      'Start: open all initially available boxes. BFS: when opening a box, add its keys and contained boxes to available sets. If a box is in available boxes and has its key, open it.',
      'Count candies as boxes are opened.',
    ],
    pitfalls: ['Track available boxes (contained in opened boxes or initially given) and available keys separately.'],
  },

  1301: {
    intuition:
      'Paths move only right, down, or diagonally from start to end. Work backward from the bottom-right: each cell inherits the best score reachable from its three forward neighbors, and we count how many ways achieve that best. Blocked cells (X) and the start cell (S) contribute zero digit value.',
    algorithm: [
      'Initialize dp and count at (n−1,n−1): score 0, one path.',
      'Iterate cells (i,j) from bottom-right to top-left.',
      'Skip X and S for score accumulation; for each of three directions, relax dp[i,j] with neighbor score.',
      'On a strictly better neighbor score, replace dp and reset count; on a tie, add counts modulo 1e9+7.',
      'If dp[i,j] is reachable and cell is not E, add board[i][j] digit to dp[i,j].',
      'Return [dp[0,0], count[0,0]].',
    ],
    example: {
      input: 'board = ["E23","2X2","12S"]',
      steps: [
        'From (2,2) backward: only path to E is diagonal chain.',
        'At each step, pick the neighbor direction with maximum accumulated score.',
        'Ties in score add their path counts together.',
      ],
      output: '[7, 1] (max score 7 along one optimal path)',
    },
    pitfalls: [
      'Process from (n−1,n−1) toward (0,0); forward DP from S is harder because max-score paths merge backward.',
      'Modulo applies to count, and digit addition on dp also uses mod in this formulation.',
      'Do not add digit value on E or X cells.',
    ],
  },

  1304: {
    intuition: 'Find two elements with no common factors. Set element at n-1 to n, element at n-2 to n+1 (they differ by 1, so gcd=1). Fill remaining elements to sum to required total.',
    algorithm: [
      'Put n at index n-1, n+1 at index n-2. Remaining sum = unique_sum - n - (n+1). Fill remaining n-2 positions with 1s and adjust.',
      'Actually: construct uniqueNumbers: 1,2,...,n-2 then check. Simpler: use 1,2,...,n-2,?,? where last two are n and n+1.',
    ],
    pitfalls: ['n and n+1 are always coprime (consecutive integers). Must use each 1..n exactly once in the sum constraint.'],
  },

  1305: {
    intuition:
      'In-order traversal of a BST yields sorted values. Traverse both trees to get two sorted arrays, then merge with the standard two-pointer technique — same as merging two sorted lists in merge sort.',
    algorithm: [
      'In-order DFS on root1 into list A; same for root2 into list B.',
      'Initialize pointers i = 0, j = 0 and empty result.',
      'While both pointers in range: append smaller of A[i], B[j] and advance that pointer.',
      'Append remaining elements from whichever list is not exhausted.',
      'Return merged array.',
    ],
    example: {
      input: 'root1 = [2,1,4], root2 = [1,3]',
      steps: [
        'In-order: A = [1,2,4], B = [1,3].',
        'Merge: 1,1,2,3,4.',
      ],
      output: '[1, 1, 2, 3, 4]',
    },
    pitfalls: [
      'Do not use a heap unless asked — two sorted arrays merge in O(m+n).',
      'Iterative in-order avoids stack overflow on skewed trees.',
      'Duplicates are kept — merge does not deduplicate.',
    ],
  },

  1310: {
    intuition: 'XOR has the property: XOR(l,r) = prefix[r] XOR prefix[l-1]. Precompute prefix XOR array for O(1) range queries.',
    algorithm: [
      'prefix[i] = arr[0] XOR ... XOR arr[i].',
      'XOR(l,r) = prefix[r] XOR prefix[l-1] (with prefix[-1]=0).',
    ],
    pitfalls: ['XOR is its own inverse: a XOR a = 0. prefix[r] XOR prefix[l-1] gives the range XOR.'],
  },

  1317: {
    intuition: 'Find two positive integers with no 1s in their binary sum that add to n. If n is odd: use 1 and n-1 (n-1 = ...0 ? check). Actually just find no-one-in-binary numbers.',
    algorithm: [
      'Greedy: find largest number <= n with no 1s in binary (all bits set in pairs: 2,8,32,...). Subtract from n.',
      'Simpler: b = highest set bit as single bit number. a = n - b. If a has no 1 bits adjacent to b, done.',
    ],
    pitfalls: ['A number has no 1s if it only has bits that are isolated (e.g., 2=10, 4=100, 8=1000). Take b as n with only highest bit, a=n-b.'],
  },

  1319: {
    intuition: 'Union-Find or BFS. Count connected components. To fully connect a graph, need (components-1) connections. But each extra edge beyond spanning tree can replace two wire connections, so extra_edges help.',
    algorithm: [
      'Union-Find: process all n-1 edges (cables already exist). Count initial components C and redundant edges R.',
      'Redundant edges can each eliminate one needed connection. Answer = C - 1 - R if >= 0, else -1.',
    ],
    pitfalls: ['If R >= C-1: we have enough redundant edges to fully connect. Else impossible (-1). Minimum = max(0, C-1-R)... wait, each redundant edge can be rewired to connect two components.'],
  },

  1320: {
    intuition: 'DP on intervals. dp[i][j] = min distance to type word[i..j] with one finger on word[i] and another on word[j]. Divide points between two fingers.',
    algorithm: [
      'dp[i][j] = min cost where fingers are at positions of word[i] and word[j] (WLOG i < j).',
      'Transition: move left finger from word[i] or word[j] to word[i-1].',
      'Use memoization.',
    ],
    pitfalls: ['Two-finger optimization. Each step, choose which finger to move to the next character.'],
  },

  1323: {
    intuition: 'Greedily replace 9s from left with +1 when safe. Find leftmost digit where incrementing gives a larger digit and all right digits can become 9.',
    algorithm: [
      'Find rightmost non-9 digit that can be incremented.',
      'Increment it, set all subsequent digits to 9.',
    ],
    pitfalls: ['To maximize: find leftmost digit < 9, increment it, set all digits to its right to 9.'],
  },

  1331: {
    intuition: 'The rank of an element is its position in the sorted unique values. Sort unique values, assign ranks 1,2,3,..., then replace each element.',
    algorithm: [
      'Create sorted unique array. Map value -> rank (1-indexed).',
      'Replace each element with its rank.',
    ],
    pitfalls: ['Duplicate values get the same rank. Rank is based on relative order among unique values.'],
  },

  1334: {
    intuition: 'Find city with fewest neighbors reachable within distance threshold. BFS/Dijkstra from each node, or Floyd-Warshall for all-pairs shortest paths.',
    algorithm: [
      'Floyd-Warshall for all-pairs shortest paths.',
      'For each city: count cities reachable within threshold.',
      'Return city with minimum count (ties: largest index).',
    ],
    pitfalls: ['Return the city with SMALLEST number of neighbors. Break ties by choosing the largest city index.'],
  },

  1339: {
    intuition: 'For each edge removal, the product of two subtree sums. One subtree = subtree sum S, other = total - S. Maximize S * (total - S).',
    algorithm: [
      'Compute total sum. DFS to compute subtree sums.',
      'For each subtree sum S: compute S * (total - S). Track maximum.',
    ],
    pitfalls: ['Answer can be very large � return result modulo 10^9+7. Compute subtree sums in post-order DFS.'],
  },

  1346: {
    intuition: 'Check if any element in the array equals 2 * another element. Use a HashSet.',
    algorithm: [
      'Add all elements to a set.',
      'For each element x: if 2*x in set, return true.',
    ],
    pitfalls: ['Edge case: if x=0, need two 0s in the array (2*0=0). Check count of 0s or handle separately.'],
  },

  1352: {
    intuition: 'Maintain a running product with a pointer. Use a deque or array storing products. getProduct(k) = total_product / product_before_last_k.',
    algorithm: [
      'Store prefix products. When adding: multiply into running product. For getProduct(k): return product of last k = prefix[-1] / prefix[-1-k].',
      'Handle zeros: reset running product on zero.',
    ],
    pitfalls: ['Division by zero when list contains 0. Track index of last zero; if within last k, product is 0.'],
  },

  1353: {
    intuition: 'Greedy: sort events by end day. For each event, attend on the earliest available day within [start, end]. Use a min-heap of end days.',
    algorithm: [
      'Sort by start day. Process day by day (1 to max_day).',
      'At each day d: add all events starting on d to min-heap. Remove expired events (end < d). Attend the event with earliest end day.',
    ],
    pitfalls: ['Can attend at most one event per day. Greedy: always prefer the event ending soonest.'],
  },

  1358: {
    intuition: 'Count substrings containing all three characters a, b, c. Sliding window: for each right pointer, track leftmost valid left. Count = l+1.',
    algorithm: [
      'Window [l,r]. Expand r. Shrink l while window has all three chars.',
      'For each r: number of valid subarrays ending at r = l (since any starting point 0..l-1 with r also works).',
    ],
    pitfalls: ['Count subarrays where minimum of a,b,c counts is >= 1. Answer accumulates l at each step.'],
  },

  1367: {
    intuition: 'DFS the tree. At each node, try to continue the current linked list match or restart from the head of the list.',
    algorithm: [
      'For each tree node: try matching linked list starting from head.',
      'dfs(treeNode, listNode): if listNode==null, return true. If treeNode==null, return false.',
      'If values match: recurse dfs(left,next) || dfs(right,next).',
      'Also try starting fresh: isSubPath(head, treeNode.left) || isSubPath(head, treeNode.right).',
    ],
    pitfalls: ['Must try restarting the list match at each tree node, not just continue existing match.'],
  },

  1368: {
    intuition: 'Dijkstra/0-1 BFS. Moving to an already-pointing neighbor costs 0. Moving against the direction costs 1 (changing sign).',
    algorithm: [
      '0-1 BFS (deque): cost 0 for following existing direction, cost 1 for going against (changing direction).',
      'Find minimum cost to reach (m-1, n-1) from (0,0).',
    ],
    pitfalls: ['Use deque: push front for cost-0 edges, push back for cost-1 edges. Equivalent to Dijkstra but faster for 0-1 weights.'],
  },

  1371: {
    intuition: 'Use bitmask for vowel parity. XOR mask at each position. Longest subarray with same mask = first occurrence of each mask. Use prefix XOR approach.',
    algorithm: [
      '5 vowels ? 5-bit mask. State[i] = XOR mask of vowels seen so far.',
      'If state[i] == state[j]: subarray (i+1)..j has even count of all vowels.',
      'Store first occurrence of each state. Answer = max(i - first[state[i]]).',
    ],
    pitfalls: ['Initialize first[0] = -1 (empty prefix has all even counts). 5 vowels ? 32 possible states.'],
  },

  1380: {
    intuition: 'A lucky number is min in its row and max in its column. Find row minimums and column maximums. Intersection gives lucky numbers.',
    algorithm: [
      'For each row: find minimum value.',
      'For each column: find maximum value.',
      'Lucky numbers are those that are both row-min and column-max.',
    ],
    pitfalls: ['Use sets for row minimums and column maximums. Intersection = lucky numbers.'],
  },

  1381: {
    intuition: 'Custom stack with increment operation on bottom k elements. Use lazy increment array to handle increment in O(1) amortized.',
    algorithm: [
      'Stack + inc[] array. inc[i] = pending increment for elements at positions 0..i.',
      'push: push value. pop: return stack.top + inc[top_index], propagate inc down.',
      'increment(k, val): inc[min(k,size)-1] += val.',
    ],
    pitfalls: ['Lazy propagation: when popping, add inc[i] to value and propagate: inc[i-1] += inc[i], inc[i]=0.'],
  },

  1382: {
    intuition: 'In-order traversal of BST gives sorted array. Build a balanced BST from sorted array (like problem 108).',
    algorithm: [
      'In-order traverse to get sorted array.',
      'Build balanced BST from sorted array: pick middle as root, recurse on halves.',
    ],
    pitfalls: ['Two-step: extract sorted array, then rebuild. Can also be done with DSW algorithm in O(1) space.'],
  },

  1390: {
    intuition: 'Each node value becomes sum of (values of all ancestors that equal the node\'s value). Root gets value 0. DFS with path value sum.',
    algorithm: [
      'Wait: "lucky numbers" - different problem. For Four Divisors: find elements with exactly 4 divisors.',
      'For each element: count divisors up to sqrt. If exactly 4, add sum of divisors.',
    ],
    pitfalls: ['Problem 1390 is actually "Four Divisors". Count divisors efficiently in O(sqrt(n)).'],
  },

  1394: {
    intuition: 'Find the element with exactly k occurrences and minimum value, where k equals that element\'s value.',
    algorithm: [
      'Count frequency of each element.',
      'Find elements where freq[x] == x.',
      'Return the maximum such x (problem says "lucky integer" = element whose value equals its frequency).',
    ],
    pitfalls: ['Return the largest lucky integer, or -1 if none exists. Lucky integer: value == frequency.'],
  },

  1395: {
    intuition: 'Count valid teams of three soldiers (i<j<k) with ratings[i]<ratings[j]<ratings[k] or ratings[i]>ratings[j]>ratings[k].',
    algorithm: [
      'For each middle element j: count elements to its left that are smaller/larger, and elements to its right that are smaller/larger.',
      'Teams = left_smaller * right_larger + left_larger * right_smaller.',
    ],
    pitfalls: ['O(n^2) with nested loops is sufficient for n<=200. For each j, scan left and right.'],
  },

  1399: {
    intuition:
      'For each integer from 1 to n, compute the sum of its decimal digits. Group numbers by digit sum and count group sizes. The answer is how many integers share the most common digit sum (largest group).',
    algorithm: [
      'Create frequency map digitSum -> count, size at most 46 for n <= 10^4.',
      'For num from 1 to n: compute digit sum by repeated mod/div by 10.',
      'Increment freq[digitSum].',
      'Track max frequency while iterating (or scan map at end).',
      'Return the maximum frequency value.',
    ],
    example: {
      input: 'n = 13',
      steps: [
        'Digit sums: 1..9 -> sum equals self; 10->1, 11->2, 12->3, 13->4.',
        'Largest group size is 2 (several sums tie at 2).',
      ],
      output: '2',
    },
    pitfalls: [
      'Return count of members in largest group, not the digit sum itself.',
      'Ties for max group size still return that shared count.',
      'Brute force over 1..n is fine for n <= 10^4.',
    ],
  },

  1400: {
    intuition: 'Check if string can be rearranged into k palindrome groups. Count character frequencies. Characters with odd frequency need one middle slot each. Need at most k odd-frequency characters.',
    algorithm: [
      'Count character frequencies.',
      'Count how many have odd frequency.',
      'Return odd_count <= k <= s.length.',
    ],
    pitfalls: ['Each palindrome string can absorb at most one odd-frequency character as center. Also k must be <= s.length.'],
  },

  1405: {
    intuition: 'Greedily append the most frequent character that isn\'t the same as last two appended. Use a max-heap.',
    algorithm: [
      'Max-heap of (freq, char).',
      'Each step: pop max. If same as last two chars, pop second-max, use it, push max back.',
      'Append character, decrement frequency, push back if freq > 0.',
    ],
    pitfalls: ['Same approach as task scheduler problem. Track the last character added to avoid consecutive triples.'],
  },

  1408: {
    intuition: 'A string is a string matching of another if it appears as a substring. Use string matching or sort by length; shorter strings are substrings of longer ones.',
    algorithm: [
      'For each string s: check if any other string t (s != t) contains s as a substring.',
      'Use contains() or KMP for each pair.',
    ],
    pitfalls: ['O(n^2 * L) is acceptable. Sort by length descending; longest strings cannot be substrings of shorter ones.'],
  },

  1410: {
    intuition: 'Process HTML entities: &amp; &apos; &quot; &gt; &lt; Each appears in encoded string, map back to actual characters.',
    algorithm: [
      'String replace or state machine: scan for &...;. Map known entities to characters.',
      'Only 5 entities to handle.',
    ],
    pitfalls: ['Only the 5 specified entities: &quot; -> ", &apos; -> \', &amp; -> &, &gt; -> >, &lt; -> <. Process left to right.'],
  },

  1411: {
    intuition: 'Count ways to paint n columns with 3 colors such that no two adjacent share the same color. Two types of rows: all-different (e.g. 121) and adjacent-same (e.g. 121 patterns with repeats).',
    algorithm: [
      'Track count of "end with two same" (ABA pattern) and "end with all different" (ABC pattern).',
      'Transitions: same*2 + diff*2 -> same. same*3 + diff*2 -> diff for 3 colors.',
    ],
    pitfalls: ['With 3 colors in 3 columns: patterns are either all-different (6 ways) or end-repeat like ABA (6 ways). Track transitions between these types.'],
  },

  1415: {
    intuition: 'The happy string is made from a,b,c with no two consecutive same characters. Generate them in lexicographic order and return the k-th one.',
    algorithm: [
      'BFS/DFS generating happy strings in lex order. Count k-th.',
      'Or: compute directly - at each position, count how many strings of remaining length start with each valid character.',
    ],
    pitfalls: ['Each position has at most 2 choices (any of a,b,c except last character). Total strings of length n = 3 * 2^(n-1).'],
  },

  1422: {
    intuition: 'Score = zeros in left part + ones in right part. Precompute prefix zeros and suffix ones.',
    algorithm: [
      'For each split position i (0 to n-1): score = zeros_in_s[0..i] + ones_in_s[i+1..n-1].',
      'Precompute suffix ones. Scan left to right counting zeros, compute score at each split.',
    ],
    pitfalls: ['Split divides s into two non-empty parts. Split at i: left is s[0..i], right is s[i+1..n-1].'],
  },

  1432: {
    intuition: 'Use digit DP or greedy: minimize the largest digit while maximizing the smallest by flipping digit d (0-9) to (9-d). Find the flip that maximizes the difference.',
    algorithm: [
      'Try all 10 possible digit substitutions. For max: from left, find first digit not 9, replace all occurrences with 9.',
      'For min: if first digit is not 1, replace all occurrences with 1; else find first non-0,1 digit, replace with 0.',
      'Return max - min over all strategies.',
    ],
    pitfalls: ['You can only substitute one digit value at a time (all occurrences). Maximize and minimize independently.'],
  },

  1437: {
    intuition: 'Check if at most one swap can make all 1s move to the right end. Count 0s before the last 1 - if <= 1, possible.',
    algorithm: [
      'Find last index of 1.',
      'Count 0s in range [0, last_one_index].',
      'Return count <= 1.',
    ],
    pitfalls: ['At most one 0 can appear before the last 1 (one swap can fix one 0 by swapping with the last 1).'],
  },

  1438: {
    intuition: 'Sliding window with a monotone deque tracking min and max. Window is valid when max-min <= limit.',
    algorithm: [
      'Two deques: max-deque (decreasing) and min-deque (increasing).',
      'Expand right. When max-min > limit, shrink left (remove from fronts of deques if index out of window).',
      'Track max window size.',
    ],
    pitfalls: ['Two separate deques for min and max. Shrink window when constraint violated.'],
  },

  1450: {
    intuition:
      'A student is doing homework at queryTime if they started on or before that minute and have not finished yet (end time is still on or after queryTime). Linear scan with two interval checks per student.',
    algorithm: [
      'Initialize count = 0.',
      'For each index i: if startTime[i] <= queryTime && endTime[i] >= queryTime, count++.',
      'Return count.',
    ],
    example: {
      input: 'start = [1,2,3], end = [3,2,7], queryTime = 4',
      steps: [
        'Student 0: 1≤4≤3? end 3 < 4 — no.',
        'Student 2: 3≤4≤7 — yes.',
      ],
      output: '1',
    },
    pitfalls: [
      'Both inequalities are inclusive on start and end.',
      'O(n) scan is fine for constraints.',
      'Do not confuse with overlap of intervals across students.',
    ],
  },

  1455: {
    intuition: 'Find first word in sentence where the prefix is a prefix of that word. Simple string split and check.',
    algorithm: [
      'Split sentence into words.',
      'For each word: check if it starts with the given prefix.',
      'Return 1-indexed position of first match, or -1.',
    ],
    pitfalls: ['1-indexed output. Check StartsWith or substring[0..prefix.length-1] == prefix.'],
  },

  1458: {
    intuition: 'Max dot product of non-empty subsequences. DP: dp[i][j] = max dot product using elements from nums1[0..i] and nums2[0..j].',
    algorithm: [
      'dp[i][j] = max of: nums1[i]*nums2[j], dp[i-1][j-1]+nums1[i]*nums2[j], dp[i-1][j], dp[i][j-1].',
      'Base: dp[0][0] = nums1[0]*nums2[0].',
    ],
    pitfalls: ['At least one pair must be selected. Initialize with -infinity and handle carefully.'],
  },

  1460: {
    intuition: 'Two arrays can be made equal by reversing a subarray if and only if they have the same multiset of elements.',
    algorithm: [
      'Sort both arrays. Compare.',
      'Or: use frequency maps.',
    ],
    pitfalls: ['Reversing a subarray doesn\'t change the multiset. So just compare sorted arrays.'],
  },

  1461: {
    intuition: 'Check if all binary strings of length k appear as substrings. Use a sliding window of size k and a HashSet.',
    algorithm: [
      'Slide window of size k over s. Add each window to a set.',
      'Return set.size() == 2^k.',
    ],
    pitfalls: ['Need exactly 2^k distinct substrings. For large k this is just checking if s is long enough.'],
  },

  1462: {
    intuition: 'Transitive closure: b is a prerequisite of a if there exists a path b->a. Precompute reachability using BFS/DFS from each node.',
    algorithm: [
      'BFS/DFS from each course, mark all reachable courses.',
      'For each query (u,v): check if u is reachable from v.',
    ],
    pitfalls: ['The graph is a DAG. For each query, answer is whether there is a directed path from prerequisites to the course.'],
  },

  1475: {
    intuition: 'For each price, find the nearest smaller price within the next k products. Monotone stack.',
    algorithm: [
      'Monotone stack (decreasing). Process prices left to right.',
      'When processing price[i]: pop stack while stack top > price[i] and top index within i-k range.',
      'final_prices[stack.top] = price[i] (discount). Push i.',
    ],
    pitfalls: ['Stack front elements are candidate discounts. Check that the discount is within k distance.'],
  },

  1482: {
    intuition: 'Binary search on number of days. For d days: count bouquets = sum of floor(consecutive_1s / k). Check if >= m.',
    algorithm: [
      'Binary search [1, max(bloomDay)].',
      'Feasibility(days): iterate bloomDay, count consecutive bloomed flowers, add floor(streak/k) to bouquets.',
      'Return first day where bouquets >= m.',
    ],
    pitfalls: ['When a flower hasn\'t bloomed (bloomDay[i] > days), reset streak to 0.'],
  },

  1493: {
    intuition: 'Sliding window. Window can contain at most one 0. Track last position of 0 seen.',
    algorithm: [
      'Sliding window with at most one zero.',
      'When second zero found: move left pointer to just after the previous zero.',
      'Track max window size.',
    ],
    pitfalls: ['Window contains at most one 0 (which you delete). Max subarray of 1s after one deletion.'],
  },

  1497: {
    intuition: 'If we can arrange pairs summing to k, every element must have a partner. For each element x: need element k-x. Count frequencies and check.',
    algorithm: [
      'If n is odd: return false.',
      'Count frequencies. For each value v: if v+v==k, need even count. Else freq[v] must equal freq[k-v].',
    ],
    pitfalls: ['Handle k/2 case specially (needs even frequency). Also handle 0: need even count if 2*0==k.'],
  },

  1498: {
    intuition: 'Sort array. For each subarray sorted, XOR of all is sum if consecutive... count non-empty subsequences where max-min <= target. Sort, then two pointers.',
    algorithm: [
      'Sort. Two pointers l, r. For each r: find smallest l where arr[r]-arr[l] <= target.',
      'Count = 2^(r-l) subsequences with arr[r] as max.',
      'Sum all counts modulo 10^9+7.',
    ],
    pitfalls: ['Precompute powers of 2. After sorting, min and max of subsequence are its first and last elements.'],
  },

  1503: {
    intuition: 'Simulate race. Last car in position n-1. It can be blocked by slower car ahead. Compute time for each car to reach the end, block means they form a fleet.',
    algorithm: [
      'Process from right to left. Each car moves toward finish. If car catches up to car ahead, they move together (blocked).',
      'Actually: time[i] = (target - position[i]) / speed[i]. Count collisions going right to left.',
    ],
    pitfalls: ['Cars catch up when time_behind < time_ahead. Use simulation or stack-based approach.'],
  },

  1508: {
    intuition: 'Sum of all subarray ranges. Sort. Two-pointer or binary search to count subarrays with sum in [left, right]. Use prefix sums of sorted array.',
    algorithm: [
      'Sort array. Prefix sums.',
      'Count(s) = number of subarrays with sum <= s using two pointers on sorted prefix sums.',
      'Answer = Count(right) - Count(left-1).',
    ],
    pitfalls: ['Subarrays are counted from the sorted array, not the original. Since sorted, each subarray sum = prefix[r]-prefix[l-1].'],
  },

  1509: {
    intuition: 'Minimum difference after at most 3 changes. Sort. We can change 3 smallest to equal largest, or 3 largest to equal smallest, or mix. Check 4 strategies.',
    algorithm: [
      'Sort. Try: remove 3 from left, remove 3 from right, remove 1 left + 2 right, remove 2 left + 1 right.',
      'Answer = min of nums[n-1-j] - nums[i] for (i+j==3, i in 0..3).',
    ],
    pitfalls: ['After sorting and 3 changes, minimum difference = min over 4 strategies of nums[n-1-j] - nums[i].'],
  },

  1514: {
    intuition:
      'Find the path from src to dst with maximum probability product. This is shortest-path with weights inverted — use Dijkstra on negative log probabilities, or a max-heap that always expands the most promising partial path first.',
    algorithm: [
      'Build adjacency list: each edge (u,v,p) adds (v,p) to u and (u,p) to v.',
      'Initialize prob[src] = 1.0, others 0. Max-priority queue by probability.',
      'Pop highest-prob node u. For each neighbor v with edge prob w:',
      'newProb = prob[u] * w. If newProb > prob[v], update prob[v] and push v.',
      'Return prob[dst] when done (or when dst is popped).',
    ],
    example: {
      input: 'n=3, edges=[[0,1,0.5],[1,2,0.5],[0,2,0.2]], src=0, dst=2',
      steps: [
        'Path 0->1->2: 0.5*0.5 = 0.25 beats direct 0->2 at 0.2.',
      ],
      output: '0.25',
    },
    pitfalls: [
      'Multiply probabilities — do not add edge weights like distance Dijkstra.',
      'Use max-heap, not min-heap.',
      'Floating point is fine; compare with epsilon if needed on some platforms.',
    ],
  },

  1523: {
    intuition: 'Count odd numbers in range [low, high]. Formula: ceil((high-low+1)/2) adjusted for parity of low.',
    algorithm: [
      'odd_count(n) = (n+1)/2 (numbers 1..n that are odd).',
      'Count(low, high) = odd_count(high) - odd_count(low-1).',
    ],
    pitfalls: ['Use count of odds up to n formula. Subtract counts.'],
  },

  1524: {
    intuition: 'Count subarrays with odd sum. Track parity of prefix sums. When prefix is odd, pair with previous even prefix sums; when even, pair with odd.',
    algorithm: [
      'even_count=1, odd_count=0. running_sum=0.',
      'For each element: running_sum += element. If odd: result += even_count, odd_count++. Else: result += odd_count, even_count++.',
    ],
    pitfalls: ['Start with even_count=1 for the empty prefix. Odd+even or even+odd sums create odd result.'],
  },

  1526: {
    intuition: 'The broken calculator allows: if X > Y: X-1. If X < Y: X*2. Work backwards from Y to X: if Y is odd, Y+1. If Y is even, Y/2. Count steps.',
    algorithm: [
      'While Y > X: if Y odd, Y++; else Y /= 2. Steps++.',
      'Return steps + (X - Y) for remaining decrements.',
    ],
    pitfalls: ['Work backward from Y. When Y is odd, incrementing (reverse of -1 on target side) brings it to even for halving.'],
  },

  1530: {
    intuition: 'Count pairs of good nodes (distance > k). DFS returning list of depths. Count pairs from different subtrees with sum of depths > k.',
    algorithm: [
      'For each node: collect depths from left and right subtrees. Count pairs (one from each) where d1+d2+2 > k (add 2 for edges to current node).',
      'Return merged depth list incremented by 1.',
    ],
    pitfalls: ['Two-pointer on sorted depth lists to count valid pairs. Distance between nodes in different subtrees = d1+d2+2.'],
  },

  1534: {
    intuition:
      'Count triplets (i, j, k) with i < j < k where all three pairwise differences are within limits a, b, and c. Constraints are small (n <= 100), so checking every triplet is acceptable. All three conditions must hold simultaneously.',
    algorithm: [
      'Initialize count = 0.',
      'Triple loop: for i in 0..n-3, j in i+1..n-2, k in j+1..n-1.',
      'If abs(arr[i]-arr[j]) <= a AND abs(arr[j]-arr[k]) <= b AND abs(arr[i]-arr[k]) <= c: count++.',
      'Return count.',
    ],
    example: {
      input: 'arr = [3,0,1,1,9,7], a=7, b=2, c=3',
      steps: [
        'Valid triplets include (0,2,3) -> |3-1|,|1-1|,|3-1| all within limits.',
      ],
      output: '4',
    },
    pitfalls: [
      'Check all three pairwise gaps — not just adjacent pairs in the triplet.',
      'Indices must be strictly increasing i < j < k.',
      'Brute force O(n^3) is intended for n <= 100.',
    ],
  },

  1545: {
    intuition: 'Binary string generated by flipping 0?"01" and 1?"10" repeatedly. Find k-th character efficiently using recursion without generating the string.',
    algorithm: [
      'After n generations, length = 2^n. Find k-th in step n:',
      'If k <= 2^(n-1): same as k-th in step n-1.',
      'Else: k-th in step n = NOT of (k-2^(n-1))-th in step n-1.',
    ],
    pitfalls: ['Parent-child relationship: child at position k is the complement of parent at position k - half_length. Use recursion/binary lifting.'],
  },

  1552: {
    intuition: 'Binary search on minimum distance. Check if we can place m balls with at least mid distance apart.',
    algorithm: [
      'Sort positions. Binary search [1, (max-min)/(m-1)].',
      'Feasibility: greedily place balls, always as far right as possible while maintaining >= mid distance.',
    ],
    pitfalls: ['Same pattern as aggressive cows. Sort first. Check if m balls fit with minimum gap >= mid.'],
  },

  1574: {
    intuition: 'Find shortest subarray to remove so remaining is non-decreasing. Find longest non-decreasing prefix and suffix. Binary search to merge them.',
    algorithm: [
      'Find longest prefix ending at i (non-decreasing). Find longest suffix starting at j (non-decreasing).',
      'Remove middle part [i+1..j-1] is trivial = suffix start.',
      'For each prefix end i: binary search for smallest j in suffix where suffix[j] >= prefix[i]. Track min(j-i-1).',
    ],
    pitfalls: ['Consider removing only prefix, only suffix, or middle portion. Two-pointer or binary search on sorted suffix.'],
  },

  1579: {
    intuition: 'Maximize edges removed while keeping the graph fully connected. Use two Union-Finds (one per user). Add type 3 edges first (both benefit). Then greedily add type 1 and 2.',
    algorithm: [
      'Process type 3 edges first, union in both UF1 and UF2. Count redundant type 3 edges.',
      'Process type 1 with UF1, type 2 with UF2. Count redundant edges.',
      'If both UFs are fully connected, return total redundant edges. Else -1.',
    ],
    pitfalls: ['Process shared edges first for maximum sharing. Redundant = edge added when both endpoints already connected.'],
  },

  1590: {
    intuition: 'Find shortest subarray to remove to make sum divisible by p. Use prefix sums and modular arithmetic. Track last seen index for each prefix mod.',
    algorithm: [
      'Need = total_sum % p. If need == 0: return 0.',
      'Prefix sums mod p. For each right index r: find leftmost l where (prefix[r]-prefix[l])%p == need. Answer = r-l.',
      'Map: mod -> last index.',
    ],
    pitfalls: ['Target subarray sum mod p == need. Use map of prefix_mod to index. Minimize r-l > 0.'],
  },

  1593: {
    intuition: 'Backtracking: try all ways to split the string into k unique substrings. Track used substrings in a set. Maximize k.',
    algorithm: [
      'DFS: at each position, try all prefix lengths. If prefix not in used set, add to used, recurse, remove.',
      'Return maximum splits found.',
    ],
    pitfalls: ['Pruning: if remaining characters < remaining needed splits, prune. Use backtracking with pruning.'],
  },

  1598: {
    intuition: 'Count operations on a file system. Only valid operations increment the counter: mkdir creates a new folder, rmdir removes empty folder. Others (cd, ls) don\'t count.',
    algorithm: [
      'For each log entry: increment count. But "cd .." and "ls" don\'t count, nor does "cd x" if x exists in current directory.',
      'Wait: problem counts minimum operations to return to main folder from cd operations. Use depth tracking.',
    ],
    pitfalls: ['Each "cd x" where x!=".." increases depth by 1. "../" decreases by 1 (floor 0). "./" stays. Return final depth.'],
  },

  1605: {
    intuition: 'Find values of x, y, z given only row/column sum constraints and a grid with 0s and 1s. Multiple solutions exist; find any valid one.',
    algorithm: [
      'Set z = min of any cell. Compute remaining row/column sums. Distribute y and x greedily.',
    ],
    pitfalls: ['Any valid assignment works. Start with minimum cell value as z, then fill greedily.'],
  },

  1611: {
    intuition: 'Minimum number of bit flips to convert 0 to n. 0 can reach any number; think in terms of paths through XOR operations.',
    algorithm: [
      'BFS from 0. At each state x: can XOR with any power of 2 (flip a bit). Find minimum steps to reach n.',
      'Or: count number of 1-bits in n + (trailing zeros before highest bit) type analysis.',
    ],
    pitfalls: ['BFS on bit states. States are all numbers reachable. Distance = min flips.'],
  },

  1621: {
    intuition: 'Count pairs of integers from 1..n where abs(i-j) > target. Equivalent to total pairs minus pairs with abs(i-j) <= target.',
    algorithm: [
      'Total pairs = n*(n-1)/2.',
      'Pairs with diff <= target: for each d from 1 to target: (n-d) pairs. Sum = target*n - target*(target+1)/2.',
      'Answer = total - close_pairs.',
    ],
    pitfalls: ['Handle edge case where target >= n (then close_pairs includes all).'],
  },

  1622: {
    intuition: 'Lazy segment tree for range add operations and point queries. Operations are add to indices 1..i and add to indices i..n.',
    algorithm: [
      'Maintain prefix sum differences. Each operation [l,r,v]: difference[l]+=v, difference[r+1]-=v.',
      'Get(i): return sum of differences[1..i].',
    ],
    pitfalls: ['Mod operation needed. Segment tree or BIT with lazy propagation.'],
  },

  1625: {
    intuition: 'Find lexicographically smallest string after applying shift/rotate operations. BFS over all reachable strings.',
    algorithm: [
      'BFS with a visited set. Start with s. Two operations: rotate (move last char to front) and add (increment even-indexed chars by a mod 10).',
      'Return minimum string in visited set.',
    ],
    pitfalls: ['Total reachable states bounded. BFS explores all. Rotation cycle is at most n states.'],
  },

  1636: {
    intuition:
      'Sort the array by how often each value appears — higher frequency first. When two values tie in frequency, the larger value comes first. Count frequencies with a hash map, then sort with a custom comparator.',
    algorithm: [
      'Build frequency map: value → count.',
      'Sort nums with comparator: compare (-freq[a], -a) vs (-freq[b], -b).',
      'Negative freq sorts descending frequency; negative value breaks ties by larger value first.',
      'Return the sorted array.',
    ],
    example: {
      input: 'nums = [2,3,1,3,2]',
      steps: [
        'Frequencies: 3→2, 2→2, 1→1.',
        'Tie on freq 2: 3 before 2 (larger value). Then 1.',
      ],
      output: '[3,3,2,2,1]',
    },
    pitfalls: [
      'Tie-break is by value descending, not ascending.',
      'Comparator must use frequency first, then value.',
      'O(n log n) from sorting; counting is O(n).',
    ],
  },

  1639: {
    intuition: 'Count strings of length n from words where characters appear at most target times. DP: dp[i][j] = ways to form strings of length i using first j word characters with j occurrences.',
    algorithm: [
      'Frequency count of words. DP over characters a-z.',
      'For each character c with freq f: dp[len] = sum over used 0..min(f,target,len): dp[len-used] * C(f, used).',
    ],
    pitfalls: ['Characters are chosen at most target times. Use knapsack DP over character types.'],
  },

  1652: {
    intuition: 'Defuse bomb: each value is sum of k next (positive k) or k previous (negative k) elements. Circular array.',
    algorithm: [
      'If k==0: all zeros. If k>0: for each i, sum code[(i+1)...(i+k)] (circular). If k<0: sum code[(i-|k|)...(i-1)].',
      'Use prefix sums on doubled array for efficiency.',
    ],
    pitfalls: ['Handle circular indexing with modulo. k can be negative (look backward).'],
  },

  1653: {
    intuition: 'Minimum characters to delete to make s consist of some a\'s followed by some b\'s. Scan left to right: delete b\'s seen so far or a\'s ahead.',
    algorithm: [
      'Count total b\'s. Scan: at each position, if char is a: b_ahead decreases. If char is b: a_before increases.',
      'Answer = min(a_before + b_ahead_after) over all split positions.',
    ],
    pitfalls: ['Answer = min over all split positions of: b\'s to the left (delete) + a\'s to the right (delete).'],
  },

  1671: {
    intuition: 'Find length of minimum mountain removals. The answer is n - maxBitonic where maxBitonic = max LIS ending at i + LDS starting at i - 1 (for valid peaks).',
    algorithm: [
      'Compute LIS[i] = LIS ending at index i. Compute LDS[i] = LDS starting at index i (= LIS from right ending at i).',
      'For each valid peak i (LIS[i]>1 && LDS[i]>1): bitonic = LIS[i]+LDS[i]-1. Max over all i.',
      'Answer = n - max_bitonic.',
    ],
    pitfalls: ['Peak must have LIS>1 and LDS>1 (both strictly increasing on both sides). Subtract 1 to avoid double-counting peak.'],
  },

  1678: {
    intuition:
      'The goal parser maps fixed tokens to output characters: G stays G, () becomes o, (al) becomes al, and ()! becomes !. Scan left to right and match the longest pattern first so (al) is not mistaken for ().',
    algorithm: [
      'Initialize empty result and index i = 0.',
      'While i < length: if s[i] == G, append G and i++.',
      'Else if s starts with "(al)" at i, append "al", i += 4.',
      'Else if s starts with "()" at i, check next char for !.',
      'If "()!", append ! and i += 4; else append o and i += 2.',
      'Return result string.',
    ],
    example: {
      input: 'command = "G()(al)"',
      steps: [
        'G -> G. () -> o. (al) -> al.',
      ],
      output: '"Goal"',
    },
    pitfalls: [
      'Match "(al)" before bare "()" — order of pattern checks matters.',
      'Input is guaranteed valid — no error handling needed.',
      'StringBuilder avoids repeated string concatenation in loops.',
    ],
  },

  1680: {
    intuition: 'Concatenate binary representations of 1,2,...,n. Find k-th bit. Work out length = sum(floor(log2(i))+1 for i in 1..n) and binary search.',
    algorithm: [
      'Total length grows. Binary search for which number contains the k-th bit.',
      'Determine bit position within that number.',
    ],
    pitfalls: ['Total bit length = sum of bit lengths. Find the number containing position k using prefix sums.'],
  },

  1689: {
    intuition: 'Minimum number of operations to reduce n to 0, where op is +1 or -1. When n is even: /2 is implicit (use binary representation). Count 1-bits + carry analysis.',
    algorithm: [
      'Count 1s in binary representation. Each isolated 1 takes 2 ops (subtract to clear). Consecutive 1s optimized with carry.',
      'Simulate: while n>0, if n&1: if n&2 and n>3: n++ else n--. Else n>>=1. Count ops.',
    ],
    pitfalls: ['For consecutive 1s, adding 1 turns them into a carry (fewer total operations). Greedy simulation.'],
  },

  1695: {
    intuition: 'Maximum sum of subarray with all distinct elements. Sliding window with a HashSet.',
    algorithm: [
      'Window [l,r]. Expand r: if nums[r] in set, shrink l until nums[r] removed. Add nums[r] to set and sum.',
      'Track max sum.',
    ],
    pitfalls: ['Shrink from left until duplicate is removed. Track running sum for O(n) total.'],
  },

  1700: {
    intuition: 'Count students who cannot get their sandwich preference. After sandwiches in queue are exhausted for students wanting front sandwich, simulation ends.',
    algorithm: [
      'Count preference[0] and preference[1] students.',
      'Process sandwiches in order. If top sandwich matches count > 0: count--. Else: if both counts > 0, cycle. Return remaining students.',
      'Simplified: remaining = students who want opposite of remaining sandwiches.',
    ],
    pitfalls: ['When count for current top sandwich is 0 and count for other is >0: all remaining students are unsatisfied.'],
  },

  1716: {
    intuition: 'Maximize money on day n: earn on days 1, 4, 7, 10,... (every 3rd). Compare taking day n alone vs not.',
    algorithm: [
      'For n divisible by 3: earn on n/3 days (days 1,4,...,n). Else earn on floor(n/3) days + possibly one extra.',
      'Actually: max = (n//3)*2 if n%3==0, (n//3)*2 + (n%3 == 2 ? 1 : 0).',
    ],
    pitfalls: ['Greedy: take triplets (3 days = ). Remainder of 1 day =  extra, remainder of 2 =  extra.'],
  },

  1718: {
    intuition: 'Build lex-smallest valid array where adjacent difference is either 1 or equals the element. Backtracking with pruning.',
    algorithm: [
      'DFS: fill n positions. At each position i: try values from 1 upward. Check conditions: |arr[i]-arr[i-1]|==1 or divisible.',
      'Use a set to track used values.',
    ],
    pitfalls: ['Try smallest values first for lex-smallest. Backtrack when stuck.'],
  },

  1722: {
    intuition: 'Elements that can be swapped freely (via allowed swaps) form connected components. Within each component, any arrangement is possible. For each target[i], check if source has a matching value in the same component.',
    algorithm: [
      'Build Union-Find from allowedSwaps. Group all source[i] values by their component root.',
      'For each target[i]: look up its component root and check if that value exists in the component\'s frequency map. If yes: consume one count. If no: increment Hamming distance.',
    ],
    pitfalls: ['Union-Find with path compression + union by rank. O((n + k) a(n)) time. Consuming from frequency map prevents double-matching.'],
  },

  1726: {
    intuition: 'Count tuples (i,j,k,l) where nums[i]*nums[j]==nums[k]*nums[l]. For each product value, count pairs with that product. Tuples = C(count,2)*8 for distinct indices.',
    algorithm: [
      'Map product -> count of pairs with that product.',
      'For each pair (i,j): product = nums[i]*nums[j]. tuples += map[product]. Map[product]++.',
    ],
    pitfalls: ['Each pair of pairs gives 8 tuples (reordering the two pairs and swapping within pairs). Multiply by 8.'],
  },

  1727: {
    intuition: 'Largest submatrix where every row is sorted. Sort columns within each row independently, then find max area of 1-filled rectangle.',
    algorithm: [
      'Sort each row. Compute heights: height[j] = consecutive 1s ending at current row in column j.',
      'For each row: sort heights descending. Max area = max(heights[j] * (j+1)).',
    ],
    pitfalls: ['After sorting each row, the problem reduces to histogram max rectangle per row.'],
  },

  1749: {
    intuition: 'Maximum absolute sum of any subarray. Max of (maximum subarray sum) and (absolute of minimum subarray sum).',
    algorithm: [
      'Run Kadane for maximum subarray sum.',
      'Run Kadane for minimum subarray sum.',
      'Return max(max_sum, abs(min_sum)).',
    ],
    pitfalls: ['|sum| is maximized by either the most positive or most negative subarray.'],
  },

  1751: {
    intuition: 'Maximum value of k non-overlapping events. DP + binary search. dp[i][j] = max value attending at most j events from events[0..i].',
    algorithm: [
      'Sort by end time. dp[i][k] = max(dp[i-1][k], dp[last_before_start][k-1] + value[i]).',
      'Binary search for last event ending before event[i].start.',
    ],
    pitfalls: ['k is at most 2 in most variants. For general k, use O(n*k*log n) DP.'],
  },

  1752: {
    intuition: 'Check if array is sorted and rotated. An array is sorted-rotated if it has at most one "inversion" (arr[i] > arr[i+1]) and arr[last] <= arr[0].',
    algorithm: [
      'Count positions where arr[i] > arr[(i+1)%n].',
      'Return count <= 1.',
    ],
    pitfalls: ['Wrap-around check: arr[n-1] <= arr[0] is also required. Total inversions <= 1 means <= 1 rotation point.'],
  },

  1758: {
    intuition: 'Minimum operations to make string alternating. Count 010101... vs 101010... patterns and take minimum.',
    algorithm: [
      'Count mismatches with "010101..." pattern = c1. Mismatches with "101010..." = n - c1.',
      'Return min(c1, n-c1).',
    ],
    pitfalls: ['Only two valid alternating patterns for binary strings. Count mismatches with each.'],
  },

  1760: {
    intuition: 'Minimize the maximum bag size after k operations (each op splits one bag). Binary search on max size.',
    algorithm: [
      'Binary search [1, max(nums)].',
      'Feasibility(maxSize): for each bag of size s, ops needed = ceil(s/maxSize)-1. Total ops <= maxOps.',
    ],
    pitfalls: ['ceil(s/maxSize)-1 = (s-1)/maxSize ops to split bag of size s into bags of maxSize.'],
  },

  1763: {
    intuition: 'Find longest nice substring (every letter has both upper and lower case). Recursive split at characters that don\'t have both cases.',
    algorithm: [
      'For each char in s: if uppercase present but not lowercase (or vice versa): split at this char, recurse on substrings.',
      'Return longest result from recursion.',
    ],
    pitfalls: ['Split at any character missing its case pair. Try all such split points, return longest nice substring found.'],
  },

  1765: {
    intuition: 'Multi-source BFS from all water cells (0s). BFS fills inland heights.',
    algorithm: [
      'Add all water cells to queue with height 1.',
      'BFS: for each cell, if neighbor is 0: set to current+1, add to queue.',
    ],
    pitfalls: ['BFS from all water sources simultaneously gives the shortest distance from water for each land cell.'],
  },

  1768: {
    intuition:
      'Merge word1 and word2 by alternating characters. When one string runs out, append the rest of the other. Two pointers walk both strings in lockstep.',
    algorithm: [
      'Initialize i = 0, j = 0 and empty result.',
      'While i < word1.Length && j < word2.Length: append word1[i], then word2[j]; i++, j++.',
      'Append remaining characters from whichever string is not exhausted.',
      'Return merged string.',
    ],
    example: {
      input: 'word1 = "abc", word2 = "pqr"',
      steps: [
        'Merge a,p,b,q,c,r → "apbqcr".',
      ],
      output: '"apbqcr"',
    },
    pitfalls: [
      'Alternate starting with word1 first.',
      'Do not forget the tail of the longer string.',
      'O(n+m) time, O(n+m) output space.',
    ],
  },

  1780: {
    intuition: 'Check if n can be represented as sum of distinct powers of 3. Greedily try to subtract highest powers of 3.',
    algorithm: [
      'While n > 0: if n % 3 == 0, divide by 3. If n % 3 == 1, subtract 1 and divide by 3. If n % 3 == 2, return false (can\'t use power twice).',
    ],
    pitfalls: ['In base 3, each digit must be 0 or 1 (distinct powers). If any digit is 2, return false.'],
  },

  1791: {
    intuition: 'The center node is connected to all other nodes. Find the node that appears in all edges.',
    algorithm: [
      'Center must appear in both edges[0] and edges[1]. Find common node.',
    ],
    pitfalls: ['With n>=3 nodes and n-1 edges in a star, center appears in every edge. Just check first two edges.'],
  },

  1792: {
    intuition: 'Maximize average pass ratio by greedily adding extra students to the class that benefits most. Use max-heap by gain.',
    algorithm: [
      'Gain of adding to class (pass, total) = (pass+1)/(total+1) - pass/total.',
      'Max-heap by gain. For each extra student: pop max gain class, add student, push back.',
      'Sum all pass/total ratios at end.',
    ],
    pitfalls: ['Use max-heap by marginal gain. Each extra student goes to class with highest current marginal gain.'],
  },

  1800: {
    intuition: 'Find the subarray of 1s with maximum length (since max sum of consecutive ascending array starting from 1 = 1+2+...+L = L*(L+1)/2 but actually just sum consecutive increasing prefix).',
    algorithm: [
      'Sliding window: longest consecutive subarray where each element = previous + 1.',
      'Max sum = max(sum of such a window).',
    ],
    pitfalls: ['The maximum ascending subarray sum (each element strictly greater than previous).'],
  },

  1802: {
    intuition: 'Construct array with max value at index such that adjacent difference <= maxDiff and sum <= maxSum. Binary search on the value at index.',
    algorithm: [
      'Binary search on value v at index. Sum = sum of capped arithmetic sequences from index going left and right.',
      'Left sum: sum of min(v, v-1, ..., 1, 1, 1...) for n elements. Right sum: similar.',
    ],
    pitfalls: ['Sum from peak of height h going k steps: sum = h + (h-1) + ... = arithmetic series capped at 1.'],
  },

  1823: {
    intuition: 'Josephus problem. Find winner when counting k positions starting from 1. Recurrence: winner(1)=0, winner(n) = (winner(n-1)+k) % n.',
    algorithm: [
      'Base: 1 person, winner=0 (0-indexed).',
      'For n from 2 to n: position = (position + k) % n.',
      'Return position + 1 (1-indexed).',
    ],
    pitfalls: ['Classic Josephus recurrence in O(n). Convert to 1-indexed at the end.'],
  },

  1855: {
    intuition: 'Maximum distance between indices i < j such that nums1[i] >= nums2[j]. Binary search or two pointers.',
    algorithm: [
      'For each i: binary search for rightmost j where nums2[j] <= nums1[i]. Answer = max(j-i).',
      'Or: two pointers from left. Track j for each valid i.',
    ],
    pitfalls: ['nums1 and nums2 are not necessarily sorted by value. Binary search may not directly apply unless we use monotonic properties.'],
  },

  1857: {
    intuition: 'Topological sort on directed graph of character dependencies. For each edge (a->b): must use b before a (b has smaller color). Find max score path.',
    algorithm: [
      'Topological sort (Kahn\'s). dp[node][c] = max count of color c on any path ending at node.',
      'Propagate DP along edges. Answer = max over all (node, color).',
    ],
    pitfalls: ['If cycle exists: return -1. Score = maximum color frequency on any path.'],
  },

  1863: {
    intuition: 'Sum of XOR of all subsets. Each bit contributes 2^(n-1) to the total if any element has that bit set (since it appears in half of subsets with non-zero XOR).',
    algorithm: [
      'OR all elements together: bits_present.',
      'Answer = bits_present * 2^(n-1).',
    ],
    pitfalls: ['Each bit that appears in any element contributes 2^(n-1) to total XOR sum. Multiply OR by 2^(n-1).'],
  },

  1877: {
    intuition: 'Pair elements to maximize minimum pair sum. Sort and pair first with last, second with second-last. This maximizes the minimum.',
    algorithm: [
      'Sort array. For each i: pair nums[i] with nums[n-1-i]. Max of these sums is the answer.',
    ],
    pitfalls: ['Sort + pair opposite ends. Optimal pairing minimizes the maximum of minimum pairs.'],
  },

  1886: {
    intuition: 'Check if mat equals any rotation of target. Compare mat with target rotated 0, 90, 180, 270 degrees.',
    algorithm: [
      'Rotate mat up to 3 times (90-degree rotation: (i,j) -> (j, n-1-i)). Check equality after each rotation.',
    ],
    pitfalls: ['90-degree clockwise rotation: new[j][n-1-i] = old[i][j]. Or equivalently new[i][j] = old[n-1-j][i].'],
  },

  1905: {
    intuition: 'Check if small grid is a strict subset: every connected component of 1s in small must match corresponding region in large.',
    algorithm: [
      'For each cell (i,j): if small[i][j]==1 and large[i][j]==0: return false.',
      'For each 2x2 block in small that is all 1s: check corresponding 2x2 in large is all 1s.',
      'More precisely: BFS on components.',
    ],
    pitfalls: ['Components in small must be strict subsets of components in large. Check BFS connectivity.'],
  },

  1920: {
    intuition:
      'The input is a permutation of indices 0..n-1. The answer at position i is the value found by following the permutation once: nums[nums[i]]. This is a direct array lookup — no sorting or modification of the source array required.',
    algorithm: [
      'Create a new array ans of length n.',
      'For each index i from 0 to n-1, set ans[i] = nums[nums[i]].',
      'Return ans without mutating nums (unless the problem allows in-place tricks).',
    ],
    example: {
      input: 'nums = [0,2,1,5,3,4]',
      steps: [
        'ans[0] = nums[nums[0]] = nums[0] = 0.',
        'ans[1] = nums[nums[1]] = nums[2] = 1.',
        'ans[2] = nums[nums[2]] = nums[1] = 2.',
        'Continue similarly for remaining indices.',
      ],
      output: '[0,1,2,4,5,3]',
    },
    pitfalls: [
      'Use a new output array — overwriting nums while reading breaks double lookups.',
      'Indices are 0-based; nums[i] is always a valid index because input is a permutation.',
      'O(n) time and O(n) space is optimal for this definition.',
    ],
  },

  1930: {
    intuition: 'Count distinct palindromic subsequences of length 3. Fix the two outer characters (same) and count distinct inner characters.',
    algorithm: [
      'For each character c (a-z): find first and last occurrence. Count distinct chars strictly between them.',
    ],
    pitfalls: ['Palindrome of length 3: c_middle_c. For each outer char, count distinct inner chars (not duplicates).'],
  },

  1971: {
    intuition:
      'Undirected graph connectivity: determine whether destination is reachable from source using any sequence of edges. BFS or DFS from source is sufficient; Union-Find also works if you prefer offline connectivity.',
    algorithm: [
      'Build adjacency list from bi-directional edges.',
      'BFS: queue starting with source, visited set.',
      'Dequeue node u; if u == destination return true.',
      'Enqueue unvisited neighbors of u.',
      'If queue empties without reaching destination, return false.',
    ],
    example: {
      input: 'n=3, edges=[[0,1],[1,2],[2,0]], source=0, destination=2',
      steps: [
        'From 0 reach 1 and 2 via edges — destination found.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Edges are undirected — add both directions to adjacency list.',
      'Source equals destination should return true immediately.',
      'No edge weights — plain reachability, not shortest path.',
    ],
  },

  1976: {
    intuition: 'Count shortest paths in weighted graph. Dijkstra with path counting.',
    algorithm: [
      'Dijkstra: dist[] and count[]. count[src]=1.',
      'On relaxation: if new dist < dist[v]: dist[v]=new, count[v]=count[u].',
      'If new dist == dist[v]: count[v] += count[u].',
      'Return count[n-1] % MOD.',
    ],
    pitfalls: ['Count updates when relaxation equals current best. Same as Number of Ways to Arrive (LC 1976).'],
  },

  1980: {
    intuition: 'Find n+1 bit binary strings not in the array. Since there are 2^n possible n-bit strings but only n given, at least one is missing. Iterate and check.',
    algorithm: [
      'Build set of existing strings.',
      'Generate all n-bit strings (0..2^n-1). Return first not in set.',
    ],
    pitfalls: ['2^n total possibilities, only n strings given. Iterate 0..2^n and find missing. For large n, use clever generation.'],
  },

  2011: {
    intuition: 'Simple accumulation: gain adds to score, lose subtracts. Return maximum score at any point.',
    algorithm: [
      'For each operation: if gain, score += point. If lose, score -= point. Track max score.',
    ],
    pitfalls: ['Score can go negative but we track maximum at any point, not final score.'],
  },

  2016: {
    intuition: 'Maximum difference where larger element comes after smaller element. Track minimum seen so far, compute diff at each step.',
    algorithm: [
      'min_so_far = nums[0]. max_diff = -1.',
      'For each i from 1: if nums[i] > min_so_far: max_diff = max(max_diff, nums[i]-min_so_far). Update min_so_far.',
    ],
    pitfalls: ['Must have j > i and nums[j] > nums[i]. Track minimum to the left. Return -1 if no valid pair.'],
  },

  2048: {
    intuition: 'A next beautiful number is a number where digit frequency equals that digit. Find next such number >= n.',
    algorithm: [
      'Only 1-9 allowed as digits in beautiful number. Try all combinations: digits used form a valid beautiful number.',
      'Generate beautiful numbers in order, return first >= n.',
    ],
    pitfalls: ['Beautiful numbers have at most 1+2+3+...+9 = 45 digits. Very few exist. Enumerate and check.'],
  },

  2090: {
    intuition: 'K-radius average: for each index i, average of nums[i-k..i+k]. Use prefix sums for O(n) computation.',
    algorithm: [
      'prefix[i] = sum of nums[0..i-1].',
      'For each i from k to n-1-k: avg = (prefix[i+k+1] - prefix[i-k]) / (2k+1).',
      'Positions < k or >= n-k get -1.',
    ],
    pitfalls: ['Use integer division. Return -1 for positions without full radius window.'],
  },

  2092: {
    intuition: 'Graph: favorites connect in directed pairs. Find 2-cycle pairs (mutual favorites). The answer is max(longest_cycle, sum_of_two_cycle_chains).',
    algorithm: [
      'Find all cycles. For 2-cycles: sum their chain lengths. For longer cycles: track maximum cycle length.',
      'Answer = max(max_long_cycle, sum_2cycle_chains).',
    ],
    pitfalls: ['2-cycle pairs can be extended with chains. Longer cycles stand alone. This is a complex graph problem.'],
  },

  2099: {
    intuition: 'Find k largest elements and return their sum. Use partial sort or a min-heap of size k.',
    algorithm: [
      'Sort descending. Sum first k elements.',
      'Or: QuickSelect for k largest, then sum.',
    ],
    pitfalls: ['Sort descending and take first k. Or use partition.'],
  },

  2095: {
    intuition:
      'The middle node of a linked list is found with the classic slow/fast pointer technique: when fast reaches the end, slow sits on the node to remove. A dummy node before the head handles the edge case where the middle is the first node. If the target has a successor, copy its value and skip the next node; otherwise unlink the tail through the tracked predecessor.',
    algorithm: [
      'Create dummy start pointing to head; initialize slow, fast, and prev at head.',
      'While fast and fast.next exist, advance prev to slow, slow by one, and fast by two.',
      'If slow.next is not null, copy slow.next.val into slow and set slow.next = slow.next.next.',
      'Else if slow is the head node, set start.next = null.',
      'Else set prev.next = null to remove the tail middle.',
      'Return start.next.',
    ],
    example: {
      input: 'head = [1, 3, 4, 7, 1, 2, 6]',
      steps: [
        'Seven nodes: slow/fast stops with slow on node 4 (the middle).',
        'slow.next exists, so copy 7 into slow and skip the next node.',
        'Result list is 1 -> 3 -> 4 -> 1 -> 2 -> 6.',
      ],
      output: '[1, 3, 4, 1, 2, 6]',
    },
    pitfalls: [
      'Use a dummy node so deleting the first/middle node does not lose the list head.',
      'Track prev during the slow/fast walk for tail-deletion cases.',
      'When slow.next is null, do not copy-delete; unlink with prev or dummy instead.',
    ],
  },

  2109: {
    intuition: 'Add spaces at given indices in a string. Build result character by character, inserting spaces at specified positions.',
    algorithm: [
      'Two pointers: string index and spaces index. Append char; if current index is in spaces array, append space first.',
    ],
    pitfalls: ['Spaces are inserted BEFORE the character at given index. Indices are in the original string.'],
  },

  2131: {
    intuition: 'Form palindrome pairs from strings. Two strings form a palindrome if one + reverse(other). Count pairs, track longest combined length.',
    algorithm: [
      'Sort by length. For each string s: check if reverse(s) exists in set. Longest pair = 2 * longest such length.',
      'Also check single-string palindromes for the middle (when n is odd number of strings... wait n is pairs).',
    ],
    pitfalls: ['Find longest string whose reverse also exists in the list. Answer = 2 * such length.'],
  },

  2134: {
    intuition: 'Find minimum swaps to group all 1s. Sliding window of size = count(1s). Find window with maximum 1s; minimum swaps = window_size - max_ones_in_window.',
    algorithm: [
      'Count total ones = k. Sliding window of size k.',
      'Max ones in any window of size k using circular array (treat as doubled).',
      'Answer = k - max_ones_in_window.',
    ],
    pitfalls: ['Circular array: use doubled array or modular indexing. Window size = count of 1s in original array.'],
  },

  2140: {
    intuition: 'DP with 2 skips available. dp[i][j] = max points using j skips through question i.',
    algorithm: [
      'dp[i][0] = max(dp[i-1][0], dp[prev_earn][0] + points[i-1]) where prev_earn accounts for brainpower.',
      'dp[i][j] = max(dp[i-1][j], dp[prev_earn][j-1] + points[i-1], dp[i-1][j-1]) second option: skip this question costs 1 skip.',
    ],
    pitfalls: ['Brainpower of question i skips to question i + brainpower + 1. Track 0 and 1 (or 2) skips used.'],
  },

  2161: {
    intuition: 'Divide array into elements below pivot, equal to pivot, and above pivot, maintaining relative order.',
    algorithm: [
      'Three passes: collect elements < pivot, then == pivot, then > pivot.',
      'Concatenate.',
    ],
    pitfalls: ['Maintain relative order within each group. Three-pass approach is simplest.'],
  },

  2176: {
    intuition: 'Count pairs with same value and same absolute difference index. Group by value, then for each group count pairs with |i-j| divisible by... wait: pairs (i,j) where nums[i]==nums[j] and |i-j|%k==0.',
    algorithm: [
      'Group indices by value. For each group: count pairs with |i-j|%k==0.',
      'Equivalent to counting pairs with same (value, index%k). Use frequency map of (value, i%k).',
    ],
    pitfalls: ['Count pairs with same (nums[i], i%k) combination. Use map, count C(freq,2) for each key.'],
  },

  2181: {
    intuition: 'Merge nodes between zeros. Scan linked list, accumulate sum between consecutive 0-value nodes.',
    algorithm: [
      'Skip initial 0. Accumulate sum until next 0 node. Create new node with sum. Continue.',
    ],
    pitfalls: ['Input guaranteed to start and end with 0. Build new list from sums between zeros.'],
  },

  2196: {
    intuition: 'Build tree from description: [parent, child, isLeft]. HashMap parent -> {left, right} children. Root = node not appearing as any child.',
    algorithm: [
      'Map val -> TreeNode. For each description: set parent.left or parent.right = child.',
      'Root = node not in child set.',
    ],
    pitfalls: ['Track all child values. Root is the parent that never appears as a child.'],
  },

  2200: {
    intuition:
      'Index i is k-distant if some index j with |i-j| <= k has nums[j] == key. Equivalently, every occurrence of key marks all indices within distance k. Collect marked indices in sorted order.',
    algorithm: [
      'For each index i from 0 to n-1:',
      'Check if any j in [max(0,i-k), min(n-1,i+k)] has nums[j] == key.',
      'If yes, append i to the answer list.',
      'Return the list (indices are naturally increasing).',
    ],
    example: {
      input: 'nums = [3,4,9,5,7,1,9], key = 9, k = 1',
      steps: [
        '9 at indices 2 and 6. Within k=1 of index 2: 1,2,3. Of index 6: 5,6.',
      ],
      output: '[1, 2, 3, 4, 5, 6]',
    },
    pitfalls: [
      'Condition is existence of key within distance k — not nums[i] itself.',
      'Use inclusive bounds on j: |i-j| <= k.',
      'O(n*k) or O(n^2) is fine for typical constraints.',
    ],
  },

  2206: {
    intuition:
      'Divide array into pairs of equal values. For each distinct value appearing c times, you can form c/2 pairs (integer division). Sum pair counts across all values — order of pairing does not matter.',
    algorithm: [
      'Build frequency map value -> count.',
      'Initialize pairs = 0.',
      'For each count c in map: pairs += c / 2 (integer division).',
      'Return pairs.',
    ],
    example: {
      input: 'nums = [3,2,3,2,2,2]',
      steps: [
        'Counts: 3 appears 2 -> 1 pair. 2 appears 4 -> 2 pairs. Total 3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Use integer division c/2, not combinations formula on whole array.',
      'Odd leftover elements cannot form a pair — discard them.',
      'Frequency map handles unsorted input.',
    ],
  },

  2210: {
    intuition:
      'A hill is a local peak: nums[i] is strictly greater than both neighbors. Valleys are local minima with the same strict inequality. Endpoints cannot be hills or valleys because they lack two neighbors. Count both types in one pass.',
    algorithm: [
      'If n < 3, return 0.',
      'count = 0. For i from 1 to n-2:',
      'If nums[i] > nums[i-1] && nums[i] > nums[i+1]: hill, count++.',
      'Else if nums[i] < nums[i-1] && nums[i] < nums[i+1]: valley, count++.',
      'Return count.',
    ],
    example: {
      input: 'nums = [6,2,7,9,4,5]',
      steps: [
        'i=1: 2 < 6 and 2 < 7 -> valley. i=2: 7 peak. i=4: 4 valley.',
      ],
      output: '3',
    },
    pitfalls: [
      'Strict inequalities — equal neighbors are neither hill nor valley.',
      'Indices 0 and n-1 are never counted.',
      'Plateaus (flat runs) contribute nothing at interior points.',
    ],
  },

  2211: {
    intuition: 'Count collisions: two cars moving toward each other collide. Left-moving car hits right-moving car ahead. Simulate or count.',
    algorithm: [
      'Count R cars seen so far. For each car: if direction is L: collisions += R (each R car to the left collides). If S: collisions += R (all R cars collide with it).',
    ],
    pitfalls: ['After collision, cars become stationary. R moving left of S will also collide with S.'],
  },

  2220: {
    intuition:
      'Flipping bits where start and goal differ is exactly the number of 1-bits in start XOR goal. Each differing bit needs one flip; matching bits need zero.',
    algorithm: [
      'Compute xor = start ^ goal.',
      'Return population count (Hamming weight) of xor.',
      'In C#: BitOperations.PopCount((uint)xor) or loop with xor &= xor-1.',
    ],
    example: {
      input: 'start = 3 (011), goal = 4 (100)',
      steps: [
        '3 ^ 4 = 7 (111) — three bits differ.',
      ],
      output: '3',
    },
    pitfalls: [
      'XOR marks differing bits; do not flip bit-by-bit in a loop unless asked.',
      'Works for non-negative integers in problem constraints.',
      'O(1) bit operations vs O(log n) per-bit loop.',
    ],
  },

  2225: {
    intuition:
      'Count wins per team from match results. Track frequency in a map; find maximum win count; return all teams tied at that maximum (sorted by index or name per problem).',
    algorithm: [
      'Initialize wins map.',
      'For each match [winner, loser]: wins[winner]++.',
      'Find maxWin = max of map values.',
      'Collect all teams with wins[team] == maxWin into result list.',
      'Return result (often sorted by team index).',
    ],
    example: {
      input: 'matches with Alice/Bob wins',
      steps: [
        'Tally wins per name.',
        'Return every team with the highest tally.',
      ],
      output: 'list of top teams',
    },
    pitfalls: [
      'Losers are not inserted unless they win elsewhere.',
      'Ties return multiple teams.',
      'Team ids may be integers — map accordingly.',
    ],
  },

  2226: {
    intuition: 'Binary search on the answer (maximum pieces per person). Check if distributable with given max.',
    algorithm: [
      'Binary search on value [1, max(quantity)]. Feasibility: greedily assign pieces to people sorted by quantity descending.',
      'Sort quantities descending. For each person: assign floor(total_pieces / needed). Reduce total_pieces.',
    ],
    pitfalls: ['Sort quantities descending for greedy to work. Binary search on total pieces per person.'],
  },

  2236: {
    intuition:
      'Binary tree root equals sum of children only when both children exist and root.val == left.val + right.val. Missing child or null root means false.',
    algorithm: [
      'If root is null, return false.',
      'If left or right child is null, return false.',
      'Return root.val == root.left.val + root.right.val.',
    ],
    example: {
      input: 'root = [10,4,-6]',
      steps: [
        'Both children exist: 10 == 4 + (-6)? 10 == -2 — false.',
      ],
      output: 'false',
    },
    pitfalls: [
      'Leaf node (no children) → false, not vacuously true.',
      'Only exactly two children qualify.',
      'Values can be negative — sum still valid.',
    ],
  },

  2257: {
    intuition: 'Count cells visible to a guard: horizontal and vertical rays until blocked by wall. Simulate.',
    algorithm: [
      'BFS/simulation from each guard. Expand in 4 directions until hitting a wall or boundary. Mark cells.',
      'Count distinct marked cells.',
    ],
    pitfalls: ['Multiple guards can cover overlapping cells - count each cell once.'],
  },

  2264: {
    intuition: 'Remove leading zeros from non-first digits. For number with k zeros before non-zero: remove k-1 zeros (keep one). Special case: all zeros.',
    algorithm: [
      'Split by non-zero digits. For each group of zeros between digits: keep exactly one zero.',
      'Or: regex replace leading zeros in each numeric group.',
    ],
    pitfalls: ['First digit cannot be zero. Inner groups can have one zero. Trailing zeros stay.'],
  },

  2270: {
    intuition: 'Count splits where left sum equals right sum. Prefix sum from left, suffix from right.',
    algorithm: [
      'Total sum. leftSum = 0. For i from 0 to n-2: leftSum += nums[i]. rightSum = total - leftSum. If equal: count++.',
    ],
    pitfalls: ['Split at index i means left=[0..i], right=[i+1..n-1]. Do not include last index.'],
  },

  2271: {
    intuition: 'Maximum whiteboard area: for each laser row, available horizontal space is the minimum gap between obstacles. Sort obstacles by row, scan.',
    algorithm: [
      'Sort obstacles by row. For each laser row between obstacles: width = min gap between consecutive obstacles in that row.',
      'Track maximum area = width * height_between_lasers.',
    ],
    pitfalls: ['Laser rows divide the board. Within each section, minimum horizontal width determines area.'],
  },

  2273: {
    intuition: 'For each word, check if it is a substring of any folder name and return the folder names sorted by query match.',
    algorithm: [
      'Sort folders. For each query: binary search or scan for folders containing query as substring.',
      'Return matching folders.',
    ],
    pitfalls: ['Case-sensitive substring match. Sort results lexicographically.'],
  },

  2275: {
    intuition: 'Count values that have all required bits set (value & bits == bits). For each candidate in votes, check bitmask.',
    algorithm: [
      'For each candidate: if (candidate & bits) == bits: count++.',
    ],
    pitfalls: ['All bits in the required mask must be set. Use bitwise AND.'],
  },

  2285: {
    intuition: 'Maximum road importance: assign values 1..n to roads. Road with highest degree gets highest value. Sort by degree.',
    algorithm: [
      'Count degree of each node. Sort degrees. Assign values 1..n to degrees ascending. Importance = sum(degree[i] * value[i]).',
    ],
    pitfalls: ['Greedy: highest degree node gets highest value. Sum of degree*value is the total importance.'],
  },

  2290: {
    intuition: 'Minimum obstacles to remove to reach bottom-right. 0-1 BFS: free cells cost 0, obstacle cells cost 1.',
    algorithm: [
      '0-1 BFS with deque. Start at (0,0) with cost 0. Expand: free neighbor -> cost 0 (push front). Obstacle -> cost 1 (push back).',
      'Return dist[m-1][n-1].',
    ],
    pitfalls: ['0-1 BFS: use deque. Free cells (0) go to front, obstacle cells (1) go to back.'],
  },

  2294: {
    intuition: 'Partition array into groups where max - min < k. Minimize groups by sorting and greedily grouping consecutive elements.',
    algorithm: [
      'Sort array. Greedy: start new group when nums[i] - nums[group_start] >= k.',
    ],
    pitfalls: ['Sorting ensures minimum spread within a group. Count groups greedily.'],
  },

  2300: {
    intuition: 'For each spell (power), count potions that form successful pair: spell * potion >= success. Binary search on sorted potions.',
    algorithm: [
      'Sort potions. For each spell s: find first potion p where s * p >= success using binary search. Count = potions.length - idx.',
    ],
    pitfalls: ['Binary search for ceil(success / spell) in sorted potions. Handle integer overflow with long.'],
  },

  2302: {
    intuition: 'Count subarrays with score < k, where score = sum * length. Sliding window: expand right, shrink left when score >= k.',
    algorithm: [
      'Window [l,r]. Maintain sum. While sum * (r-l+1) >= k: l++. Add r-l+1 subarrays ending at r.',
    ],
    pitfalls: ['Score is sum*length. Window shrinks from left when score exceeds k.'],
  },

  2311: {
    intuition: 'Count longest substring where each character appears an even number of times. Bitmask DP: parity of each character seen.',
    algorithm: [
      'Bitmask of 26 bits for parity. Find longest subarray where XOR of bitmasks at endpoints are equal.',
      'Store first occurrence of each bitmask. For each position: length = i - first[mask].',
    ],
    pitfalls: ['Even parity means bitmask XOR = 0. Use prefix XOR and hashmap of first occurrence.'],
  },

  2322: {
    intuition: 'Minimum score of path root->leaf. Sum of XOR along any root-to-leaf path. DFS to find minimum.',
    algorithm: [
      'DFS. At each node: XOR current node value into running sum. At leaf: update min answer.',
    ],
    pitfalls: ['XOR is accumulated along each path. Find minimum XOR sum across all root-to-leaf paths.'],
  },

  2326: {
    intuition:
      'Fill an m×n matrix in spiral order using values from a linked list head. Walk the spiral boundary (right, down, left, up) shrinking limits; place the next list value at each cell until list or matrix is exhausted.',
    algorithm: [
      'Track top, bottom, left, right boundaries and direction index.',
      'While list not empty and boundaries valid: place head.val at (r,c), advance list, move in current direction.',
      'When hitting boundary, turn direction and shrink the corresponding edge.',
      'Return matrix (or list remainder if sizes mismatch per problem).',
    ],
    example: {
      input: 'm=3, n=4, list 1→2→3→...',
      steps: [
        'Spiral fills row 0 left-to-right, then right column, etc.',
      ],
      output: '3×4 matrix in spiral order',
    },
    pitfalls: [
      'Standard spiral boundary template — same as Spiral Matrix II.',
      'Check list length vs m*n if problem requires exact fit.',
      'Update boundaries when turning direction.',
    ],
  },

  2327: {
    intuition: 'Count people who know the secret at each day. BFS/simulation: on day x+delay, person shares with acquaintances for forget days.',
    algorithm: [
      'Queue with (person, day_learned). Simulate each day. Person shares from day+delay to day+delay+forget-1.',
    ],
    pitfalls: ['Simulate day by day. Track who knows the secret at each specific day.'],
  },

  2331: {
    intuition: 'Evaluate boolean tree: leaves are 0/1, internal nodes are OR (2) or AND (3). Post-order DFS.',
    algorithm: [
      'DFS. If leaf: return val==1. If OR node: return left || right. If AND node: return left && right.',
    ],
    pitfalls: ['Post-order evaluation. OR=2, AND=3. Return boolean.'],
  },

  2337: {
    intuition: 'Check if you can reach destination with k-1 moves and 1 final step. From position x with k moves: can reach positions x-k+1 to x (move left any amount, then step right).',
    algorithm: [
      'Check if |target - source| <= k and (k - |target - source|) % 2 == 0.',
    ],
    pitfalls: ['Must use exactly k moves. After reaching target, must have even remaining moves to waste in place.'],
  },

  2338: {
    intuition: 'Count ideal arrays: strictly increasing where each element divides the next. DP with divisor chains.',
    algorithm: [
      'For each chain of divisors ending at value v of length k: count placements in array of length n using stars and bars.',
      'Answer = sum over all (v, chain_length) of C(n-1, chain_length-1).',
    ],
    pitfalls: ['Number of arrays = number of ways to place k-length divisor chain in n positions = C(n-1, k-1). Use SPF sieve.'],
  },

  2342: {
    intuition: 'Find two numbers whose digit sums are equal and their sum is maximum. Group by digit sum, take top-2 per group.',
    algorithm: [
      'Map: digitSum -> max value seen. For each num: ds = digitSum(num). If ds in map: ans = max(ans, map[ds] + num). map[ds] = max(map[ds], num).',
    ],
    pitfalls: ['Only need the maximum value per digit sum group. Update max after using it.'],
  },

  2344: {
    intuition: 'Count minimum operations to make each array element <= limit. Each op reduces an element. Elements > limit need ceiling(excess/dec) ops.',
    algorithm: [
      'For each value > limit: count occurrences. Ops = sum of occurrences rounded up based on decrement value.',
    ],
    pitfalls: ['Operations apply to groups of elements. Batch reductions with counting sort.'],
  },

  2348: {
    intuition: 'Count subarrays with exactly 0 odd numbers. A subarray is zero-odd if all elements are even. Count maximal even subarrays.',
    algorithm: [
      'For each maximal even subarray of length L: subarrays = L*(L+1)/2.',
    ],
    pitfalls: ['Split by odd numbers. Each even-only segment of length L contributes L*(L+1)/2 subarrays.'],
  },

  2349: {
    intuition: 'Design NumberContainers with change(index, number) and find(number). HashMap: number -> sorted set of indices.',
    algorithm: [
      'indexMap: index -> number. numMap: number -> TreeSet of indices.',
      'change: update indexMap, remove old from numMap, add new to numMap.',
      'find: return min of numMap.get(number), or -1 if empty.',
    ],
    pitfalls: ['Use TreeSet (sorted) for O(log n) min. Handle overwriting existing indices.'],
  },

  2353: {
    intuition: 'Food rating system: change rating, highest rated food per cuisine. Map cuisine -> priority queue by (rating desc, name asc).',
    algorithm: [
      'HashMap food->rating, food->cuisine, cuisine->PriorityQueue.',
      'changeRating: update rating in map. PQ will have stale entries - use lazy deletion.',
      'highestRated: poll PQ until top matches current rating.',
    ],
    pitfalls: ['Lazy deletion in PQ: only remove when popped and stale. Check against current rating map.'],
  },

  2359: {
    intuition: 'Find closest node to two given nodes. For each node, BFS/DFS to find distances. Answer is node minimizing max(dist1, dist2).',
    algorithm: [
      'BFS from node1 to get dist1[]. BFS from node2 to get dist2[]. For each node i: candidate = max(dist1[i], dist2[i]). Return i with minimum candidate.',
    ],
    pitfalls: ['Graph may have cycles (each node has at most 1 outgoing edge). BFS handles reachability. Return smallest index on tie.'],
  },

  2364: {
    intuition: 'Count bad pairs (i,j) where j-i != nums[j]-nums[i]. Equivalently: (nums[i]-i) != (nums[j]-j). Count total pairs minus good pairs.',
    algorithm: [
      'Transform: key[i] = nums[i] - i. Count freq of each key. Bad pairs = total pairs - sum(C(freq, 2)).',
    ],
    pitfalls: ['Good pairs have equal (nums[i]-i). Total pairs = n*(n-1)/2.'],
  },

  2369: {
    intuition: 'Check if valid parentheses string can be formed. Wildcard * can be (, ), or empty. Track range [min_open, max_open].',
    algorithm: [
      'min_open=0, max_open=0. For each char: if (: both++. If ): both--. If *: min--, max++.',
      'If max_open < 0: return false. Clamp min_open = max(0, min_open).',
      'Return min_open == 0.',
    ],
    pitfalls: ['Track minimum and maximum possible open counts. Clamp min at 0 (cannot have negative opens).'],
  },

  2370: {
    intuition: 'Longest ideal string: subsequence where consecutive chars differ by at most k. DP[char] = longest ending with that char.',
    algorithm: [
      'dp[26] = 0. For each c in s: dp[c] = 1 + max(dp[c-k..c+k]). Return max(dp).',
    ],
    pitfalls: ['For each character, look back k positions in alphabet. O(26k) per character or use range max.'],
  },

  2375: {
    intuition: 'Smallest number with pattern where I means increasing, D means decreasing. Greedy: use 1-9 with push/pop stack approach.',
    algorithm: [
      'Stack-based: push digits, pop on I to get increasing sequence.',
      'For i from 0 to n: push i+1. If i==n or pattern[i]==I: pop all stack to result.',
    ],
    pitfalls: ['Classic problem: use stack to reverse decreasing runs. Final digit handles trailing Ds.'],
  },

  2379: {
    intuition: 'Count black cells after painting rows and columns. Inclusion-exclusion: |rows| * m + |cols| * n - |rows| * |cols|.',
    algorithm: [
      'Count unique rows and unique cols from coordinates.',
      'Answer = uniqueRows * n + uniqueCols * m - uniqueRows * uniqueCols.',
    ],
    pitfalls: ['Intersection cells (row and col both painted) are counted twice without subtraction.'],
  },

  2381: {
    intuition: 'Apply shift operations to string. Optimize: each operation [direction, amount] shifts a range. Use difference array for net shifts.',
    algorithm: [
      'diff array of size n+1. For each [dir, amt, l, r]: diff[l] += shift, diff[r+1] -= shift.',
      'Prefix sum to get net shift per position. Apply modulo 26.',
    ],
    pitfalls: ['Net shift can be negative; use ((shift % 26) + 26) % 26. Difference array + prefix sum = O(n+q).'],
  },

  2389: {
    intuition: 'Answer queries offline. Sort queries by value. Sort nums. Binary search or two pointers for each query.',
    algorithm: [
      'Sort nums. For each query[i]: answer = number of elements in nums <= queries[i]. Binary search gives upper_bound.',
    ],
    pitfalls: ['Upper bound binary search: find first element > query. Index = count of elements <= query.'],
  },

  2392: {
    intuition: 'Build a matrix where matrix[i][j] satisfies row and column ordering constraints. Topological sort on merged constraints.',
    algorithm: [
      'For each row constraint (u<v): u must come before v in column order for those rows.',
      'Build DAG, topological sort to find valid column order. Return -1 if cycle.',
    ],
    pitfalls: ['Constraints from different rows must be consistent. Cycle in DAG -> impossible.'],
  },

  2400: {
    intuition: 'Count K-smooth integers up to n: numbers with all prime factors <= k. Precompute using sieve or DP.',
    algorithm: [
      'Generate all K-smooth numbers up to n using BFS/DFS: multiply by primes <= k starting from 1.',
      'Count those <= n.',
    ],
    pitfalls: ['K-smooth: all prime factors <= k. Generate by multiplying primes <= k up to n.'],
  },

  2401: {
    intuition: 'Longest nice subarray: no two elements share a bit. Sliding window with bitmask OR.',
    algorithm: [
      'Window [l,r]. usedBits = OR of window elements. Expand r: if (usedBits & nums[r]) != 0: shrink l (remove nums[l] from usedBits). Add nums[r].',
      'Track max window size.',
    ],
    pitfalls: ['Remove element from bitmask by XOR (or AND NOT). Window is valid when all elements share no bits.'],
  },

  2402: {
    intuition: 'Assign tasks to workers with cooldown rooms. Sort tasks by end time. Use min-heap for available rooms and running rooms.',
    algorithm: [
      'Sort tasks. Two heaps: available (free rooms), running (end_time, room_id).',
      'For each task: move rooms that finished by task.start to available. If available: assign. Else: wait for earliest room.',
    ],
    pitfalls: ['Tasks must start at or after their start time. Rooms become available at their end time.'],
  },

  2406: {
    intuition: 'Minimum number of groups to cover all intervals without overlapping in each group. Greedy: sort by start, use min-heap of group end times.',
    algorithm: [
      'Sort intervals. Min-heap of end times. For each interval: if heap.min < interval.start: replace (reuse group). Else: add new group.',
      'Return heap size.',
    ],
    pitfalls: ['Equivalent to finding maximum overlap at any point = minimum groups needed.'],
  },

  2409: {
    intuition:
      'Count calendar days both Alice and Bob are present in Rome. Convert MM-DD strings to day-of-year numbers, then count days d where arriveAlice ≤ d ≤ leaveAlice and arriveBob ≤ d ≤ leaveBob.',
    algorithm: [
      'Parse each date to day index 1..365 using month length table.',
      'Loop day from 1 to 365 (or use overlap formula: max(0, min(leaveA,leaveB) - max(arriveA,arriveB) + 1)).',
      'Increment when day lies in both inclusive intervals.',
      'Return count.',
    ],
    example: {
      input: 'Alice 08-06 to 08-09, Bob 08-01 to 08-09',
      steps: [
        'Overlap days 08-06 through 08-09 → 4 days together.',
      ],
      output: '4',
    },
    pitfalls: [
      'Non-leap-year calendar in problem — fixed month lengths.',
      'Intervals are inclusive on both ends.',
      'Overlap formula avoids loop if you prefer O(1).',
    ],
  },

  2410: {
    intuition: 'Match players to trainers optimally: each player needs a trainer with capacity >= player skill. Maximize matches.',
    algorithm: [
      'Sort both. Two pointers: match smallest player to smallest sufficient trainer.',
    ],
    pitfalls: ['Greedy: sort both, use two pointers. If trainer >= player: match and advance both. Else: advance trainer.'],
  },

  2415: {
    intuition: 'Reverse odd levels of binary tree. BFS level-order traversal, collect nodes at odd levels, swap their values.',
    algorithm: [
      'BFS. Track level. At odd levels: collect all node values, reverse them in-place.',
    ],
    pitfalls: ['Perfect binary tree. Only values need to be swapped, not nodes. Collect level values, reverse array.'],
  },

  2416: {
    intuition: 'Sum of prefix scores: for each word, count how many other words have it as a prefix. Trie solution.',
    algorithm: [
      'Build Trie. Each node stores count of words passing through it.',
      'For each word: traverse trie, sum counts at each node.',
    ],
    pitfalls: ['Each node count = number of words sharing that prefix. Sum along path = total prefix score.'],
  },

  2418: {
    intuition:
      'Each name is paired with a height. Sort by height in descending order and return the names in that order — the tallest person first. This is standard sort-by-key with a custom comparator on the height field while preserving name association.',
    algorithm: [
      'Build pairs (name[i], height[i]) for each index.',
      'Sort pairs by height descending (taller first).',
      'Extract the name from each pair in sorted order into the result array.',
      'Return the reordered names.',
    ],
    example: {
      input: 'names = ["Mary","John","Emma"], heights = [180,165,170]',
      steps: [
        'Pairs: (Mary,180), (John,165), (Emma,170).',
        'Sort by height: Mary 180, Emma 170, John 165.',
      ],
      output: '["Mary","Emma","John"]',
    },
    pitfalls: [
      'Sort pairs together — never sort heights and names independently.',
      'Stable sort is not required but names must stay matched to heights.',
      'Equal heights: any order among ties is usually acceptable.',
    ],
  },

  2419: {
    intuition: 'Find the longest subarray where bitwise AND of all elements is greater than 0. AND can only decrease as we add elements. All elements must share at least one common bit.',
    algorithm: [
      'Sliding window: AND of window > 0. When AND becomes 0: move left pointer.',
      'Or: for each bit, find max run where that bit is set in all elements.',
    ],
    pitfalls: ['AND of subarray is > 0 iff some bit is set in all elements. Max such contiguous run.'],
  },

  2425: {
    intuition: 'XOR of (nums1[i] XOR nums2[j]) for all pairs. Expand: XOR all values num1_i XOR num2_j. Count parity of occurrences.',
    algorithm: [
      'For each bit position b: count1 = bits set in nums1 at b, count0 = n - count1. count2_set in nums2.',
      'Pairs with bit set = count1*count2_set + count0*(n-count2_set). If odd: set bit in answer.',
    ],
    pitfalls: ['Process bit by bit. Bit b is set in XOR(all pairs) iff odd number of pairs have that bit set.'],
  },

  2429: {
    intuition: 'Minimize XOR: make x have same number of set bits as target, minimizing XOR with num. Greedy: copy high bits from num, fill remaining from low bits.',
    algorithm: [
      'Count set bits in target = k. Start with x=0. Greedily set k highest bits of num in x.',
      'If more bits needed: set lowest unset bits. If fewer: unset lowest set bits.',
    ],
    pitfalls: ['Minimize XOR means align set bits with num as much as possible from high to low.'],
  },

  2434: {
    intuition: 'Longest balanced subsequence after removing characters. Count valid brackets using greedy: track open count, for each close try to match.',
    algorithm: [
      'Two passes: left-to-right count matched brackets. Or: maintain count of available opens.',
    ],
    pitfalls: ['Remove minimum characters = keep maximum valid brackets. Greedy: track open count.'],
  },

  2435: {
    intuition: 'Count paths from (0,0) to (m-1,n-1) passing through exactly k obstacles. DP: dp[i][j][k] = ways with k obstacles used.',
    algorithm: [
      'DP on grid with obstacle count dimension. dp[i][j][ob] = paths reaching (i,j) using ob obstacles.',
    ],
    pitfalls: ['State space is m*n*maxObstacles. Transition: free cell = same obstacles, obstacle = +1 obstacle count.'],
  },

  2438: {
    intuition:
      'Write n in binary; each set bit is a power of two. Extract powers in increasing order into an array. Each query asks for product of powers[left..right] modulo 10^9+7.',
    algorithm: [
      'While n > 0: isolate lowest set bit with n & -n, push to powers[], subtract from n.',
      'For each query [l,r]: multiply powers[l..r] with modular arithmetic.',
      'Return answer array.',
    ],
    example: {
      input: 'n = 22 (10110), query [1,2]',
      steps: [
        'Powers: 2, 4, 16 (bits set in 22).',
        'Product powers[1]*powers[2] = 4*16 = 64 mod MOD.',
      ],
      output: '64',
    },
    pitfalls: [
      'Use long for intermediate product before mod.',
      'Powers array is sorted by increasing bit position.',
      'MOD = 1e9+7 on every multiply.',
    ],
  },

  2444: {
    intuition: 'Count subarrays with at least k odd numbers. Complement: at most k-1 odd numbers. Answer = total - atMost(k-1).',
    algorithm: [
      'atMost(k) = count subarrays with <= k odd numbers using sliding window.',
      'Answer = atMost(n) - atMost(k-1)... wait: at least k = total - atMost(k-1).',
    ],
    pitfalls: ['Use atLeast(k) = total - atMost(k-1). Sliding window for atMost.'],
  },

  2458: {
    intuition: 'For each node query the height of its subtree after removing its k largest-height children. Euler tour + offline queries.',
    algorithm: [
      'DFS to get subtree heights. For each node: sort children heights. queries ask for height with k largest children removed.',
      'Height = 1 + max of remaining children heights.',
    ],
    pitfalls: ['Precompute sorted child heights per node. For query (node, k): skip k largest.'],
  },

  2460: {
    intuition: 'Replace 0s with doubled value of previous non-zero, then shift zeros to end.',
    algorithm: [
      'Pass 1: scan left to right. If nums[i]==nums[i+1]: nums[i]*=2, nums[i+1]=0.',
      'Pass 2: remove zeros, pad end with zeros.',
    ],
    pitfalls: ['After doubling, set original position to 0. Then compact array (move zeros to end).'],
  },

  2461: {
    intuition: 'Maximum sum of subarray of length k with distinct elements. Sliding window + frequency map.',
    algorithm: [
      'Window [l,r] of size k. HashMap for element counts. Expand r, shrink l when duplicate found or size > k.',
      'Track max sum when window is valid (size k, all distinct).',
    ],
    pitfalls: ['Window must have exactly k distinct elements. Use map to track duplicates.'],
  },

  2463: {
    intuition: 'Assign robots to factories optimally minimizing total travel. Sort both. DP: dp[i][j] = min cost assigning first i robots to first j factories.',
    algorithm: [
      'Sort robots and factories. DP with factory capacity constraint.',
    ],
    pitfalls: ['Each factory has limited capacity. Sort both arrays for optimal assignment DP.'],
  },

  2466: {
    intuition: 'Count strings where no two adjacent characters are the same. For each position after first: (k-1) choices. Total = k * (k-1)^(n-1).',
    algorithm: [
      'Answer = k * (k-1)^(n-1) % MOD.',
    ],
    pitfalls: ['First position: k choices. Each subsequent: k-1 (any but previous). Use modular exponentiation.'],
  },

  2467: {
    intuition: 'Tree coloring game: Alice colors node x, Bob colors node y to maximize his region. Bob should pick the largest subtree of x, or the complement.',
    algorithm: [
      'DFS to get subtree sizes. Bob picks best of: left subtree of x, right subtree of x, or n - subtree[x].',
      'Bob wins if max(left, right, n-subtree[x]) > n/2.',
    ],
    pitfalls: ['Bob places optimally adjacent to x. Three choices: left child subtree, right child subtree, parent side.'],
  },

  2471: {
    intuition: 'Minimum swaps to sort tree by level. At each level, find minimum swaps to sort level values using cycle detection on permutation.',
    algorithm: [
      'BFS to get each level. Sort each level, find minimum swaps via cycle detection.',
      'Total swaps = sum over all levels.',
    ],
    pitfalls: ['Minimum swaps to sort array = n - number_of_cycles in permutation from current to sorted.'],
  },

  2490: {
    intuition: 'Check if word forms a valid zigzag: letters alternate strictly up and down. Check direction changes.',
    algorithm: [
      'Track direction (up/down). On equal adjacent chars: not zigzag. On direction change: verify it alternates.',
    ],
    pitfalls: ['Direction must alternate at each step. Any two consecutive equal chars invalidate it.'],
  },

  2491: {
    intuition: 'Divide players into pairs where each pair sums to same value. Sort, pair first with last.',
    algorithm: [
      'Sort. Check all pairs (i, n-1-i) have same sum. If yes: answer = sum of product of each pair.',
    ],
    pitfalls: ['All pairs must have same sum. If any pair differs: return -1.'],
  },

  2492: {
    intuition:
      'The graph is connected and undirected. Any path from city 1 to city n can only use edges in the component reachable from 1. The minimum score of a path is limited by its weakest edge, so the answer is the minimum edge weight among all edges reachable from city 1.',
    algorithm: [
      'Build adjacency list from roads.',
      'DFS (or BFS) from city 1, marking visited cities.',
      'Whenever traversing an edge of weight w, update ans = min(ans, w).',
      'Return ans after visiting the whole reachable component.',
    ],
    example: {
      input: 'n = 4, roads = [[1,2,4],[1,3,3],[2,1,2],[3,1,1]]',
      steps: [
        'DFS from 1 visits edges with weights 4, 3, 2, and 1.',
        'The smallest edge weight on any reachable edge is 1.',
      ],
      output: '1',
    },
    pitfalls: [
      'You do not need to find a specific 1→n path — every path uses only edges in the same connected component.',
      'Initialize ans to a large value and update on every edge relaxation during DFS.',
    ],
  },

  2501: {
    intuition: 'Find longest nice subarray where for any two elements, their AND > 0. Wait - actually longest subarray where consecutive elements AND > 0.',
    algorithm: [
      'Actually: two elements are "nice" if AND > 0. Sliding window maintaining that condition.',
    ],
    pitfalls: ['Re-read problem carefully. Usually sliding window on bit conditions.'],
  },

  2503: {
    intuition: 'Maximum number of robots you can run with given budget. Sliding window: cost = max_charge + k * sum_running. Binary search on k robots.',
    algorithm: [
      'Binary search on k (number of robots). Feasibility: sliding window of size k, track max using monotonic deque.',
    ],
    pitfalls: ['For fixed k: cost = maxCharge[window] + k * sumRunning[window]. Use monotonic deque for max.'],
  },

  2509: {
    intuition: 'Find cycle length in permutation where each step applies the permutation. Count cycle containing element 0.',
    algorithm: [
      'Follow permutation from 0 until returning to 0. Count steps.',
    ],
    pitfalls: ['Permutation forms disjoint cycles. Find the cycle containing index 0.'],
  },

  2516: {
    intuition: 'Minimum deletions to make string of k distinct characters. Count frequencies, sort, delete smallest frequencies first.',
    algorithm: [
      'Count frequencies. If distinct <= k: return 0. Sort frequencies ascending. Delete smallest until k remain.',
    ],
    pitfalls: ['We want exactly k distinct characters. Delete characters with smallest frequencies entirely first.'],
  },

  2523: {
    intuition: 'Find closest prime numbers in range [left, right]. Sieve primes in range, find min-gap adjacent pair.',
    algorithm: [
      'Sieve of Eratosthenes up to right. Collect primes in [left, right]. Find adjacent pair with min difference.',
    ],
    pitfalls: ['Return [-1,-1] if fewer than 2 primes in range. Closest primes are always adjacent in sorted order.'],
  },

  2529: {
    intuition: 'Maximize count of positive or negative integers. Sort. Count positive = elements > 0, negative = elements < 0. Return max.',
    algorithm: [
      'Count negatives and positives (exclude zeros). Return max(neg_count, pos_count).',
    ],
    pitfalls: ['Zero is neither positive nor negative. Return the larger count.'],
  },

  2537: {
    intuition: 'Count subarrays with exactly k distinct values. atLeast(k) = total subarrays - atMost(k-1).',
    algorithm: [
      'atMost(k): sliding window with frequency map. Count subarrays with at most k distinct.',
      'Answer = atMost(k) - atMost(k-1).',
    ],
    pitfalls: ['Exactly k = atMost(k) - atMost(k-1). Standard template.'],
  },

  2551: {
    intuition: 'Distribute coins into k bags minimizing maximum bag size. Binary search on max size.',
    algorithm: [
      'Binary search [1, sum/k or max_coin]. Feasibility: can we form k bags each of size <= mid?',
    ],
    pitfalls: ['Binary search on answer. Feasibility check: greedy fill bags up to mid capacity.'],
  },

  2553: {
    intuition: 'Separate digits of each number and insert in order. For each number, expand its digits.',
    algorithm: [
      'For each num: extract digits (from most significant). Insert all digits in order.',
    ],
    pitfalls: ['Maintain relative order of original elements, and digit order within each element.'],
  },

  2558: {
    intuition:
      'Repeat k times: take the largest pile, replace it with floor(sqrt(value)). Use a max-heap to fetch the maximum in O(log n) each round. After k operations, sum everything left in the heap.',
    algorithm: [
      'Push all gifts into a max-priority queue.',
      'Repeat k times: pop max, push (int)Math.Floor(Math.Sqrt(max)).',
      'Drain heap and sum remaining values (use long for sum).',
      'Return total.',
    ],
    example: {
      input: 'gifts = [25,64,9], k = 2',
      steps: [
        'Pop 64 → push 8. Pop 25 → push 5.',
        'Remaining piles 9, 8, 5 → sum 22.',
      ],
      output: '22',
    },
    pitfalls: [
      'Use floor of square root, not round.',
      'Sum can exceed int — accumulate in long.',
      'k operations, not until heap empty.',
    ],
  },

  2559: {
    intuition: 'Count vowel strings in range. Prefix count of vowel-starting strings. Answer per query = prefix[r] - prefix[l-1].',
    algorithm: [
      'Precompute prefix[i] = count of vowel strings in words[0..i-1].',
      'For query [l,r]: answer = prefix[r+1] - prefix[l].',
    ],
    pitfalls: ['Vowel string: starts AND ends with vowel (a,e,i,o,u). Precompute prefix sums.'],
  },

  2560: {
    intuition: 'Minimum operations to make all elements in each house covered. Binary search on answer (number of cops).',
    algorithm: [
      'Binary search on k (number of cops / operations). Feasibility: can k operations cover all houses?',
    ],
    pitfalls: ['Greedy placement of security officers at every k positions. Binary search on coverage gap.'],
  },

  2561: {
    intuition: 'Trade boxes between two people optimally. Sort both. Each trade swaps one item from each. Minimize cost = sum of swaps.',
    algorithm: [
      'Sort both. For each swap: exchange smallest from bob with smallest from alice that reduces cost.',
    ],
    pitfalls: ['Greedy: sort and compare swap costs. Find minimum number of swaps to equalize.'],
  },

  2563: {
    intuition: 'Count pairs with sum in [lower, upper]. Sort, two pointers for counting pairs in range.',
    algorithm: [
      'Sort. For each i: count j > i where lower-nums[i] <= nums[j] <= upper-nums[i]. Binary search for bounds.',
    ],
    pitfalls: ['Binary search for upper_bound(upper-nums[i]) - lower_bound(lower-nums[i]) for each i.'],
  },

  2566: {
    intuition: 'Maximum difference by changing one digit. To maximize: increase leftmost non-9 digit to 9. Decrease: if first digit > 1 set to 1, else find first non-0/1 and set to 0.',
    algorithm: [
      'Max: replace first non-9 digit with 9.',
      'Min: if first digit != 1: replace all first-digit with 1. Else: replace first non-0/1 with 0.',
    ],
    pitfalls: ['Min must not create leading zeros. Special case for first digit.'],
  },

  2570: {
    intuition: 'Merge two sorted lists, removing elements in both. Subtract list2 from list1, combine, sort.',
    algorithm: [
      'Convert list2 to set. Remove from list1 any in set. Remove from list2 any in list1-set. Merge remaining.',
    ],
    pitfalls: ['Remove elements appearing in BOTH lists. Merge and sort the remainders.'],
  },

  2574: {
    intuition:
      'For each index i, we need the absolute difference between the sum of elements to the left and the sum of elements to the right. A naive solution recomputes both sums at every index in O(n^2). The key observation is that as we move one step right, only one element crosses from the right side to the left side, so both sums can be updated in O(1) per index.',
    algorithm: [
      'Initialize leftSum = 0 and rightSum = sum of all elements.',
      'For each index i from 0 to n-1:',
      '  Subtract nums[i] from rightSum so rightSum now represents the sum strictly to the right of i.',
      '  Set answer[i] = |leftSum - rightSum|.',
      '  Add nums[i] to leftSum so leftSum represents the sum of elements up to and including i for the next step.',
      'Return the answer array.',
    ],
    example: {
      input: 'nums = [10, 4, 8, 3]',
      steps: [
        'Start: leftSum = 0, rightSum = 25.',
        'i = 0: rightSum = 15, ans[0] = |0 - 15| = 15, leftSum = 10.',
        'i = 1: rightSum = 11, ans[1] = |10 - 11| = 1, leftSum = 14.',
        'i = 2: rightSum = 3, ans[2] = |14 - 3| = 11, leftSum = 22.',
        'i = 3: rightSum = 0, ans[3] = |22 - 0| = 22, leftSum = 25.',
      ],
      output: '[15, 1, 11, 22]',
    },
    pitfalls: [
      'Subtract nums[i] from rightSum before computing the answer, not after.',
      'Do not include nums[i] in either leftSum or rightSum when computing answer[i].',
      'Using prefix and suffix arrays works but uses O(n) extra space; the running-sum method is enough.',
    ],
  },

  2579: {
    intuition: 'Count beautiful arrangements in grid: rows with same count of colored cells and same value modulo k.',
    algorithm: [
      'Iterate: count cells colored, track pattern. Combinatorial counting.',
    ],
    pitfalls: ['Group by (count mod k). Each group of size g contributes floor(g/2) pairs.'],
  },

  2583: {
    intuition: 'Kth largest sum of binary tree levels. BFS to get each level sum, sort descending, return kth.',
    algorithm: [
      'BFS, compute sum per level. Sort descending. Return sums[k-1].',
    ],
    pitfalls: ['If fewer than k levels: return -1. Use BFS for clean level-order traversal.'],
  },

  2593: {
    intuition: 'Find score of array: pick max, add to score, remove max and its neighbors. Use max-heap with visited tracking.',
    algorithm: [
      'Max-heap. While heap not empty: pop max, if not visited: score += val, mark neighbors visited.',
    ],
    pitfalls: ['Greedy max selection. Skip already-removed elements. Linked list or visited array for neighbor tracking.'],
  },

  2601: {
    intuition: 'Check if n has exactly k set bits and is prime. Count bits, check primality.',
    algorithm: [
      'If popcount(n) != k: false. If n is prime: true.',
    ],
    pitfalls: ['Two conditions: exact bit count AND primality. Use simple trial division for primality.'],
  },

  2616: {
    intuition: 'Minimize maximum difference of pairs. Sort array. Binary search on max diff, greedily pair adjacent elements.',
    algorithm: [
      'Sort. Binary search on diff d. Feasibility: greedy scan pairs: if nums[i+1]-nums[i] <= d: count pair, skip both.',
      'Return minimum d where count >= p.',
    ],
    pitfalls: ['Greedy pairing: after sorting, pair adjacent if within diff. Binary search on the diff value.'],
  },

  2625: {
    intuition:
      'Flatten a nested array to depth n (or fully if depth is large). Each element is either an integer or another array — recurse into sub-arrays with depth-1 until depth is 0 or value is not an array.',
    algorithm: [
      'Define Flatten(arr, depth): if depth==0 or arr is int, return [arr].',
      'Otherwise iterate items: if item is array, extend result with Flatten(item, depth-1); else push item.',
      'Return accumulated list.',
    ],
    example: {
      input: 'arr = [1,[2,[3]]], depth = 2',
      steps: [
        'Depth 2: flatten outer → [1,2,[3]].',
        'Inner [3] stays nested because depth exhausted.',
      ],
      output: '[1,2,[3]]',
    },
    pitfalls: [
      'Depth counts how many levels of nesting you may unwrap.',
      'At depth 0, leave arrays as-is in the result.',
      'Recursive or explicit stack both work.',
    ],
  },

  2640: {
    intuition: 'Maximum score after applying queries. Sort queries, sort array. For each query limit: sum of elements <= limit (prefix sum on sorted array).',
    algorithm: [
      'Sort nums. Sort queries by value. Two pointer/binary search to accumulate sum. Divide by query value.',
    ],
    pitfalls: ['Answer each query with sum of elements in nums that are <= query[i]. Sort both, use running sum.'],
  },

  2641: {
    intuition: 'Replace each node value with sum of cousin values. BFS: track level sum and parent-child sums.',
    algorithm: [
      'BFS. For each node: cousin_sum = level_sum - (node.left?.val + node.right?.val of parent).',
      'Two-pass BFS: first pass compute level sums and sibling sums. Second pass assign cousin sums.',
    ],
    pitfalls: ['Cousin nodes are at same depth but different parents. Sum all same-depth values, subtract sibling pair.'],
  },

  2645: {
    intuition: 'Minimum additions to make string valid (no two consecutive characters are same after additions). Count changes needed.',
    algorithm: [
      'Count positions where s[i] == s[i+1]. Each such conflict needs 1 insertion.',
    ],
    pitfalls: ['Each insertion between two identical adjacent chars. Count adjacent duplicates.'],
  },

  2654: {
    intuition: 'Minimum number of operations to make array k-increasing. Split into k subsequences (indices mod k). For each: minimum deletions to make non-decreasing = n/k - LIS length.',
    algorithm: [
      'For each i in 0..k-1: extract subsequence at indices i, i+k, i+2k... Find LIS length. Ops = length - LIS.',
    ],
    pitfalls: ['k subsequences are independent. Each needs to be non-decreasing. Min ops = sum of (len - LIS len).'],
  },

  2657: {
    intuition: 'Find the k closest numbers using a two-pointer approach on sorted array or priority queue.',
    algorithm: [
      'Sort. Binary search for insertion point of target. Two pointers expanding outward. Take k closest.',
    ],
    pitfalls: ['Tie-breaking: prefer smaller element. Two pointers from found position outward.'],
  },

  2661: {
    intuition: 'Return time when all cells of grid are filled. Simulate flood fill BFS from time 0. For each cell added at time t, t is its time.',
    algorithm: [
      'Create reverse map: value -> position. BFS/simulate additions. Track when each cell is filled.',
      'At time t: cell with value t is added. Return when all n*m cells filled.',
    ],
    pitfalls: ['Cells are filled one by one in order 1..n*m. Time when all filled = n*m.'],
  },

  2684: {
    intuition: 'Max number of moves in grid: from (r,c) can go to (r-1,c+1), (r,c+1), (r+1,c+1) if strictly greater. BFS/DP by column.',
    algorithm: [
      'DP by columns. reachable[c] = set of rows reachable at column c. For each column: expand reachable set.',
      'Return maximum column reached.',
    ],
    pitfalls: ['Must move strictly right (column increases). Value must be strictly greater. BFS column by column.'],
  },

  2685: {
    intuition:
      'Count connected components in an undirected graph given edges. Union-Find merges endpoints; number of distinct roots after all unions is the answer. Isolated nodes (not in any edge) still count as their own component if included in node count n.',
    algorithm: [
      'Initialize parent[i]=i for i in 0..n-1.',
      'For each edge [u,v]: union(u,v).',
      'Count distinct find(i) for all i — or decrement component count on successful unions.',
      'Return component count.',
    ],
    example: {
      input: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
      steps: [
        'Component {0,1,2} and {3,4} → 2 components.',
      ],
      output: '2',
    },
    pitfalls: [
      'Nodes with no edges are still components if 0..n-1 all exist.',
      'Path compression in find speeds large graphs.',
      'Undirected — union(a,b) once per edge.',
    ],
  },

  2696: {
    intuition: 'Minimum string length after removing AB or CD substrings. Repeat until no more removals. Stack-based.',
    algorithm: [
      'Stack. For each char: if stack.top + char == AB or CD: pop. Else: push.',
      'Return stack size.',
    ],
    pitfalls: ['Stack handles nested removals automatically. Single pass O(n).'],
  },

  2707: {
    intuition: 'Extra characters in string: minimum characters not used in any dictionary word. DP.',
    algorithm: [
      'dp[i] = min extra chars using s[0..i-1]. dp[0]=0.',
      'For each i: dp[i] = dp[i-1]+1 (skip s[i-1]). For each word in dict ending at i: dp[i] = min(dp[i], dp[i-len]).',
    ],
    pitfalls: ['Standard word break DP variant. For each position, try all dictionary words ending there.'],
  },

  2718: {
    intuition: 'Sum of matrix after k operations: each operation applies row sums as new row values. Find pattern or simulate.',
    algorithm: [
      'After each step, rows get redistributed. Simulate k steps or find cycle.',
    ],
    pitfalls: ['Track row sums evolving over k steps. Usually small constraints allow simulation.'],
  },

  2749: {
    intuition: 'Check if (num1 XOR num2) can equal num3 for a pair from array. Enumerate or bit manipulation.',
    algorithm: [
      'For each pair (i,j): if nums[i] XOR nums[j] exists in nums: return true.',
      'Optimize: HashSet lookup.',
    ],
    pitfalls: ['O(n^2) enumeration with HashSet lookup for third element. Or XOR properties.'],
  },

  2762: {
    intuition: 'Count subarrays with at least k distinct values and AND > 0... actually re-read. Count subarrays where bitwise OR has at least k set bits.',
    algorithm: [
      'Sliding window. Maintain OR of window. When OR has >= k bits: count subarrays.',
    ],
    pitfalls: ['OR only increases as window grows. Shrink from left when condition exceeded.'],
  },

  2765: {
    intuition:
      'Find the longest subarray where consecutive differences strictly alternate between +1 and -1 (not general sign flips). Track the current run length: extend when the next diff matches the expected +1 or -1; otherwise reset to a new run of length 2 or 1. Return -1 if no alternating subarray of length >= 2 exists.',
    algorithm: [
      'Initialize ans = 1, dp = 1 (length of run ending at previous index).',
      'For i from 1 to n-1: expected diff is +1 if dp is odd length, -1 if even.',
      'If nums[i] - nums[i-1] == expected: dp++.',
      'Else if diff == +1: reset dp = 2 (start new run at i-1..i).',
      'Else: reset dp = 1. Update ans = max(ans, dp).',
      'Return ans == 1 ? -1 : ans.',
    ],
    example: {
      input: 'nums = [1,2,3,4,3,2,1]',
      steps: [
        'Diffs +1,+1 break alternation; best run may be shorter segments like 1,2,3,4,3 (diffs +1,+1,-1).',
      ],
      output: 'length of longest valid alternating subarray',
    },
    pitfalls: [
      'Only +1 and -1 diffs count — zero or larger gaps reset the pattern.',
      'Return -1 when no subarray of length >= 2 alternates.',
      'Subarray must be contiguous, not subsequence.',
    ],
  },

  2779: {
    intuition: 'Maximum beauty of array: change each element by at most k, then find longest equal-element subarray. Each element can become any value in [nums[i]-k, nums[i]+k]. Find max overlapping intervals.',
    algorithm: [
      'Sort. Sliding window: window valid if nums[r] - nums[l] <= 2k.',
    ],
    pitfalls: ['After sorting, a valid window is where max - min <= 2k. Simple sliding window after sort.'],
  },

  2780: {
    intuition: 'Minimum index of valid split: dominant element appears > half times in both halves. Find dominant element, then first valid split.',
    algorithm: [
      'Boyer-Moore to find dominant element. Verify majority. Scan left: when left count > left_size/2: check right.',
    ],
    pitfalls: ['Dominant = majority element. First valid split where it dominates both halves.'],
  },

  2785: {
    intuition: 'Rearrange vowels in place by sorting them. Extract vowels, sort, put back in same vowel positions.',
    algorithm: [
      'Find vowel positions. Extract vowels, sort. Place back at vowel positions.',
    ],
    pitfalls: ['Only move vowels. Consonants stay fixed. Vowel positions stay fixed but get sorted vowels.'],
  },

  2799: {
    intuition: 'Count subarrays where each element appears at least twice? Or count "complete" subarrays with all k distinct values. Count subarrays containing all distinct elements of nums.',
    algorithm: [
      'Let k = distinct elements in nums. Count subarrays with exactly k distinct elements.',
      'Sliding window: when window has k distinct values: all extensions to right are valid.',
    ],
    pitfalls: ['Total distinct k. Subarrays with all k = n*(n+1)/2 - subarrays with < k distinct. Sliding window.'],
  },

  2807: {
    intuition: 'Insert greatest common divisors between every pair of adjacent elements. GCD of adjacent pair inserted between them.',
    algorithm: [
      'For each adjacent pair (nums[i], nums[i+1]): compute GCD, insert between them.',
      'Build new array with original elements and inserted GCDs.',
    ],
    pitfalls: ['New array has 2n-1 elements. GCD computed for original adjacent pairs only.'],
  },

  2812: {
    intuition:
      'Path safeness is the minimum Manhattan distance to any thief along the route. Maximize that bottleneck — a maximin shortest-path problem on an implicit grid graph, analogous to LC 778 (Swim in Rising Water) but with precomputed cell weights.',
    algorithm: [
      'Multi-source BFS from every thief (grid cell = 1): dist[r][c] = Manhattan distance to the nearest thief.',
      'Max-heap Dijkstra from (0,0): state priority = path safeness = min(dist along the path so far).',
      'Relax a neighbor (nr, nc) with ns = min(current safeness, dist[nr][nc]); push if ns improves best[nr][nc].',
      'First time the destination is popped, return its safeness (max-heap guarantees maximin optimum).',
    ],
    example: {
      input: 'grid = [[1,0,0],[0,0,0],[0,0,0]]',
      steps: [
        'Thief at (0,0): dist[0][0]=0, neighbors get 1, then 2, …',
        'Start (0,0) has safeness 0; any path must pass near the thief — answer 0.',
        'grid = [[0,1,1],[0,0,0],[0,0,0]]: dist[0][0]=1 from thief (0,1); maximin path keeps safeness 1.',
      ],
      output: '0 / 1 / 2 depending on grid',
    },
    pitfalls: [
      'Use 4-direction neighbors only — Dc must be {1,-1,0,0}, not {1,0,0,-1} (wrong order creates diagonal moves and corrupts BFS distances).',
      'Binary search on answer + feasibility BFS also works (~O(n² log n) passes); one maximin Dijkstra is simpler and same asymptotic cost.',
      '(0,0) and (n-1,n-1) are guaranteed safe (no thieves); dist there is the starting safeness, not infinity.',
    ],
  },

  2818: {
    intuition: 'Apply operations maximizing score. Score = product of chosen elements. Use prime factorization and greedy assignment.',
    algorithm: [
      'For each element: factorize. Sort prime factors. Assign each prime to minimize the score loss using binary search.',
    ],
    pitfalls: ['Each prime factor contributes independently. Sort and assign greedily for maximum product.'],
  },

  2825: {
    intuition: 'Check if string s can become t by rotating t (i.e., t is a rotation of s). Standard rotation check: s == t or s in t+t.',
    algorithm: [
      'If s.length != t.length: false. Return (t+t).contains(s).',
    ],
    pitfalls: ['Rotation: t is a rotation of s iff s appears in t+t. Length must match.'],
  },

  2839: {
    intuition: 'Check if two strings are k-similar (differ in at most k swaps to make equal). BFS on permutation states.',
    algorithm: [
      'BFS from s. Each state: find first mismatch, try all valid swaps. Count levels to reach t.',
    ],
    pitfalls: ['K-similar problems need BFS with pruning. Greedy: fix leftmost mismatch, try valid positions.'],
  },

  2840: {
    intuition: 'Check if array is beautiful: no element equals the last digit of the next element.',
    algorithm: [
      'For each i: if nums[i] % 10 == nums[i+1]: return false. Return true.',
    ],
    pitfalls: ['Compare last digit of current with value of next. nums[i] % 10 gives last digit.'],
  },

  2843: {
    intuition: 'Count symmetric integers (equal digit sums in first and second halves). Only even-digit numbers qualify.',
    algorithm: [
      'For each n in [low, high]: if odd digits: skip. Sum first half digits = sum second half digits.',
    ],
    pitfalls: ['Only even-length numbers can be symmetric. Convert to string, split halves, compare sums.'],
  },

  2845: {
    intuition: 'Count interesting subarrays where count of elements with val%modulo==k satisfies count%modulo==k. Prefix count + hashmap.',
    algorithm: [
      'prefix[i] = count of elements in nums[0..i-1] with val%modulo==k.',
      'For each j: need prefix[j] - prefix[i] satisfies (cnt%modulo==k). Use hashmap of prefix[i]%modulo.',
    ],
    pitfalls: ['Standard prefix sum modulo trick. Map prefix_mod -> count. Answer += map[(prefix[j]-k+modulo)%modulo].'],
  },

  2872: {
    intuition: 'Maximum sum of at most k subtrees that are non-overlapping. Tree DP with node selection.',
    algorithm: [
      'DFS. At each node: collect subtree sums. Greedily pick top-k positive subtree sums.',
    ],
    pitfalls: ['Non-overlapping subtrees: if parent selected, children cannot be. Greedy after sorting.'],
  },

  2873: {
    intuition: 'Maximum value of ordered triple (i<j<k): nums[i]-nums[j]+nums[k]. Fix j as middle, maximize nums[i] to the left and nums[k] to the right.',
    algorithm: [
      'For each j: prefix_max[j] = max of nums[0..j-1]. suffix_max[j] = max of nums[j+1..n-1].',
      'ans = max over j of (prefix_max[j] - nums[j] + suffix_max[j]).',
    ],
    pitfalls: ['Negative contribution at j is fine. Precompute prefix max and suffix max in O(n).'],
  },

  2874: {
    intuition: 'Maximize value of ordered triple: same as 2873 but different formula. nums[i]*nums[j]*nums[k] or (nums[i]-nums[k])*nums[j].',
    algorithm: [
      'Track max so far (for i), max*(max-num) for (i,j pair). Then add nums[k].',
      'Single pass: maxVal, maxDiff = max(maxVal - nums[j]), ans = max(maxDiff + nums[k]).',
    ],
    pitfalls: ['One-pass greedy updating three values: max element, max (A-B), max (A-B)*C.'],
  },

  2894: {
    intuition: 'Divisible and non-divisible sums difference. Sum all nums 1..n minus 2*(sum of multiples of m).',
    algorithm: [
      'Total = n*(n+1)/2. Sum of multiples of m up to n: m*(1+2+...+k) where k=floor(n/m). = m*k*(k+1)/2.',
      'Answer = total - 2 * multiples_sum.',
    ],
    pitfalls: ['Answer = (sum of non-divisible) - (sum of divisible). Direct formula.'],
  },

  2900: {
    intuition: 'Find longest valid sequence by removing some elements. Subsequence where adjacent difference alternates sign.',
    algorithm: [
      'DP: dp[i][0] = longest ending at i where last step was positive. dp[i][1] = negative last step.',
    ],
    pitfalls: ['Zigzag subsequence. Similar to longest alternating subsequence DP.'],
  },

  2901: {
    intuition:
      'Pick the longest subsequence of words where adjacent picked words belong to different groups AND differ in exactly one character (same length, Hamming distance 1). This is DP on indices: extend word i from j when groups differ and words are one edit apart.',
    algorithm: [
      'dp[i] = length of best subsequence ending at words[i]; prev[i] for reconstruction.',
      'For each i, for each j < i: skip if groups[i] == groups[j].',
      'Require words[i].Length == words[j].Length and HammingDist == 1.',
      'If dp[j]+1 > dp[i]: update dp[i] and prev[i] = j.',
      'Reconstruct from index with maximum dp[i].',
    ],
    example: {
      input: 'words with groups; adjacent picks must differ in group and by one char',
      steps: [
        'Try all prior words as predecessor; keep best chain satisfying both constraints.',
      ],
      output: 'longest valid word subsequence (lex order not required in answer list)',
    },
    pitfalls: [
      'Hamming distance exactly 1 — not subsequence edit distance on strings.',
      'Groups must differ between consecutive picks — same group cannot chain.',
      'O(n^2 * L) is acceptable; return the actual word list, not just length.',
    ],
  },

  2906: {
    intuition: 'Construct matrix with column-wise prefix OR sums (each row i is OR of first i+1 elements per column).',
    algorithm: [
      'For each column j: result[i][j] = OR of matrix[0][j]..matrix[i][j]. Prefix OR column-wise.',
    ],
    pitfalls: ['OR is monotonically non-decreasing (bits only get set). Simple prefix accumulation.'],
  },

  2914: {
    intuition: 'Minimum string changes to make string good (each character has even count). Count characters with odd frequency.',
    algorithm: [
      'Count frequencies. Odd frequency chars must pair up. Min changes = oddCount / 2.',
    ],
    pitfalls: ['Each swap can fix two odd-frequency characters. Minimum changes = floor(oddCount/2).'],
  },

  2924: {
    intuition: 'Find champion in tournament DAG: node with in-degree 0. Only one team can beat all others.',
    algorithm: [
      'Compute in-degrees. Return the single node with in-degree 0. If multiple: return -1.',
    ],
    pitfalls: ['Champion has in-degree 0. If multiple nodes have in-degree 0: no unique champion, return -1.'],
  },

  2929: {
    intuition: 'Count ways to distribute n candies among 3 children where each gets at least 1 and at most limit. Inclusion-exclusion.',
    algorithm: [
      'Total ways (each >= 1, no upper limit): C(n-1, 2) (stars and bars).',
      'Subtract cases where any child gets > limit: 3 * C(n-limit-2, 2). Add back double-counted: 3 * C(n-2*limit-3, 2).',
    ],
    pitfalls: ['Inclusion-exclusion on upper bound violations. C(k,2) = 0 when k < 2.'],
  },

  2930: {
    intuition: 'Count strings of length n from alphabet where each char appears an even number of times. Bitmask DP on parity.',
    algorithm: [
      'dp[mask] = number of strings where mask represents parity of each char (0=even, 1=odd).',
      'After all positions: count strings where all parities are even = dp[0].',
    ],
    pitfalls: ['State = bitmask of parities. Start with dp[0]=1. For each char of alphabet: XOR its bit into mask.'],
  },

  2938: {
    intuition: 'Minimum swaps to group all 0s to left and all 1s to right. Count 1s in left half (should be 0s).',
    algorithm: [
      'Count total 1s = k. Sliding window of size k: minimum 0s in window = minimum swaps.',
    ],
    pitfalls: ['Swaps needed = 0s in the window of size (total 1s). Sliding window minimum.'],
  },

  2940: {
    intuition: 'Find buildings where person can see a sunset. Monotone stack: maintain decreasing stack of heights.',
    algorithm: [
      'Traverse from right. Maintain monotone decreasing stack. A building can see sunset if taller than all to its right.',
    ],
    pitfalls: ['Scan right to left. Building i is visible if height[i] > max of heights to its right.'],
  },

  2942: {
    intuition: 'Find words that contain a given character. Filter words list by checking if character is in each word.',
    algorithm: [
      'For each i: if x in words[i]: add i to result.',
    ],
    pitfalls: ['Simple containment check. Return indices, not words.'],
  },

  2943: {
    intuition: 'Maximize total value of all subarrays after applying operations. Each value can be doubled once. Greedy selection.',
    algorithm: [
      'For each element: decide whether to double it. Doubling a[i] increases all subarrays containing i.',
      'Greedy: double element that contributes most (highest value in smallest subarray context).',
    ],
    pitfalls: ['Each element can be doubled at most once. Sort by value, double greedily.'],
  },

  2946: {
    intuition: 'Check if string has "beautiful" splits: first part is prefix of second, or second is prefix of third.',
    algorithm: [
      'For each split point (i, j): check if s[0..i-1] is prefix of s[i..j-1] OR s[i..j-1] is prefix of s[j..].',
    ],
    pitfalls: ['O(n^3) brute force. Optimize with Z-array or KMP prefix function for O(n^2).'],
  },

  2962: {
    intuition: 'Count subarrays with exactly k distinct values where each distinct value appears at least k times. Sliding window.',
    algorithm: [
      'Count subarrays where max element count >= k. Sliding window: when any element count >= k, count subarrays.',
    ],
    pitfalls: ['Count subarrays where maximum frequency >= k. For each right endpoint, binary search or track counts.'],
  },

  2965: {
    intuition: 'Find missing and repeated values in grid where each value 1..n^2 appears exactly once except one missing and one extra.',
    algorithm: [
      'Count occurrences. Value with count 2 = repeated. Value with count 0 = missing.',
    ],
    pitfalls: ['Use frequency array. Or sum + sum of squares formulas for O(1) space.'],
  },

  2966: {
    intuition: 'Divide array into groups of 3 where max-min <= 2. Sort, take consecutive groups of 3.',
    algorithm: [
      'Sort array. For each i in steps of 3: if nums[i+2]-nums[i] > 2: return [].',
      'Otherwise group consecutive triples.',
    ],
    pitfalls: ['After sorting, optimal grouping is consecutive triples. Any other grouping is worse.'],
  },

  2975: {
    intuition: 'Maximum area square subgrid with at most k obstacles inside. Binary search on side length + 2D prefix sums.',
    algorithm: [
      'Prefix sum of obstacle grid. Binary search on side length. Check all positions for obstacle count <= k.',
    ],
    pitfalls: ['2D prefix sum for O(1) rectangle queries. Binary search on answer.'],
  },

  2976: {
    intuition: 'Minimum cost to make all characters of a string the same using keyboard adjacency costs. DP on character sequences.',
    algorithm: [
      'Model as shortest path: cost to convert char a to b = min hops on keyboard * time_multiplier.',
      'Dijkstra or BFS on 26-char graph.',
    ],
    pitfalls: ['Build graph from keyboard layout. Dijkstra for all-pairs shortest paths between characters.'],
  },

  2977: {
    intuition: 'Minimum cost to convert source string to target with given conversion costs. Floyd-Warshall on character costs.',
    algorithm: [
      'Build cost graph: cost[a][b] = min cost to convert a->b. Floyd-Warshall for transitive minimums.',
      'For each position: if source[i]!=target[i], add cost[source[i]][target[i]].',
    ],
    pitfalls: ['Transitive conversions: a->b->c may be cheaper than direct a->c. Floyd-Warshall on 26 nodes.'],
  },

  2980: {
    intuition: 'Check if grid has unique values within each column and row. Verify all grid entries are distinct in same row/col.',
    algorithm: [
      'For each row: check distinct. For each column: check distinct.',
    ],
    pitfalls: ['Simple distinct check per row and per column. HashSet per row/column.'],
  },

  2981: {
    intuition: 'Length of longest "nice" substring (has uppercase+lowercase of every letter used). Find longest substring where each letter has both cases.',
    algorithm: [
      'Recursive: split at letter missing its case pair. Return longest result.',
      'For each char in s: if uppercase exists but not lowercase (or vice versa): split and recurse.',
    ],
    pitfalls: ['Same approach as LC 1763. Split on missing-case characters, recurse on segments.'],
  },

  2999: {
    intuition: 'Count numbers with same digit count and digit sum as n. Group by (digitCount, digitSum).',
    algorithm: [
      'Extract digitCount and digitSum of n. Count integers in [1..10^digitCount-1] with same digitSum and same digitCount.',
    ],
    pitfalls: ['DP: count k-digit numbers with given digit sum. Subtract n itself if it matches.'],
  },

  3000: {
    intuition: 'Maximum area of longest diagonal rectangle. For each rectangle, compute diagonal length = sqrt(w^2+h^2). Return max area with max diagonal.',
    algorithm: [
      'For each rectangle: diag^2 = w^2 + h^2. Track max diag^2, and max area among those.',
    ],
    pitfalls: ['Compare diagonal squared (avoids float). Among all max-diagonal rectangles, return max area.'],
  },

  3001: {
    intuition: 'Minimum moves to capture the queen. Bishop, rook, and queen positions. Rook or bishop can capture in 1 or 2 moves.',
    algorithm: [
      'Check if rook can reach queen in 1 move (same row/col, not blocked by bishop).',
      'Check if bishop can reach queen in 1 move (same diagonal, not blocked by rook).',
      'Otherwise: 2 moves.',
    ],
    pitfalls: ['1 move if direct line of sight exists and not blocked. Otherwise always 2 moves.'],
  },

  3005: {
    intuition: 'Count elements with maximum frequency. Find max frequency, count how many elements have it.',
    algorithm: [
      'Frequency map. maxFreq = max value in map. Count keys with freq == maxFreq.',
    ],
    pitfalls: ['Simple frequency counting. Sum all elements that have the maximum frequency.'],
  },

  3010: {
    intuition: 'Divide array into minimum subarrays where each subarray has a minimum score (min[subarray]). Each subarray must satisfy min*length >= k.',
    algorithm: [
      'Binary search or greedy partition. For minimum subarrays: greedily extend current subarray as long as valid.',
    ],
    pitfalls: ['Check feasibility with binary search on number of partitions.'],
  },

  3011: {
    intuition: 'Find if number can be represented as product of distinct positive integers (all > 1). Always true for n > 1.',
    algorithm: [
      'Any integer n > 1 can be represented as product: just n itself. Return n > 1.',
    ],
    pitfalls: ['n = n*1 is not valid (1 not allowed). n itself as single element works for n > 1.'],
  },

  3013: {
    intuition: 'Divide players into teams of 2 where each pair skill sum equals same target. Sort, pair smallest with largest.',
    algorithm: [
      'Sort. Check all pairs (i, n-1-i) have same sum. Chemistry = product of each pair.',
    ],
    pitfalls: ['Same as LC 2491. Sort and pair opposites. Return -1 if any pair differs in sum.'],
  },

  3016: {
    intuition: 'Minimum number of operations to make string of length n where each character replaces its value. Operations = insertions of characters to satisfy constraints.',
    algorithm: [
      'Each character contributes to constraints on adjacent characters. Count required insertions.',
    ],
    pitfalls: ['Count consecutive characters needing insertions between them based on their difference.'],
  },

  3020: {
    intuition:
      'Build a subset that looks like x, x², x⁴, … using copies from nums. Each intermediate value in the chain needs at least two copies (pair them); the terminal power needs only one. The value 1 is special because 1² = 1 — use every copy when the count is odd, otherwise drop one. Try every distinct starting value and take the maximum chain length.',
    algorithm: [
      'Frequency-map all values in nums; track maxNum.',
      'If 1 exists: ans = count[1] minus 1 when count[1] is even, else count[1].',
      'For each num ≠ 1: walk x = num, num², num⁴, … while x ≤ maxNum and count[x] ≥ 2, adding 2 to length each step.',
      'After the loop: add 1 if count[x] exists for the next power, else subtract 1.',
      'Return the maximum length over all starts.',
    ],
    example: {
      input: 'nums with chain 2 → 4 → 16',
      steps: [
        'Two 2s and two 4s give +2 each; one 16 adds +1 at the end.',
        'Length 5 beats the all-1s chain if that is shorter.',
      ],
      output: 'maximum subset size',
    },
    pitfalls: [
      'Use long for x while squaring — int overflow before x > maxNum check.',
      'Handle 1 separately; the while-loop pairing rule does not apply to the 1-cycle.',
      'The final +1/−1 adjusts when the last pair has no singleton successor.',
    ],
  },

  3021: {
    intuition: 'Alice and Bob word game: each gets words with unique first letters. Count Alice wins (more distinct first letters).',
    algorithm: [
      'Split words alternating. Count distinct first letters for each. Compare.',
    ],
    pitfalls: ['Alice takes words[0], words[2],... Bob takes words[1], words[3],... Count distinct firsts.'],
  },

  3024: {
    intuition:
      'Given three stick lengths, they form a non-zero area triangle iff the sum of the two smaller sides exceeds the largest. Sort three numbers and check nums[0]+nums[1] > nums[2].',
    algorithm: [
      'Sort the three sides ascending.',
      'If nums[0] + nums[1] > nums[2], return the triangle type required (e.g. "yes" / specific label).',
      'Else degenerate or impossible triangle.',
    ],
    example: {
      input: 'nums = [2,3,4]',
      steps: [
        'Sorted: 2,3,4. 2+3=5 > 4 — valid triangle.',
      ],
      output: 'valid triangle classification',
    },
    pitfalls: [
      'After sorting, only one inequality check needed.',
      'Equality (2+3=5) is degenerate — not a valid triangle for positive area.',
      'Exactly three sides in problem.',
    ],
  },

  3025: {
    intuition: 'Find number of wonderful substrings (at most one character with odd frequency). Bitmask on character parities.',
    algorithm: [
      'Prefix XOR bitmask. For each j: count prefix masks equal to current (all even) or differing in exactly one bit.',
    ],
    pitfalls: ['Same as count of substrings with all even frequencies + those with exactly one odd. Hashmap of prefix masks.'],
  },

  3027: {
    intuition: 'Find minimum cost to repair edges to create a spanning tree. Prim/Kruskal with repair option.',
    algorithm: [
      'Model: existing edges have cost 0 or repair cost. Add new edges. Find minimum spanning tree.',
    ],
    pitfalls: ['Each repaired edge has given cost. Standard MST on modified graph.'],
  },

  3042: {
    intuition: 'Count prefix-suffix pairs (i, j) where words[i] is both a prefix and suffix of words[j].',
    algorithm: [
      'For each pair (i,j) with i<j: check words[j].startsWith(words[i]) && words[j].endsWith(words[i]).',
    ],
    pitfalls: ['O(n^2 * L) brute force. Optimize with Trie on reversed strings or Z-function.'],
  },

  3043: {
    intuition: 'Find length of longest common prefix between all pairs of strings from two arrays.',
    algorithm: [
      'Trie on arr1. For each string in arr2: traverse Trie, find longest matching prefix.',
      'Return max matching length.',
    ],
    pitfalls: ['Build Trie from arr1. Query each word of arr2 against Trie.'],
  },

  3047: {
    intuition: 'Find maximum and minimum sum of n+1 elements from two arrays. Pick largest n+1 from combined, smallest n+1.',
    algorithm: [
      'Merge and sort. Max sum = sum of top n+1 values ensuring at least one from each array.',
      'Min sum = sum of bottom n+1 values with same constraint.',
    ],
    pitfalls: ['Must include at least one element from each array. Greedy with constraint handling.'],
  },

  3066: {
    intuition: 'Minimum operations to exceed threshold k. Each op: remove two smallest, add their sum+min back. Use min-heap.',
    algorithm: [
      'Min-heap. While min < k: pop two smallest a,b. Push min(a,b)*2+max(a,b). Count ops.',
    ],
    pitfalls: ['Heap operation is pop two, push one. Continue until minimum element >= k.'],
  },

  3068: {
    intuition: 'Find maximum sum by selecting elements such that no element is divisible by the previous. Greedy or DP.',
    algorithm: [
      'Sort descending. Greedy: take element if not divisible by the last taken.',
    ],
    pitfalls: ['The constraint is on consecutive selected elements. Greedy after sorting.'],
  },

  3070: {
    intuition: 'Count elements greater than all neighbors. For each element: if greater than left and right neighbors: count.',
    algorithm: [
      'For i from 1 to n-2: if nums[i] > nums[i-1] && nums[i] > nums[i+1]: count++.',
    ],
    pitfalls: ['Endpoints are not counted (no two neighbors). Interior elements only.'],
  },

  3085: {
    intuition: 'Minimum deletions to make string good: each character appears either 0 or >= minFreq times. Delete until constraint satisfied.',
    algorithm: [
      'Count frequencies. For each char with freq < minFreq: delete all (add freq to ops). Others: keep.',
    ],
    pitfalls: ['A character must appear 0 or >= minFreq times. Delete entire character if under threshold.'],
  },

  3097: {
    intuition: 'Shortest subarray with bitwise OR >= k. Sliding window with OR: OR only increases, shrink left when condition met.',
    algorithm: [
      'Sliding window. Maintain OR of window. When OR >= k: record length, try to shrink left.',
      'Challenge: OR cannot easily be decremented. Track bit counts to support removal.',
    ],
    pitfalls: ['Track bit counts in window for each of 32 bits. Remove left: decrement counts; if count becomes 0, unset bit.'],
  },

  3100: {
    intuition: 'Detect if water flows to Pacific and Atlantic. Multi-source BFS from ocean borders inward.',
    algorithm: [
      'Two BFS: one from Pacific border cells, one from Atlantic. Water flows UP (reverse direction).',
      'Return cells reachable by both BFS.',
    ],
    pitfalls: ['Reverse problem: find cells that can reach ocean. BFS from ocean going to higher cells.'],
  },

  3105: {
    intuition: 'Find longest strictly increasing then strictly decreasing subarray. DP on both directions.',
    algorithm: [
      'inc[i] = length of longest strictly increasing ending at i. dec[i] = longest strictly decreasing starting at i.',
      'Answer = max(inc[i] + dec[i] - 1) where both > 1 (actual peak).',
    ],
    pitfalls: ['Peak must have both inc and dec > 1. Maximum mountain length.'],
  },

  3108: {
    intuition: 'Minimum cost of connecting graph edges. Find connected components using Union-Find. Cost = number of components - 1.',
    algorithm: [
      'Union-Find on edges. Count connected components.',
      'Minimum edges to connect = components - 1.',
    ],
    pitfalls: ['Standard MST cost or connectivity cost. Answer is components - 1.'],
  },

  3116: {
    intuition: 'Kth smallest amount using coins: binary search + inclusion-exclusion on multiples of coin combinations.',
    algorithm: [
      'Binary search on value v. Count numbers <= v that are multiples of at least one coin using inclusion-exclusion.',
    ],
    pitfalls: ['Include-exclude on coin LCMs. Binary search on the answer.'],
  },

  3122: {
    intuition: 'Find minimum operations to convert source to target where each operation merges elements at cost. Interval DP.',
    algorithm: [
      'DP on matching subsequences. Find longest common subsequence structure then compute ops.',
    ],
    pitfalls: ['Complex interval DP matching target structure in source.'],
  },

  3129: {
    intuition: 'Find K-or of array: bit b is set if at least k numbers have that bit set.',
    algorithm: [
      'For each bit position b (0..31): count numbers with bit b set. If count >= k: set bit b in result.',
    ],
    pitfalls: ['Count per bit position. Set bit if count >= k. Simple O(32n).'],
  },

  3133: {
    intuition: 'Minimum sum of array after operations: replace elements to minimize sum maintaining divisibility constraint.',
    algorithm: [
      'For each element starting from end: if nums[i] > nums[i-1]: set nums[i-1] = ceil(nums[i-1]/nums[i])*nums[i] to minimize while maintaining constraint.',
    ],
    pitfalls: ['Work backwards. Each element must divide the previous. Minimize by rounding up to nearest multiple.'],
  },

  3136: {
    intuition: 'Check if number is valid: no leading zeros (if multi-digit) and contains only digits and at most one decimal point.',
    algorithm: [
      'Validate: all chars are digits or one decimal point. No leading zeros unless single digit or decimal.',
    ],
    pitfalls: ['Edge cases: "0", "0.1", ".5" (invalid leading decimal in some definitions). Read problem carefully.'],
  },

  3151: {
    intuition: 'Check if array is "special": every adjacent pair has different parity (one odd, one even).',
    algorithm: [
      'For each i from 0 to n-2: if nums[i]%2 == nums[i+1]%2: return false.',
    ],
    pitfalls: ['Adjacent elements must alternate parity. One same-parity pair fails the check.'],
  },

  3152: {
    intuition: 'For each query [l,r]: check if subarray is special (adjacent parities alternate). Prefix sum of "bad" pairs.',
    algorithm: [
      'Precompute bad[i] = 1 if nums[i]%2 == nums[i+1]%2. Prefix sum. Query [l,r] is special if sum of bad[l..r-1] == 0.',
    ],
    pitfalls: ['A subarray is special iff no bad adjacent pairs within it. Prefix sum for O(1) queries.'],
  },

  3160: {
    intuition: 'Count queries where XOR of element at index equals query value. Maintain current values and XOR results.',
    algorithm: [
      'Simulate: for each query (idx, val): update value[idx], XOR[idx] ^= old_val ^ val. Count matching queries.',
    ],
    pitfalls: ['Track current values to compute XOR changes. Count pairs matching target after each update.'],
  },

  3169: {
    intuition:
      'Count days in [1, days] with no meetings. Sort meeting intervals, sweep in order, and add gap lengths between non-overlapping busy spans. After the last meeting, add remaining free days until day `days`. Overlapping meetings merge implicitly by tracking prevEnd.',
    algorithm: [
      'Sort meetings by start day.',
      'freeDays = 0, prevEnd = 0.',
      'For each [start, end]: if start > prevEnd + 1, add start - prevEnd - 1 to freeDays.',
      'Set prevEnd = max(prevEnd, end).',
      'After loop: add max(0, days - prevEnd) for trailing free days.',
      'Return freeDays.',
    ],
    example: {
      input: 'days = 10, meetings = [[5,7],[1,3],[9,10]]',
      steps: [
        'Sorted: [1,3],[5,7],[9,10]. Gap before 5: day 4. After day 7 until 9: day 8. None after 10.',
      ],
      output: '2',
    },
    pitfalls: [
      'Meetings are inclusive [start, end] — gap between prevEnd and next start is start - prevEnd - 1.',
      'Overlapping meetings: prevEnd = max(prevEnd, end) without double-counting busy days.',
      'Do not subtract from days naively without handling overlaps.',
    ],
  },

  3170: {
    intuition:
      'Each * removes the nearest non-star character to its left. Process left to right with a stack: push letters, pop on star. Same pattern as removing adjacent pairs but stars only delete to the left. Build result from stack contents.',
    algorithm: [
      'Stack<char> st.',
      'For each character c in s:',
      'If c is * and stack not empty: pop.',
      'Else if c is not *: push c.',
      'Return new string from stack (in order).',
    ],
    example: {
      input: 's = "leet**o*eet"',
      steps: [
        'Push l,e,e,t. * pops t. * pops e. Continue until stars remove left neighbors.',
      ],
      output: '"leetoeet" (per problem examples)',
    },
    pitfalls: [
      'Only remove when stack is non-empty — extra stars are ignored.',
      'Stars never get pushed onto the stack.',
      'Equivalent to LC 2390 Removing Stars From a String.',
    ],
  },

  3174: {
    intuition:
      'Each digit character removes the closest non-digit to its left (if any). Scan left to right with a stack: push non-digits, pop one character when you see a digit. Remaining stack is the answer — digits themselves are never kept.',
    algorithm: [
      'Stack<char> st.',
      'For each character c:',
      'If c is a digit and st not empty: pop once.',
      'Else if c is not a digit: push c.',
      'Return string built from stack.',
    ],
    example: {
      input: 's = "abc"',
      steps: [
        'No digits — nothing removed. Output "abc".',
      ],
      output: '"abc"',
    },
    pitfalls: [
      'Digit triggers removal but is not added to result.',
      'If stack empty on digit, skip removal.',
      'Use char.IsDigit or compare to 0-9 range.',
    ],
  },

  3191: {
    intuition: 'Minimum operations to make binary array all ones: each op flips 3 consecutive elements. Greedy left-to-right.',
    algorithm: [
      'Scan left to right. When nums[i]==0: flip nums[i], nums[i+1], nums[i+2]. Count flips.',
      'If i+2 >= n when flip needed: return -1.',
    ],
    pitfalls: ['Greedy: flip at leftmost 0. If cannot flip (near end): impossible. O(n) solution.'],
  },

  3192: {
    intuition: 'Minimum operations to alternate binary array. Compare with patterns 010101... and 101010..., return min mismatches.',
    algorithm: [
      'Count mismatches with pattern starting with 0. Answer = min(mismatches, n - mismatches).',
    ],
    pitfalls: ['Two valid alternating patterns. Count mismatches with one, n-count for the other. Return min.'],
  },

  3201: {
    intuition:
      'Find the longest subsequence (not necessarily contiguous) where the sum of every adjacent pair is divisible by k (k = 2 in constraints). Track DP by residues mod k: when adding nums[i], extend chains whose previous residue pairs to sum 0 mod k.',
    algorithm: [
      'Let freq[r1,r2] = longest valid subsequence length ending with residues r1 then r2.',
      'For each num in nums: r = num % k.',
      'For each prior residue j: y = (j - r + k) % k; update freq[r,y] = freq[y,r] + 1.',
      'Track global maximum length across all states.',
      'Return max length found.',
    ],
    example: {
      input: 'nums with k=2 (parity)',
      steps: [
        'Valid pairs must sum to even — chain even-even or odd-odd extensions.',
      ],
      output: 'maximum valid subsequence length',
    },
    pitfalls: [
      'Subsequence — elements need not be adjacent in the array.',
      'Modular arithmetic: use (j - r + k) % k for complement residue.',
      'Single-element subsequence length is 1 baseline.',
    ],
  },

  3208: {
    intuition: 'Count subarrays where AND of all elements equals target. Sliding window on AND (only decreases).',
    algorithm: [
      'For each right: maintain set of distinct AND values ending at right (at most 30 values since AND decreases).',
      'Count values equal to target.',
    ],
    pitfalls: ['Set of AND values shrinks as we move left. At most log(max) distinct values per right endpoint.'],
  },

  3217: {
    intuition: 'Delete nodes from linked list that appear in a set. Scan and skip nodes in the set.',
    algorithm: [
      'Set from nums array. Scan linked list, skip nodes whose val is in set. Return new head.',
    ],
    pitfalls: ['Handle head deletion carefully. Dummy node simplifies edge case.'],
  },

  3223: {
    intuition: 'Minimum string length after removing specific patterns AB and CD repeatedly. Stack simulation.',
    algorithm: [
      'Stack. For each char: if stack.top and (top+char) in {AB, CD}: pop. Else push.',
    ],
    pitfalls: ['Stack handles nested and chained removals. Same as LC 2696 but with different patterns.'],
  },

  3243: {
    intuition: 'Shortest distance from root to each node after k flips in binary tree representation.',
    algorithm: [
      'BFS from root. For each node at distance d: track flips encountered. Distance = d + flip adjustments.',
    ],
    pitfalls: ['Model tree structure, BFS for shortest distances considering flip operations.'],
  },

  3254: {
    intuition: 'Find indices divisible by d in array satisfying conditions. Simple modular arithmetic scan.',
    algorithm: [
      'For each i from 0 to n-1: if i % d == 0 and condition: add to result.',
    ],
    pitfalls: ['Check divisibility condition at each step. Return first valid index or list of valid indices.'],
  },

  3264: {
    intuition: 'Apply operations to array: each op decreases one element and increases another. Maximize minimum element.',
    algorithm: [
      'Binary search on minimum value m. Feasibility: can we make all elements >= m with k operations?',
    ],
    pitfalls: ['Binary search on answer. Each op transfers one unit between elements.'],
  },

  3289: {
    intuition: 'Count subarrays where product is divisible by a prime p. Use sliding window or prefix products.',
    algorithm: [
      'Count subarrays where at least one element is divisible by p.',
      'Total subarrays - subarrays with no element divisible by p.',
    ],
    pitfalls: ['Subarrays with no multiple of p: find runs with no multiple of p, count subarrays in each run.'],
  },

  3306: {
    intuition: 'Count substrings where every vowel appears at least once and count of consonants is divisible by k. Sliding window.',
    algorithm: [
      'Sliding window tracking vowel presence (bitmask) and consonant count mod k.',
      'Count windows where all 5 vowels present and consonants%k==0.',
    ],
    pitfalls: ['Two conditions: all vowels present (5-bit mask = 31) AND consonant count % k == 0. Tricky sliding window.'],
  },

  3330: {
    intuition: 'Find lexicographically smallest string after removing one character. Remove the first character where the next is smaller or equal.',
    algorithm: [
      'Scan left to right. Remove first i where s[i] >= s[i+1]. If none: remove last.',
    ],
    pitfalls: ['For strictly decreasing string: remove last character. Otherwise: remove first descent point.'],
  },

  3341: {
    intuition: 'Minimum time to reach dungeon cell with time constraints. Dijkstra variant: can wait at starting cell if needed.',
    algorithm: [
      'Dijkstra. For each cell (r,c): time to arrive. If grid[r][c] > arrival_time: must wait. New time = grid[r][c] + parity_adjustment.',
    ],
    pitfalls: ['If time must be odd/even to enter (based on moves): adjust wait time. Account for parity.'],
  },

  3342: {
    intuition:
      'Grid shortest-path with Dijkstra. You can enter cell (x,y) only after time moveTime[x][y]. Moving to a neighbor costs 1 or 2 seconds depending on parity of (i+j). The answer is minimum arrival time at the bottom-right cell.',
    algorithm: [
      'Run Dijkstra from (0,0) with dist[0][0] = 0 in a min-heap.',
      'When relaxing edge to (x,y): newDist = max(moveTime[x][y], currentDist) + ((i+j) % 2 + 1).',
      'Skip stale heap entries. Return dist at destination when popped.',
      'Four-directional moves only; bounds check each neighbor.',
    ],
    example: {
      input: 'moveTime grid with blocked early cells',
      steps: [
        'Cannot enter a cell before its moveTime — wait is baked into max(...).',
        'Parity of current cell toggles step cost between 1 and 2.',
      ],
      output: 'Minimum seconds to reach last room',
    },
    pitfalls: [
      'Use max(moveTime[neighbor], dist[u]) — not just dist[u] + edge.',
      'Edge weight depends on source cell parity (i+j), not destination.',
      'Dijkstra, not BFS, because weights vary.',
    ],
  },

  3346: {
    intuition: 'Non-decreasing array check with at most one deletion. Track if already used a deletion.',
    algorithm: [
      'Scan: when nums[i] > nums[i+1]: if already deleted: false. Delete (skip): check nums[i-1] <= nums[i+1] or i==0.',
    ],
    pitfalls: ['After deletion, check that the new adjacent pair is also non-decreasing. Handle edge cases.'],
  },

  3354: {
    intuition: 'Count elements greater than all elements to their right. Monotone stack or suffix maximum.',
    algorithm: [
      'Suffix max: suffMax[i] = max of nums[i+1..n-1]. Count i where nums[i] > suffMax[i].',
    ],
    pitfalls: ['Last element is always greater than empty right. Scan right to left tracking suffix max.'],
  },

  3355: {
    intuition: 'Check if zero array achievable: for each position, decrement by overlap of covering ranges. Difference array.',
    algorithm: [
      'Difference array on queries. Prefix sum gives how many times each index is covered.',
      'Check nums[i] <= coverage[i] for all i.',
    ],
    pitfalls: ['Coverage array from range queries using difference array. Each query [l,r] adds 1 to that range.'],
  },

  3356: {
    intuition: 'Find minimum coverage to zero out array. Binary search on number of queries used.',
    algorithm: [
      'Binary search on k (number of queries). Check feasibility: can first k queries zero the array?',
    ],
    pitfalls: ['Binary search: use first k queries, check if coverage suffices everywhere. Difference array for O(n+k) check.'],
  },

  3362: {
    intuition: 'Count subarrays where both zero count and one count are divisible by k. Prefix sum modulo k tracking.',
    algorithm: [
      'Track (zeros%k, ones%k) at each prefix. Count pairs with same (zeros%k, ones%k) value.',
    ],
    pitfalls: ['State = (count_zeros%k, count_ones%k). Count pairs with matching states using hashmap.'],
  },

  3372: {
    intuition: 'Maximize sum of k elements choosing one per row in a grid. DP or greedy approach.',
    algorithm: [
      'Sort each row. For each row: best choices are the largest elements.',
      'DP[row][k_remaining] = max sum.',
    ],
    pitfalls: ['Greedy works if columns allow independent selection. Otherwise DP.'],
  },

  3375: {
    intuition: 'Minimum operations to make array values equal to k. All elements must be reducible to k.',
    algorithm: [
      'If any element < k: return -1. Count distinct values > k (each needs one operation).',
    ],
    pitfalls: ['Can only decrease values. If element < k: impossible. Each distinct value > k needs one op.'],
  },

  3392: {
    intuition: 'Count subarrays of length 4 with exactly 2 elements satisfying a property. Sliding window of size 4.',
    algorithm: [
      'Sliding window of size exactly 4. Count elements satisfying condition. Count windows with exactly 2.',
    ],
    pitfalls: ['Fixed window size 4. Slide across array, count qualifying windows.'],
  },

  3396: {
    intuition:
      'Each operation removes the first 3 elements of the current array. Scan from the right; when you see a duplicate, the prefix up to and including that index must be cleared in chunks of 3 — answer is ceil((i+1)/3) operations. If no duplicate, 0.',
    algorithm: [
      'Use a set while iterating i from n-1 down to 0.',
      'On first duplicate (set.Add fails): return (i + 1 + 2) / 3 using integer ceiling.',
      'If loop finishes, return 0.',
    ],
    example: {
      input: 'nums = [1,2,3,4,2,3,4,4]',
      steps: [
        'Scan right: first repeat is 2 at some index; prefix length needing cleanup → ceil(len/3) ops.',
      ],
      output: 'operations needed',
    },
    pitfalls: [
      'Right-to-left finds the earliest duplicate in the suffix sense for minimal ops.',
      'Formula (i+1+2)/3 is integer ceil of (i+1)/3.',
      'Distinct entire array → 0 operations.',
    ],
  },

  3432: {
    intuition: 'Count subsets where AND of subset is at most k. Complement: total - subsets with AND > k.',
    algorithm: [
      'Count subarrays/subsets where AND > k. Subtract from total.',
    ],
    pitfalls: ['AND of subset > k: all elements must have certain bits set. Inclusion-exclusion on bits.'],
  },

  3439: {
    intuition: 'Find maximum length increasing subsequence with constraint that adjacent pair differs by at most d.',
    algorithm: [
      'DP: dp[i] = max LIS ending at i. Transition: dp[i] = 1 + max(dp[j]) where j < i, nums[j] < nums[i], nums[i]-nums[j] <= d.',
    ],
    pitfalls: ['Standard LIS DP with additional difference constraint. O(n^2) or segment tree for O(n log n).'],
  },

  3440: {
    intuition: 'Reschedule meetings for maximum free time. Sort meetings, find gaps, reschedule to create maximum contiguous free block.',
    algorithm: [
      'Sort meetings. Find max gap if we can move k meetings. Sliding window on free gaps.',
    ],
    pitfalls: ['Moving k meetings can merge adjacent free blocks. Sliding window on the sorted meeting array.'],
  },

  3442: {
    intuition: 'Check if array has maximum and minimum element with frequency 1 (appears exactly once). Count max and min freq.',
    algorithm: [
      'max_val = max(nums), min_val = min(nums). Count max and min. If freq == 1 for both: true.',
    ],
    pitfalls: ['If max==min (all same element): it needs to appear once for both conditions simultaneously.'],
  },

  3445: {
    intuition: 'Maximum difference between even and odd indexed elements. Maximize nums[a] - nums[b] where a is odd-indexed, b is even-indexed (or vice versa).',
    algorithm: [
      'Max odd-indexed - min even-indexed, or max even-indexed - min odd-indexed. Return max.',
    ],
    pitfalls: ['Two cases: even minus odd and odd minus even. Return maximum of both.'],
  },

  3461: {
    intuition:
      'Repeatedly replace each adjacent pair (a,b) with (a+b) mod 10 until two digits remain. All strings in the input must end with the same two digits after this process. Simulate the triangular reduction on each string and compare finals.',
    algorithm: [
      'For each string, copy to char array.',
      'While length > 2: for i = 0..len-2, set s[i] = (s[i]+s[i+1]) % 10 as char (shrink effective length by 1 per outer loop).',
      'After reduction, check s[0] == s[1].',
      'Return true only if every string matches the first string\'s final pair.',
    ],
    example: {
      input: 's = "3902", compare with other strings',
      steps: [
        'Reduce "3902" → adjacent sums mod 10 until 2 chars remain.',
        'Repeat for each string; all final pairs must be equal.',
      ],
      output: 'true if all match',
    },
    pitfalls: [
      'Mod 10 after each adjacent sum — not raw sum.',
      'Outer loop reduces length by one per pass (triangle/Pascal style).',
      'Compare all strings to the same target final two digits.',
    ],
  },

  3507: {
    intuition:
      'While the array is not non-decreasing, remove one adjacent pair with the minimum sum and replace them by their sum. Count operations until no inversion remains. Each removal shortens the list by one element.',
    algorithm: [
      'Loop while array has inversion (nums[i] > nums[i+1]).',
      'Among all adjacent pairs, find index i with minimum nums[i]+nums[i+1] (smallest index on ties if required).',
      'Replace pair at i with their sum; delete nums[i+1].',
      'Increment operation count.',
      'Return count when sorted.',
    ],
    example: {
      input: 'nums = [5,2,3,1]',
      steps: [
        'Inversion exists. Min adjacent sum might be 2+3=5 at index 1.',
        'Repeat until non-decreasing.',
      ],
      output: 'minimum operations',
    },
    pitfalls: [
      'Pick globally minimum pair sum among adjacent pairs each step.',
      'Check sorted with adjacent compare, not full sort each time.',
      'Simulation O(n²) per step is acceptable for small n in problem.',
    ],
  },

  3546: {
    intuition: 'Maximize sum after partitioning array into subarrays of fixed size. Each subarray sum = max_element * size.',
    algorithm: [
      'DP: dp[i] = max sum for first i elements. For each subarray length k up to limit: dp[i] = max(dp[i-k] + max(nums[i-k..i-1]) * k).',
    ],
    pitfalls: ['Standard partition DP. Limit bounds subarray size. O(n*k) transitions.'],
  },

  3577: {
    intuition: 'Count subarrays with at least one element satisfying condition. Complement: total - subarrays with NO element satisfying condition.',
    algorithm: [
      'Sliding window for subarrays with no satisfying element. Count those, subtract from total.',
    ],
    pitfalls: ['Complement counting with sliding window on condition-satisfying elements.'],
  },

  // --- 2615. Sum of Distances -------------------------------------------------
  2615: {
    intuition:
      'For every element, you need the sum of absolute distances to all other positions that hold the same value. The brute-force recomputes this sum from scratch for each element � O(N�) overall. The key insight is that once you sort (or group) the indices sharing a value, you can sweep left-to-right and update a single running total in O(1) per step. When you advance from one index to the next, each of the already-processed left indices moves one step farther, while each of the not-yet-processed right indices moves one step closer � so you just add/subtract multiples of the gap.',
    algorithm: [
      'Build a Dictionary mapping each unique value to the sorted list of indices where it appears.',
      'For each group of indices [idx0, idx1, ..., idx_{n-1}]: initialise `sumSoFar` = sum of all indices in the group and `prevIndex` = 0.',
      'Iterate i from 0 to n-1. Compute `gap = indices[i] - prevIndex`.',
      '  Update: `sumSoFar += (i - 1) * gap` (left-side indices each grew gap farther from new position).',
      '  Update: `sumSoFar -= (n - 1 - i) * gap` (right-side indices each grew gap closer to new position).',
      '  Set `ans[indices[i]] = sumSoFar`. Set `prevIndex = indices[i]`.',
      'Return `ans`.',
    ],
    example: {
      input: 'nums = [1, 3, 1, 1, 2]',
      steps: [
        'Group indices: {1: [0,2,3], 3: [1], 2: [4]}.',
        'Group for value 1, n=3. sumSoFar = 0+2+3 = 5, prevIndex = 0.',
        'i=0, idx=0: gap=0. sumSoFar += (-1)*0 - 2*0 = 5. ans[0]=5. prevIndex=0.',
        'i=1, idx=2: gap=2. sumSoFar += 0*2 - 1*2 = 5-2 = 3. ans[2]=3. prevIndex=2.',
        'i=2, idx=3: gap=1. sumSoFar += 1*1 - 0*1 = 3+1 = 4. ans[3]=4. prevIndex=3.',
        'Groups for 3 and 2 have only one element each, skip. ans[1]=0, ans[4]=0.',
      ],
      output: '[5, 0, 3, 4, 0]',
    },
    pitfalls: [
      'Use `long` (not `int`) for `sumSoFar` and the final answer � index products can overflow 32-bit integers.',
      'Groups of size 1 contribute 0 � skip them to avoid unnecessary work.',
      'The initial `prevIndex = 0` is intentional: the formula self-corrects for the first iteration because i=0 makes the (i-1) term negative, which subtracts the inflated contribution of index 0 from the starting sum.',
    ],
  },

  // --- 2452. Words Within Two Edits of Dictionary ----------------------------
  2452: {
    intuition:
      'Because all words have the same fixed length, two words are "within two edits" of each other if and only if the count of positions where their characters differ is at most 2. There is no insertion or deletion � only substitution. We can therefore check every (query, dictionary) pair in a single character-by-character scan and short-circuit as soon as the mismatch count exceeds 2.',
    algorithm: [
      'For each word `q` in `queries`, iterate over every word `w` in `dictionary`.',
      'Count the number of positions i where `q[i] != w[i]`. Stop early if the count reaches 3.',
      'If the final count is less than 3 (i.e., 0, 1, or 2 mismatches), add `q` to the result list and break � no need to check further dictionary words for this query.',
      'Return the result list.',
    ],
    example: {
      input: 'queries = ["word","note","ants"], dictionary = ["wood","joke","moat"]',
      steps: [
        '"word" vs "wood": diff at index 2 (r?o) and index 3 (d?d � same). 1 mismatch ? "word" qualifies.',
        '"note" vs "wood": diff at 0 (n?w), 1 (o?o � same), 2 (t?o), 3 (e?d). 3 mismatches � skip.',
        '"note" vs "joke": diff at 0 (n?j), 2 (t?k). 2 mismatches ? "note" qualifies.',
        '"ants" vs "wood": 4 mismatches. vs "joke": 4. vs "moat": diff at 0 (a?m), 2 (t?a), 3 (s?t). 3 mismatches � no match.',
      ],
      output: '["word", "note"]',
    },
    pitfalls: [
      'This problem only involves substitution edits (same-length words) � do NOT use a full Levenshtein edit-distance algorithm, which is far slower.',
      'Break out of the inner loop as soon as any dictionary word matches; avoid redundant comparisons.',
      'Early exit inside GetDiff when diff reaches 3 is a small but effective constant-factor optimisation.',
    ],
  },

  // --- 2833. Furthest Point From Origin --------------------------------------
  2833: {
    intuition:
      'Every \'_\' wildcard can be assigned to either \'L\' or \'R\' freely, so they always contribute +1 to the furthest possible distance regardless of the other moves. The non-wildcard moves produce a net displacement of |countL - countR|. Adding all wildcards to that net displacement gives the maximum reachable point.',
    algorithm: [
      'Make a single pass over the moves string, counting \'L\', \'R\', and \'_\' characters.',
      'Compute net = Math.Abs(countL - countR).',
      'Return net + countUnderline (each wildcard extends the furthest point by 1).',
    ],
    example: {
      input: 'moves = "_L__LL__"',
      steps: [
        'Count: L = 3, R = 0, _ = 5.',
        'Net displacement without wildcards = |3 - 0| = 3.',
        'All 5 wildcards go left (dominant direction): 3 + 5 = 8.',
      ],
      output: '8',
    },
    pitfalls: [
      'Do not try to split wildcards between L and R � they always add fully to the dominant side.',
      'The answer is |L - R| + wildcards, not max(L, R) + wildcards.',
    ],
  },

  // --- 3464. Maximize the Distance Between Points on a Square ---------------
  3464: {
    intuition:
      'All points lie on the square perimeter, so we can linearize them in clockwise order and turn geometry into an ordered sequence problem. Then we binary-search the answer d: if we can pick k points with minimum required Manhattan separation d, any smaller d is also feasible. The core is a linear feasibility check that grows the longest valid chain ending at each point.',
    algorithm: [
      'Partition boundary points into left/top/right/bottom edges and sort each edge in traversal order, then concatenate to build clockwise order.',
      'Binary-search d in [0, side]. For each mid, run IsValidDistance to test feasibility.',
      'In IsValidDistance, maintain deque states of the form (start point, end point, chain length).',
      'For each new point p, pop deque front states whose end point is far enough from p (distance >= d). Those states are candidates to extend by p.',
      'Among extendable states, keep the one producing maximum chain length for p and push the resulting state to the deque.',
      'If any chain reaches length >= k, d is feasible; otherwise infeasible. Use this result to move binary-search boundaries.',
    ],
    example: {
      input: 'side = 5, points = [[0,1],[0,4],[2,5],[5,3],[4,0]], k = 3',
      steps: [
        'Clockwise order becomes: [0,1] -> [0,4] -> [2,5] -> [5,3] -> [4,0].',
        'Try d = 4. Start with chain length 1 at first point.',
        'As we scan, whenever current point is at least 4 away from candidate chain end, we can extend that chain.',
        'Suppose chain reaches length 3 at some point; then d=4 is feasible.',
        'Binary search continues to test larger distances until the maximum feasible d is found.',
      ],
      output: 'Maximum feasible minimum distance (problem output).',
    },
    pitfalls: [
      'Do not skip perimeter ordering; random point order breaks the DP transition logic.',
      'Feasibility check must be monotonic-safe for binary search: return true only when a full chain of size k exists.',
      'Use Manhattan distance exactly (|x1-x2| + |y1-y2|), not Euclidean distance.',
    ],
  },

  // --- 1559. Detect Cycles in 2D Grid ---------------------------------------
  1559: {
    intuition:
      'Treat cells with the same character as an undirected graph where each cell connects to up/down/left/right neighbors of equal value. A cycle exists if during DFS/BFS we reach an already-visited node that is not the parent we came from. Parent tracking is essential because the immediate back-edge to parent should not be counted as a cycle.',
    algorithm: [
      'Create a visited matrix of size m x n initialized to false.',
      'Iterate through every cell (i, j). If unvisited, start DFS from it with parent = (-1, -1).',
      'In DFS, mark current cell visited and scan 4-direction neighbors.',
      'Skip neighbors that are out of bounds or have different character.',
      'Skip the parent neighbor (the cell we came from).',
      'If a valid same-character neighbor is already visited and is not parent, return true (cycle found).',
      'Otherwise recurse into unvisited same-character neighbors. If any recursive call returns true, propagate true.',
      'If all components finish with no such back-edge, return false.',
    ],
    example: {
      input: 'grid = [[a,a,a,a],[a,b,b,a],[a,b,b,a],[a,a,a,a]]',
      steps: [
        'Start DFS from (0,0) = a and walk through connected a-cells on the border.',
        'While exploring, eventually reach a neighbor that is already visited and not the direct parent.',
        'This confirms a closed loop in the a-component.',
        'Return true immediately.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Without parent coordinates, every undirected edge looks like a false cycle when you step back one cell.',
      'Only same-character neighbors belong to the same graph component; different letters must be ignored.',
      'Use iterative DFS/BFS if recursion depth is a concern on very large grids.',
    ],
  },

  // --- 1391. Check if There is a Valid Path in a Grid -----------------------
  1391: {
    intuition:
      'Instead of manually validating every street-type pair at cell boundaries, expand each original cell into a 3x3 pixel block where valid street segments are drawn as connected true cells. Then the problem becomes a plain connectivity query: is there any continuous path from the expanded start center to expanded end center?',
    algorithm: [
      'Create a boolean grid of size (m*3) x (n*3).',
      'For each street type (1..6), mark the corresponding three pixels in that 3x3 block to represent its road shape.',
      'Start DFS from expanded coordinate (1,1), which is the center of top-left cell.',
      'During DFS, stop when out of bounds or on a false cell; otherwise mark current pixel visited and move in 4 directions.',
      'If DFS reaches (m*3-2, n*3-2), which is center of bottom-right cell, return true.',
      'If traversal ends without reaching destination, return false.',
    ],
    example: {
      input: 'grid = [[2,4,3],[6,5,2]]',
      steps: [
        'Build expanded map where each street draws its passable pixels.',
        'From start center, DFS follows only connected road pixels.',
        'Because neighboring street segments match, traversal can continue through the route.',
        'Destination center is reached, so a valid path exists.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Street encoding must be exact for each type; a wrong pixel pattern causes false positives/negatives.',
      'Always mark visited during DFS to prevent infinite recursion loops.',
      'This recursion can be deep on large grids; iterative DFS/BFS is an alternative if stack depth is a concern.',
    ],
  },

  // --- 3225. Maximum Score From Grid Operations ------------------------------
  3225: {
    intuition:
      'Process columns left to right and track, for each column, how deep the chosen boundary row goes. Prefix sums let us quickly evaluate how much score is gained when the boundary moves up or down between adjacent columns. Two DP arrays are enough: one where current column contributes (`pick`) and one where it does not (`skip`).',
    algorithm: [
      'Build column prefix sums so any segment sum in a column is O(1).',
      'Maintain `prevPick[prev]` and `prevSkip[prev]`, where `prev` is boundary depth in the previous column.',
      'For each new column j and each pair (`curr`, `prev`):',
      'If `curr > prev`, boundary goes deeper; add segment from column j-1 using `prevSkip` transitions.',
      'Else, boundary goes shallower/equal; add segment from column j using `prevPick` transitions and optionally keep skip state.',
      'Store best results in `currPick[curr]` and `currSkip[curr]`, then roll arrays for next column.',
      'Answer is max value in final `pick` array.',
    ],
    example: {
      input: 'grid = [[1,2],[3,4]]',
      steps: [
        'Compute per-column prefix sums to query vertical segment sums quickly.',
        'Initialize DP states for first transition column.',
        'Enumerate possible boundary depths for previous/current columns.',
        'Apply two transition cases (`curr > prev` vs otherwise) and keep maximum.',
        'After processing all columns, take max over ending boundary depths.',
      ],
      output: 'Maximum achievable score for the grid.',
    },
    pitfalls: [
      'Without prefix sums, segment score extraction inside transitions becomes too slow.',
      'Keep `long` DP values to avoid overflow on large sums.',
      'Be careful with state meaning: mixing `pick` and `skip` transitions gives incorrect totals.',
    ],
  },

  // --- 3286. Find a Safe Walk Through a Grid ---------------------------------
  3286: {
    intuition:
      'Treat each move as spending health equal to the destination cell value (0 or 1). The question is not shortest distance but reachability with positive health left, so the natural state is (row, col, remainingHealth). A plain cell-only visited array is not enough because reaching the same cell with more health is strictly better than reaching it with less.',
    algorithm: [
      'Subtract grid[0][0] from the initial health because entering the start cell also costs health.',
      'Run BFS over states (r, c, h), where h is remaining health after standing on that cell.',
      'From each state, try the 4 neighbors. The next health is h - grid[nr][nc].',
      'Skip moves that leave nextHealth <= 0, because the path must keep health strictly positive.',
      'Use seen[r][c][h] so the same cell can still be explored again with a different remaining-health value.',
      'If BFS reaches (m-1, n-1) with h > 0, return true; otherwise false.',
    ],
    example: {
      input: 'grid = [[0,1,0],[0,1,0],[0,0,0]], health = 2',
      steps: [
        'Start at (0,0) with health 2 because grid[0][0] = 0.',
        'Going right twice would spend 1 health on the blocked middle column and may trap us.',
        'BFS also explores going down first: (1,0) -> (2,0) -> (2,1) -> (2,2), paying only zeros.',
        'Destination is reached with health still positive, so the answer is true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'The start cell cost counts too: initialHealth = health - grid[0][0].',
      'Visited-by-cell alone is incorrect; a later path that reaches the same cell with more remaining health may still succeed.',
      'The condition is strictly positive health, so nextHealth == 0 is not allowed.',
    ],
  },

  // --- 3742. Maximum Path Score in a Grid ------------------------------------
  3742: {
    intuition:
      'You can only move right or down, so every path has a fixed length. The twist is a budget k: passing through a positive cell costs 1. Recurse backwards from (m-1,n-1) � state (i,j,k) = max score from here to the destination with k budget left. Each cell adds its value and delegates to the best predecessor.',
    algorithm: [
      'Recurse from (m-1, n-1) back to (0, 0), moving only up or left.',
      'Base case: (0, 0) returns 0.',
      'Out-of-bounds or k < 0: return -8 (impossible path sentinel).',
      'If grid[i][j] > 0, decrement budget: nk = k - 1.',
      'Result = grid[i][j] + max(Dfs(i-1, j, nk), Dfs(i, j-1, nk)).',
      'Memoize in f[i][j][k]. If final answer < 0, return -1.',
    ],
    example: {
      input: 'grid = [[-1, 2], [3, -4]], k = 1',
      steps: [
        'At (1,1): grid=-4, not positive, budget unchanged.',
        'Dfs(0,1,k): grid=2 positive ? nk=k-1. Only predecessor (0,0)=0. Score=2.',
        'Dfs(1,0,k): grid=3 positive ? nk=k-1. Only predecessor (0,0)=0. Score=3.',
        'At (1,1): -4 + max(2, 3) = -1.',
      ],
      output: '-1',
    },
    pitfalls: [
      'Sentinel must be -(1<<30), not -1 � it must survive Math.Max without polluting valid negative scores.',
      'Budget decrements only for strictly positive cells (> 0), not zero or negative.',
      'Return -1 only after full DFS; do not short-circuit on intermediate negative values.',
    ],
  },

  // --- 61. Rotate List --------------------------------------------------------
  61: {
    intuition:
      'Rotating right by k is equivalent to moving the last k nodes to the front. Rather than shifting nodes one at a time, find the new tail (node at position len - k%len), make the list circular, then break the circle at the right point. The modulo handles k >= len gracefully.',
    algorithm: [
      'Walk the list to find its length and keep a reference to the tail node.',
      'Reduce k: k = len - k % len. If k == len after reduction, no rotation is needed.',
      'Make the list circular: tail.next = head.',
      'Walk k steps from the original head; this node becomes the new tail.',
      'Set head = newTail.next, then newTail.next = null to break the circle.',
      'Return the new head.',
    ],
    example: {
      input: 'head = [1,2,3,4,5], k = 2',
      steps: [
        'Length = 5. k = 5 - 2%5 = 3.',
        'Make circular: 5.next = 1.',
        'Walk 3 steps from 1: 1 ? 2 ? 3. New tail = node 3.',
        'New head = 3.next = node 4. Break: 3.next = null.',
        'Result: [4, 5, 1, 2, 3].',
      ],
      output: '[4, 5, 1, 2, 3]',
    },
    pitfalls: [
      'Reduce k modulo len first � k can exceed the list length.',
      'If k % len == 0, the list is unchanged; the circular-then-break approach handles this automatically since walking len steps returns to the original tail.',
    ],
  },

  3660: {
    intuition:
      'For each position i, the maximum collectible value depends on whether the best value seen so far (the prefix maximum) is still "reachable" given what lies ahead. If a smaller element in the suffix would block advancement, the prefix max is the ceiling; otherwise the answer from the next position carries forward. A single right-to-left pass with a running suffix minimum resolves this in O(n).',
    algorithm: [
      'Build prefixMax: prefixMax[i] = max(nums[0..i]).',
      'Initialise suffixMin = +8 and result array of length n.',
      'Traverse i from n-1 down to 0.',
      'If prefixMax[i] > suffixMin: result[i] = result[i+1] (or 0 if i is the last index).',
      'Otherwise: result[i] = prefixMax[i].',
      'Update suffixMin = min(suffixMin, nums[i]) before moving left.',
    ],
    example: {
      input: 'nums = [3, 1, 5, 2, 4]',
      steps: [
        'prefixMax = [3, 3, 5, 5, 5].',
        'i=4: suffixMin=8, 5>8? No ? result[4]=5. suffixMin=4.',
        'i=3: 5>4? Yes ? result[3]=result[4]=5. suffixMin=min(4,2)=2.',
        'i=2: 5>2? Yes ? result[2]=result[3]=5. suffixMin=min(2,5)=2.',
        'i=1: 3>2? Yes ? result[1]=result[2]=5. suffixMin=min(2,1)=1.',
        'i=0: 3>1? Yes ? result[0]=result[1]=5. suffixMin=min(1,3)=1.',
        'Result: [5, 5, 5, 5, 5].',
      ],
      output: '[5, 5, 5, 5, 5]',
    },
    pitfalls: [
      'Don\'t skip the modulo when there is no modulo needed here � but do handle the last index (i+1 < n) before reading result[i+1].',
      'The prefix max must be computed as a full array first; you cannot compute it on the fly in the right-to-left pass.',
      'suffixMin must be updated after reading result[i], not before, to avoid including nums[i] in its own suffix.',
    ],
  },

  3620: {
    intuition:
      'Each valid path has a score equal to its minimum edge cost. We want the largest such minimum — a classic maximize-the-bottleneck problem. Binary search that threshold: for a candidate mid, keep only edges with cost ≥ mid on online endpoints and ask whether Dijkstra can reach n−1 with total cost ≤ k.',
    algorithm: [
      'Drop edges incident to offline nodes; record min and max edge weights as search bounds.',
      'Binary search mid on edge-weight threshold (search high with mid = (l+r+1)/2).',
      'check(mid): run Dijkstra using only edges with w ≥ mid; return true if dist[n−1] ≤ k.',
      'If check(l) is true return l, else return −1.',
    ],
    example: {
      input: 'edges with costs, online mask, budget k',
      steps: [
        'For mid = 6, keep only edges costing at least 6.',
        'Dijkstra finds a path 0→2→4 with total cost 12 ≤ k.',
        'Larger mid values disconnect the graph, so 6 is optimal.',
      ],
      output: '6',
    },
    pitfalls: [
      'Filter offline nodes when building the graph — intermediate offline nodes invalidate paths.',
      'Use long for distances and k; totals can exceed 32-bit range.',
      'Binary search is on minimum edge weight, not on total path cost.',
    ],
  },

  3629: {
    intuition:
      'Indices whose values share a prime factor can teleport to each other in one jump, so the problem is shortest-path on an implicit graph. BFS guarantees the minimum number of jumps. The key insight is to group indices by prime factor and expand the whole group at once � then clear the group to prevent re-processing, keeping BFS linear in the number of edges rather than quadratic.',
    algorithm: [
      'Precompute a sieve: for every integer 2 to 1e6, record all its prime factors.',
      'Walk nums[] and build a map: prime ? list of indices that have that prime.',
      'BFS from index 0 with a visited array.',
      'For each dequeued index i: if i == n-1 return current depth (ans).',
      'Collect neighbors: all indices sharing a prime with nums[i], plus i-1 and i+1.',
      'After expanding a prime group, clear it from the map so it is never traversed again.',
      'Enqueue unvisited neighbors; increment ans after each full BFS layer.',
    ],
    example: {
      input: 'nums = [6, 10, 15, 35, 21]',
      steps: [
        'Primes of each: 6?{2,3}, 10?{2,5}, 15?{3,5}, 35?{5,7}, 21?{3,7}.',
        'BFS layer 0: visit index 0 (value 6).',
        'Layer 1: expand prime 2 ? indices {0,1}; prime 3 ? indices {0,2,4}; also i+1=1. New: 1,2,4.',
        'Layer 2: from index 1, prime 5 ? indices {1,2,3}; new: 3. From index 2 or 4, i+1=3,5 would reach end.',
        'index 4 ? i+1=5 (n-1=4 in a 5-element array) � return ans = 2.',
      ],
      output: '2',
    },
    pitfalls: [
      'Not clearing the prime-group after use causes O(N�) re-expansion and TLE.',
      'Static initialization of the sieve (in the static constructor) means it is built only once per program run � essential for passing multiple test cases efficiently.',
      'Remember to also add i+1 and i-1 to the neighbor list, not just the prime-teleport neighbors.',
    ],
  },

  1914: {
    intuition:
      'A grid has concentric rectangular layers like an onion. Rotating layer by layer independently is easier than rotating the whole grid at once. Each layer is a linear sequence (top ? right ? bottom ? left), so rotating k is just a cyclic shift of that sequence. Modulo by layer size eliminates redundant full rotations.',
    algorithm: [
      'Initialise pointers: t (top), l (left), b (bottom), r (right) bounding the current layer.',
      'While t < b and l < r (more than one layer remains):',
      '  1) Compute the ring size: 2*(b-t) + 2*(r-l).',
      '  2) Compute net rotations: k % ringSize.',
      '  3) For each rotation, shift elements one position clockwise around the ring.',
      '  4) Move inward: t++, l++, b--, r--.',
    ],
    example: {
      input: 'grid = [[1,2,3],[4,5,6],[7,8,9]], k = 1',
      steps: [
        'Layer 1 (ring): [1,2,3,6,9,8,7,4].',
        'Rotate 1 step: [4,1,2,3,6,9,8,7].',
        'Place back: grid[0]=[4,1,2], grid[1]=[7,5,3], grid[2]=[8,9,6].',
      ],
      output: '[[4,1,2],[7,5,3],[8,9,6]]',
    },
    pitfalls: [
      'Modulo ring size avoids simulating every single rotation; k=5 on a 4-element ring is just k=1.',
      'After each rotation iteration, all four directions (top, right, bottom, left) must shift elements; forgetting one causes the ring to corrupt.',
      'When t == b or l == r, the layer is a single row or column and requires special handling or the loop condition prevents it.',
    ],
  },

  2770: {
    intuition:
      'This is a longest-path problem in a DAG. Define dp[j] as the maximum number of jumps needed to reach index j. Because we can only jump from i to j when |nums[j] - nums[i]| = target and i < j, the graph is acyclic and we can fill dp left to right.',
    algorithm: [
      'Initialise dp[] with -1 (unreachable); set dp[0] = 0.',
      'For each j from 1 to n-1:',
      '  For each i from 0 to j-1:',
      '    If dp[i] != -1 and |nums[j] - nums[i]| <= target:',
      '      dp[j] = max(dp[j], dp[i] + 1).',
      'Return dp[n-1] (-1 means last index is unreachable).',
    ],
    example: {
      input: 'nums = [1, 3, 6, 4, 1, 2], target = 2',
      steps: [
        'dp = [-1,-1,-1,-1,-1,-1], dp[0]=0.',
        'j=1: |3-1|=2 = 2 from i=0 ? dp[1]=1.',
        'j=2: |6-3|=3 > 2 (i=1 skip); |6-1|=5 > 2 (i=0 skip) ? dp[2]=-1.',
        'j=3: |4-3|=1 = 2 from i=1 ? dp[3]=2.',
        'j=4: |1-3|=2 = 2 from i=1 ? dp[4]=2; |1-4|=3 > 2 skip.',
        'j=5: |2-1|=1 = 2 from i=4 ? dp[5]=3; |2-4|=2 = 2 from i=3 ? dp[5]=max(3,3)=3.',
        'Answer: dp[5] = 3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Initialise dp with -1, not 0 � a 0 at an unreachable index would incorrectly allow jumps from it.',
      'The condition is |nums[j] - nums[i]| <= target (absolute value); jumping is allowed in both increasing and decreasing value directions.',
      'Return -1 if dp[n-1] remains -1 � the last index may be unreachable.',
    ],
  },

  1665: {
    intuition:
      'The key insight is that the optimal strategy involves sorting tasks by their net cost (actual - minimum). By processing tasks in this order, you minimize wasted energy. At each task, if your accumulated "savings" don\'t meet the task\'s minimum requirement, you must top up the initial energy; otherwise you deduct the actual cost.',
    algorithm: [
      'Sort tasks by (actual_effort - minimum_effort) in ascending order.',
      'Initialise prevSaved = 0 (cumulative energy benefit/cost) and ans = 0 (extra initial energy needed).',
      'For each sorted task with actual and minimum:',
      '  If prevSaved < minimum: ans += (minimum - prevSaved), then prevSaved = (minimum - actual).',
      '  Else: prevSaved -= actual.',
      'Return ans.',
    ],
    example: {
      input: 'tasks = [[1,3],[2,4],[10,11],[10,12],[8,9]]',
      steps: [
        'Sort by (actual - minimum): [1-3=-2, 2-4=-2, 10-11=-1, 8-9=-1, 10-12=-2] ? sorted = [[1,3], [2,4], [10,11], [8,9], [10,12]].',
        'Process [1,3]: prevSaved=0 < 3 ? ans+=3, prevSaved=0. ans=3.',
        'Process [2,4]: prevSaved=0 < 4 ? ans+=4, prevSaved=2. ans=7.',
        'Process [10,11]: prevSaved=2 < 11 ? ans+=9, prevSaved=1. ans=16.',
        'Process [8,9]: prevSaved=1 < 9 ? ans+=8, prevSaved=0. ans=24.',
        'Process [10,12]: prevSaved=0 < 12 ? ans+=12, prevSaved=2. ans=36.',
      ],
      output: '36',
    },
    pitfalls: [
      'The sort key is (actual - minimum), not just maximum. This ordering is critical to optimality.',
      'prevSaved tracks the net energy state after each task; it can go negative (debt) and be restored by topups.',
      'When topup is needed, the increase is (minimum - prevSaved), and the new prevSaved becomes (minimum - actual), not just -actual.',
    ],
  },

  1674: {
    intuition:
      'Instead of checking all 2*limit possible targets and recounting moves for each, use a difference array to track incremental changes. For each complementary pair, determine when the move cost changes as the target increases. This reduces redundant recounting.',
    algorithm: [
      'Initialise delta array of size 2*limit+2.',
      'For each complementary pair (nums[i], nums[n-1-i]):',
      '  Determine ranges: if target ? [min(a,b)+1, a+b), exactly one element changes.',
      '  If target ? [a+b, max(a,b)+limit+1), both could need change or neither.',
      '  Use delta to mark range transitions: decrement at start, increment at end.',
      'Compute prefix sum of delta from target=2 to 2*limit, tracking minimum moves.',
    ],
    example: {
      input: 'nums = [1,2,1,2], limit = 5',
      steps: [
        'Pairs: (1,2) and (1,2).',
        'For pair (1,2): min=1, max=2, sum=3.',
        '  delta[min+1]=delta[2]--; delta[sum]=delta[3]--; delta[sum+1]=delta[4]++; delta[max+limit+1]=delta[8]++.',
        'Initial moves at target=2: both pairs need 1 move each, total=2.',
        'Target=3: delta adds moves (or reduces); compute incrementally.',
        'Continue through target=2*5=10, track minimum seen.',
      ],
      output: 'varies based on exact deltas',
    },
    pitfalls: [
      'The delta array tracks transitions in the move-cost function as target increases; understand that multiple pairs contribute simultaneously.',
      'Ranges depend on min, max, sum, and limit; off-by-one errors in boundaries are common.',
      'Start with moves at target=2 computed explicitly; subsequent targets use cumulative delta.',
    ],
  },

  2784: {
    intuition:
      'A "good" array must have a specific structure: indices [1, n-1] each paired with exactly one value, and index n paired with two values (forming a square pattern). Counting frequencies and validating against this structure is straightforward.',
    algorithm: [
      'Count the frequency of each element using a hash map.',
      'Check that all integers from 1 to n-1 appear exactly once.',
      'Check that n (the maximum expected value) appears exactly twice.',
      'If all checks pass, the array is good; otherwise, it\'s not.',
    ],
    example: {
      input: 'nums = [1, 3, 4, 2, 2]',
      steps: [
        'n = 5 - 1 = 4.',
        'Count: {1:1, 3:1, 4:1, 2:2}.',
        'Check [1, 3]: all present with freq=1.',
        'Check 4: present with freq=2.',
        'All conditions met ? good array.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Do not confuse "good" with "sorted". A good array has a specific frequency pattern, not order.',
      'Ensure that n appears exactly twice, not just at least twice.',
      'Edge case: if the array has fewer than 2 elements, it cannot be good (since n appears twice).',
    ],
  },

  154: {
    intuition:
      'In a rotated sorted array, the minimum lies in the unsorted side. With duplicates, comparisons can become ambiguous, so when nums[mid] == nums[r], we cannot decide a side and safely shrink r by one. Otherwise, comparing nums[mid] with nums[r] still tells which half contains the minimum.',
    algorithm: [
      'Set l = 0, r = n - 1.',
      'While l < r, compute mid = l + (r - l) / 2.',
      'If nums[mid] < nums[r], minimum is in [l..mid], so set r = mid.',
      'If nums[mid] > nums[r], minimum is in [mid+1..r], so set l = mid + 1.',
      'If nums[mid] == nums[r], decrement r by 1 to remove ambiguity.',
      'When loop ends, l points to the minimum value; return nums[l].',
    ],
    example: {
      input: 'nums = [2, 2, 2, 0, 1]',
      steps: [
        'l=0, r=4, mid=2 ? nums[mid]=2, nums[r]=1, so nums[mid] > nums[r] ? l=3.',
        'l=3, r=4, mid=3 ? nums[mid]=0, nums[r]=1, so nums[mid] < nums[r] ? r=3.',
        'l==r==3, stop. nums[3]=0 is minimum.',
      ],
      output: '0',
    },
    pitfalls: [
      'With duplicates, worst-case becomes O(n) because repeated nums[mid] == nums[r] may shrink one step at a time.',
      'Using while (l <= r) can be tricky for this pattern; while (l < r) avoids out-of-range returns and simplifies termination.',
      'Always compare against nums[r] in this variant; mixing comparison targets inconsistently can break correctness.',
    ],
  },

  1306: {
    intuition:
      'From any position i, we can jump to i - arr[i] or i + arr[i]. This forms a graph where we want to know if position 0 is reachable. BFS naturally explores all reachable positions without redundant work.',
    algorithm: [
      'Initialise a queue with the start index.',
      'Mark start as visited.',
      'While queue is not empty:',
      '  Dequeue index node.',
      '  If arr[node] == 0, return true (reached a zero index).',
      '  If already visited, skip.',
      '  Enqueue node - arr[node] if valid.',
      '  Enqueue node + arr[node] if valid.',
      '  Mark node as visited.',
      'Return false if queue exhausts without finding zero.',
    ],
    example: {
      input: 'arr = [4,2,3,0,3,1,2], start = 5',
      steps: [
        'From 5: can jump to 5-1=4 or 5+1=6 (out of bounds, skip).',
        'From 4: can jump to 4-3=1 or 4+3=7 (out of bounds).',
        'From 1: can jump to 1-2=-1 (invalid) or 1+2=3.',
        'From 3: arr[3]=0 ? found!',
      ],
      output: 'true',
    },
    pitfalls: [
      'Do not forget the visited check; without it, infinite loops on cycles are possible.',
      'Bound-check both directions before enqueueing: node � arr[node] must stay in [0, n-1].',
      'Early termination on finding 0 is critical; avoid processing the entire queue unnecessarily.',
    ],
  },

  1345: {
    intuition:
      'In a standard BFS, we explore layer by layer. The key optimization here is the value-to-indices graph: all indices with the same value are just one "jump" away. By clearing each value\'s adjacency list after processing, we avoid re-exploring the same connections in future layers.',
    algorithm: [
      'Build a graph: map each value to a list of indices where it appears.',
      'Initialise BFS queue with index 0 and track visited indices.',
      'For each BFS layer (step):',
      '  Dequeue an index i. If i == n-1, return step.',
      '  Enqueue neighbors: i-1, i+1 (if valid) and all indices in graph[arr[i]].',
      '  Clear graph[arr[i]] after processing to prevent re-visiting the same edges.',
      'Return step when reaching index n-1.',
    ],
    example: {
      input: 'arr = [100,-23,-23,404,100,23,23,23]',
      steps: [
        'From 0: can jump to 1 (100-1) or any index with value 100 (indices 0, 4).',
        'From 1: can jump to 0,2 (adjacency) or any with value -23 (indices 1,2).',
        'From 4: can jump to 3,5 (adjacency) and others with value 100; index 7 eventually reachable.',
      ],
      output: '3',
    },
    pitfalls: [
      'Without clearing the value\'s edge list, you re-process the same indices multiple times, turning O(n) into O(n�).',
      'Do not confuse this with adjacency in a standard graph; edges depend on both position (i�1) and value (equal arr values).',
      'Visited check must happen before enqueueing to avoid processing the same index multiple times.',
    ],
  },

  2540: {
    intuition:
      'Because both arrays are sorted in non-decreasing order, the smallest common value can be found without extra storage. Two pointers let us discard smaller values immediately: if nums1[i] is smaller, it can never match any earlier value in nums2, and vice versa.',
    algorithm: [
      'Initialise two pointers i = 0 and j = 0.',
      'While both pointers are inside their arrays:',
      '  If nums1[i] == nums2[j], return that value immediately.',
      '  If nums1[i] < nums2[j], increment i because nums1[i] is too small to match nums2[j] or anything before it.',
      '  Otherwise increment j for the symmetric reason.',
      'If one pointer reaches the end, no common value exists, so return -1.',
    ],
    example: {
      input: 'nums1 = [1, 2, 3, 6], nums2 = [2, 3, 4, 5]',
      steps: [
        'Compare 1 and 2: 1 is smaller, so move i to the next element.',
        'Compare 2 and 2: they match, so 2 is the smallest common value.',
      ],
      output: '2',
    },
    pitfalls: [
      'This works only because both arrays are sorted; on unsorted arrays, pointer moves would skip valid matches.',
      'Return on the first match, not the last one, because the pointers advance in ascending order.',
      'Do not use nested loops here; they increase time complexity unnecessarily to O(m*n).',
    ],
  },

  1340: {
    intuition:
      'From index i you can jump left/right up to distance d, but only to smaller heights, and the path is blocked by any height greater than or equal to arr[i]. This creates local visibility constraints. A monotonic stack processes bars by height boundaries and allows dynamic programming transitions to be relaxed exactly when a blocking boundary is known.',
    algorithm: [
      'Let dp[i] be maximum extra jumps starting from index i (answer is max(dp)+1 for counting nodes).',
      'Maintain a decreasing stack of indices by arr value.',
      'Iterate i from 0..n, using i==n as a sentinel flush step.',
      'While stack top is lower than current height (or at sentinel), pop a group of equal-height indices.',
      'For each popped index j:',
      '  If current index i is within d of j, relax dp[i] = max(dp[i], dp[j] + 1).',
      '  If new stack top exists and is within d of j, relax dp[top] = max(dp[top], dp[j] + 1).',
      'Push current index to continue processing.',
      'Return max(dp) + 1.',
    ],
    example: {
      input: 'arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2',
      steps: [
        'Index 2 (14) can jump to smaller heights within 2 steps until blocked, such as 1 (4), 3 (6), and 4 (8).',
        'DP values from lower heights are computed/propagated first through stack pops.',
        'Transitions are only applied when distance <= d and boundary rules allow it.',
        'Maximum reachable chain length becomes 4 positions.',
      ],
      output: '4',
    },
    pitfalls: [
      'Equal heights must be handled as a group when popping; otherwise transitions between same heights can be mishandled.',
      'Distance constraint (<= d) applies to every transition; skipping this check overestimates dp.',
      'Return max(dp)+1 because dp counts jumps, while the problem asks for number of indices visited.',
    ],
  },

  1871: {
    intuition:
      'From each reachable index j, you can mark a future window [j + minJump, j + maxJump]. Directly iterating every window is too slow. Instead, for each index i, ask whether there exists at least one reachable j in [i - maxJump, i - minJump]. A prefix sum over reachable flags answers this in constant time per index.',
    algorithm: [
      'Let isReachable[i] indicate whether index i can be reached; set isReachable[0] = true.',
      'Maintain prefixSum where prefixSum[k] = number of reachable indices in [0, k-1].',
      'For each i from 1 to n-1:',
      '  Only process if s[i] == "0".',
      '  Compute left = max(0, i - maxJump), right = i - minJump.',
      '  If left <= right and prefixSum[right + 1] - prefixSum[left] > 0, set isReachable[i] = true.',
      '  Update prefixSum[i + 1] = prefixSum[i] + (isReachable[i] ? 1 : 0).',
      'Return isReachable[n - 1].',
    ],
    example: {
      input: 's = "011010", minJump = 2, maxJump = 3',
      steps: [
        'i=3 (s[3]=0): check j in [0,1]. Index 0 is reachable, so i=3 becomes reachable.',
        'i=5 (s[5]=0): check j in [2,3]. Index 3 is reachable, so i=5 becomes reachable.',
        'Last index becomes reachable, answer is true.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Skip positions where s[i] == "1"; they cannot be landed on.',
      'Bounds for [i-maxJump, i-minJump] must be clamped correctly or range checks break.',
      'A naive nested scan over each window is O(n*maxJump) and can time out; prefix sums are essential.',
    ],
  },

  3120: {
    intuition:
      'Each alphabet letter can appear in lowercase, uppercase, both, or neither. In this variant, a letter is special only if the lowercase occurrence appears before the uppercase occurrence. So we need both presence tracking and order awareness, not just counts.',
    algorithm: [
      'Create two boolean arrays of size 26: lower[] and upper[].',
      'Traverse each character c in word:',
      '  If c is lowercase, mark lower[c - "a"] only if the uppercase version has not been seen yet.',
      '  Otherwise mark upper[c - "A"] = true.',
      'After traversal, iterate i from 0 to 25 and count positions where lower[i] && upper[i].',
      'Return the count.',
    ],
    example: {
      input: 'word = "aaAbcBC"',
      steps: [
        'For a: lowercase appears before uppercase A, so a is special.',
        'For b and c: lowercase appears before uppercase B/C, so both are special.',
        'Total special characters = 3.',
      ],
      output: '3',
    },
    pitfalls: [
      'Order matters in variant II; a lowercase after the uppercase should not count.',
      'Use separate arrays (or sets) for lowercase and uppercase to avoid accidental index mixing.',
      'Do not count a letter just because both cases appear somewhere; the lowercase must come first.',
    ],
  },

  3093: {
    intuition:
      'Two words share a suffix when their reversed strings share a prefix. So we can turn suffix matching into prefix matching by inserting reversed container words into a trie. At each node, store the index of the shortest container word passing there (with earliest index tie behavior coming from insertion order updates), which gives the required answer for the best suffix match.',
    algorithm: [
      'Build a trie where each edge corresponds to a character of a word scanned from end to start.',
      'During insertion, move through reversed characters and update node metadata (shortest length and its index).',
      'Track minIndex globally as the shortest word in wordsContainer for full fallback.',
      'For each query, traverse the trie from query end to start.',
      'If traversal breaks, return the stored index of the deepest matched node; if none, fallback to minIndex.',
      'If traversal completes, return the current node index.',
    ],
    example: {
      input: 'wordsContainer = ["abcd","bcd","xbcd"], wordsQuery = ["cd","bcd","xyz"]',
      steps: [
        'Insert reversed container words: "dcba", "dcb", "dcbx" with node metadata tracking shortest candidate index.',
        'Query "cd" -> reversed "dc": trie path exists, best index resolves to word "bcd" (shortest match).',
        'Query "bcd" -> reversed "dcb": exact suffix path exists, again chooses shortest valid candidate.',
        'Query "xyz" -> reversed "zyx": first edge missing, fallback to globally shortest container word index.',
      ],
      output: '[1, 1, 1]',
    },
    pitfalls: [
      'This is suffix matching, so traversal must go from end to start; forward traversal solves a different problem.',
      'Fallback behavior matters: when no suffix matches, return the shortest container word index.',
      'Node metadata should represent the best candidate seen so far (shortest length, then earliest insertion semantics).',
    ],
  },

  3300: {
    intuition:
      'Each element is independently replaced by the sum of its digits, then we need the minimum among transformed values. Since replacement does not depend on other elements, a single pass with a running minimum is optimal.',
    algorithm: [
      'Initialise ans = +infinity.',
      'For each number num in nums:',
      '  Compute digitSum(num) by repeatedly taking num % 10 and num /= 10.',
      '  Update ans = min(ans, digitSum(num)).',
      'Return ans after processing all elements.',
    ],
    example: {
      input: 'nums = [10, 12, 13, 14]',
      steps: [
        'digitSum(10) = 1, ans = 1.',
        'digitSum(12) = 3, ans stays 1.',
        'digitSum(13) = 4, digitSum(14) = 5, ans stays 1.',
      ],
      output: '1',
    },
    pitfalls: [
      'Remember that digit sum for 0 is 0; guard if inputs can include 0.',
      'Do not sort just to find a minimum transformed value; one pass is enough.',
      'Digit-sum computation should use integer operations, not string conversion, for efficiency and simplicity.',
    ],
  },

  3161: {
    intuition:
      'If we process the queries backward, a type-1 obstacle insertion becomes a deletion that merges two adjacent free gaps. That makes the structure much easier to maintain. Fenwick trees provide fast predecessor/successor lookup and fast prefix-max gap queries, which are enough to answer each type-2 query in logarithmic time.',
    algorithm: [
      'Add sentinel obstacles at both ends so boundary gaps are represented naturally.',
      'Preload all type-1 obstacles into a Fenwick tree that counts obstacle positions.',
      'Use binary lifting on the count tree to find predecessor and successor obstacles.',
      'Build an auxiliary Fenwick tree storing prefix maxima of gap lengths.',
      'Process queries in reverse: type-1 removes an obstacle and merges gaps; type-2 checks whether a segment of size sz fits.',
      'Reverse the answers list before returning it.',
    ],
    example: {
      input: 'queries = [[1,2],[1,5],[2,5,2]]',
      steps: [
        'Load both type-1 insertions, so obstacles include the sentinels and positions 2 and 5.',
        'In reverse, the type-2 query checks the largest gap up to predecessor of x=5 and the direct room before x.',
        'If a free block of length 2 exists, the answer is true.',
      ],
      output: '[true]',
    },
    pitfalls: [
      'Fenwick tree indices are 1-based internally; keep conversions consistent.',
      'The reverse-processing trick is required to avoid hard dynamic interval maintenance in forward order.',
      'Do not omit sentinels or the edge gaps at the boundaries will be missed.',
    ],
  },

  2126: {
    intuition:
      'Larger asteroids block smaller ones only if they come before them. So if we sort asteroids by size and absorb them left-to-right, each successful absorption increases our mass for later asteroids. A greedy strategy of always absorbing in order works because the sorted order is optimal.',
    algorithm: [
      'Sort the asteroids array in ascending order.',
      'Start with the given initial mass.',
      'For each asteroid in sorted order:',
      '  If current mass >= asteroid size, absorb it by adding to mass.',
      '  Otherwise, return false (planet destroyed).',
      'If all asteroids are absorbed, return true.',
    ],
    example: {
      input: 'mass = 10, asteroids = [3, 9, 19, 5, 21]',
      steps: [
        'Sorted: [3, 5, 9, 19, 21].',
        'Absorb 3: mass = 13.',
        'Absorb 5: mass = 18.',
        'Absorb 9: mass = 27, now strong enough for 19 and 21.',
      ],
      output: 'true',
    },
    pitfalls: [
      'Without sorting, you cannot determine order of collisions in the array; sorting gives a valid sequence.',
      'Greedy absorption is safe because sorted order ensures future asteroids are at least as large.',
      'Use long for mass accumulation to avoid integer overflow.',
    ],
  },

  2144: {
    intuition:
      'To minimize total payment under buy-2-get-1-free, each free candy should be as expensive as possible. Sorting in descending order and taking every third candy as free guarantees that the skipped candy in each group is the best possible free choice.',
    algorithm: [
      'Sort the cost array in descending order.',
      'Initialize answer = 0.',
      'Traverse i from 0 to n-1:',
      '  If i % 3 != 2, add cost[i] to answer.',
      '  If i % 3 == 2, skip cost[i] because it is free.',
      'Return answer.',
    ],
    example: {
      input: 'cost = [6, 5, 7, 9, 2, 2]',
      steps: [
        'Sort descending -> [9, 7, 6, 5, 2, 2].',
        'Indices 0,1 paid: 9 + 7.',
        'Index 2 free: 6 skipped.',
        'Indices 3,4 paid: 5 + 2, index 5 free: 2 skipped.',
      ],
      output: '23',
    },
    pitfalls: [
      'Skipping every third element before sorting is incorrect.',
      'Ascending sort gives suboptimal free candies and larger total payment.',
      'For very large constraints in other languages, watch integer overflow in the sum.',
    ],
  },

  3633: {
    intuition:
      'You must complete one land ride and one water ride, but the order is flexible. For each order, only the earliest possible completion of the first ride type matters, because any later first completion cannot improve the final answer. Then evaluate all second rides against that earliest finish and take the minimum overall.',
    algorithm: [
      'Compute answer for order A->B and B->A separately, then return the smaller one.',
      'For one order, scan all first-type rides and compute earliestFirst = min(start[i] + duration[i]).',
      'Scan all second-type rides and compute finish = max(earliestFirst, secondStart[j]) + secondDuration[j].',
      'Track the minimum finish over all second rides for that order.',
      'Return min(order1Result, order2Result).',
    ],
    example: {
      input: 'landStartTime = [2, 5], landDuration = [3, 2], waterStartTime = [4, 7], waterDuration = [4, 1]',
      steps: [
        'Land first: earliest land finish is min(2+3, 5+2) = 5.',
        'Then water finishes at min(max(5,4)+4, max(5,7)+1) = min(9,8) = 8.',
        'Water first: earliest water finish is min(4+4, 7+1) = 8.',
        'Then land finishes at min(max(8,2)+3, max(8,5)+2) = min(11,10) = 10.',
      ],
      output: '8',
    },
    pitfalls: [
      'Do not force a single order; both land->water and water->land must be checked.',
      'The second ride start time is constrained by both availability and your previous completion time, so use max(...).',
      'Avoid O(n*m) pair enumeration; earliest first completion collapses each order to linear scans.',
    ],
  },

  3635: {
    intuition:
      'Even with larger constraints, the core observation is unchanged: for a chosen order of ride types, only the earliest possible finish of the first ride matters. Any slower first ride can only delay or equal the second ride start, never improve it. So each order reduces to two linear scans, and the final answer is the minimum over both orders.',
    algorithm: [
      'Define a helper for order A->B.',
      'In that helper, compute earliestA = min(aStart[i] + aDuration[i]) over all A rides.',
      'For each B ride, compute candidate = max(earliestA, bStart[j]) + bDuration[j].',
      'Take the minimum candidate for that order.',
      'Run helper twice: land->water and water->land, and return the smaller value.',
    ],
    example: {
      input: 'landStartTime = [1, 8], landDuration = [5, 1], waterStartTime = [3, 10], waterDuration = [4, 2]',
      steps: [
        'Land first: earliest land finish = min(1+5, 8+1) = 6.',
        'Water completion candidates: max(6,3)+4 = 10, max(6,10)+2 = 12 -> order result 10.',
        'Water first: earliest water finish = min(3+4, 10+2) = 7.',
        'Land completion candidates: max(7,1)+5 = 12, max(7,8)+1 = 9 -> order result 9.',
      ],
      output: '9',
    },
    pitfalls: [
      'Do not attempt all pair combinations between both ride sets; that is unnecessary and too slow.',
      'When chaining rides, start time is constrained by both availability and previous completion, so max(...) is mandatory.',
      'Checking only one order can miss the optimal answer; always evaluate both directions.',
    ],
  },

  3751: {
    intuition:
      'Total waviness over a range is additive, so we can evaluate each number independently and sum the counts. For one number, waviness is determined by local comparisons between each middle digit and its two neighbors. Counting local peaks and valleys directly matches the definition.',
    algorithm: [
      'Initialize answer = 0.',
      'For each x from num1 to num2, compute F(x) and add it to answer.',
      'In F(x), extract digits into an array from least significant to most significant.',
      'If digit count is less than 3, waviness is 0.',
      'For every index i from 1 to m-2, increment count if digit[i] is a strict local maximum or strict local minimum.',
      'Return the accumulated range sum.',
    ],
    example: {
      input: 'num1 = 120, num2 = 123',
      steps: [
        '120 -> digits [0,2,1], middle digit 2 is greater than both neighbors -> waviness 1.',
        '121 -> digits [1,2,1], middle digit 2 is greater than both neighbors -> waviness 1.',
        '122 -> digits [2,2,1], middle digit 2 is not strictly greater or smaller -> waviness 0.',
        '123 -> digits [3,2,1], middle digit 2 is not local extremum -> waviness 0.',
      ],
      output: '2',
    },
    pitfalls: [
      'Comparisons must be strict; equal neighboring digits do not form waviness.',
      'Numbers with fewer than three digits always contribute 0.',
      'Digit extraction order does not matter for local-extremum counting as long as adjacency is preserved consistently.',
    ],
  },

  3753: {
    intuition:
      'Brute force over a large range is too slow, so we aggregate waviness contributions with digit DP. While building each number digit by digit, we only need the previous two significant digits to know whether the next digit creates a local peak/valley at the middle position. Summing these contributions across all DP paths gives total waviness up to a bound.',
    algorithm: [
      'Define Solve(num) = total waviness of all integers in [0, num].',
      'Use digit DP state: (prevDigit, currDigit, tight, leadingZero) plus two aggregates: count of numbers and accumulated waviness sum.',
      'Initialize with a sentinel state representing no significant digits yet.',
      'For each position, try all allowed digits (respecting tight), update next state, and add waviness contribution when three significant digits are available.',
      'After processing all positions, sum waviness totals over all terminal states.',
      'Answer range query as Solve(num2) - Solve(num1 - 1).',
    ],
    example: {
      input: 'num1 = 120, num2 = 123',
      steps: [
        'Compute prefix total up to 123 with digit DP.',
        'Compute prefix total up to 119 with digit DP.',
        'Subtract to isolate [120,123].',
        'Within this range, 120 and 121 contribute 1 each, 122 and 123 contribute 0, total 2.',
      ],
      output: '2',
    },
    pitfalls: [
      'Leading zeros must not be treated as real digits in waviness comparisons.',
      'Local-extremum contribution is for the middle of a 3-digit window, so state must remember two prior significant digits.',
      'For range answers, always use prefix subtraction Solve(R) - Solve(L-1).',
    ],
  },

  3754: {
    intuition:
      'Strip zeros from n while preserving order of the remaining digits to form x. The sum is the digit sum of x (zeros in the original number contribute nothing). A single right-to-left pass can build x with a place-value multiplier and accumulate sum at the same time.',
    algorithm: [
      'Initialize x = 0, sum = 0, place = 1.',
      'While n > 0: read digit = n % 10.',
      'If digit != 0: add digit to sum, add digit * place to x, multiply place by 10.',
      'Divide n by 10 and continue.',
      'Return x * sum (use long to avoid overflow on large products).',
    ],
    example: {
      input: 'n = 10203004',
      steps: [
        'Non-zero digits in order: 1, 2, 3, 4 → x = 1234.',
        'sum = 1 + 2 + 3 + 4 = 10.',
        'Answer = 1234 * 10 = 12340.',
      ],
      output: '12340',
    },
    pitfalls: [
      'Build x from right to left with place *= 10 so digit order matches the original number.',
      'sum is over digits in x only; skipping zeros in n is equivalent to ignoring zero addends.',
      'Edge case n = 0 or all-zero digits: x = 0 and sum = 0, return 0.',
    ],
  },

  3756: {
    intuition:
      'Each query is LC 3754 on a substring. Precompute prefix digit sums, non-zero counts, and the modulo concatenation value p[i] for the first i characters. For [l,r], the substring’s x satisfies p[r+1] = p[l]·10^n0 + x, so extract x in O(1) per query.',
    algorithm: [
      'Precompute POW10[i] = 10^i mod (1e9+7).',
      'Build sumD, cntN0, and p prefix arrays over s (1-indexed).',
      'For each query [l,r]: n0 = cntN0[r+1] − cntN0[l], sd = sumD[r+1] − sumD[l].',
      'x = (p[r+1] − p[l]·POW10[n0]) mod MOD.',
      'answer = (x · sd) mod MOD.',
    ],
    example: {
      input: 's = "10203004", queries = [[0,7],[1,3],[4,6]]',
      steps: [
        'Query [0,7]: x = 1234, sd = 10 → 12340.',
        'Query [1,3] on "020": x = 2, sd = 2 → 4.',
        'Query [4,6] on "300": x = 3, sd = 3 → 9.',
      ],
      output: '[12340, 4, 9]',
    },
    pitfalls: [
      'Use 1-indexed prefixes; query bounds l,r are 0-indexed inclusive.',
      'Add MOD before modulo when subtracting p[l]·10^n0 from p[r+1].',
      'sumD counts all digits; zeros add 0, so it equals the sum of non-zero digits in the range.',
    ],
  },

  3689: {
    intuition:
      'The value of any subarray is determined only by its maximum and minimum element. No subarray can have a larger difference than the global maximum minus the global minimum of the entire array, because every subarray element is still one of the original array elements. Since the problem asks for the maximum total value after choosing k subarrays and overlapping is allowed, we can choose a best-value subarray every time, so the answer is k multiplied by that single best possible difference.',
    algorithm: [
      'Scan nums once and track the largest element mx and the smallest element mn.',
      'The maximum possible value for one chosen subarray is mx - mn.',
      'Because the same optimal subarray can be chosen for each of the k selections, return k * (mx - mn).',
      'Use long for the final multiplication so large k and value differences do not overflow an int result.',
      'Time Complexity: O(n), where n is nums.length, because each element is visited once.',
      'Space Complexity: O(1), because only two running values are stored.',
    ],
    example: {
      input: 'nums = [1, 3, 2, 5], k = 3',
      steps: [
        'The global minimum is 1 and the global maximum is 5.',
        'No subarray can have value greater than 5 - 1 = 4.',
        'A subarray containing both 1 and 5 reaches that value, so the best value for one pick is 4.',
        'Since overlapping/reusing the best choice is allowed, total value = 3 * 4 = 12.',
      ],
      output: '12',
    },
    pitfalls: [
      'Do not try to enumerate every subarray; the global max-min bound already gives the best possible value.',
      'Do not greedily pick disjoint subarrays; the problem allows overlapping selections.',
      'Cast before multiplying so the answer is computed as a long.',
    ],
  },

  3691: {
    intuition:
      'For a fixed left endpoint l, the subarray value max(nums[l..r]) - min(nums[l..r]) is largest when r is farthest to the right, and it never increases when we shrink r leftward. That means every left endpoint produces a sorted stream of candidate values. A max-heap can merge these n streams: always take the current best subarray, then reveal the next smaller candidate from the same left endpoint.',
    algorithm: [
      'Build a sparse table that can answer range maximum and range minimum queries in O(1).',
      'For every left endpoint l, compute value(l, n-1) and push [value, l, n-1] into a max-heap.',
      'Repeat up to k times while the heap is non-empty.',
      'Pop the largest available candidate and add its value to the answer.',
      'If its right endpoint r is still greater than l, compute value(l, r-1) and push that next candidate for the same left endpoint.',
      'Return the accumulated answer as a long.',
      'Time Complexity: O(n log n + (n + k) log n): sparse-table preprocessing plus heap initialization and k heap pops/pushes.',
      'Space Complexity: O(n log n), dominated by the sparse tables for range max/min.',
    ],
    example: {
      input: 'nums = [1, 3, 2], k = 3',
      steps: [
        'For l = 0, candidates by shrinking r are [1,3,2] -> 2, [1,3] -> 2, [1] -> 0.',
        'For l = 1, candidates are [3,2] -> 1, [3] -> 0.',
        'For l = 2, candidate is [2] -> 0.',
        'The heap first contains values 2, 1, and 0. Pop 2 from l=0, then push the next l=0 value 2.',
        'Pop 2 again, then pop 1. The top 3 total is 2 + 2 + 1 = 5.',
      ],
      output: '5',
    },
    pitfalls: [
      'Do not recompute max and min by scanning every subarray; that becomes too slow.',
      'The heap entry must carry both l and r so the next candidate for the same left endpoint can be generated correctly.',
      'Use long for the answer because the sum of k selected values can exceed int range.',
    ],
  },

  3699: {
    intuition:
      'Count zigzag arrays of length n with values in [l, r]: adjacent elements differ, and no three consecutive elements are strictly increasing or decreasing. Track the last value and whether the previous step went up or down. If the last step was up, the next value must be smaller (otherwise a < b < c). If the last step was down, the next must be larger. Prefix and suffix sums over values make each extension O(r − l).',
    algorithm: [
      'Initialize up[v] and down[v] from all length-2 pairs (a, b) with a ≠ b.',
      'up[b] counts arrays ending at b with a < b; down[b] counts a > b.',
      'For each additional position: nextUp[w] = sum of down[v] for v < w (prefix).',
      'nextDown[w] = sum of up[v] for v > w (suffix).',
      'Repeat for n − 2 extension steps.',
      'Return sum of up[v] + down[v] over v ∈ [l, r], modulo 10⁹ + 7.',
    ],
    example: {
      input: 'n = 3, l = 4, r = 5',
      steps: [
        'Length-2 pairs: (4,5) and (5,4) only.',
        'From (5, up): next value must be < 5 → 4 gives [4,5,4].',
        'From (4, down): next value must be > 4 → 5 gives [5,4,5].',
        'Total = 2.',
      ],
      output: '2',
    },
    pitfalls: [
      'From “last step up” only allow w < v — not w > v (creates strictly increasing triple).',
      'Use long for DP counts before the final modulo.',
      'Initialize with pairs at length 2, then loop n − 2 times (not n − 1).',
    ],
  },

  3700: {
    intuition:
      'Same zigzag rules as LC 3699, but n can be up to 10⁹ — iterating the DP n times is impossible. Each extension step is linear: nextUp = prefix sum of down, nextDown = suffix sum of up. That step is encoded by V×V matrices U (lower-triangular prefix) and D (upper-triangular suffix). Two steps compose as UD; binary-exponentiate UD for (n−1)/2 steps, multiply by U when n−1 is odd, then sum all matrix entries and double for up/down symmetry.',
    algorithm: [
      'Let m = r − l + 1 (at most 75). Build U[i][j] = 1 if j < i and D[i][j] = 1 if j > i.',
      'Compute UD = U × D (one pair of up/down extensions).',
      'Decrement n once; mat = UD^(n/2) via binary matrix exponentiation.',
      'If n is odd after decrement, mat = mat × U.',
      'Answer = 2 × (sum of all entries of mat) mod 10⁹ + 7.',
    ],
    example: {
      input: 'n = 3, l = 4, r = 5',
      steps: [
        'm = 2 values {4,5}. After one extension from length-2 pairs, only [4,5,4] and [5,4,5] survive.',
        'Matrix sum × 2 gives total 2 zigzag arrays.',
      ],
      output: '2',
    },
    pitfalls: [
      'Do not loop n − 2 DP steps when n ≤ 10⁹ — matrix exponentiation is required.',
      'Multiply the final matrix sum by 2 to account for both up-ending and down-ending states.',
      'After n--, use n/2 and n&1 for the exponent split; off-by-one here breaks large n.',
    ],
  },

  3737: {
    intuition:
      'Target is a strict majority in subarray [l, r] when its count exceeds half the length. Encode +1 for target and −1 for every other value: the subarray sum is positive exactly in that case (2·count − length > 0). Scan left to right with a running prefix sum s; each new position starts subarrays ending here whose earlier prefix is strictly less than s — count those with a Fenwick tree on shifted indices.',
    algorithm: [
      'Initialize Fenwick tree and prefix sum s = n + 1 (offset so indices stay positive).',
      'Record one occurrence of the empty prefix: tree.Update(s, 1).',
      'For each x in nums: s += 1 if x == target else −1.',
      'Add tree.Query(s − 1) to the answer (earlier prefixes smaller than current).',
      'tree.Update(s, 1) and continue.',
      'Return the total count.',
    ],
    example: {
      input: 'nums = [1,2,2,3], target = 2',
      steps: [
        'Subarrays where 2 is strict majority: [2,2], [2,2,3], [1,2,2], [1,2,2,3] — four total.',
        'Transformed +1/−1 prefix sums stay positive only on those windows.',
      ],
      output: '4',
    },
    pitfalls: [
      'Strict majority needs sum > 0, not ≥ 0 — query prefixes < s, not ≤ s.',
      'Offset prefix sums by n + 1 so Fenwick indices never go negative.',
      'Use long for the answer if n is large; counts can exceed int.',
    ],
  },

  3739: {
    intuition:
      'Identical counting rule to LC 3737: target is a strict majority in a subarray when +1/−1 encoding yields a positive sum. Use a Fenwick tree over shifted prefix sums to count how many earlier prefixes are strictly smaller than the current one. Part II only changes constraints — the answer can exceed 32-bit range, so accumulate in long and return long from CountMajoritySubarrays.',
    algorithm: [
      'Same pipeline as 3737: offset prefix s = n + 1, seed empty prefix in the BIT.',
      'For each value: update s (+1 for target, −1 otherwise).',
      'ans += Query(s − 1); Update(s, 1).',
      'Return ans as long.',
    ],
    example: {
      input: 'nums = [1,2,2,3], target = 2',
      steps: [
        'Four subarrays have 2 as strict majority — same as problem I.',
        'With larger n the count may overflow int; long prevents wraparound.',
      ],
      output: '4',
    },
    pitfalls: [
      'Do not cast the Fenwick accumulation to int before returning.',
      'BIT frequency array can stay int; only the running answer needs long.',
      'Query(s − 1), not Query(s), for strict majority (positive sum, not zero).',
    ],
  },

  3558: {
    intuition:
      'Only the path from node 1 to the deepest reachable node matters, because the answer depends on the maximum number of edges that may be assigned weights. If that path has d edges, each edge can be weight 1 or 2, giving 2^d total assignments. Exactly half of those assignments have odd total sum: flipping any one edge toggles the parity, pairing every even-sum assignment with one odd-sum assignment. So the count is 2^(d-1).',
    algorithm: [
      'Build an undirected adjacency list from the edge list.',
      'Run BFS starting at node 1 and mark visited nodes.',
      'Process BFS level by level; the number of completed levels gives the maximum depth plus one, because level 0 contains the root.',
      'Let d be the maximum depth in edges. The code computes d - 1 as step - 2 for the exponent.',
      'Return 2^(d-1) modulo 1,000,000,007 using fast modular exponentiation.',
      'Time Complexity: O(n + log n), where n is the number of nodes: BFS is linear and modular exponentiation is logarithmic in the depth.',
      'Space Complexity: O(n), for the adjacency list, queue, and visited array.',
    ],
    example: {
      input: 'edges = [[1,2],[1,3],[3,4]]',
      steps: [
        'BFS levels from node 1 are: level 0 -> [1], level 1 -> [2,3], level 2 -> [4].',
        'The deepest path has d = 2 edges, for example 1 -> 3 -> 4.',
        'There are 2^2 = 4 assignments of weights 1/2 on those two edges.',
        'Odd sums occur for (1,2) and (2,1), so the answer is 2 = 2^(2-1).',
      ],
      output: '2',
    },
    pitfalls: [
      'Depth should be counted in edges, not nodes.',
      'Use modulo arithmetic for the power calculation.',
      'The tree is undirected in the input, so add both u->v and v->u to the graph.',
    ],
  },

  3559: {
    intuition:
      'For any query path between nodes u and v, only the number of edges on that path matters. If the path has d edges, each edge can independently receive weight 1 or 2, giving 2^d total assignments. Exactly half of those assignments have odd total sum, because flipping any one edge toggles the parity. Therefore each non-empty path contributes 2^(d-1), and the work is finding d quickly for every query.',
    algorithm: [
      'Build an undirected adjacency list for the tree.',
      'Root the tree at node 1 and run DFS to fill depth[v] and the immediate parent parent[0][v].',
      'Build the binary-lifting table where parent[k][v] is the 2^k-th ancestor of v.',
      'For each query (u, v), return 0 immediately if u == v because the path has no edges.',
      'Find lca = LCA(u, v) using the lifting table.',
      'Compute path length d = depth[u] + depth[v] - 2 * depth[lca].',
      'Return 2^(d-1) modulo 1,000,000,007.',
    ],
    example: {
      input: 'edges = [[1,2],[1,3],[3,4]], queries = [[2,4],[3,3]]',
      steps: [
        'Root at 1. Depths are depth[1]=0, depth[2]=1, depth[3]=1, depth[4]=2.',
        'For query [2,4], LCA is 1, so d = 1 + 2 - 2*0 = 3 edges.',
        'A 3-edge path has 2^3 total assignments; half have odd sum, so answer is 2^(3-1) = 4.',
        'For query [3,3], there are no path edges, so the answer is 0.',
      ],
      output: '[4, 0]',
    },
    pitfalls: [
      'Return 0 for u == v; applying 2^(d-1) with d = 0 would be invalid.',
      'Depth is measured in edges from the root.',
      'Build the tree as undirected, then use parent tracking to avoid walking back during DFS.',
    ],
  },

  3838: {
    intuition:
      'Each word is mapped independently. Add the weight of every letter, reduce modulo 26, then convert that residue to a single output character using the reverse-alphabet formula 25 - sum. The only work per word is one pass over its characters plus constant-time modular arithmetic.',
    algorithm: [
      'Initialize an empty result string.',
      'For each word, set sum = 0.',
      'For each character c in the word, add weights[c - \'a\'] to sum and take sum modulo 26.',
      'Append the character (char)(\'a\' + (25 - sum)) to the result.',
      'Return the built string after all words are processed.',
    ],
    example: {
      input: 'words = ["a", "b"], weights = [1,2,...,26]',
      steps: [
        'For "a": sum = weights[0] = 1, so mapped index is 25 - 1 = 24 -> \'y\'.',
        'For "b": sum = weights[1] = 2, so mapped index is 25 - 2 = 23 -> \'x\'.',
        'Concatenate the mapped letters in input order.',
      ],
      output: '"yx"',
    },
    pitfalls: [
      'Apply modulo 26 after every addition to keep the sum in range.',
      'The output index is 25 - sum, not sum itself.',
      'weights[i] corresponds to the i-th lowercase letter starting from \'a\'.',
    ],
  },

  2130: {
    intuition:
      'Twin pairs are symmetric positions from the ends of the list: first with last, second with second-last, and so on. Finding every twin by indexing from both ends would need extra space or repeated traversals. Instead, locate the start of the second half with slow/fast pointers, reverse that half in place, and walk both halves together to evaluate each twin sum.',
    algorithm: [
      'Advance slow one step and fast two steps until fast reaches the end; slow then starts the second half.',
      'Reverse the linked list beginning at slow and keep the new head as tail.',
      'Initialize answer = 0.',
      'While tail is not null, update answer with max(answer, head.val + tail.val).',
      'Move head and tail one node forward each iteration.',
      'Return answer.',
    ],
    example: {
      input: 'head = [5, 4, 2, 1]',
      steps: [
        'Slow/fast split places slow at node 2, the start of the second half.',
        'Reverse the second half: 2 -> 1 becomes 1 -> 2.',
        'Compare twins: 5 + 1 = 6 and 4 + 2 = 6.',
        'Maximum twin sum is 6.',
      ],
      output: '6',
    },
    pitfalls: [
      'Reverse only the second half, not the entire list.',
      'After reversal, head still points to the original first node of the first half.',
      'The loop should continue until tail becomes null, covering all twin pairs.',
    ],
  },

  1344: {
    intuition:
      'A clock face is 360° with 12 hour marks (30° apart) and 60 minute marks (6° apart). The hour hand moves continuously: at hour h and minute m it sits at (h mod 12 + m/60) × 30 degrees. The minute hand sits at m × 6 degrees. The angle between them is the absolute difference; return the smaller of that difference and 360 minus the difference to get the acute angle.',
    algorithm: [
      'Compute hourHand = (hour % 12 + minutes / 60.0) * 30.',
      'Compute minuteHand = minutes * 6.0.',
      'Set diff = |hourHand - minuteHand|.',
      'Return min(diff, 360 - diff).',
    ],
    example: {
      input: 'hour = 12, minutes = 30',
      steps: [
        'hourHand = (0 + 30/60) × 30 = 15°.',
        'minuteHand = 30 × 6 = 180°.',
        'diff = |15 - 180| = 165°.',
        'min(165, 195) = 165°.',
      ],
      output: '165',
    },
    pitfalls: [
      'Use hour % 12 so 12 o\'clock is treated as 0 for position math.',
      'Include minutes in the hour-hand position (fractional hour).',
      'Return the smaller angle, not always the raw difference.',
    ],
  },

  3612: {
    intuition:
      'Process the string left to right and maintain the current result as a mutable sequence. Letters append. The * character removes the last character if any exist. The # character duplicates the current result by appending it to itself. The % character reverses the entire current result in place. After all characters, convert the mutable result to a string.',
    algorithm: [
      'Create an empty mutable result (StringBuilder).',
      'Scan characters from left to right.',
      'If the character is a lowercase English letter, append it to result.',
      'If the character is the * operator and result is not empty, remove the last character.',
      'If the character is the # operator, append the current result to itself to duplicate it.',
      'If the character is the % operator, reverse the entire current result in place.',
      'Return result as a string.',
    ],
    example: {
      input: 's = "a#b%*"',
      steps: [
        'Start result = "".',
        'Read a → append → "a".',
        'Read # → duplicate → "aa".',
        'Read b → append → "aab".',
        'Read % → reverse → "baa".',
        'Read * → remove last → "ba".',
      ],
      output: '"ba"',
    },
    pitfalls: [
      'If * appears when result is empty, do nothing.',
      'For #, duplicate the current content by appending a copy of the builder, not only one character.',
      'For %, reverse the whole current result, not only the next segment.',
    ],
  },

  1833: {
    intuition:
      'Buy as many ice cream bars as possible with a fixed coin budget. Each bar has a cost — always take the cheapest available bars first. Sort costs ascending, subtract each cost from coins while you can afford it, and stop at the first bar that exceeds the remaining coins. The index where you stop is the count of bars bought.',
    algorithm: [
      'Sort costs in ascending order.',
      'Loop i from 0 to n − 1: if coins >= costs[i], subtract costs[i]; else return i.',
      'If the loop finishes, return costs.Length (afforded all bars).',
    ],
    example: {
      input: 'costs = [1,3,2,4,1], coins = 7',
      steps: [
        'Sorted costs → [1, 1, 2, 3, 4].',
        'Buy at 1 → coins = 6 (count 1).',
        'Buy at 1 → coins = 5 (count 2).',
        'Buy at 2 → coins = 3 (count 3).',
        'Buy at 3 → coins = 0 (count 4).',
        'Cannot afford 4 → return 4.',
      ],
      output: '4',
    },
    pitfalls: [
      'Sort first — greedy on unsorted costs is wrong.',
      'Return the index i when you cannot afford costs[i], not i − 1.',
      'If all bars fit, return costs.Length, not costs.Length − 1.',
    ],
  },

  1840: {
    intuition:
      'Buildings sit on positions 1..n. Height can change by at most 1 per step, and position 1 starts at height 0 — so position i can never exceed i − 1 without restrictions. Each restriction [id, height] caps that position. After adding sentinels at (1, 0) and (n, n − 1), propagate caps left-to-right and right-to-left so neighboring limits are consistent with the slope-1 rule. The maximum height between two consecutive caps is the peak of the best “mountain” that fits between them.',
    algorithm: [
      'Append sentinels [1, 0] and [n, n − 1] to restrictions; sort by position then height.',
      'Forward: for i = 1..end, set cap[i] = min(cap[i], cap[i−1] + position[i] − position[i−1]).',
      'Backward: for i = end−1..0, set cap[i] = min(cap[i], cap[i+1] + position[i+1] − position[i]).',
      'For each adjacent pair (l, hL) and (r, hR), update ans with max(hL, hR) + (r − l − |hL − hR|) / 2.',
      'Return ans.',
    ],
    example: {
      input: 'n = 5, restrictions = [[2,1],[4,1]]',
      steps: [
        'Sentinels → (1,0), (2,1), (4,1), (5,4). Forward/backward passes keep caps (1,0), (2,1), (4,1), (5,2).',
        'Segment 1→2: max(0,1) + (1 − 1)/2 = 1.',
        'Segment 2→4: max(1,1) + (2 − 0)/2 = 2.',
        'Segment 4→5: max(1,2) + (1 − 1)/2 = 2.',
      ],
      output: '2',
    },
    pitfalls: [
      'Include sentinel at position 1 with height 0 — the problem starts there.',
      'Position n is capped at n − 1 by the slope rule even without user restrictions.',
      'Integer division in the peak formula — (r − l − |hL − hR|) must be even when caps are feasible.',
    ],
  },

  1846: {
    intuition:
      'You may decrease any element and reorder freely. In sorted order the constraints are arr[0] = 1 and each step increases by at most 1 — so the array is as steep as possible while staying valid. After sorting, pin the minimum to 1, then each next value is capped at previous + 1 but never increased. The last element is the maximum achievable.',
    algorithm: [
      'Sort arr ascending.',
      'Set arr[0] = 1.',
      'For i from 1 to n − 1: arr[i] = min(arr[i], arr[i − 1] + 1).',
      'Return arr[n − 1].',
    ],
    example: {
      input: 'arr = [3, 9, 7, 3, 2, 5, 3, 9, 0, 1]',
      steps: [
        'Sorted: 0,1,2,3,3,3,5,7,9,9 → force start 1, then 1,2,3,3,3,4,5,6,7.',
      ],
      output: '7',
    },
    pitfalls: [
      'Sort first — rearranging means you pick the order after decreases.',
      'Use min, not max — you only decrease values.',
      'arr[0] must be exactly 1, not min(arr).',
    ],
  },

  1732: {
    intuition:
      'The biker begins at altitude 0 before any road segment. Each gain[i] adds to the current altitude — that is a prefix sum over the gain array. The highest altitude is the maximum prefix sum encountered, including the starting altitude 0 before the first segment.',
    algorithm: [
      'Set ans = 0 and currAltitude = 0 (starting point).',
      'For each g in gain: add g to currAltitude.',
      'Update ans = max(ans, currAltitude) after each step.',
      'Return ans.',
    ],
    example: {
      input: 'gain = [-5, 1, 5, 0, -7]',
      steps: [
        'Start at altitude 0 → ans = 0.',
        'After -5 → altitude -5 → ans still 0.',
        'After +1 → altitude -4.',
        'After +5 → altitude 1 → ans = 1.',
        'After 0 → altitude 1.',
        'After -7 → altitude -6.',
      ],
      output: '1',
    },
    pitfalls: [
      'Initialize ans to 0 — the answer can be 0 if the biker never climbs above the start.',
      'Update the maximum after each gain, not only at the end.',
      'Do not assume the peak is at the last index.',
    ],
  },

  3614: {
    intuition:
      'The processed string can grow exponentially, so building it is impossible. Instead, run two passes on the operation string. First pass computes only the final length m by simulating * (delete last), # (double length), and letter inserts; % does not change length. If k >= m, return ".". Second pass walks backward: undo each operator to map index k to the correct position — % mirrors k (k = m - 1 - k), # maps the second half to the first, * restores a deleted slot, and letters are returned when k equals the current length after shrinking.',
    algorithm: [
      'Forward scan: maintain length m. On letter (not %), m += 1. On *, m = max(0, m - 1). On #, m <<= 1. Ignore % for length.',
      'If k >= m, return \'.\'.',
      'Backward scan from the last character of s:',
      'On *, increment m (undo delete).',
      'On #, set m /= 2; if k >= m, subtract m from k (index lies in the second copy).',
      'On %, set k = m - 1 - k (undo reverse).',
      'On a letter, decrement m; if k == m, return that character.',
    ],
    example: {
      input: 's = "a#b%", k = 2',
      steps: [
        'Forward: a → m=1; # → m=2; b → m=3; % → m=3 (reverse does not change length).',
        'k=2 < m=3, so continue.',
        'Backward at %: k = 3 - 1 - 2 = 0.',
        'Backward at b: m=2, k≠2.',
        'Backward at #: m=1, k < m.',
        'Backward at a: m=0, k==0 → return \'a\'.',
        '(Forward-built string is "baa"; index 2 is \'a\'.)',
      ],
      output: '"a"',
    },
    pitfalls: [
      'Do not materialise the string — length can overflow memory.',
      'In the forward pass, % must not change m.',
      'When undoing #, subtract m from k only when k >= m (k indexes the duplicated half).',
      'Use long for m and k if the problem allows very large results.',
    ],
  },

  3532: {
    intuition:
      'Nodes i and j are connected when |nums[i] − nums[j]| ≤ maxDiff. Because nums is sorted, any path stays inside a contiguous block of indices: if two indices are in the same component, every index between them is too. So only check consecutive pairs — union i with i−1 when their values are close enough, then answer queries by comparing DSU roots.',
    algorithm: [
      'Initialize Union-Find on n nodes.',
      'For i = 1 … n−1: if nums[i] − nums[i−1] ≤ maxDiff, union(i, i−1).',
      'For each query [u, v]: answer[i] = (Find(u) == Find(v)).',
      'Equivalently, label each contiguous “good-gap” segment with one component id.',
    ],
    example: {
      input: 'n = 4, nums = [2,5,6,8], maxDiff = 2, queries = [[0,1],[0,2],[1,3],[2,3]]',
      steps: [
        'Adjacent gaps: |5−2|=3 > 2 → break after index 0. |6−5|=1 and |8−6|=2 → indices 1–3 form one component.',
        'Component ids: [0, 1, 1, 1].',
        'Query [0,1]: different components → false.',
        'Query [0,2]: 0 vs component 1 → false.',
        'Query [1,3]: same component → true (path 1→2→3).',
        'Query [2,3]: same component → true (direct edge).',
      ],
      output: '[false, false, true, true]',
    },
    pitfalls: [
      'Only adjacent unions are enough because nums is sorted — do not union all pairs O(n²).',
      'Use nums[i] − nums[i−1] (non-negative) instead of Math.Abs on sorted input.',
      'Self-queries [u,u] are always true once a node is in its own set.',
    ],
  },

  3534: {
    intuition:
      'Unlike LC 3532, nums is not sorted by index and each query asks for the shortest path length (edge count), not just connectivity. Sort nodes by value: an edge can only connect values within maxDiff, so from any sorted position the farthest one-hop landing is a contiguous right endpoint. Precompute that endpoint, then binary-lift to jump 2^k hops and answer each query in O(log n).',
    algorithm: [
      'Sort (nums[i], i) pairs; build sortedNums and indexMap[original] → sorted rank.',
      'Two pointers: for each sorted index i, advance right while sortedNums[right] − sortedNums[i] ≤ maxDiff; set jump[i][0] = right.',
      'Binary lifting: jump[i][k] = jump[jump[i][k−1]][k−1].',
      'For query [u,v]: start = min(rank[u], rank[v]), end = max(...).',
      'If jump[start][maxLevel] < end, return −1 (cannot reach).',
      'Otherwise greedily take the largest 2^j jump that stays strictly before end, recurse, add 1 << j (or return 1 if one hop reaches end).',
    ],
    example: {
      input: 'n = 5, nums = [1,8,3,5,2], maxDiff = 3, queries include [0,3]',
      steps: [
        'Sorted values: 1,2,3,5,8 with ranks for original indices.',
        'From value 1, one hop can reach up through 2,3 (diff ≤ 3) but not necessarily all the way to 8.',
        'Binary lifting finds the minimum number of such maxDiff-hops between the two ranks.',
        'If a gap larger than maxDiff separates components, answer is −1.',
      ],
      output: 'minimum edge counts (or -1) per query',
    },
    pitfalls: [
      'Must sort by value first — unlike 3532, index order is not sorted.',
      'Distance is number of edges (jumps), not |u−v| in index space.',
      'If jump[start][0] already ≥ end, answer is 1; if start == end, answer is 0.',
      'Return −1 when even the farthest binary-lifted position never reaches end.',
    ],
  },

  1291: {
    intuition:
      'A sequential-digit number has digits that increase by exactly 1 left to right (12, 123, 6789, …). There are only 36 such numbers in total, so generate them instead of scanning [low, high]. DFS from each start digit 1–9, always appending the next consecutive digit, and keep values that land in range.',
    algorithm: [
      'For start digit i = 1 … 9, call DFS with current digit pointer i and num = 0.',
      'In DFS: if num is inside [low, high], add it to the answer.',
      'Stop if num > high or the next digit would exceed 9.',
      'Otherwise recurse with the next digit i+1 and num = num*10 + i (append digit i).',
      'Sort the collected list (branches are not globally ordered) and return it.',
    ],
    example: {
      input: 'low = 100, high = 300',
      steps: [
        'From start 1: build 1 → 12 → 123 (123 is in range) → 1234 (too big, stop).',
        'From start 2: build 2 → 23 → 234 (in range) → …',
        'From start 3: 3 → 34 → 345 (345 > 300, stop after checking).',
        'Collect and sort → [123, 234].',
      ],
      output: '[123, 234]',
    },
    pitfalls: [
      'Do not iterate every integer from low to high — generate the tiny candidate set.',
      'Must sort at the end if generation order is not ascending across all starts.',
      'Single-digit numbers are sequential; they appear only when low ≤ that digit.',
      'A number like 7890 is invalid — digits must stay within 1–9 with no wrap.',
    ],
  },

  3336: {
    intuition:
      'Count ordered pairs of disjoint non-empty subsequences with the same GCD. Constraints are tiny (n, values ≤ 200), so track every possible GCD pair while scanning the array. dp[x][y] = number of ways to assign processed elements so the first subsequence has GCD x and the second has GCD y (0 means that subsequence is still empty).',
    algorithm: [
      'Let M = max(nums). Initialize dp[0][0] = 1 (both subsequences empty).',
      'For each num, build a fresh table newDp. For every existing state (x, y) with count c:',
      '  • Skip num → add c to newDp[x][y].',
      '  • Append to first → add c to newDp[gcd(x, num)][y] (gcd(0, num) = num).',
      '  • Append to second → add c to newDp[x][gcd(y, num)].',
      'All additions are modulo 10^9+7; replace dp with newDp.',
      'Answer = sum of dp[g][g] for g = 1 … M (both non-empty and equal GCD).',
    ],
    example: {
      input: 'nums = [10, 20, 30]',
      steps: [
        'Start dp[0][0] = 1.',
        'After 10: can leave both empty, put 10 in first (GCD 10), or put 10 in second.',
        'After 20 and 30: the only equal non-empty pairs are ([10], [20,30]) and ([20,30], [10]) — both have GCD 10.',
        'Summing dp[g][g] for g ≥ 1 yields 2.',
      ],
      output: '2',
    },
    pitfalls: [
      'Subsequences must be index-disjoint — each element goes to at most one of the two sequences (or neither).',
      'Do not count dp[0][0]; both subsequences must be non-empty (sum from g = 1).',
      'Use a separate newDp table each step — updating in place double-counts transitions.',
      'gcd(0, x) = x is required so the first element placed into an empty subsequence sets its GCD.',
    ],
  },

  3658: {
    intuition:
      'You need gcd(sum of first n odds, sum of first n evens). Closed forms are sumOdd = n² and sumEven = n(n+1). Factor out n: gcd(n², n(n+1)) = n · gcd(n, n+1). Consecutive integers are always coprime, so gcd(n, n+1) = 1 and the answer is simply n.',
    algorithm: [
      'Recall: 1+3+…+(2n−1) = n².',
      'Recall: 2+4+…+2n = n(n+1).',
      'Return n — no need to compute the sums or run Euclidean GCD.',
    ],
    example: {
      input: 'n = 4',
      steps: [
        'sumOdd = 1+3+5+7 = 16 = 4².',
        'sumEven = 2+4+6+8 = 20 = 4·5.',
        'gcd(16, 20) = 4, which equals n.',
      ],
      output: '4',
    },
    pitfalls: [
      'Do not loop to build the odd/even lists — the O(1) identity is the intended solution.',
      'gcd(n, n+1) is always 1; do not special-case n = 1 (still returns 1 correctly).',
      'Constraints are small enough for a loop, but returning n is both correct and optimal.',
    ],
  },

  3867: {
    intuition:
      'The problem defines the pairs for you: first build prefixGcd[i] = gcd(nums[i], max of the prefix ending at i), then sort that array and pair the smallest leftover with the largest leftover until nothing remains (odd middle ignored). So simulate the construction, sort, and sum gcd of end-pairs — no combinatorial search needed.',
    algorithm: [
      'Scan left to right keeping running max mx; set prefixGcd[i] = gcd(nums[i], mx).',
      'Sort prefixGcd ascending.',
      'For i = 0 … n/2 − 1: add gcd(prefixGcd[i], prefixGcd[n−1−i]) to the answer.',
      'If n is odd, the middle element is never paired — the loop naturally skips it.',
      'Return the sum as a long.',
    ],
    example: {
      input: 'nums = [3, 6, 2, 8]',
      steps: [
        'prefix maxes: 3,6,6,8 → prefixGcd = [gcd(3,3), gcd(6,6), gcd(2,6), gcd(8,8)] = [3,6,2,8].',
        'Sort → [2, 3, 6, 8].',
        'Pairs: gcd(2,8)=2 and gcd(3,6)=3.',
        'Sum = 5.',
      ],
      output: '5',
    },
    pitfalls: [
      'Update mx before computing gcd(nums[i], mx) — mx must include nums[i].',
      'Pair after sorting ends, not adjacent sorted neighbors.',
      'Use long for the answer; many pairs of large GCDs can overflow int.',
      'When n is odd the middle sorted value contributes nothing — do not add it alone.',
    ],
  },

  3312: {
    intuition:
      'The GCD of any pair is at most max(nums), so count pairs by their exact GCD instead of generating and sorting all O(n²) pair values. If c[d] numbers are divisible by d, then C(c[d], 2) pairs have a GCD that is a multiple of d. Processing d from large to small lets us subtract counts already assigned to 2d, 3d, and so on, leaving only pairs whose GCD is exactly d.',
    algorithm: [
      'Let M = max(nums). For every number, enumerate its divisors in O(√num) and increment countDivisor[d] for each divisor d.',
      'For gcd from M down to 1, start countGcdPair[gcd] at C(countDivisor[gcd], 2).',
      'Subtract countGcdPair[2·gcd], countGcdPair[3·gcd], … so only pairs with exact GCD gcd remain.',
      'Build prefixCount[g] = number of pairs whose GCD is at most g. This represents the cumulative positions in the sorted list of all pair GCDs.',
      'For each zero-based query q, binary-search the first g with prefixCount[g] ≥ q+1 and return g.',
    ],
    example: {
      input: 'nums = [2, 3, 4], queries = [0, 2]',
      steps: [
        'The three pairs have GCDs: gcd(2,3)=1, gcd(2,4)=2, and gcd(3,4)=1.',
        'Their sorted GCD list is [1, 1, 2].',
        'Exact counts are countGcdPair[1]=2 and countGcdPair[2]=1, so prefixCount[1]=2 and prefixCount[2]=3.',
        'Query 0 is the first value, found at GCD 1; query 2 is the third value, found at GCD 2.',
      ],
      output: '[1, 2]',
    },
    pitfalls: [
      'C(countDivisor[d], 2) includes every pair whose GCD is a multiple of d, not only pairs whose GCD equals d; subtract exact counts of larger multiples.',
      'Process possible GCDs from large to small so all larger-multiple counts are already known.',
      'Queries are zero-based, while prefix counts are cardinalities; search for query+1.',
      'Pair counts can be O(n²), so use long even though each returned GCD fits in int.',
      'Enumerate both divisors i and num/i, but count a square root only once.',
    ],
  },

}

export default explanations




