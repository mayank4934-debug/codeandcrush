import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Types "../types/reviews";

/// Domain logic for user-submitted app reviews
module {
  public type Review = Types.Review;

  /// Appends a new review to the global reviews list.
  /// Validates: rating 1–5, text non-empty and max 500 chars, universityName max 100 chars.
  /// Returns #ok with the new Review on success, or #err with a reason.
  public func submit(
    reviews : List.List<Review>,
    nextId : Nat,
    username : Text,
    rating : Nat,
    text : Text,
    universityName : Text,
  ) : { #ok : Review; #err : Text } {
    if (rating < 1 or rating > 5) {
      return #err("Rating must be between 1 and 5");
    };
    if (text.size() == 0) {
      return #err("Review text cannot be empty");
    };
    if (text.size() > 500) {
      return #err("Review text must be 500 characters or fewer");
    };
    if (universityName.size() > 100) {
      return #err("University/school name must be 100 characters or fewer");
    };
    let review : Review = {
      id = nextId.toText();
      username;
      universityName;
      rating;
      text;
      timestamp = Time.now();
    };
    reviews.add(review);
    #ok(review);
  };

  /// Returns all reviews sorted by timestamp descending (newest first).
  public func getAll(reviews : List.List<Review>) : [Review] {
    let arr = reviews.toArray();
    arr.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) });
  };

  /// Returns the newest N reviews sorted by timestamp descending.
  public func getLatest(reviews : List.List<Review>, limit : Nat) : [Review] {
    let all = getAll(reviews);
    if (limit >= all.size()) {
      all;
    } else {
      all.sliceToArray(0, limit.toInt());
    };
  };
};
