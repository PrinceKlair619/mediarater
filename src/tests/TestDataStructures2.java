package tests;

import org.junit.Test;
import ratings.Playlist;
import ratings.Song;
import ratings.datastructures.LinkedListNode;
import ratings.datastructures.SongBayesianRatingComparator;
import ratings.datastructures.SongTitleComparator;
import static org.junit.Assert.*;
public class TestDataStructures2 {
    @Test
    public void getPlayList1(){
        Playlist p1 = new Playlist(new SongBayesianRatingComparator());
        Song song1 = new Song("p","r","c");
        Song song2 = new Song("p","r","c");
        Song song3 = new Song("p","r","c");
        p1.addSong(song1);
        p1.addSong(song2);
        p1.addSong(song3);
        LinkedListNode<Song> SL = p1.getSongList();
        assertEquals(song1, SL.getValue());
        assertEquals(song2, SL.getNext().getValue());
        assertEquals(song3, SL.getNext().getNext().getValue());
    }
    @Test
    public void getPlayList2(){
        Playlist p11 = new Playlist(new SongBayesianRatingComparator());
        Song song1 = new Song("p","r","c");
        Song song2 = new Song("p","r","c");
        Song song3 = new Song("p","r","c");
        Song song4 = new Song("p","r","c");
        p11.addSong(song1);
        p11.addSong(song2);
        p11.addSong(song3);
        p11.addSong(song4);
        LinkedListNode<Song> SL = p11.getSongList();
        assertEquals(song1, SL.getValue());
        assertEquals(song2, SL.getNext().getValue());
        assertEquals(song3, SL.getNext().getNext().getValue());
        assertEquals(song4, SL.getNext().getNext().getNext().getValue());
    }
    @Test
    public void getPlayList3(){
        Playlist playlist = new Playlist(new SongTitleComparator());
        Song song1 = new Song("a","r","a");
        Song song2 = new Song("b","r","b");
        Song song3 = new Song("c","r","c");
        Song song4 = new Song("d","r","d");
        playlist.addSong(song1);
        playlist.addSong(song2);
        playlist.addSong(song3);
        playlist.addSong(song4);
        LinkedListNode<Song> SL = playlist.getSongList();
        assertEquals("a", SL.getValue().getTitle());
        assertEquals("b", SL.getNext().getValue().getTitle());
        assertEquals("c", SL.getNext().getNext().getValue().getTitle());
        assertEquals("d", SL.getNext().getNext().getNext().getValue().getTitle());
        assertNull(SL.getNext().getNext().getNext().getNext());
    }
    @Test
    public void getPlayList(){
        Playlist p1 = new Playlist(new SongBayesianRatingComparator());
        LinkedListNode<Song> SL = p1.getSongList();
        assertNull(SL);
    }
}


