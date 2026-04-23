import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  /// A user-submitted review for the app
  public type Review = {
    id : Text;
    username : Text;
    universityName : Text;
    rating : Nat;
    text : Text;
    timestamp : Timestamp;
  };
};
