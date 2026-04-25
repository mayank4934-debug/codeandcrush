import Common "common";

/// Social media domain types: media messages, reactions, stories, saved messages, read receipts.
module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  /// Supported media attachment types
  public type MediaType = {
    #photo;
    #video;
    #document;
  };

  /// Rich media attachment that can be included in a DirectMessage
  public type MediaMessage = {
    mediaUrl   : Text;
    mediaType  : MediaType;
    caption    : ?Text;
    thumbnail  : ?Text;
  };

  /// Message delivery/read status
  public type MessageStatus = {
    #sent;
    #delivered;
    #read;
  };

  /// Status record stored per message id
  public type MessageStatusRecord = {
    messageId : Text;
    status    : MessageStatus;
    updatedAt : Timestamp;
  };

  /// Emoji reaction on a specific message
  public type Reaction = {
    messageId : Text;
    userId    : Principal;
    emoji     : Text;
    timestamp : Timestamp;
  };

  /// A 24-hour story posted by a user
  public type Story = {
    id        : Text;
    authorId  : Principal;
    mediaUrl  : Text;
    mediaType : Text;
    caption   : ?Text;
    createdAt : Timestamp;
    expiresAt : Timestamp;  // createdAt + 86_400_000_000_000 nanoseconds
    viewCount : Nat;
    viewerIds : [Principal];
  };

  /// A bookmarked message reference stored per user
  public type SavedMessage = {
    messageId : Text;
    savedAt   : Timestamp;
  };
};
