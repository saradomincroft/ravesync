import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    User: a
        .model({
            username: a.string().required(),
            email: a.string().required(),
            bio: a.string(),
            image: a.string(),
            followers: a.integer().default(0),
            following: a.integer().default(0),
            posts: a.integer().default(0),
            cognitoId: a.string().required(), // unique ID from AWS Cognito (auth)
            favouriteGenres: a.string().array(),
            favouriteLocations: a.string().array(),
            isPrivate: a.boolean().default(false),
        })
        .authorization((allow) => [
            allow.owner(), // this means user who create this record (own profile) can do all CRUD
            allow.authenticated().to(['read']),
        ])
        .secondaryIndexes((index) => [
            index('cognitoId'),
            index('username'),
            index('email'),
        ]),

    Genre: a
        .model({
            name: a.string().required(),
            description: a.string(),
        })
        .authorization((allow) => [
            allow.authenticated().to(['read']),
        ]),

    Location: a
        .model({
            name: a.string().required(),
        })
        .authorization((allow) => [
            allow.authenticated().to(['read']),
        ]),
    
    Follow: a
        .model({
            followerId: a.string().required(),
            followingId: a.string().required(),
            followerUsername: a.string(),
            followingUsername: a.string(),
            status: a.string().default('accepted'),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read']),
        ])
        .secondaryIndexes((index) => [
            index('followerId'),
            index('followingId'),
        ]),
    
    FollowRequest: a
        .model({
            requesterId: a.string().required(),
            requestedId: a.string().required(),
            requesterUsername: a.string(),
            status: a.string().default('pending'),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read']),
        ])
        .secondaryIndexes((index) => [
            index('requesterId'),
            index('requestedId'),
            index('status'),
        ]),

    Block: a
        .model({
            blockerId: a.string().required(),
            blockedId: a.string().required(),
            blockerUsername: a.string(),
            blockedUsername: a.string(),
        })
        .authorization((allow) => [
            allow.owner(),
        ])
        .secondaryIndexes((index) => [
            index('blockerId'),
            index('blockedId'),
        ]),

    Notification: a
        .model({
            receiverId: a.string().required(),
            senderId: a.string().required(),
            type: a.string().required(),
            read: a.boolean().default(false),
            postId: a.string(),
            commentId: a.string(),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read']),
        ])
        .secondaryIndexes((index) => [
            index('receiverId'),
            index('senderId'),
            index('postId'),
        ]),

    Post: a
        .model({
            userId: a.string().required(),
            imageUrl: a.string(),
            videoUrl: a.string(),
            storageId: a.string(),
            caption: a.string(),
            likes: a.integer().default(0),
            comments: a.integer().default(0),
            genreId: a.string(),
            locationId: a.string(),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read', 'create'])
        ])
        .secondaryIndexes((index) => [
            index('userId'),
            index('genreId'),
            index('locationId'),
        ]),

    Bookmark: a
        .model({
            userId: a.string().required(),
            postId: a.string().required(),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read']),
        ])
        .secondaryIndexes((index) => [
            index('userId'),
            index('postId'),
        ]),

    Like: a
        .model({
            postId: a.string().required(),
            userId: a.string().required(),
            username: a.string(),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read']),
        ])
        .secondaryIndexes((index) => [
            index('postId'),
            index('userId'),
        ]),

    Comment: a
        .model({
            postId: a.string().required(),
            userId: a.string().required(),
            content: a.string().required(),
        })
        .authorization((allow) => [
            allow.owner(),
            allow.authenticated().to(['read', 'create']),
        ])
        .secondaryIndexes((index) => [
            index('postId'),
            index('userId'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    },
});