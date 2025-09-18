package ratings;

import ratings.datastructures.LinkedListNode;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
public class Song extends Ratable{
    private String artist;
    private String songID;
    public Song(String title, String artist, String songID) {
        super();
        this.setTitle(title);
        this.artist = artist;
        this.songID = songID;
    }
    public String getArtist() {
        return artist;
    }
    public void setArtist(String artist) {
        this.artist = artist;
    }
    public String getSongID() {
        return songID;
    }
    public void setSongID(String songID) {
        this.songID = songID;
    }
}





