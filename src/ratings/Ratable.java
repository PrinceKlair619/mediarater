package ratings;

import ratings.datastructures.LinkedListNode;

public class Ratable {
    private LinkedListNode<Rating> ratings = null;
    public String title;

    public Ratable() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void addRating(Rating rating) {
        if (this.ratings == null) {
            this.ratings = new LinkedListNode<>(rating, null);
        } else if (!didReviewerRateSong(rating.getReviewerID()))
            ratings.append(rating);
    }

    public LinkedListNode<Rating> getRatings() {
        return this.ratings;
    }

    public double averageRating() {
        LinkedListNode<Rating> local_node = this.ratings;
        int amount = 0;
        double sum = 0;
        while (local_node != null) {
            double value = local_node.getValue().getRating();
            sum += value;
            amount++;
            local_node = local_node.getNext();
        }
        double average = 0.0;
        if (amount > 0) {
            average = (double) sum / amount;
        }
        return average;
    }

    public boolean didReviewerRateSong(String ID) {
        LinkedListNode<Rating> local_node = this.ratings;
        while (local_node != null) {
            if (local_node.getValue().getReviewerID() == ID) {
                return true;
            }
            local_node = local_node.getNext();
        }
        return false;
    }

    public void removeRatingByReviewer(Reviewer reviewer) {
        LinkedListNode<Rating> local_node = this.ratings;
        if (local_node == null) {
            return;
        } else if (local_node.getValue().getReviewerID().equals(reviewer.getReviewerID())) {
            this.ratings = this.ratings.getNext();
            return;
        }
        while (local_node.getNext() != null) {
            if (local_node.getNext().getValue().getReviewerID().equals(reviewer.getReviewerID())) {
                local_node.setNext(local_node.getNext().getNext());
                return;
            }
            local_node = local_node.getNext();
        }
    }

//    private LinkedListNode<Rating> node = new LinkedListNode<>(null, null);

    public double bayesianAverageRating(int amount, int value) {
//
        LinkedListNode<Rating> local_node = this.ratings;
        int total = 0;
        int sum = 0;
        while (local_node != null) {
            double val = local_node.getValue().getRating();
            sum += val;
            total++;
            local_node = local_node.getNext();
        }
        total += amount;
        sum += amount * value;
        if (total == 0) {
            return 0.0;
        }
        double BA = (double) sum / total;
        return BA;
    }
}
