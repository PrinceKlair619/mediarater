package ratings;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

public class FileReader {

    public static ArrayList<String> readFile(String filename) {
        try {
            return new ArrayList<>(Files.readAllLines(Paths.get(filename)));
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }

    public static ArrayList<Song> readSongs(String file) {
        ArrayList<String> lines = readFile(file);
        ArrayList<Song> songs = new ArrayList<>();
        for (String line : lines) {
            ArrayList<String> field = new ArrayList<>(Arrays.asList(line.split(",")));
            String songId = field.get(0);
            String artist = field.get(1);
            String title = field.get(2);
            String reviewerId = field.get(3);
            int rating = Integer.parseInt(field.get(4));
            // Check if song already exists in the songs list
            Song song = null;
            for (Song s : songs) {
                if (s.getSongID().equals(songId)) {
                    song = s;
                    break;
                }
            }
            // If song does not exist, create a new one
            if (song == null) {
                song = new Song(title, artist, songId);
                songs.add(song);
            }
            // Add rating
            Rating newRating = new Rating(reviewerId, rating);
            song.addRating(newRating);
        }
        return songs;
    }

    public static ArrayList<Movie> readMovies(String file) {
        ArrayList<String> lines = readFile(file);
        ArrayList<Movie> movies = new ArrayList<>();
        for (String line : lines) {
            ArrayList<String> field = new ArrayList<>(Arrays.asList(line.split(",")));
            String title = field.get(0);
            ArrayList<String> cast = new ArrayList<>();
            for (int i = 1; i < field.size(); i++) {
                cast.add(field.get(i));
            }
            Movie movie = new Movie(title, cast);
            movies.add(movie);
        }
        return movies;
    }

    public static ArrayList<Movie> readMovieRatings(ArrayList<Movie> movies, String file) {
        ArrayList<Movie> rm = new ArrayList<>();
        HashMap<String, Movie> Movies = new HashMap<>();
        for (Movie movie : movies) {
            Movies.put(movie.getTitle(), movie);
        }
        try {
            ArrayList<String> lines = (ArrayList<String>) Files.readAllLines(Paths.get(file));
            for (String line : lines) {
                ArrayList<String> parts = new ArrayList<>(Arrays.asList(line.split(",")));
                String title = parts.get(0);
                String reviewerId = parts.get(1);
                int rating = Integer.parseInt(parts.get(2));

                if(Movies.containsKey(title)){
                    Movie movie = Movies.get(title);
                    movie.addRating(new Rating(reviewerId,rating));
                        if (!rm.contains(movie)) {
                            rm.add(movie);
                        }
                    }
                }
            } catch (IOException e){
            e.printStackTrace();
            }
            return rm;
    }
}
