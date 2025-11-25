import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOARDS } from '../GraphQL/Queries';
import { CREATE_BOARD } from '../GraphQL/Mutation';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

function Boards() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { loading, error, data, refetch } = useQuery(GET_BOARDS, {
        variables: { userId: user?.id },
        skip: !user
    });
    const [createBoard] = useMutation(CREATE_BOARD);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!user) return <p>Please login to view boards.</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        try {
            await createBoard({
                variables: {
                    title,
                    description,
                    ownerId: user.id
                }
            });
            setTitle('');
            setDescription('');
            setShowCreateForm(false);
            refetch();
        } catch (err) {
            console.error(err);
            alert('Failed to create board');
        }
    };

    return (
        <Wrapper>
            <Header>
                <Title>Shared Boards</Title>
                <CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>
                    <AddIcon /> Create Board
                </CreateButton>
            </Header>

            {showCreateForm && (
                <Form onSubmit={handleCreateBoard}>
                    <Input 
                        type="text" 
                        placeholder="Board Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                    <Input 
                        type="text" 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <SubmitButton type="submit">Create</SubmitButton>
                </Form>
            )}

            <BoardGrid>
                {data.getBoards.map((board) => (
                    <BoardCard key={board.id} onClick={() => navigate(`/board/${board.id}`)}>
                        <BoardTitle>{board.title}</BoardTitle>
                        <BoardDesc>{board.description}</BoardDesc>
                        <BoardMeta>
                            {board.ownerId === user.id ? 'Owner' : 'Collaborator'}
                        </BoardMeta>
                    </BoardCard>
                ))}
            </BoardGrid>
        </Wrapper>
    );
}

export default Boards;

const Wrapper = styled.div`
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: 700;
`;

const CreateButton = styled.button`
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: #e60023;
    color: white;
    border: none;
    border-radius: 24px;
    padding: 10px 20px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #ad081b;
    }
`;

const Form = styled.form`
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 16px;
`;

const Input = styled.input`
    padding: 10px 15px;
    border-radius: 20px;
    border: 1px solid #ddd;
    outline: none;
    flex: 1;

    &:focus {
        border-color: #0074e8;
    }
`;

const SubmitButton = styled.button`
    background-color: #333;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #000;
    }
`;

const BoardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
`;

const BoardCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }
`;

const BoardTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 5px;
`;

const BoardDesc = styled.p`
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
`;

const BoardMeta = styled.span`
    font-size: 12px;
    background: #e9e9e9;
    padding: 4px 8px;
    border-radius: 10px;
    color: #555;
`;
