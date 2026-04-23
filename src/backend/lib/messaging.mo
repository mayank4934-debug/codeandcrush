import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import MessagingTypes "../types/messaging";

/// Stateless messaging domain logic.
/// All state is injected via the directMessagesMap parameter.
/// conversationId = sorted concat of two Principal texts joined with ":"
module {

  /// Derive a deterministic conversation ID from two principals.
  public func conversationId(a : Principal, b : Principal) : Text {
    let ta = a.toText();
    let tb = b.toText();
    if (ta.less(tb)) { ta # ":" # tb } else { tb # ":" # ta };
  };

  /// Store a new message. Returns the generated message id.
  public func sendMessage(
    store : Map.Map<Text, List.List<MessagingTypes.DirectMessage>>,
    sender : Principal,
    receiver : Principal,
    content : Text,
    msgId : Text,
  ) : Text {
    let cid = conversationId(sender, receiver);
    let msg : MessagingTypes.DirectMessage = {
      id = msgId;
      senderId = sender;
      receiverId = receiver;
      content;
      timestamp = Time.now();
      read = false;
    };
    let thread = switch (store.get(cid)) {
      case (?list) list;
      case null List.empty<MessagingTypes.DirectMessage>();
    };
    thread.add(msg);
    store.add(cid, thread);
    msgId;
  };

  /// Return all messages between two users (caller and otherUser), sorted by timestamp.
  public func getMessages(
    store : Map.Map<Text, List.List<MessagingTypes.DirectMessage>>,
    caller : Principal,
    otherUser : Principal,
  ) : [MessagingTypes.DirectMessage] {
    let cid = conversationId(caller, otherUser);
    switch (store.get(cid)) {
      case (?list) {
        let arr = list.toArray();
        func dmCompare(a : MessagingTypes.DirectMessage, b : MessagingTypes.DirectMessage) : { #less; #equal; #greater } {
          Int.compare(a.timestamp, b.timestamp)
        };
        arr.sort(dmCompare);
      };
      case null [];
    };
  };

  /// Mark all messages sent by otherUser to caller as read.
  public func markRead(
    store : Map.Map<Text, List.List<MessagingTypes.DirectMessage>>,
    caller : Principal,
    otherUser : Principal,
  ) {
    let cid = conversationId(caller, otherUser);
    switch (store.get(cid)) {
      case (?list) {
        list.mapInPlace(func(msg) {
          if (Principal.equal(msg.receiverId, caller) and not msg.read) {
            { msg with read = true }
          } else {
            msg
          }
        });
      };
      case null {};
    };
  };

  /// Count total unread messages across all conversations for caller.
  public func countUnread(
    store : Map.Map<Text, List.List<MessagingTypes.DirectMessage>>,
    caller : Principal,
  ) : Nat {
    var total : Nat = 0;
    for ((_, list) in store.entries()) {
      list.forEach(func(msg) {
        if (Principal.equal(msg.receiverId, caller) and not msg.read) {
          total += 1;
        };
      });
    };
    total;
  };

  /// Build the list of Conversation summaries for the caller.
  public func getConversations(
    store : Map.Map<Text, List.List<MessagingTypes.DirectMessage>>,
    caller : Principal,
  ) : [MessagingTypes.Conversation] {
    let result = List.empty<MessagingTypes.Conversation>();

    for ((_, list) in store.entries()) {
      // Only include threads where caller is a participant
      let msgs = list.toArray();
      if (msgs.size() == 0) { } else {
        let first = msgs[0];
        if (Principal.equal(first.senderId, caller) or Principal.equal(first.receiverId, caller)) {
          let lastMsg = switch (list.last()) {
            case (?m) m;
            case null first;
          };
          let unread = list.foldLeft(0, func(acc : Nat, msg : MessagingTypes.DirectMessage) : Nat {
            if (Principal.equal(msg.receiverId, caller) and not msg.read) {
              acc + 1
            } else {
              acc
            }
          });
          let other = if (Principal.equal(first.senderId, caller)) {
            first.receiverId
          } else {
            first.senderId
          };
          result.add({
            participants = [caller, other];
            lastMessage = lastMsg;
            unreadCount = unread;
          });
        };
      };
    };

    result.toArray();
  };
};
