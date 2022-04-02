import { TownJoinResponse, TownCreateRequest, TownDeleteRequest } from "./CoveyTownRequestHandlers";
import Player from "../types/Player";
import Post from "../types/Post";
import Comment from "../types/Comment";

export interface PostTownJoinResponse extends TownJoinResponse {
    /** Owner of the town * */
    owner: Player;
    /** Adminstrators of the town * */ 
    adminstrators: Player[];
    /** List of Post Ids of this town * */
    posts: String[];
}

export interface PostTownUpdateRequest extends TownCreateRequest {
    username: String;
}

export interface PostTwonDeleteRequest extends TownDeleteRequest {
    username: String;
}

export interface PostUpdateRequest {
    coveyTown: string;
    sessionToken: string;
    post: Post;
}

export interface CommentUpdateRequest {
    coveyTown: string;
    sessionToken: string;
    comment: Comment;
}

export interface AdminstratorUpdateRequest {
    sessionToken: string;
    player: Player;
}

export interface PostRequest {
    coveyTown: string;
    sessionToken: string;
    postId: string;
}

export interface PostIdsResponse {
    postIDs: string[];
}

export interface PostContentResponse {
    post: Post;
    comments: Comment[];
}