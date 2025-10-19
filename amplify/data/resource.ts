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
            imageUrl: a.string(),
        })
        .authorization((allow) => [
            allow.authenticated().to(['read']),
        ])
})