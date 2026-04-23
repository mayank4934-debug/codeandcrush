import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MockTestTypes "../types/mockTests";

/// Domain logic for mock test results
module {

  /// Save a legacy mock test result (testId-based, preserves existing callers)
  public func save(
    mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>,
    userId : Principal,
    testId : Text,
    score : Nat,
    totalQuestions : Nat,
    timeTaken : Nat,
    answers : [Text],
  ) : MockTestTypes.MockTestResult {
    let now = Time.now();
    let pct : Float = if (totalQuestions == 0) 0.0
      else score.toFloat() / totalQuestions.toFloat() * 100.0;
    // Convert [Text] answers to [Nat] — try parsing each; default 0 on failure
    let natAnswers : [Nat] = answers.map<Text, Nat>(
      func(a) {
        switch (Nat.fromText(a)) {
          case (?n) n;
          case null 0;
        }
      }
    );
    let result : MockTestTypes.MockTestResult = {
      id = userId.toText() # "-" # testId # "-" # now.toText();
      userId;
      domain = testId;
      score;
      maxScore = totalQuestions;
      percentage = pct;
      timestamp = now;
      timeSpentSecs = timeTaken;
      answers = natAnswers;
      // Legacy fields
      testId;
      totalQuestions;
      timeTaken;
      completedAt = now;
    };
    let existing = switch (mockTestResultsMap.get(userId)) {
      case (?list) list;
      case null List.empty<MockTestTypes.MockTestResult>();
    };
    existing.add(result);
    mockTestResultsMap.add(userId, existing);
    result;
  };

  /// Save a domain test result (new enriched format)
  public func saveDomain(
    mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>,
    userId : Principal,
    domain : Text,
    score : Nat,
    maxScore : Nat,
    timeSpentSecs : Nat,
    answers : [Nat],
  ) : Text {
    let now = Time.now();
    let pct : Float = if (maxScore == 0) 0.0
      else score.toFloat() / maxScore.toFloat() * 100.0;
    let id = userId.toText() # "-" # domain # "-" # now.toText();
    let result : MockTestTypes.MockTestResult = {
      id;
      userId;
      domain;
      score;
      maxScore;
      percentage = pct;
      timestamp = now;
      timeSpentSecs;
      answers;
      // Legacy fields (empty/zero for new-style results)
      testId = domain;
      totalQuestions = maxScore;
      timeTaken = timeSpentSecs;
      completedAt = now;
    };
    let existing = switch (mockTestResultsMap.get(userId)) {
      case (?list) list;
      case null List.empty<MockTestTypes.MockTestResult>();
    };
    existing.add(result);
    mockTestResultsMap.add(userId, existing);
    id;
  };

  /// Return all mock test results for a user
  public func getAll(
    mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>,
    userId : Principal,
  ) : [MockTestTypes.MockTestResult] {
    switch (mockTestResultsMap.get(userId)) {
      case (?list) list.toArray();
      case null [];
    };
  };

  /// Return all results for a specific domain for a user
  public func getAllForDomain(
    mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>,
    userId : Principal,
    domain : Text,
  ) : [MockTestTypes.MockTestResult] {
    switch (mockTestResultsMap.get(userId)) {
      case (?list) list.toArray().filter(func(r) { r.domain == domain });
      case null [];
    };
  };

  /// Return all results across all users (admin/leaderboard use)
  public func getAllGlobal(
    mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>,
  ) : [MockTestTypes.MockTestResult] {
    let acc = List.empty<MockTestTypes.MockTestResult>();
    for ((_, list) in mockTestResultsMap.entries()) {
      for (item in list.values()) {
        acc.add(item);
      };
    };
    acc.toArray();
  };

  /// Return top-N users by best score for a given domain
  public func getLeaderboard(
    mockTestResultsMap : Map.Map<Principal, List.List<MockTestTypes.MockTestResult>>,
    domain : Text,
    limit : Nat,
  ) : [(Principal, Nat)] {
    // Collect best score per user for the domain
    let bestScores = Map.empty<Principal, Nat>();
    for ((userId, list) in mockTestResultsMap.entries()) {
      for (r in list.values()) {
        if (r.domain == domain) {
          let current = switch (bestScores.get(userId)) {
            case (?s) s;
            case null 0;
          };
          if (r.score > current) {
            bestScores.add(userId, r.score);
          };
        };
      };
    };
    // Sort descending by score, take limit
    let entries = bestScores.toArray();
    let sorted = entries.sort(func(a, b) {
      if (b.1 > a.1) #less
      else if (b.1 < a.1) #greater
      else #equal
    });
    if (sorted.size() <= limit) sorted
    else sorted.sliceToArray(0, limit.toInt());
  };
};
