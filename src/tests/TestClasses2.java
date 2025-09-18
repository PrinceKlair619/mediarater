package tests;

import org.junit.Test;
import java.util.ArrayList;
import ratings.Rating;
import ratings.Reviewer;
import ratings.Song;
import ratings.Movie;
import ratings.datastructures.SongBayesianRatingComparator;
import ratings.datastructures.SongTitleComparator;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;
public class TestClasses2 {
    @Test
    public void testBARNoRatings() {
        Song song = new Song("a","b","c");
        assertEquals(0.0, song.bayesianAverageRating(0, 0), 0.001);
    }
    @Test
    public void testBARNoExtraRatings() {
        Song song = new Song("a", "b", "c");
        Rating ratings5 = new Rating("h", 4);
        song.addRating(ratings5);
        Rating ratings4 = new Rating("y", 5);
        song.addRating(ratings4);
        assertEquals(4.5, song.bayesianAverageRating(0, 0), 0.001);
    }
    @Test
    public void testBAR1ExtraRating() {
        Song song = new Song("a","b","c");
        assertEquals(3.0, song.bayesianAverageRating(1, 3), 0.001);
    }
    @Test
    public void testBAR2ExtraRatings() {
        Song song = new Song("a","b","c");
        Rating ratings = new Rating("h",4);
        song.addRating(ratings);
        Rating ratings1 = new Rating("y",5);
        song.addRating(ratings1);
        assertEquals(3.75, song.bayesianAverageRating(2, 3), 0.001);
    }
    @Test
    public void testBARode() {
        Song song = new Song("a", "b", "c");
        Rating ratings = new Rating("h", 3);
        song.addRating(ratings);
        Rating ratings1 = new Rating("y", 5);
        song.addRating(ratings1);
        assertEquals(4, song.bayesianAverageRating(7, 4), 0.001);
    }
    @Test
    public void testgetCast1() {
        String title = "The Avengers";
        ArrayList<String> cast = new ArrayList<>();
        cast.add("Robert Downey");
        cast.add("Chris Evans");
        cast.add("Mark");
        cast.add("Chris");
        cast.add("Scarlett Johansson");
        cast.add("Jeremy");
        Movie movie = new Movie(title, cast);

        assertTrue(movie.getTitle().equalsIgnoreCase("The Avengers"));
        ArrayList<String> expected = movie.getCast();
        for (int i = 0; i < cast.size(); i++) {
            assertTrue(expected.get(i).equalsIgnoreCase(cast.get(i)));
        }
    }
    @Test
    public void testgetCast2() {
        String title = "The Avengers";
        ArrayList<String> cast = new ArrayList<>();
        cast.add("Robert Downey");
        cast.add("Chris Evans");
        cast.add("Mark");
        cast.add("Chris");
        cast.add("Scarlett Johansson");
        cast.add("Jeremy");
        Movie movie = new Movie(title, cast);
        assertTrue(movie.getTitle().equalsIgnoreCase("The Avengers"));
    }
    @Test
    public void testgetCast3() {
        String title = "The Avengers";
        ArrayList<String> cast = new ArrayList<>();
        cast.add("Robert Downey");
        cast.add("Chris Evans");
        cast.add("Mark");
        cast.add("Chris");
        cast.add("Scarlett Johansson");
        cast.add("Jeremy");
        Movie movie = new Movie(title, cast);
        ArrayList<String> expected = movie.getCast();
        assertTrue(expected.size() == cast.size());
    }
    @Test
    public void testtitlecomparator() {

        SongTitleComparator comp = new SongTitleComparator();

        Song song1 = new Song("Prince", "asd", "wqd");
        Song song2 = new Song("Adam", "asd", "wqd");
        assertFalse(comp.compare(song1,song2));
        assertTrue(comp.compare(song2,song1));

        Song song11 = new Song("prince", "asd", "wqd");
        Song song22 = new Song("ADAM", "asd", "wqd");
        assertFalse(comp.compare(song11,song22));
        assertTrue(comp.compare(song22,song11));

        Song song111 = new Song("prince", "asd", "wqd");
        Song song222 = new Song("PRINCE", "asd", "wqd");
        assertFalse(comp.compare(song111, song222));


        Song song1111 = new Song("BOB", "asd", "wqd");
        Song song2222 = new Song("DUDE", "asd", "wqd");
        assertTrue(comp.compare(song1111, song2222));
        assertFalse(comp.compare(song2222,song1111));

        Song song11111 = new Song("DEV KLAIR", "asd", "wqd");
        Song song22222 = new Song("prince", "asd", "wqd");
        assertTrue(comp.compare(song11111, song22222));
        assertFalse(comp.compare(song22222,song11111));

        Song song19 = new Song("DEV KLAIR", "asd", "wqd");
        Song song20 = new Song("DEV", "asd", "wqd");
        assertFalse(comp.compare(song19, song20));

        Song song21 = new Song("faiza", "asd", "wqd");
        Song song25 = new Song("PRINCE", "asd", "wqd");
        assertTrue(comp.compare(song21, song25));
        assertFalse(comp.compare(song25,song21));
    }

    @Test
    public void testBayesianRatingComparator(){
        SongBayesianRatingComparator comper = new SongBayesianRatingComparator();

        Song song1 = new Song("p","r","c");
        Song song2 = new Song("p","r","c");
        assertFalse(comper.compare(song1,song2));

//        Song song3 = new Song("p","r","c");
//        Song song4 = new Song("p","r","c");
//        for (int i=0; i<60;i++) {
//            Rating rating = new Rating("G", 3);
//            song3.addRating(rating);
//        }
//        assertTrue(comper.compare(song3,song4));

        Song song5 = new Song("p","r","c");
        Song song6 = new Song("p","r","c");
        for (int i=0; i<60;i++) {
            Rating rating = new Rating("a", 1);
            song5.addRating(rating);
            Rating rating1 = new Rating("b", 1);
            song5.addRating(rating1);
            Rating rating2 = new Rating("c", 1);
            song5.addRating(rating2);
            Rating rating3 = new Rating("d", 1);
            song5.addRating(rating3);
        }
        assertFalse(comper.compare(song5,song6));
    }
}

