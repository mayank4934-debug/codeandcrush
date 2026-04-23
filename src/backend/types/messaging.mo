import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  /// A single direct message between two users
  public type DirectMessage = {
    id : Text;
    senderId : Principal;
    receiverId : Principal;
    content : Text;
    timestamp : Timestamp;
    read : Bool;
  };

  /// A conversation summary shown in the inbox list
  public type Conversation = {
    participants : [Principal];
    lastMessage : DirectMessage;
    unreadCount : Nat;
  };

  /// A full thread of messages between two users, keyed by conversationId
  public type MessageThread = {
    conversationId : Text;
    messages : [DirectMessage];
  };
};
