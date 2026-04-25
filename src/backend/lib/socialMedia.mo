import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import SocialMediaTypes "../types/socialMedia";
import MessagingTypes "../types/messaging";

/// Stateless social-media domain logic.
/// All mutable state is injected by the caller (main.mo via mixins).
module {

  // ── Reactions ────────────────────────────────────────────────────────────────

  /// Add an emoji reaction from userId to messageId.
  /// Store is keyed by messageId; value is the list of reactions for that message.
  public func addReaction(
    store    : Map.Map<Text, List.List<SocialMediaTypes.Reaction>>,
    messageId : Text,
    userId    : Principal,
    emoji     : Text,
  ) : () {
    Debug.todo()
  };

  /// Remove the reaction by userId on messageId (if it exists).
  public func removeReaction(
    store    : Map.Map<Text, List.List<SocialMediaTypes.Reaction>>,
    messageId : Text,
    userId    : Principal,
  ) : () {
    Debug.todo()
  };

  /// Return all reactions for a given messageId.
  public func getReactions(
    store    : Map.Map<Text, List.List<SocialMediaTypes.Reaction>>,
    messageId : Text,
  ) : [SocialMediaTypes.Reaction] {
    Debug.todo()
  };

  // ── Stories ──────────────────────────────────────────────────────────────────

  /// Create a new story for authorId. Returns the story record.
  public func createStory(
    store     : List.List<SocialMediaTypes.Story>,
    authorId  : Principal,
    mediaUrl  : Text,
    mediaType : Text,
    caption   : ?Text,
    storyId   : Text,
    now       : Int,
  ) : SocialMediaTypes.Story {
    Debug.todo()
  };

  /// Return all non-expired stories for a given userId (as viewer/consumer).
  /// "Active" means expiresAt > now.
  public func getActiveStories(
    store  : List.List<SocialMediaTypes.Story>,
    now    : Int,
  ) : [SocialMediaTypes.Story] {
    Debug.todo()
  };

  /// Increment view count and record viewerId for storyId. No-op if already viewed.
  public func viewStory(
    store    : List.List<SocialMediaTypes.Story>,
    storyId  : Text,
    viewerId : Principal,
  ) : () {
    Debug.todo()
  };

  /// Remove a story by storyId, only if authorId matches the stored authorId.
  public func deleteStory(
    store    : List.List<SocialMediaTypes.Story>,
    storyId  : Text,
    authorId : Principal,
  ) : () {
    Debug.todo()
  };

  // ── Saved messages ───────────────────────────────────────────────────────────

  /// Save a message for caller. No-op if already saved.
  public func saveMessage(
    store     : Map.Map<Principal, List.List<SocialMediaTypes.SavedMessage>>,
    caller    : Principal,
    messageId : Text,
    now       : Int,
  ) : () {
    Debug.todo()
  };

  /// Remove a saved message for caller.
  public func unsaveMessage(
    store     : Map.Map<Principal, List.List<SocialMediaTypes.SavedMessage>>,
    caller    : Principal,
    messageId : Text,
  ) : () {
    Debug.todo()
  };

  /// Return all saved message IDs for caller.
  public func getSavedMessages(
    store  : Map.Map<Principal, List.List<SocialMediaTypes.SavedMessage>>,
    caller : Principal,
  ) : [Text] {
    Debug.todo()
  };

  // ── Read receipts ────────────────────────────────────────────────────────────

  /// Mark a message as delivered. No-op if status is already read.
  public func markDelivered(
    store     : Map.Map<Text, SocialMediaTypes.MessageStatusRecord>,
    messageId : Text,
    now       : Int,
  ) : () {
    Debug.todo()
  };

  /// Return the delivery/read status for a given messageId.
  /// Returns #sent if no status record exists yet.
  public func getMessageStatus(
    store     : Map.Map<Text, SocialMediaTypes.MessageStatusRecord>,
    messageId : Text,
  ) : SocialMediaTypes.MessageStatus {
    Debug.todo()
  };

  /// Initialize a message status record as #sent when a message is first stored.
  public func initMessageStatus(
    store     : Map.Map<Text, SocialMediaTypes.MessageStatusRecord>,
    messageId : Text,
    now       : Int,
  ) : () {
    Debug.todo()
  };
};
