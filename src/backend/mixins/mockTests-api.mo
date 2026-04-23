import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MockTestLib "../lib/mockTests";
import MockTestTypes "../types/mockTests";

/// Public API mixin for mock test results
mixin (mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>) {

  // ── Legacy API (preserved unchanged) ─────────────────────────────────────────

  /// Save a completed mock test result for the calling user (legacy testId-based)
  public shared ({ caller }) func saveMockTestResult(
    testId : Text,
    score : Nat,
    totalQuestions : Nat,
    timeTaken : Nat,
    answers : [Text],
  ) : async MockTestTypes.MockTestResult {
    MockTestLib.save(mockTestResultsMap, caller, testId, score, totalQuestions, timeTaken, answers);
  };

  /// Return all mock test results for the calling user (legacy)
  public query ({ caller }) func getMockTestResults() : async [MockTestTypes.MockTestResult] {
    MockTestLib.getAll(mockTestResultsMap, caller);
  };

  // ── New domain-aware API ──────────────────────────────────────────────────────

  /// Save a domain-specific test result and return its generated ID.
  /// Supports all 18 domains: Frontend, Python, Backend, FullStack, DataScience,
  /// ML, DevOps, Android, iOS, Cybersecurity, Blockchain, Cloud, AIML, GameDev,
  /// UIUXDesign, ProgrammingInC, CSSubjects, SystemDesign.
  public shared ({ caller }) func saveDomainTestResult(
    domain : Text,
    score : Nat,
    maxScore : Nat,
    timeSpentSecs : Nat,
    answers : [Nat],
  ) : async Text {
    MockTestLib.saveDomain(mockTestResultsMap, caller, domain, score, maxScore, timeSpentSecs, answers);
  };

  /// Return all test results the calling user completed for a specific domain
  public query ({ caller }) func getDomainTestResults(domain : Text) : async [MockTestTypes.MockTestResult] {
    MockTestLib.getAllForDomain(mockTestResultsMap, caller, domain);
  };

  /// Return all test results for the calling user across every domain
  public query ({ caller }) func getAllTestResults() : async [MockTestTypes.MockTestResult] {
    MockTestLib.getAll(mockTestResultsMap, caller);
  };

  /// Return the top-N users ranked by best score for a specific domain.
  /// Returns an array of (Principal, bestScore) pairs, sorted descending.
  public query func getTestLeaderboard(domain : Text, limit : Nat) : async [(Principal, Nat)] {
    MockTestLib.getLeaderboard(mockTestResultsMap, domain, limit);
  };
};
