package tests;

import java.util.ArrayList;
import java.util.Arrays;
import ratings.Rating;
import ratings.Song;
import ratings.Movie;
import ratings.FileReader;
import ratings.DegreesOfSeparation;
import ratings.datastructures.LinkedListNode;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
public class TestDataStructures3 {
    @Test
    public void testRMEmpty() {
        ArrayList<Movie> movies = FileReader.readMovies("data/empty.csv");
        assertTrue(movies.isEmpty());
    }
    @Test
    public void testRMFNF() {
        ArrayList<Movie> movies = FileReader.readMovies("nonexistentfile.csv");
        assertEquals(new ArrayList<Movie>(), movies);
    }
    @Test
    public void testRM1() {
        ArrayList<Movie> movies = FileReader.readMovies("data/movies.csv");
        assertEquals(4575, movies.size());
        assertTrue(movies.size()!=0);

        Movie movie1 = movies.get(0);
        assertEquals("Toy Story", movie1.getTitle());

        ArrayList<String> cast1 = movie1.getCast();
        assertEquals(10, cast1.size());
        assertEquals("Tom Hanks", cast1.get(0));
        assertEquals("Tim Allen", cast1.get(1));
        assertEquals("Don Rickles", cast1.get(2));
        assertEquals("Wallace Shawn", cast1.get(3));
    }
    @Test
    public void testRM3() {
        ArrayList<Movie> movies = FileReader.readMovies("data/movies.csv");
        assertEquals(4575, movies.size());

        Movie movie1 = movies.get(0);
        assertEquals("Toy Story", movie1.getTitle());

        ArrayList<String> cast1 = movie1.getCast();
        assertEquals(10, cast1.size());
        assertEquals("Tom Hanks", cast1.get(0));
        assertEquals("Tim Allen", cast1.get(1));
        assertEquals("Don Rickles", cast1.get(2));
        assertEquals("Wallace Shawn", cast1.get(3));

        Movie movie2 = movies.get(1);
        assertEquals("Jumanji", movie2.getTitle());

        ArrayList<String> cast2 = movie2.getCast();
        assertEquals(10, cast2.size());
        assertEquals("Robin Williams", cast2.get(0));
        assertEquals("Jonathan Hyde", cast2.get(1));
        assertEquals("Kirsten Dunst", cast2.get(2));

        Movie movie3 = movies.get(2);
        assertEquals("Father of the Bride Part II", movie3.getTitle());

        ArrayList<String> cast3 = movie3.getCast();
        assertEquals(12, cast3.size());
        assertEquals("Steve Martin", cast3.get(0));
        assertEquals("Diane Keaton", cast3.get(1));
        assertEquals("Martin Short", cast3.get(2));
        assertEquals("Kimberly Williams-Paisley", cast3.get(3));
    }
//Father of the Bride Part II,Steve Martin,Diane Keaton,Martin Short,Kimberly Williams-Paisley,George Newbern,Kieran Culkin,BD Wong,Peter Michael Goetz,Kate McGregor-Stewart,Jane Adams,Eugene Levy,Lori Alan
// Jumanji,Robin Williams,Jonathan Hyde,Kirsten Dunst,Bonnie Hunt,Bebe Neuwirth,David Alan Grier,Patricia Clarkson,James Handy,Malcolm Stewart,Darryl Henriques
// Toy Story,Tom Hanks,Tim Allen,Don Rickles,Wallace Shawn,John Ratzenberger,Annie Potts,John Morris,Laurie Metcalf,R. Lee Ermey,Penn Jillette
    @Test
    public void testDOS() {
        Movie m1 = new Movie("June the Cat", new ArrayList<>(Arrays.asList("Chris Pratt", "Brad Pitt")));
        Movie m2= new Movie("Faiza the wife", new ArrayList<>(Arrays.asList("Brad Pitt", "Kevin Bacon")));
        ArrayList<Movie> movies = new ArrayList<Movie>();
        movies.add(m1);
        movies.add(m2);
        DegreesOfSeparation dos = new DegreesOfSeparation(movies);
        int r1 = dos.degreesOfSeparation("Chris Pratt", "Kevin Bacon");
        assertEquals(2, r1);

        Movie m3 = new Movie("Prince the Handsome Man", new ArrayList<>(Arrays.asList("Leonardo DiCaprio", "Tom Hardy")));
        ArrayList<Movie> movies2 = new ArrayList<Movie>();
        movies2.add(m3);
        DegreesOfSeparation dos2 = new DegreesOfSeparation(movies2);
        int r2 = dos2.degreesOfSeparation("Leonardo DiCaprio", "Kevin Bacon");
        assertEquals(-1, r2);

        Movie m4 = new Movie("Prince the super kool dude", new ArrayList<>(Arrays.asList("Christian Bale", "Heath Ledger")));
        ArrayList<Movie> movies3 = new ArrayList<Movie>();
        movies3.add(m4);
        DegreesOfSeparation dos3 = new DegreesOfSeparation(movies3);
        int r3 = dos3.degreesOfSeparation("Christian Bale", "Christian Bale");
        assertEquals(0, r3);

        Movie m5 = new Movie("Cant wait to make money",new ArrayList<>(Arrays.asList("Tim Robbins", "Morgan Freeman")));
        ArrayList<Movie> movies4 = new ArrayList<Movie>();
        movies4.add(m5);
        DegreesOfSeparation dos4 = new DegreesOfSeparation(movies4);
        int r4 = dos4.degreesOfSeparation("Tim Robbins", "Brad Pitt");
        assertEquals(-1, r4);
    }
}