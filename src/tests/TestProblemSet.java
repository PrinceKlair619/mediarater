package tests;


import org.junit.Assert;
import org.junit.Test;
import ratings.ProblemSet;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import static org.junit.Assert.assertTrue;


public class TestProblemSet {
    @Test
    public void averagetests() {
        ArrayList<Double> T1 = new ArrayList<>(Arrays.asList(1.0, 2.0, 3.0));
        Assert.assertEquals(2.0,ProblemSet.average(T1), 0.01);

        ArrayList<Double> T2 = new ArrayList<>(Arrays.asList(-5.0, 5.0));
        Assert.assertEquals(0.0,ProblemSet.average(T2), 0.01);

        ArrayList<Double> T3 = new ArrayList<>(Arrays.asList(6.5,6.5,8.5,8.5));
        Assert.assertEquals(7.5,ProblemSet.average(T3), 0.01);

        ArrayList<Double> T4 = new ArrayList<>(Arrays.asList( ));
        Assert.assertEquals(0.0,ProblemSet.average(T4), 0.01);

        ArrayList<Double> T5 = new ArrayList<>(Arrays.asList( 3.0, 3.0, 3.0));
        Assert.assertEquals(3.0,ProblemSet.average(T5), 0.01);

        ArrayList<Double> T6 = new ArrayList<>(Arrays.asList(13.0));
        Assert.assertEquals(13.0,ProblemSet.average(T6), 0.01);

    }
    //Examples
    //[1.0,2.0,3.0] returns 2.0
    // [-5.0,5.0] returns 0.0
    // [6.5,6.5,8.5,8.5] returns 7.5
    // [] returns 0.0
    @Test
    public void sumOfDigitstests(){
        assertTrue(ProblemSet.sumOfDigits(123)==(6));

        assertTrue(ProblemSet.sumOfDigits(57)==(12));

        assertTrue(ProblemSet.sumOfDigits(-36)==(9));

        assertTrue(ProblemSet.sumOfDigits(12345)==(15));

        assertTrue(ProblemSet.sumOfDigits(2004)==(6));

        assertTrue(ProblemSet.sumOfDigits(0)==(0));
    }
    // Examples
    // 123 returns 6
    // 57 returns 12
    // -36 returns 9

    @Test
public void bestKeytests(){
        HashMap<String, Integer> h1 = new HashMap<>();
        h1.put("CSE",100);
        h1.put("MTH",90);
        h1.put("MGT",10);
        assertTrue(ProblemSet.bestKey(h1).equals("CSE"));

        HashMap<String, Integer> h2 = new HashMap<>();
        h2.put("cat",5);
        h2.put("dog",3);
        h2.put("fox",4);
        assertTrue(ProblemSet.bestKey(h2).equals("cat"));

        HashMap<String, Integer> h3 = new HashMap<>();
        h3.put("faiza",-420);
        h3.put("prince",-69);
        h3.put("robin",0);
        assertTrue(ProblemSet.bestKey(h3).equals("robin"));

        HashMap<String, Integer> h4 = new HashMap<>();
        h4.put("bro",890);
        h4.put("sigma",1738);
        h4.put("lmao",-10000);
        h4.put("lol",101);
        assertTrue(ProblemSet.bestKey(h4).equals("sigma"));

        HashMap<String, Integer> h5 = new HashMap<>();
        assertTrue(ProblemSet.bestKey(h5).equals(""));

        HashMap<String, Integer> h6 = new HashMap<>();
        h6.put("best",-5690);
        h6.put("amazing",-673);
        h6.put("great",-12100);
        assertTrue(ProblemSet.bestKey(h6).equals("amazing"));

    }
    // Examples
    // {"CSE": 100, "MTH": 90, "MGT": 10} returns "CSE"
    // {"cat": 5, "dog": 5, "fox": 4} can return either "cat" or "dog"
    // {} returns ""

    // TODO: Write testing for all 3 methods of the ratings.ProblemSet class


}

