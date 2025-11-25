import {gql} from '@apollo/client'

const CREATE_PIN = gql`
    mutation createPin($title: String, $imageUrl: String, $description: String, $link: String, $userId: String){
        createPin(title: $title, imageUrl: $imageUrl, description: $description, link: $link, userId: $userId){
            title
            imageUrl
            description
            userId
        }
    }
`

// const DELETE_PIN = gql`
//     mutatiaon{
        
//     }
// `

const CREATE_BOARD = gql`
    mutation createBoard($title: String, $description: String, $ownerId: String) {
        createBoard(title: $title, description: $description, ownerId: $ownerId) {
            id
            title
            description
            ownerId
        }
    }
`

const ADD_COLLABORATOR = gql`
    mutation addCollaborator($boardId: ID!, $email: String) {
        addCollaborator(boardId: $boardId, email: $email) {
            id
            collaborators
        }
    }
`

const ADD_PIN_TO_BOARD = gql`
    mutation addPinToBoard($boardId: ID!, $pinId: ID!) {
        addPinToBoard(boardId: $boardId, pinId: $pinId) {
            id
        }
    }
`

export {CREATE_PIN, CREATE_BOARD, ADD_COLLABORATOR, ADD_PIN_TO_BOARD} ;