package ratings.datastructures;

import ratings.Song;

public class SongBayesianRatingComparator extends Comparator<Song> {

    public boolean compare(Song a, Song b) {
        double x = a.bayesianAverageRating(2, 3);
        double y = b.bayesianAverageRating(2, 3);
        if (x > y) {
            return true;
        } else {
            return false;
        }
    }
}