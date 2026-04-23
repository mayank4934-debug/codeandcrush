import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import NewReviewTypes "./types/reviews";
import NewMockTestTypes "./types/mockTests";

/// Explicit migration: upgrades state from old canister version to current.
/// Old shape:
///   reviews : List<OldReview>     where OldReview.id : Nat
///   mockTestResultsMap : Map<Principal, List<OldMockTestResult>>
///     where OldMockTestResult.answers : [Text], lacks domain/maxScore/percentage/timestamp/timeSpentSecs
module {

  // ── Old types (copied inline from .old/src/backend/types/) ─────────────────

  type OldReview = {
    id : Nat;
    username : Text;
    rating : Nat;
    text : Text;
    universityName : Text;
    timestamp : Int;
  };

  type OldMockTestResult = {
    id : Text;
    userId : Principal;
    testId : Text;
    score : Nat;
    totalQuestions : Nat;
    timeTaken : Nat;
    completedAt : Int;
    answers : [Text];
  };

  // ── State records ───────────────────────────────────────────────────────────

  type OldActor = {
    reviews : List.List<OldReview>;
    mockTestResultsMap : Map.Map<Principal, List.List<OldMockTestResult>>;
  };

  type NewActor = {
    reviews : List.List<NewReviewTypes.Review>;
    mockTestResultsMap : Map.Map<Principal, List.List<NewMockTestTypes.MockTestResult>>;
  };

  // ── Migration function ──────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate reviews: Nat id → Text id
    let newReviews = old.reviews.map<OldReview, NewReviewTypes.Review>(
      func(r) {
        {
          id = r.id.toText();
          username = r.username;
          universityName = r.universityName;
          rating = r.rating;
          text = r.text;
          timestamp = r.timestamp;
        }
      }
    );

    // Migrate mock test results: [Text] answers → [Nat], add missing fields
    let newMockTestResultsMap = old.mockTestResultsMap.map<Principal, List.List<OldMockTestResult>, List.List<NewMockTestTypes.MockTestResult>>(
      func(_userId, oldList) {
        oldList.map<OldMockTestResult, NewMockTestTypes.MockTestResult>(
          func(r) {
            // Convert [Text] answers to [Nat]: parse each, default 0 on failure
            let natAnswers : [Nat] = r.answers.map<Text, Nat>(
              func(a) {
                switch (Nat.fromText(a)) {
                  case (?n) n;
                  case null 0;
                }
              }
            );
            {
              id = r.id;
              userId = r.userId;
              domain = r.testId;
              score = r.score;
              maxScore = r.totalQuestions;
              percentage = if (r.totalQuestions == 0) 0.0
                else r.score.toFloat() / r.totalQuestions.toFloat() * 100.0;
              timestamp = r.completedAt;
              timeSpentSecs = r.timeTaken;
              answers = natAnswers;
              // Legacy fields preserved
              testId = r.testId;
              totalQuestions = r.totalQuestions;
              timeTaken = r.timeTaken;
              completedAt = r.completedAt;
            }
          }
        )
      }
    );

    {
      reviews = newReviews;
      mockTestResultsMap = newMockTestResultsMap;
    };
  };
};
