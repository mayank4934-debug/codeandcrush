// Public API mixin for quiz challenges and seasonal milestones
import Debug "mo:core/Debug";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import ChallengesLib "../lib/challenges";
import Types "../types/challenges";

mixin (
  challenges : List.List<Types.Challenge>,
  challengeCounter : { var value : Nat },
  seasonalMilestones : List.List<Types.SeasonalMilestone>,
) {

  // ── Quiz challenge endpoints ────────────────────────────────────────────────

  /// Send a challenge to a friend; challengerScore is the score to beat
  public shared ({ caller }) func sendChallenge(
    challengeeId : Principal,
    quizId : Text,
    quizTopic : Text,
    challengerScore : Nat,
  ) : async Types.ChallengeView {
    Debug.todo();
  };

  /// Submit the challengee's score for an existing challenge
  public shared ({ caller }) func submitChallengeScore(
    challengeId : Text,
    score : Nat,
  ) : async Bool {
    Debug.todo();
  };

  /// Get all active (pending/accepted, non-expired) challenges for the caller
  public query ({ caller }) func getActiveChallenges() : async [Types.ChallengeView] {
    Debug.todo();
  };

  /// Get all completed challenges for the caller (as challenger or challengee)
  public query ({ caller }) func getChallengeHistory() : async [Types.ChallengeView] {
    Debug.todo();
  };

  /// Get a single challenge by its ID
  public query func getChallengeById(id : Text) : async ?Types.ChallengeView {
    Debug.todo();
  };

  // ── Seasonal milestone endpoints ────────────────────────────────────────────

  /// Called when a user completes a module; auto-checks season and unlocks avatar item if applicable
  public shared ({ caller }) func recordModuleCompletion(
    domain : Text,
    moduleIndex : Nat,
  ) : async ?Text {
    Debug.todo();
  };

  /// Get all seasonal avatar item IDs unlocked by the caller
  public query ({ caller }) func getUnlockedSeasonalItems() : async [Text] {
    Debug.todo();
  };

  /// Check whether completing this module+domain right now would unlock a seasonal item
  public query func checkSeasonalMilestone(domain : Text, moduleIndex : Nat) : async ?Text {
    Debug.todo();
  };
};
