import { ServerConversationArea } from '../client/TownsServiceClient';
import { ChatMessage } from '../CoveyTypes';
import Player from './Player';
import { Post } from './PostTown/post';
import { CommentTree } from './PostTown/comment';

/**
 * A listener for player-related events in each town
 */
export default interface CoveyTownListener {
  /**
   * Called when a player joins a town
   * @param newPlayer the new player
   */
  onPlayerJoined(newPlayer: Player): void;

  /**
   * Called when a player's location changes
   * @param movedPlayer the player that moved
   */
  onPlayerMoved(movedPlayer: Player): void;

  /**
   * Called when a player disconnects from the town
   * @param removedPlayer the player that disconnected
   */
  onPlayerDisconnected(removedPlayer: Player): void;

  /**
   * Called when a town is destroyed, causing all players to disconnect
   */
  onTownDestroyed(): void;

  /**
   * Called when a conversation area is created or updated
   * @param conversationArea the conversation area that is updated or created
   */
  onConversationAreaUpdated(conversationArea: ServerConversationArea): void;

  /**
   * Called when a conversation area is destroyed
   * @param conversationArea the conversation area that has been destroyed
   */
  onConversationAreaDestroyed(conversationArea: ServerConversationArea): void;

  /**
   * Called when a chat message is received from a user
   * @param message the new chat message
   */
  onChatMessage(message: ChatMessage): void;

  /**
   * Called when a post is created by a user
   * @param post the new post
   */
  onPostCreate(post: Post): void;

  /**
  * Called when a post is updated by a user
  * @param post the updated post
  */
  onPostUpdate(post: Post): void;

  /**
   * Called when a post is deleted by a user
   * @param post the deleted post
   */
  onPostDelete(post: Post): void;


  /**
   * Called when a comment is created/deleted/created
   * @param postID the root post id of the updated comment
   * @param comments the comments tree for the post with the given post id
   */
  onCommentUpdate(postId: string, comments: CommentTree[]): void;
}
