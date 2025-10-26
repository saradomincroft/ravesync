import { generateClient } from 'aws-amplify/data';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

export const userService = {
  /**
   * Create a new user (called after Cognito signup)
   */
  async createUser(params: {
    username: string;
    email: string;
    bio?: string;
    image?: string;
  }) {
    try {
      const session = await fetchAuthSession();
      const cognitoId = session.tokens?.idToken?.payload.sub as string;

      if (!cognitoId) {
        throw new Error("User not authenticated");
      }

      const username = params.email.split('@')[0];
      const userImage = params.image || "../assets/images/default-user.svg";

      // Check if user already exists by cognitoId
      const { data: existingUsers } = await client.models.User.list({
        filter: { cognitoId: { eq: cognitoId } }
      });

      if (existingUsers && existingUsers.length > 0) {
        return existingUsers[0];
      }

      // Check email uniqueness
      const { data: emailCheck } = await client.models.User.list({
        filter: { email: { eq: params.email } }
      });

      if (emailCheck && emailCheck.length > 0) {
        throw new Error("Email is already in use");
      }

      // Create user
      const { data: newUser, errors } = await client.models.User.create({
        username,
        email: params.email,
        bio: params.bio,
        image: userImage,
        followers: 0,
        following: 0,
        posts: 0,
        favouriteGenres: [],
        favouriteLocations: [],
        isPrivate: false,
        cognitoId,
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Get user by Cognito ID
   */
  async getUserByCognitoId(cognitoId: string) {
    try {
      const { data: users } = await client.models.User.list({
        filter: { cognitoId: { eq: cognitoId } }
      });
      return users?.[0] || null;
    } catch (error) {
      console.error('Error getting user by cognitoId:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user (replaces getAuthenticatedUser)
   */
  async getCurrentUser() {
    try {
      const session = await fetchAuthSession();
      const cognitoId = session.tokens?.idToken?.payload.sub as string;
      
      if (!cognitoId) {
        throw new Error("User not authenticated");
      }

      const user = await this.getUserByCognitoId(cognitoId);
      
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(params: {
    username: string;
    bio?: string;
    image?: string;
  }) {
    try {
      const currentUser = await this.getCurrentUser();
      const normalizedUsername = params.username.toLowerCase();

      // Username validation
      if (normalizedUsername !== currentUser.username) {
        if (normalizedUsername.length > 16) {
          throw new Error("Username must be 16 characters or less.");
        }
        
        if (/\s/.test(normalizedUsername)) {
          throw new Error("Username cannot contain spaces.");
        }

        // Check username availability
        const { data: existingUsers } = await client.models.User.list({
          filter: { username: { eq: normalizedUsername } }
        });

        if (existingUsers && existingUsers.length > 0) {
          throw new Error("Username already taken");
        }
      }

      const updateData: any = {
        username: params.username,
        bio: params.bio,
      };

      if (params.image === null || params.image === "") {
        updateData.image = "../assets/images/default-user.svg";
      } else if (params.image) {
        updateData.image = params.image;
      }

      const { data: updatedUser, errors } = await client.models.User.update({
        id: currentUser.id,
        ...updateData,
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    try {
      const { data: user, errors } = await client.models.User.get({ id: userId });
      
      if (errors) {
        throw new Error(errors[0].message);
      }
      
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  /**
   * Get all users
   */
  async getAllUsers() {
    try {
      const { data: users } = await client.models.User.list();
      return users || [];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  /**
   * Check if current user is following another user
   */
  async isFollowing(followingId: string) {
    try {
      const currentUser = await this.getCurrentUser();

      const { data: follows } = await client.models.Follow.list({
        filter: {
          and: [
            { followerId: { eq: currentUser.id } },
            { followingId: { eq: followingId } }
          ]
        }
      });

      return follows && follows.length > 0;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  },

  /**
   * Toggle follow/unfollow
   */
  async toggleFollow(followingId: string) {
    try {
      const currentUser = await this.getCurrentUser();
      const targetUser = await this.getUserProfile(followingId);

      // Check if already following
      const { data: existingFollow } = await client.models.Follow.list({
        filter: {
          and: [
            { followerId: { eq: currentUser.id } },
            { followingId: { eq: followingId } }
          ]
        }
      });

      if (existingFollow && existingFollow.length > 0) {
        // Unfollow
        await client.models.Follow.delete({ id: existingFollow[0].id });
        await this.updateFollowCounts(currentUser.id, followingId, false);
        return false;
      } else {
        // Check if target user has private account
        if (targetUser.isPrivate) {
          // Create follow request instead
          const { errors } = await client.models.FollowRequest.create({
            requesterId: currentUser.id,
            requestedId: followingId,
            requesterUsername: currentUser.username,
            status: 'pending',
          });

          if (errors) throw new Error(errors[0].message);

          // Create notification
          await client.models.Notification.create({
            receiverId: followingId,
            senderId: currentUser.id,
            type: "follow_request",
            read: false,
          });

          return 'pending';
        } else {
          // Public account - follow immediately
          const { errors } = await client.models.Follow.create({
            followerId: currentUser.id,
            followingId: followingId,
            followerUsername: currentUser.username,
            followingUsername: targetUser.username,
            status: 'accepted',
          });

          if (errors) throw new Error(errors[0].message);
          
          await this.updateFollowCounts(currentUser.id, followingId, true);

          // Create notification
          await client.models.Notification.create({
            receiverId: followingId,
            senderId: currentUser.id,
            type: "follow",
            read: false,
          });

          return true;
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  },

  /**
   * Update follower/following counts
   */
  async updateFollowCounts(followerId: string, followingId: string, isFollow: boolean) {
    try {
      const [follower, following] = await Promise.all([
        this.getUserProfile(followerId),
        this.getUserProfile(followingId),
      ]);

      if (follower && following) {
        await Promise.all([
          client.models.User.update({
            id: followerId,
            following: (follower.following || 0) + (isFollow ? 1 : -1),
          }),
          client.models.User.update({
            id: followingId,
            followers: (following.followers || 0) + (isFollow ? 1 : -1),
          }),
        ]);
      }
    } catch (error) {
      console.error('Error updating follow counts:', error);
      throw error;
    }
  },

  /**
   * Get users that current user follows
   */
  async getFollowedUsers() {
    try {
      const currentUser = await this.getCurrentUser();

      const { data: follows } = await client.models.Follow.list({
        filter: { followerId: { eq: currentUser.id } }
      });

      if (!follows || follows.length === 0) return [];

      const followedUserIds = follows.map(f => f.followingId);
      
      // Get all users and filter
      const { data: allUsers } = await client.models.User.list();
      const followedUsers = allUsers?.filter(user => followedUserIds.includes(user.id)) || [];

      return followedUsers;
    } catch (error) {
      console.error('Error getting followed users:', error);
      return [];
    }
  },

  /**
   * Toggle privacy setting
   */
  async togglePrivacy() {
    try {
      const currentUser = await this.getCurrentUser();

      const { data: updatedUser, errors } = await client.models.User.update({
        id: currentUser.id,
        isPrivate: !currentUser.isPrivate,
      });

      if (errors) throw new Error(errors[0].message);

      return updatedUser;
    } catch (error) {
      console.error('Error toggling privacy:', error);
      throw error;
    }
  },
};