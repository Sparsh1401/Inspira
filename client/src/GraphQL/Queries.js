import {gql} from '@apollo/client';

const GET_MY_PINS = gql`
    query mypins($userId: ID!){
        myPins(userId: $userId){
            title
            description
            imageUrl
            userId
        }
    }
`

const GET_LATEST_PINS = gql`
    query {
    latestPins{
        id
        title
        description
        imageUrl
        userId
    }
}
`;

const GET_SAVED_PINS = gql`
    query getsavedpins($googleId: String){
        getSavedPins(googleId: $googleId){
            id
            title
            description
            imageUrl
            link
        }
    }
`

const GET_PIN_DETAILS = gql`
    query getPin($id: ID!) {
        getPin(id: $id) {
            id
            imageUrl
            title
            description
            link
            user {
                id
                firstName
                lastName
                avatar
                email
            }
        }
    }
`

const GET_BOARDS = gql`
    query getBoards($userId: ID!) {
        getBoards(userId: $userId) {
            id
            title
            description
            ownerId
            collaborators
        }
    }
`

const GET_BOARD = gql`
    query getBoard($id: ID!) {
        getBoard(id: $id) {
            id
            title
            description
            ownerId
            collaborators
            pins {
                id
                imageUrl
                title
                description
            }
        }
    }
`

const IS_FOLLOWING = gql`
    query isFollowing($followerId: ID, $followingId: ID) {
        isFollowing(followerId: $followerId, followingId: $followingId)
    }
`

const GET_FOLLOWER_COUNT = gql`
    query getFollowerCount($userId: ID) {
        getFollowerCount(userId: $userId)
    }
`

export {GET_MY_PINS, GET_LATEST_PINS, GET_SAVED_PINS, GET_PIN_DETAILS, GET_BOARDS, GET_BOARD, IS_FOLLOWING, GET_FOLLOWER_COUNT};