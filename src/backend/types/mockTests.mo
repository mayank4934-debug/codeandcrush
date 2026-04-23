import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  /// Result of a completed mock test session
  public type MockTestResult = {
    id : Text;
    userId : Principal;
    domain : Text;
    score : Nat;
    maxScore : Nat;
    percentage : Float;
    timestamp : Int;
    timeSpentSecs : Nat;
    answers : [Nat];
    // Legacy fields kept for backward compatibility with saveMockTestResult
    testId : Text;
    totalQuestions : Nat;
    timeTaken : Nat;
    completedAt : Timestamp;
  };

  /// Configuration for domain-specific test parameters
  public type DomainTestConfig = {
    domain : Text;
    totalMCQ : Nat;
    totalCoding : Nat;
    timeLimit : Nat; // minutes
  };
};
