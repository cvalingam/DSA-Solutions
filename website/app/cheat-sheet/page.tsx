import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'C# DSA Cheat Sheet - LeetCode Data Structures & Algorithms',
  description:
    'Quick reference cheat sheet for C# data structures and algorithms used in LeetCode interviews. Covers Dictionary, PriorityQueue, Stack, Queue, SortedSet, and common algorithmic patterns with C# code snippets.',
  alternates: { canonical: '/cheat-sheet' },
  openGraph: {
    title: 'C# DSA Cheat Sheet for LeetCode',
    description:
      'Quick reference for C# data structures and algorithms - Dictionary, PriorityQueue, SortedSet, BFS, DFS, binary search, sliding window, and more, with code snippets.',
    url: '/cheat-sheet',
    type: 'article',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'C# DSA Cheat Sheet for LeetCode Interviews',
  description:
    'Quick reference for C# data structures and algorithms - Dictionary, PriorityQueue, SortedSet, BFS, DFS, binary search, sliding window, and more.',
  author: { '@type': 'Person', name: 'Sivalingam Ramasamy', url: 'https://github.com/cvalingam' },
  url: `${SITE_URL}/cheat-sheet`,
  datePublished: '2026-04-20',
  dateModified: '2026-04-20',
  image: `${SITE_URL}/opengraph-image`,
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono">
      <code>{code.trim()}</code>
    </pre>
  )
}

