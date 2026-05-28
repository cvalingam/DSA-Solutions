// Approach: Build a trie on reversed container words (suffix trie).
// Each trie node stores the index of the shortest word passing through it, so query traversal
// directly yields the best index for the longest matched suffix.
// Time: O(total container chars + total query chars) Space: O(total container chars)

public class Solution
{
    private TrieNode root = new TrieNode();

    public int[] StringIndices(string[] wordsContainer, string[] wordsQuery)
    {
        int[] ans = new int[wordsQuery.Length];
        int minIndex = 0;

        for (int i = 0; i < wordsContainer.Length; ++i)
        {
            Insert(wordsContainer[i], i);
            if (wordsContainer[i].Length < wordsContainer[minIndex].Length)
                minIndex = i;
        }

        for (int i = 0; i < wordsQuery.Length; ++i)
        {
            int index = Search(wordsQuery[i]);
            ans[i] = index == -1 ? minIndex : index;
        }

        return ans;
    }

    private void Insert(string word, int idx)
    {
        TrieNode node = root;
        for (int i = word.Length - 1; i >= 0; --i)
        {
            int index = word[i] - 'a';
            if (node.children[index] == null)
                node.children[index] = new TrieNode();
            node = node.children[index];
            if (node.length > word.Length)
            {
                node.length = word.Length;
                node.index = idx;
            }
        }
    }

    private int Search(string word)
    {
        TrieNode node = root;
        for (int i = word.Length - 1; i >= 0; --i)
        {
            int index = word[i] - 'a';
            if (node.children[index] == null)
                return node.index;
            node = node.children[index];
        }
        return node.index;
    }
}

class TrieNode
{
    public TrieNode[] children = new TrieNode[26];
    public bool isWord = false;
    public int length = int.MaxValue;
    public int index = -1;
}