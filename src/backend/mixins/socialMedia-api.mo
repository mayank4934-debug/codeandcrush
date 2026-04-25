import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import SocialMediaTypes "../types/socialMedia";
import SocialMediaLib "../lib/socialMedia";

/// Public API surface for the social-media domain.
/// Injected state slices:
///   reactionsStore   – Map<messageId, List<Reaction>>
///   storiesStore     – List<Story>
///   savedMessagesStore – Map<Principal, List<SavedMessage>>
///   messageStatusStore – Map<messageId, MessageStatusRecord>
mixin (
  reactionsStore       : Map.Map<Text, List.List<SocialMediaTypes.Reaction>>,
  storiesStore         : List.List<SocialMediaTypes.Story>,
  savedMessagesStore   : Map.Map<Principal, List.List<SocialMediaTypes.SavedMessage>>,
  messageStatusStore   : Map.Map<Text, SocialMediaTypes.MessageStatusRecord>,
) {

  // ── Reactions ────────────────────────────────────────────────────────────────

  /// Add an emoji reaction to a message.
  public shared ({ caller }) func addReaction(messageId : Text, emoji : Text) : async () {
    Debug.todo()
  };

  /// Remove caller's reaction from a message.
  public shared ({ caller }) func removeReaction(messageId : Text) : async () {
    Debug.todo()
  };

  /// Get all reactions for a given message.
  public query func getReactions(messageId : Text) : async [SocialMediaTypes.Reaction] {
    Debug.todo()
  };

  // ── Stories ──────────────────────────────────────────────────────────────────

  /// Create a new 24-hour story.
  public shared ({ caller }) func createStory(
    mediaUrl  : Text,
    mediaType : Text,
    caption   : ?Text,
  ) : async SocialMediaTypes.Story {
    Debug.todo()
  };

  /// Get all currently active (non-expired) stories.
  public query func getActiveStories() : async [SocialMediaTypes.Story] {
    Debug.todo()
  };

  /// Record that the caller has viewed a story.
  public shared ({ caller }) func viewStory(storyId : Text) : async () {
    Debug.todo()
  };

  /// Delete a story (only the author may delete their own story).
  public shared ({ caller }) func deleteStory(storyId : Text) : async () {
    Debug.todo()
  };

  // ── Saved messages ───────────────────────────────────────────────────────────

  /// Bookmark a message by ID.
  public shared ({ caller }) func saveMessage(messageId : Text) : async () {
    Debug.todo()
  };

  /// Remove a bookmarked message.
  public shared ({ caller }) func unsaveMessage(messageId : Text) : async () {
    Debug.todo()
  };

  /// Return all saved message IDs for the caller.
  public query ({ caller }) func getSavedMessages() : async [Text] {
    Debug.todo()
  };

  // ── Read receipts ────────────────────────────────────────────────────────────

  /// Mark a specific message as delivered.
  public shared func markDelivered(messageId : Text) : async () {
    Debug.todo()
  };

  /// Get the current status of a message (sent / delivered / read).
  public query func getMessageStatus(messageId : Text) : async SocialMediaTypes.MessageStatus {
    Debug.todo()
  };
};
