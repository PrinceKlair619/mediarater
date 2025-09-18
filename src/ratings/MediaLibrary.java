package ratings;

import ratings.Movie;
import ratings.Rating;
import ratings.Song;
import ratings.FileReader;
import ratings.Ratable;
import ratings.datastructures.Comparator;
import java.util.ArrayList;

public class MediaLibrary {
    private static ArrayList<Ratable> teriMa;

    public MediaLibrary() {
        this.teriMa = new ArrayList<>();
    }

    public void populateLibrary(String sF, String mF, String MrF) {
        ArrayList<Song> Songfile = FileReader.readSongs(sF);
        ArrayList<Movie> movieratingsfile = FileReader.readMovieRatings( FileReader.readMovies(mF), MrF);
        for (Song line : Songfile) {
            boolean lund = false;
            for (int x = 0; x < teriMa.size(); x++) {
                if (line.bayesianAverageRating(2, 3) > teriMa.get(x).bayesianAverageRating(2, 3)) {
                    teriMa.add(x, line);
                    lund = true;
                    break;
                }
            }
            if (!lund) {
                teriMa.add(line);
                }
            }
        for (Movie lines : movieratingsfile) {
            boolean penchod = false;
            for (int x = 0; x < teriMa.size(); x++) {
                if (lines.bayesianAverageRating(2, 3) > teriMa.get(x).bayesianAverageRating(2, 3)) {
                    teriMa.add(x, lines);
                    penchod = true;
                    break;
                }
            }
            if (!penchod) {
                teriMa.add(lines);
            }
        }
    }
    public ArrayList<Ratable> topKRatables(int k){
        ArrayList<Ratable> everything = new ArrayList<>();
        if(teriMa.isEmpty()){
            return everything;
        }
        else {
            for ( int x = 0; x < Math.min( k , teriMa.size()); x++){
                everything.add(teriMa.get(x));
            }
        }
        return everything;
    }
}

//    public void populateLibrary(String sF, String mF, String MrF) {
//            songs = FileReader.readSongs(sF);
//            movies = FileReader.readMovies(mF);
//            FileReader.readMovieRatings(movies, MrF);
//    }
