package ratings;

import java.util.ArrayList;

public class Movie extends Ratable{
    private ArrayList<String> cast;

    public Movie(String title, ArrayList<String> cast) {
        super();
        this.setTitle(title);
        this.cast = cast;
    }

    public ArrayList<String> getCast() {
        return cast;
    }
}

