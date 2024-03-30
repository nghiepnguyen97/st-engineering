class PrefixTreeNode {
    children;
    isEndWord: boolean;
    indexes: number[];

    constructor() {
        this.children = {};
        this.isEndWord = false;
        this.indexes = [];
    }
}

export class PrefixTree {
    private root: PrefixTreeNode;
    constructor() {
        this.root = new PrefixTreeNode();
    }

    /**
     * Remove special characters
     * @param word 
     * @returns 
     */
    private removeSpecialCharacters(word: string) {
        return word.replace(/[^\w]/g, '');
    }

    /**
     * Insert
     * @param word 
     * @param index 
     */
    public insert(word: string, index: number) {
        word = this.removeSpecialCharacters(word);
        let cNode = this.root;
        for (const str of word) {
            if (!cNode.children[str]) {
                cNode.children[str] = new PrefixTreeNode();
            }

            cNode = cNode.children[str];
        }

        cNode.isEndWord = true;
        cNode.indexes.push(index);
    }

    /**
     * Search
     * @param prefix 
     * @returns 
     */
    public search(prefix: string): number[] {
        let cNode = this.root;
        for (const str of prefix) {
            if (!cNode.children[str]) {
                return [];
            }
            cNode = cNode.children[str];
        }
        return this.getAllWordsFromNode(cNode, prefix);
    }

    /**
     * Get all words from node
     * @param node 
     * @param prefix 
     * @returns 
     */
    public getAllWordsFromNode(node: PrefixTreeNode, prefix: string): number[] {
        const words = []
        if (node.isEndWord) {
            words.push(...node.indexes);
        }

        for (const key in node.children) {
            words.push(...this.getAllWordsFromNode(node.children[key], prefix + key));
        }
        return words;
    }
}