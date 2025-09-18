package ratings;

import java.util.ArrayList;
import java.util.HashMap;

public class DegreesOfSeparation {
    private ArrayList<Movie> movie;

    public DegreesOfSeparation(ArrayList<Movie> movie) {
        this.movie = movie;
    }

    public int degreesOfSeparation(String actor1, String actor2) {
        if (actor1.equals(actor2)) {
            return 0;
        }
        ArrayList<String> list = new ArrayList<>();
        HashMap<String, Integer> map = new HashMap<>();
        list.add(actor1);
        map.put(actor1, 0);

        for (int x = 0; x < list.size(); x++){
            String y = list.get(x);
            int z = map.get(y);



            for( Movie m1 : movie){
                ArrayList<String> cast = m1.getCast();
                if (cast.contains(y)){
                    for ( String gandu : cast){
                        if (gandu.equals(actor2)){
                            return z + 1;
                        }
                        if (!map.containsKey(gandu)){
                            map.put(gandu, z + 1);
                            list.add(gandu);
                        }
                    }
                }
            }
        }
        return -1;
    }
}

