package ratings;

import ratings.datastructures.BinaryTreeNode;
import ratings.datastructures.Comparator;
import ratings.datastructures.LinkedListNode;
public class Playlist {
    private BinaryTreeNode<Song> BTN;
    private LinkedListNode<Song> Song;
    private Comparator<Song> comparator;
    public Playlist(Comparator<Song> comparator) {
        this.comparator = comparator;
        this.BTN = null;
    }
    public void addSong(Song song) {
        if (this.BTN == null) {
            this.BTN = new BinaryTreeNode<>(song, null, null);
        } else {
            addSongHelper(this.BTN, song);
        }
    }
    private void addSongHelper(BinaryTreeNode<Song> node, Song song) {
        if (this.comparator.compare(song, node.getValue())) {
            if (node.getLeft() == null) {
                node.setLeft(new BinaryTreeNode<>(song, null, null));
            } else {
                addSongHelper(node.getLeft(), song);
            }
        } else {
            if (node.getRight() == null) {
                node.setRight(new BinaryTreeNode<>(song, null, null));
            } else {
                addSongHelper(node.getRight(), song);
            }
        }
    }
    public BinaryTreeNode<Song> getSongTree() {
        return BTN;
    }
    public LinkedListNode<Song> getSongList(BinaryTreeNode<Song> node) {
        LinkedListNode<Song> list = new LinkedListNode<>(null,null);
        Helper(node,list);
        return list.getNext();
    }
    private void Helper(BinaryTreeNode<Song>node, LinkedListNode<Song> LLN){
        if(node == null){
            return;
        }
        Helper(node.getLeft(), LLN);
        LLN.append(node.getValue());
        Helper(node.getRight(), LLN);
    }
    public LinkedListNode<Song> getSongList(){
        return getSongList(BTN);
    }
}