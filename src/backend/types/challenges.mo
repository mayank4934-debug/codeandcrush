// Challenge domain types: quiz challenges between users and seasonal milestone tracking
import CommonTypes "common";
module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  /// Challenge status lifecycle
  public type ChallengeStatus = {
    #pending;    // sent, awaiting acceptance
    #accepted;   // challengee accepted, quiz not yet submitted
    #completed;  // both scores are in
    #expired;    // 72-hour window passed without completion
  };

  /// A quiz challenge from one user to another
  public type Challenge = {
    id : Text;
    challenger : UserId;
    challengee : UserId;
    quizId : Text;
    quizTopic : Text;
    challengerScore : Nat;
    challengeeScore : ?Nat;
    status : ChallengeStatus;
    createdAt : Timestamp;
    expiresAt : Timestamp;   // createdAt + 72h in nanoseconds
  };

  /// Public view of a challenge (all fields are shared-type safe)
  public type ChallengeView = {
    id : Text;
    challenger : Text;   // Principal as Text for frontend
    challengee : Text;
    quizId : Text;
    quizTopic : Text;
    challengerScore : Nat;
    challengeeScore : ?Nat;
    status : Text;       // "pending" | "accepted" | "completed" | "expired"
    createdAt : Timestamp;
    expiresAt : Timestamp;
  };

  /// Which real-world season a milestone belongs to
  public type Season = {
    #spring;  // months 3–5
    #summer;  // months 6–8
    #fall;    // months 9–11
    #winter;  // months 12, 1, 2
  };

  /// Record of a seasonal item unlocked by completing a domain module
  public type SeasonalMilestone = {
    userId : UserId;
    domain : Text;
    moduleIndex : Nat;
    season : Text;         // human-readable season name
    unlockedItemId : Text;
    unlockedAt : Timestamp;
  };
};
