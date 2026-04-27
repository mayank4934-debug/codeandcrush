import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

// Migration


// New domain mixins
import EnrollmentApi "mixins/enrollment-api";
import ReviewsApi "mixins/reviews-api";
import EmailApi "mixins/email-api";
import ProgressApi "mixins/progress-api";
import AiProxyApi "mixins/ai-proxy-api";
import NotesApi "mixins/notes-api";
import ArticlesApi "mixins/articles-api";
import ExperiencesApi "mixins/experiences-api";
import GCoinsApi "mixins/gcoins-api";
import MockTestsApi "mixins/mockTests-api";
import FollowsApi "mixins/follows-api";
import MessagingApi "mixins/messaging-api";
import ChallengesApi "mixins/challenges-api";
import SocialMediaApi "mixins/socialMedia-api";

// New domain types
import MessagingTypes "types/messaging";
import EnrollTypes "types/enrollment";
import ReviewTypes "types/reviews";
import EmailTypes "types/email";
import NoteTypes "types/notes";
import ArticleTypes "types/articles";
import ExperienceTypes "types/experiences";
import MockTestTypes "types/mockTests";
import ChallengeTypes "types/challenges";
import SocialMediaTypes "types/socialMedia";




actor {

  // ── HTTP interface types (IC HTTP gateway standard) ──────────────────────────
  type HttpHeader = { name : Text; value : Text };

  type HttpRequest = {
    method : Text;
    url : Text;
    headers : [HttpHeader];
    body : Blob;
  };

  type HttpResponse = {
    status_code : Nat16;
    headers : [HttpHeader];
    body : Blob;
  };

  // ── HTTP request handler — serves sitemap.xml and robots.txt ──────────────────
  // MUST be a query func so the IC HTTP gateway serves it to external crawlers
  // (Googlebot, etc.) via the certified query path. An update func would require
  // consensus and is NOT reachable by the IC HTTP gateway for asset serving.
  public query func http_request(req : HttpRequest) : async HttpResponse {
    // Strip query string: keep only the path portion before '?'
    let path : Text = switch (req.url.split(#char '?').next()) {
      case (?p) p;
      case null req.url;
    };

    // Always use the real production domain. The Host header on ICP is
    // unreliable and must not be used to build canonical sitemap URLs.
    let baseUrl : Text = "https://codeandcrush.app";

    if (path == "/sitemap.xml" or path == "/sitemap.xml/") {
      let xml : Text =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" #
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" #
        "  <url><loc>" # baseUrl # "/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/problems</loc><changefreq>daily</changefreq><priority>0.9</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/blueprints</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/compiler</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/documentation</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/events</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/dashboard</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/chat</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/technews</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/techmagazine</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/online-test</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/practice</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/leaderboard</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/frontend</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/backend</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/python</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/java</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/devops</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/data-science</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/machine-learning</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/cybersecurity</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/blockchain</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/cloud</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/game-dev</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/ui-ux</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/roadmap/system-design</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/privacy</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>\n" #
        "  <url><loc>" # baseUrl # "/terms</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>\n" #
        "</urlset>";
      return {
        status_code = 200 : Nat16;
        headers = [
          { name = "Content-Type"; value = "application/xml; charset=utf-8" },
          { name = "Cache-Control"; value = "public, max-age=3600" },
          { name = "Access-Control-Allow-Origin"; value = "*" },
        ];
        body = xml.encodeUtf8();
      };
    };

    if (path == "/robots.txt") {
      let robots : Text =
        "User-agent: *\n" #
        "Allow: /\n" #
        "Disallow: /api/\n" #
        "Sitemap: " # baseUrl # "/sitemap.xml\n";
      return {
        status_code = 200 : Nat16;
        headers = [
          { name = "Content-Type"; value = "text/plain; charset=utf-8" },
          { name = "Cache-Control"; value = "public, max-age=86400" },
          { name = "Access-Control-Allow-Origin"; value = "*" },
        ];
        body = robots.encodeUtf8();
      };
    };

    {
      status_code = 404 : Nat16;
      headers = [{ name = "Content-Type"; value = "text/plain" }];
      body = "Not found".encodeUtf8();
    };
  };

  type Personality = {
    #encouraging;
    #witty;
    #calm;
    #playful;
  };

  module Personality {
    public func toText(personality : Personality) : Text {
      switch (personality) {
        case (#encouraging) { "encouraging" };
        case (#witty) { "witty" };
        case (#calm) { "calm" };
        case (#playful) { "playful" };
      };
    };
  };

  type UserProfile = {
    username : Text;
    xp : Nat;
    streakDays : Nat;
    level : Nat;
    lastActive : Int;
    companionName : Text;
    personality : Personality;
    completedTopics : [Text];
    badges : [Text];
    messagesSent : Nat;
    burnoutScore : Nat;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.username, b.username);
    };
  };

  type Question = {
    text : Text;
    answers : [Text];
    correctIndex : Nat;
    difficulty : Nat;
    xpReward : Nat;
    topic : Text;
  };

  module Question {
    public func compare(a : Question, b : Question) : Order.Order {
      Text.compare(a.topic, b.topic);
    };
  };

  type Message = {
    role : Text; // "user" or "companion"
    text : Text;
    timestamp : Int;
  };

  module Message {
    public func compare(a : Message, b : Message) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  // Existing state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let allQuestions = List.empty<Question>();
  let convoHistory = Map.empty<Principal, List.List<Message>>();

  // New domain state
  let enrollments = Map.empty<Principal, List.List<EnrollTypes.CourseId>>();
  let reviews = List.empty<ReviewTypes.Review>();
  let pendingVerifications = Map.empty<Text, EmailTypes.PendingVerification>();
  let notesMap = Map.empty<Principal, List.List<NoteTypes.Note>>();
  let articlesMap = Map.empty<Text, ArticleTypes.Article>();
  let experiencesMap = Map.empty<Text, ExperienceTypes.Experience>();
  let gcoinBalances = Map.empty<Principal, Nat>();
  let mockTestResultsMap = Map.empty<Principal, List.List<MockTestTypes.MockTestResult>>();

  // Follows state: two maps for O(log n) bidirectional lookup
  let followingMap = Map.empty<Principal, List.List<Principal>>();
  let followersMap = Map.empty<Principal, List.List<Principal>>();

  // Messaging state: keyed by conversationId (sorted pair of principal texts)
  let directMessagesMap = Map.empty<Text, List.List<MessagingTypes.DirectMessage>>();

  // Social-media state
  let reactionsStore     = Map.empty<Text, List.List<SocialMediaTypes.Reaction>>();
  let storiesStore       = List.empty<SocialMediaTypes.Story>();
  let savedMessagesStore = Map.empty<Principal, List.List<SocialMediaTypes.SavedMessage>>();
  let messageStatusStore = Map.empty<Text, SocialMediaTypes.MessageStatusRecord>();

  // Challenges state
  let challengesList = List.empty<ChallengeTypes.Challenge>();
  var challengeCounter = { var value : Nat = 0 };
  let seasonalMilestonesList = List.empty<ChallengeTypes.SeasonalMilestone>();

  // Include new domain mixins
  include EnrollmentApi(enrollments);
  include ReviewsApi(reviews);
  include EmailApi(pendingVerifications);
  include ProgressApi(userProfiles, enrollments);
  include AiProxyApi();
  include NotesApi(notesMap);
  include ArticlesApi(articlesMap);
  include ExperiencesApi(experiencesMap);
  include GCoinsApi(gcoinBalances);
  include MockTestsApi(mockTestResultsMap);
  include FollowsApi(followingMap, followersMap);
  include MessagingApi(directMessagesMap);
  include ChallengesApi(challengesList, challengeCounter, seasonalMilestonesList);
  include SocialMediaApi(reactionsStore, storiesStore, savedMessagesStore, messageStatusStore);

  // ── Existing methods (unchanged) ────────────────────────────────────────────

  public shared ({ caller }) func getOrCreateProfile(username : Text) : async UserProfile {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        let newProfile : UserProfile = {
          username;
          xp = 0;
          streakDays = 0;
          level = 1;
          lastActive = Time.now();
          companionName = "AI Buddy";
          personality = #encouraging;
          completedTopics = [];
          badges = [];
          messagesSent = 0;
          burnoutScore = 0;
        };
        userProfiles.add(caller, newProfile);
        newProfile;
      };
    };
  };

  public shared ({ caller }) func addMessage(role : Text, text : Text) : async () {
    let newMessage : Message = {
      role;
      text;
      timestamp = Time.now();
    };

    let currentHistory = switch (convoHistory.get(caller)) {
      case (?history) { history };
      case (null) { List.empty<Message>() };
    };

    currentHistory.add(newMessage);

    while (currentHistory.size() > 20) {
      ignore currentHistory.removeLast();
    };

    convoHistory.add(caller, currentHistory);
  };

  public query ({ caller }) func getHistory() : async [Message] {
    switch (convoHistory.get(caller)) {
      case (?history) {
        history.toArray().sort();
      };
      case (null) { [] };
    };
  };

  public query func getQuestionsByTopic(topic : Text) : async [Question] {
    allQuestions.toArray().filter(
      func(q) { q.topic == topic }
    );
  };

  public shared ({ caller }) func completeTopic(topicId : Text) : async () {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedTopics = profile.completedTopics.concat([topicId]);
        let updatedProfile = {
          profile with completedTopics = updatedTopics
        };
        userProfiles.add(caller, updatedProfile);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func awardBadge(badgeId : Text) : async () {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedBadges = profile.badges.concat([badgeId]);
        let updatedProfile = {
          profile with badges = updatedBadges
        };
        userProfiles.add(caller, updatedProfile);
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getAllStats() : async UserProfile {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("No profile found.") };
    };
  };

  public shared ({ caller }) func updateCompanion(name : Text, personality : Personality) : async () {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile = {
          profile with companionName = name; personality
        };
        userProfiles.add(caller, updatedProfile);
      };
      case (null) {};
    };
  };

  public shared func addSampleQuestions() : async () {
    let sampleQuestions = [
      {
        text = "What does CPU stand for?";
        answers = ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Control Processing Unit"];
        correctIndex = 0;
        difficulty = 1;
        xpReward = 10;
        topic = "Hardware";
      },
      {
        text = "Which language is primarily used for web development?";
        answers = ["Python", "Java", "HTML", "C++"];
        correctIndex = 2;
        difficulty = 1;
        xpReward = 10;
        topic = "Web Development";
      },
    ];

    for (q in sampleQuestions.vals()) {
      allQuestions.add(q);
    };
  };
};
