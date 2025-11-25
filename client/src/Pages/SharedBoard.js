import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOARD } from '../GraphQL/Queries';
import { ADD_COLLABORATOR } from '../GraphQL/Mutation';
import Pin from '../components/Pin';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function SharedBoard() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_BOARD, {
        variables: { id }
    });
    const [addCollaborator] = useMutation(ADD_COLLABORATOR);
    const [email, setEmail] = useState('');
    const [showAddCollab, setShowAddCollab] = useState(false);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { title, description, pins, collaborators } = data.getBoard;
    const collabList = JSON.parse(collaborators || "[]");

    const handleAddCollaborator = async () => {
        if (!email) return;
        try {
            await addCollaborator({
                variables: { boardId: id, email }
            });
            setEmail('');
            setShowAddCollab(false);
            alert('Collaborator added!');
        } catch (err) {
            console.error(err);
            alert('Failed to add collaborator');
        }
    };

    return (
        <Wrapper>
            <Header>
                <Title>{title}</Title>
                <Description>{description}</Description>
                <Collaborators>
                    <CollabTitle>Collaborators:</CollabTitle>
                    {collabList.map((email, index) => (
                        <CollabBadge key={index}>{email}</CollabBadge>
                    ))}
                    <IconButton onClick={() => setShowAddCollab(!showAddCollab)}>
                        <PersonAddIcon />
                    </IconButton>
                </Collaborators>
                {showAddCollab && (
                    <AddCollabForm>
                        <Input 
                            type="email" 
                            placeholder="Friend's Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <Button onClick={handleAddCollaborator}>Add</Button>
                    </AddCollabForm>
                )}
            </Header>

            <Container>
                {pins && pins.map((pin) => (
                    <Pin key={pin.id} urls={pin.imageUrl} />
                ))}
            </Container>
        </Wrapper>
    );
}

export default SharedBoard;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: white;
    min-height: 100vh;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;
    max-width: 800px;
`;

const Title = styled.h1`
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 10px;
`;

const Description = styled.p`
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
    text-align: center;
`;

const Collaborators = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
`;

const CollabTitle = styled.span`
    font-weight: 600;
    color: #333;
`;

const CollabBadge = styled.div`
    background-color: #e9e9e9;
    padding: 5px 10px;
    border-radius: 16px;
    font-size: 14px;
    color: #333;
`;

const AddCollabForm = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const Input = styled.input`
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #ddd;
    outline: none;
    width: 200px;

    &:focus {
        border-color: #0074e8;
    }
`;

const Button = styled.button`
    background-color: #e60023;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #ad081b;
    }
`;

const Container = styled.div`
    column-count: 5;
    column-gap: 10px;
    margin: 0 auto;
    height: 100%;
    max-width: 1260px;
    background-color: white;

    @media (max-width: 1200px) {
        column-count: 4;
    }
    @media (max-width: 992px) {
        column-count: 3;
    }
    @media (max-width: 768px) {
        column-count: 2;
    }
`;
