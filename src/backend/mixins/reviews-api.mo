import List "mo:core/List";
import ReviewLib "../lib/reviews";
import ReviewTypes "../types/reviews";

/// Public API mixin for user app reviews
mixin (reviews : List.List<ReviewTypes.Review>) {

  /// Submit a review. No authentication required — anyone can call.
  /// Rating must be 1–5. Text must be non-empty, max 500 chars.
  /// universityName stores the user's university or school name (optional, max 100 chars).
  public shared ({ caller = _ }) func submitReview(
    username : Text,
    universityName : Text,
    rating : Nat,
    text : Text,
  ) : async { #ok : ReviewTypes.Review; #err : Text } {
    // Use list size as the next id (monotonically increasing)
    let nextId = reviews.size();
    ReviewLib.submit(reviews, nextId, username, rating, text, universityName);
  };

  /// Returns all submitted reviews, newest first.
  public query func getReviews() : async [ReviewTypes.Review] {
    ReviewLib.getAll(reviews);
  };

  /// Returns the newest N submitted reviews, newest first.
  public query func getLatestReviews(limit : Nat) : async [ReviewTypes.Review] {
    ReviewLib.getLatest(reviews, limit);
  };
};
