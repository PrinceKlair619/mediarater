package ratings;

public class Rating {

    private String reviewerID;
    private int rating;

    public Rating(String reviewerID, int rating) {
        setReviewerID(reviewerID);
        setRating(rating);
    }

    public String getReviewerID() {
        return reviewerID;
    }

    public void setReviewerID(String reviewerID) {
        this.reviewerID = reviewerID;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        if (rating >= 1 && rating <= 5) {
            this.rating = rating;
        } else {
            this.rating = -1;
        }
    }
}

