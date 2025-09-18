package tests;

import org.junit.Test;
import java.util.ArrayList;
import java.util.Arrays;
import ratings.*;
import ratings.datastructures.LinkedListNode;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.*;
public class TestClasses3 {
    @Test
    public void testRSEmpty() {
        ArrayList<Song> songs = FileReader.readSongs("data/empty.csv");
        assertTrue(songs.isEmpty());
    }
    @Test
    public void testRSFNF() {
        ArrayList<Song> Songs = FileReader.readSongs("nonexistentfile.csv");
        assertEquals(new ArrayList<Song>(), Songs);
    }
    @Test
    public void testRS3() {
        ArrayList<Song> songs = FileReader.readSongs("data/songratings.csv");
        assertEquals(3, songs.size());
        assertTrue(songs.size() != 0);

        Song song1 = songs.get(0);
        assertEquals("song1", song1.getSongID());
        assertEquals("artist1", song1.getArtist());
        assertEquals("title1", song1.getTitle());

        LinkedListNode<Rating> ratings1 = song1.getRatings();
        Rating x1 = new Rating("Bob", 4);
        Rating x2 = new Rating("Prince", 3);
        LinkedListNode<Rating> Gandu1 = new LinkedListNode<>(x1, null);
        Gandu1.append(x2);
        assertEquals(2, ratings1.size());
        checkRatingsList(ratings1, Gandu1);

        Song song2 = songs.get(1);
        assertEquals("song2", song2.getSongID());
        assertEquals("artist2", song2.getArtist());
        assertEquals("title2", song2.getTitle());

        LinkedListNode<Rating> ratings2 = song2.getRatings();
        Rating x3 = new Rating("Mike", 5);
        Rating x4 = new Rating("Faiza", 3);
        Rating x5 = new Rating("Ajinkya", 2);
        LinkedListNode<Rating> Gandu2 = new LinkedListNode<>(x3, null);
        Gandu2.append(x4);
        Gandu2.append(x5);
        assertEquals(3, ratings2.size());
        checkRatingsList(ratings2, Gandu2);

        Song song3 = songs.get(2);
        assertEquals("song3", song3.getSongID());
        assertEquals("artist3", song3.getArtist());
        assertEquals("title3", song3.getTitle());

        LinkedListNode<Rating> ratings3 = song3.getRatings();
        Rating x6 = new Rating("Dhruv", 5);
        LinkedListNode<Rating> Gandu3 = new LinkedListNode<>(x6, null);
        assertEquals(1, ratings3.size());
        checkRatingsList(ratings3, Gandu3);
    }
    public void compareRatings(Rating computed, Rating expected) {
        assertTrue(computed.getRating() == expected.getRating());
        assertTrue(computed.getReviewerID().equals(expected.getReviewerID()));
    }
    public void checkRatingsList(LinkedListNode<Rating> computed, LinkedListNode<Rating> expected) {
        if (expected == null) {
            assertTrue(computed == null);
        } else {
            assertTrue(computed != null);
            compareRatings(computed.getValue(), expected.getValue());
            checkRatingsList(computed.getNext(), expected.getNext());
        }
    }
    @Test
    public void testRMR() {
        ArrayList<Movie> Movie = new ArrayList<Movie>();
        Movie m1 = new Movie("The American President",new ArrayList<>(Arrays.asList("Michael Douglas,Annette Bening,Michael J. Fox")));
        Movie m2 =new Movie("Dracula: Dead and Loving It",new ArrayList<>(Arrays.asList("Leslie Nielsen,Mel Brooks,Amy Yasbeck")));
        Movie.add(m1);
        Movie.add(m2);
    ArrayList<Movie> ratedMovies = FileReader.readMovieRatings(Movie, "movie.csv");
        assertEquals(0, ratedMovies.size());
        for (Movie movie : ratedMovies) {
            if (movie.getTitle().equals("The American President")) {
                assertEquals(2, movie.getRatings().size());
                assertEquals(10, movie.getRatings().getValue().getRating());
            } else if (movie.getTitle().equals("Dracula: Dead and Loving It")) {
                assertEquals(1, movie.getRatings().size());
            }
        }
    }
    @Test
    public void testRMRNF() {
        ArrayList<Movie> movies = new ArrayList<Movie>();
        movies.add(new Movie("Rocky III",new ArrayList<>(Arrays.asList("bs"))));
        ArrayList<Movie> ratedMovies = FileReader.readMovieRatings(movies, "nonexistent_file.csv");
        assertEquals(0, ratedMovies.size());
    }
    @Test
    public void testRMREmpty(){
        String file = "empty.csv";
        ArrayList<Movie> want = new ArrayList<>();
        ArrayList<Movie> get = FileReader.readMovieRatings(FileReader.readMovies("data/movies.csv"),file);
        assertEquals(want,get);
    }
    @Test
    public void testRMRagain(){
        ArrayList<Movie> list = FileReader.readMovies("data/movie.csv");
        ArrayList<Movie> real = FileReader.readMovieRatings(list,"data/Mratings.csv");
        Movie ml1 = new Movie("The American President", new ArrayList<>(Arrays.asList("Michael Douglas,Annette Bening,Michael J. Fox")));
        ml1.addRating(new Rating("17",4));
        ml1.addRating(new Rating("45",1));
        ml1.addRating(new Rating("1738",3));
        Movie ml2 = new Movie("Dracula: Dead and Loving It", new ArrayList<>(Arrays.asList("Leslie Nielsen,Mel Brooks,Amy Yasbeck")));
        ml2.addRating(new Rating("15",5));
        ml2.addRating(new Rating("20",3));
        ml2.addRating(new Rating("11",2));
        ArrayList<Movie> expect = new ArrayList<>(Arrays.asList(ml1,ml2));
        assertEquals(real.size(),expect.size());
        for(int x= 0; x < real.size(); x++){
            assertEquals(expect.get(x).getTitle(),real.get(x).getTitle());
            assertEquals(expect.get(x).getRatings().size(),real.get(x).getRatings().size());
            assertEquals(expect.get(x).getRatings().getValue().getRating(),real.get(x).getRatings().getValue().getRating());
        }
    }
    @Test
    public void testtopk(){
        MediaLibrary test = new MediaLibrary();
        test.populateLibrary("data/ratings.csv","data/movie.csv","data/onemovierating.csv");
        ArrayList<Ratable> real = test.topKRatables(6);
        assertEquals(6,real.size());
        assertEquals("Faucet Failure",real.get(0).getTitle());
        assertEquals("Dracula: Dead and Loving It",real.get(1).getTitle());
        assertEquals("Toy Story",real.get(2).getTitle());
        assertEquals("Till I Collapse",real.get(3).getTitle());
        assertEquals("The American President",real.get(4).getTitle());
        assertEquals("Uptown Funk",real.get(5).getTitle());
    }
    @Test
    public void testtopk2() {
        MediaLibrary test = new MediaLibrary();
        test.populateLibrary("data/ratings.csv","data/movie.csv","data/Mratings.csv");
        assertNotNull(test.topKRatables(2));
        assertTrue(test.topKRatables(2).size() <= 2);
}
    @Test
    public void testtopk3() {
        MediaLibrary test = new MediaLibrary();
        test.populateLibrary("data/ratings.csv","data/movies.csv","data/movie_ratings.csv");
        ArrayList<Ratable> real1 = test.topKRatables(5);
        assertEquals(5, real1.size());
        ArrayList<Ratable> real2 = test.topKRatables(2);
        assertEquals(2, real2.size());
        ArrayList<Ratable> real3 = test.topKRatables(1);
        assertEquals(1, real3.size());
    }
    @Test
    public void testTopKEmpty() {
        MediaLibrary test = new MediaLibrary();
        assertNotNull(test.topKRatables(1));
    }
    @Test
    public void testPLInvalid() {
        MediaLibrary test = new MediaLibrary();
        test.populateLibrary("bruh.csv", "lol.csv", "urMom.csv");
        assertNotNull(test.topKRatables(1));
    }
}