function Section({ title, anchor, children }: { title: string; anchor: string; children: React.ReactNode }) {
  return (
    <section className="mb-12" id={anchor}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        {title}
      </h2>
      {children}
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

export default function CheatSheetPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 font-medium">Cheat Sheet</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
        C# DSA Cheat Sheet
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-4 text-base leading-relaxed">
        Quick reference for C# data structures and algorithmic patterns used in LeetCode and coding interviews.
        All snippets are idiomatic .NET - tested on LeetCode's C# judge.
      </p>

      {/* TOC */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 mb-10 text-sm">
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Contents</p>
        <ol className="list-decimal list-inside space-y-1 text-indigo-700 dark:text-indigo-400 columns-2">
          {['Data Structures', 'Sorting & Searching', 'Two Pointers', 'Sliding Window', 'Binary Search', 'BFS', 'DFS / Backtracking', 'Dynamic Programming', 'Bit Manipulation', 'Useful .NET APIs'].map((t, i) => (
            <li key={t}><a href={`#${t.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="hover:underline">{t}</a></li>
          ))}
        </ol>
      </div>

      {/* 1. Data Structures */}
      <Section title="1. Data Structures" anchor="data-structures">
        <SubSection title="Dictionary (Hash Map)">
          <CodeBlock code={`
var freq = new Dictionary<int, int>();
foreach (var x in nums)
    freq[x] = freq.GetValueOrDefault(x) + 1;

// Check and get
if (freq.TryGetValue(key, out int val)) { /* use val */ }

// Iterate
foreach (var (k, v) in freq) { }
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">O(1) average lookup/insert. Use for frequency counting, complement lookup (Two Sum), and caching seen values.</p>
        </SubSection>

        <SubSection title="HashSet">
          <CodeBlock code={`
var seen = new HashSet<int>();
seen.Add(x);
bool exists = seen.Contains(x);
seen.Remove(x);

// Intersection / union
var inter = new HashSet<int>(a);
inter.IntersectWith(b);
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">O(1) membership. Use to track visited nodes, detect duplicates, and set operations.</p>
        </SubSection>

        <SubSection title="Stack">
          <CodeBlock code={`
var stack = new Stack<int>();
stack.Push(x);
int top = stack.Peek();   // look without removing
int val = stack.Pop();    // remove and return
bool empty = stack.Count == 0;
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">LIFO. Use for balanced parentheses, monotonic stack, DFS iterative, undo operations.</p>
        </SubSection>

        <SubSection title="Queue">
          <CodeBlock code={`
var q = new Queue<int>();
q.Enqueue(x);
int front = q.Peek();
int val = q.Dequeue();
bool empty = q.Count == 0;
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">FIFO. Use for BFS, level-order tree traversal, sliding window with constraints.</p>
        </SubSection>

        <SubSection title="Priority Queue (Min-Heap)">
          <CodeBlock code={`
// Min-heap (.NET 6+)
var pq = new PriorityQueue<int, int>();
pq.Enqueue(value, priority);     // lower priority = dequeued first
int top = pq.Peek().Element;     // not available - use Dequeue
(int elem, int pri) = pq.Dequeue();
int size = pq.Count;

// Max-heap: negate the priority
pq.Enqueue(value, -value);
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">O(log n) push/pop. Use for top-K, Dijkstra, merge K sorted lists, median stream (two heaps).</p>
        </SubSection>

        <SubSection title="SortedSet / SortedDictionary">
          <CodeBlock code={`
var ss = new SortedSet<int>();
ss.Add(x);
int min = ss.Min;
int max = ss.Max;
int floor  = ss.GetViewBetween(int.MinValue, x).Max;  // largest ≤ x
int ceiling = ss.GetViewBetween(x, int.MaxValue).Min; // smallest ≥ x
ss.Remove(x);
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">O(log n) all ops. Use when you need both fast lookup and order queries (floor/ceiling/successor).</p>
        </SubSection>

        <SubSection title="Linked List (as Deque)">
          <CodeBlock code={`
var dq = new LinkedList<int>();
dq.AddFirst(x);   // push front
dq.AddLast(x);    // push back
int front = dq.First!.Value;
int back  = dq.Last!.Value;
dq.RemoveFirst();
dq.RemoveLast();
          `} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">O(1) front/back ops. Use for sliding window max/min (monotonic deque) and LRU cache.</p>
        </SubSection>
      </Section>

      {/* 2. Sorting */}
      <Section title="2. Sorting &amp; Searching" anchor="sorting-searching">
        <CodeBlock code={`
// Sort array ascending
Array.Sort(arr);

// Sort with custom comparator (sort by first element)
Array.Sort(intervals, (a, b) => a[0] - b[0]);

// Sort descending
Array.Sort(arr, (a, b) => b - a);

// LINQ sort (stable, returns IEnumerable)
var sorted = arr.OrderBy(x => x).ToArray();
var sortedDesc = arr.OrderByDescending(x => x).ToArray();
var sortedByLen = words.OrderBy(w => w.Length).ThenBy(w => w).ToArray();

// Sort List<T>
list.Sort((a, b) => a.CompareTo(b));
        `} />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">Array.Sort uses introsort (O(n log n)). Not stable - use LINQ OrderBy when stability matters.</p>

        <CodeBlock code={`
// Binary search on sorted array
int idx = Array.BinarySearch(arr, target);
// idx >= 0 → found; idx < 0 → ~idx is insertion point

// Manual binary search
int lo = 0, hi = arr.Length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;   // avoids overflow
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
        `} />
      </Section>

      {/* 3. Two Pointers */}
      <Section title="3. Two Pointers" anchor="two-pointers">
        <SubSection title="Opposite ends (sorted array)">
          <CodeBlock code={`
int left = 0, right = nums.Length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new[] { left, right };
    if (sum < target) left++;
    else right--;
}
          `} />
        </SubSection>
        <SubSection title="Fast / Slow pointer (cycle detection)">
          <CodeBlock code={`
var slow = head;
var fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true; // cycle
}
return false;
          `} />
        </SubSection>
        <SubSection title="Remove duplicates in-place">
          <CodeBlock code={`
int k = 1;
for (int i = 1; i < nums.Length; i++)
    if (nums[i] != nums[i - 1])
        nums[k++] = nums[i];
return k;
          `} />
        </SubSection>
      </Section>

      {/* 4. Sliding Window */}
      <Section title="4. Sliding Window" anchor="sliding-window">
        <SubSection title="Fixed size window">
          <CodeBlock code={`
int windowSum = 0;
for (int i = 0; i < k; i++) windowSum += nums[i];
int maxSum = windowSum;
for (int i = k; i < nums.Length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.Max(maxSum, windowSum);
}
          `} />
        </SubSection>
        <SubSection title="Variable size - at most K distinct characters">
          <CodeBlock code={`
var freq = new Dictionary<char, int>();
int left = 0, maxLen = 0;
for (int right = 0; right < s.Length; right++) {
    freq[s[right]] = freq.GetValueOrDefault(s[right]) + 1;
    while (freq.Count > k) {                      // shrink
        freq[s[left]]--;
        if (freq[s[left]] == 0) freq.Remove(s[left]);
        left++;
    }
    maxLen = Math.Max(maxLen, right - left + 1);
}
          `} />
        </SubSection>
      </Section>

      {/* 5. Binary Search on Answer */}
      <Section title="5. Binary Search on Answer Space" anchor="binary-search">
        <CodeBlock code={`
// Template: "find minimum X such that condition(X) is true"
// condition must be monotonically false then true
int lo = minPossible, hi = maxPossible;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (condition(mid)) hi = mid;    // mid might be the answer
    else lo = mid + 1;
}
return lo; // lo == hi == answer

// Example: minimum capacity to ship within D days
bool canShip(int capacity) {
    int days = 1, cur = 0;
    foreach (var w in weights) {
        if (cur + w > capacity) { days++; cur = 0; }
        cur += w;
    }
    return days <= D;
}
        `} />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Key insight: the answer space is monotonic - once a capacity works, all larger capacities also work. Binary search finds the boundary.</p>
      </Section>

      {/* 6. BFS */}
      <Section title="6. BFS (Shortest Path / Level Order)" anchor="bfs">
        <SubSection title="Grid BFS">
          <CodeBlock code={`
int[][] dirs = { new[]{0,1}, new[]{0,-1}, new[]{1,0}, new[]{-1,0} };
var q = new Queue<(int r, int c)>();
q.Enqueue((startR, startC));
var visited = new bool[rows, cols];
visited[startR, startC] = true;
int steps = 0;

while (q.Count > 0) {
    int size = q.Count;
    for (int i = 0; i < size; i++) {
        var (r, c) = q.Dequeue();
        if (r == endR && c == endC) return steps;
        foreach (var d in dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && !visited[nr, nc] && grid[nr][nc] != '#') {
                visited[nr, nc] = true;
                q.Enqueue((nr, nc));
            }
        }
    }
    steps++;
}
          `} />
        </SubSection>
        <SubSection title="Tree Level Order">
          <CodeBlock code={`
var result = new List<IList<int>>();
if (root == null) return result;
var q = new Queue<TreeNode>();
q.Enqueue(root);
while (q.Count > 0) {
    int size = q.Count;
    var level = new List<int>();
    for (int i = 0; i < size; i++) {
        var node = q.Dequeue();
        level.Add(node.val);
        if (node.left != null)  q.Enqueue(node.left);
        if (node.right != null) q.Enqueue(node.right);
    }
    result.Add(level);
}
          `} />
        </SubSection>
      </Section>

      {/* 7. DFS */}
      <Section title="7. DFS / Backtracking" anchor="dfs-backtracking">
        <SubSection title="Recursive DFS on graph">
          <CodeBlock code={`
var visited = new HashSet<int>();
void Dfs(int node) {
    visited.Add(node);
    foreach (var neighbour in graph[node])
        if (!visited.Contains(neighbour))
            Dfs(neighbour);
}
          `} />
        </SubSection>
        <SubSection title="Backtracking template (subsets / permutations)">
          <CodeBlock code={`
var result = new List<IList<int>>();
void Backtrack(int start, List<int> current) {
    result.Add(new List<int>(current)); // snapshot
    for (int i = start; i < nums.Length; i++) {
        current.Add(nums[i]);       // choose
        Backtrack(i + 1, current);  // explore
        current.RemoveAt(current.Count - 1); // un-choose
    }
}
Backtrack(0, new List<int>());
          `} />
        </SubSection>
      </Section>

      {/* 8. DP */}
      <Section title="8. Dynamic Programming" anchor="dynamic-programming">
        <SubSection title="1D DP - Climbing Stairs / House Robber pattern">
          <CodeBlock code={`
// dp[i] = best answer considering first i elements
int[] dp = new int[n + 1];
dp[0] = base0;
dp[1] = base1;
for (int i = 2; i <= n; i++)
    dp[i] = Math.Max(dp[i - 1], dp[i - 2] + nums[i - 1]);
return dp[n];

// Space-optimised (rolling variables)
int prev2 = base0, prev1 = base1;
for (int i = 2; i <= n; i++) {
    int cur = Math.Max(prev1, prev2 + nums[i - 1]);
    prev2 = prev1; prev1 = cur;
}
return prev1;
          `} />
        </SubSection>
        <SubSection title="2D DP - Longest Common Subsequence pattern">
          <CodeBlock code={`
int m = text1.Length, n = text2.Length;
int[,] dp = new int[m + 1, n + 1];
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i, j] = text1[i-1] == text2[j-1]
            ? dp[i-1, j-1] + 1
            : Math.Max(dp[i-1, j], dp[i, j-1]);
return dp[m, n];
          `} />
        </SubSection>
        <SubSection title="Memoization with tuple key">
          <CodeBlock code={`
var memo = new Dictionary<(int, int), int>();
int Solve(int i, int j) {
    if (/* base case */) return 0;
    if (memo.TryGetValue((i, j), out int cached)) return cached;
    int result = /* recurrence */;
    return memo[(i, j)] = result;
}
          `} />
        </SubSection>
      </Section>

      {/* 9. Bit Manipulation */}
      <Section title="9. Bit Manipulation" anchor="bit-manipulation">
        <CodeBlock code={`
// Check if k-th bit is set (0-indexed from right)
bool isSet = (n & (1 << k)) != 0;

// Set k-th bit
n |= (1 << k);

// Clear k-th bit
n &= ~(1 << k);

// Toggle k-th bit
n ^= (1 << k);

// Count set bits (popcount)
int count = BitOperations.PopCount((uint)n); // .NET 5+

// Clear lowest set bit
n &= n - 1;

// Isolate lowest set bit
int lsb = n & (-n);

// Check power of two
bool isPow2 = n > 0 && (n & (n - 1)) == 0;

// XOR trick: find single number in pairs
int result = 0;
foreach (var x in nums) result ^= x;
        `} />
      </Section>

      {/* 10. Useful .NET APIs */}
      <Section title="10. Useful .NET APIs" anchor="useful-net-apis">
        <CodeBlock code={`
// String operations
string rev = new string(s.Reverse().ToArray());
char[] arr = s.ToCharArray();
string joined = string.Join(",", list);
string[] parts = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
bool starts = s.StartsWith("abc");
string sub = s.Substring(start, length); // or s[start..(start+length)]

// Math
int abs = Math.Abs(x);
int gcd = (int)BigInteger.GreatestCommonDivisor(a, b); // using System.Numerics
int log2 = (int)Math.Log2(n);  // floor
int sqrt = (int)Math.Sqrt(n);  // floor - always verify: (long)sqrt*sqrt <= n

// Array utilities
Array.Fill(arr, 0);
Array.Reverse(arr);
int idx = Array.BinarySearch(arr, target);

// List utilities
list.Sort();
list.Reverse();
list.RemoveAt(list.Count - 1);  // pop back

// Char helpers
char.IsLetter(c)
char.IsDigit(c)
char.ToLower(c)
int digit = c - '0';
int idx   = c - 'a';  // 0-based alphabet index
        `} />
      </Section>

      {/* Footer links */}
      <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
        <Link href="/study-guide" className="text-indigo-600 dark:text-indigo-400 hover:underline">Study Guide →</Link>
        <Link href="/topics" className="text-indigo-600 dark:text-indigo-400 hover:underline">Browse by Topic →</Link>
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">All LeetCode Solutions →</Link>
      </div>
    </div>
  )
}
