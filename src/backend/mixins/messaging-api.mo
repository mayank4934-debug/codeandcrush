import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MessagingTypes "../types/messaging";
import MessagingLib "../lib/messaging";

mixin (
  directMessagesMap : Map.Map<Text, List.List<MessagingTypes.DirectMessage>>,
) {

  /// Internal counter for generating unique message IDs.
  var _msgCounter : Nat = 0;

  /// Send a direct message to another user. Returns the new message ID.
  public shared ({ caller }) func sendDirectMessage(
    receiverId : Principal,
    content : Text,
  ) : async Text {
    _msgCounter += 1;
    let msgId = caller.toText() # "-" # _msgCounter.toText();
    MessagingLib.sendMessage(directMessagesMap, caller, receiverId, content, msgId);
  };

  /// Get all conversations (inbox) for the caller, sorted by last message time.
  public query ({ caller }) func getConversations() : async [MessagingTypes.Conversation] {
    MessagingLib.getConversations(directMessagesMap, caller);
  };

  /// Get all messages exchanged between the caller and another user.
  public query ({ caller }) func getMessages(otherUser : Principal) : async [MessagingTypes.DirectMessage] {
    MessagingLib.getMessages(directMessagesMap, caller, otherUser);
  };

  /// Mark all messages from otherUser to caller as read.
  public shared ({ caller }) func markMessagesRead(otherUser : Principal) : async () {
    MessagingLib.markRead(directMessagesMap, caller, otherUser);
  };

  /// Get the total count of unread messages across all conversations.
  public query ({ caller }) func getUnreadCount() : async Nat {
    MessagingLib.countUnread(directMessagesMap, caller);
  };
};
