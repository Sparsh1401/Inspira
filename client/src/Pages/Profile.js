import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_MY_PINS } from '../GraphQL/Queries';
import { useAuth } from '../context/AuthContext';
import Pin from '../components/Pin';
import { Avatar } from '@mui/material';

function Profile() {
    const { user } = useAuth();
    const [userPins, setUserPins] = useState([]);
    
    const { data, loading, error } = useQuery(GET_MY_PINS, {
        variables: { userId: String(user?.id) },
        skip: !user,
    });

    useEffect(() => {
        if (data) {
            setUserPins(data.myPins);
        }
    }, [data]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>Loading...</div>;
    if (error) {
        console.error("Profile Query Error:", error);
        return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>Error loading profile: {error.message}</div>;
    }
    if (!user) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>Please login to view profile</div>;

    return (
        <Wrapper>
            <ProfileHeader>
                <Avatar 
                    src={user.avatar} 
                    alt={user.firstName}
                    sx={{ width: 120, height: 120, fontSize: 48, marginBottom: 2, bgcolor: '#efefef', color: '#333', fontWeight: 'bold' }}
                >
                    {user.firstName?.charAt(0)}
                </Avatar>
                <UserName>{user.firstName} {user.lastName}</UserName>
                <UserEmail>@{user.email.split('@')[0]}</UserEmail>
                <ButtonsWrapper>
                    <ActionButton>Share</ActionButton>
                    <ActionButton>Edit Profile</ActionButton>
                </ButtonsWrapper>
            </ProfileHeader>
            
            <PinsContainer>
                <TabWrapper>
                    <Tab active>Created</Tab>
                    <Tab>Saved</Tab>
                </TabWrapper>
                <PinGrid>
                    {userPins.map((pin, index) => (
                        <Pin key={index} urls={pin.imageUrl} />
                    ))}
                </PinGrid>
                {userPins.length === 0 && <NoPins>You haven't created any pins yet.</NoPins>}
            </PinsContainer>
        </Wrapper>
    );
}

export default Profile;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: white;
    padding-top: 30px;
`;

const ProfileHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
`;

const UserName = styled.h1`
    font-size: 36px;
    font-weight: 600;
    margin: 8px 0 4px;
    color: #111;
`;

const UserEmail = styled.p`
    font-size: 14px;
    color: #767676;
    margin: 0;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

const ActionButton = styled.button`
    background-color: #efefef;
    border: none;
    border-radius: 24px;
    padding: 12px 20px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    color: #111;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e2e2e2;
    }
`;

const PinsContainer = styled.div`
    width: 100%;
    max-width: 1360px;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TabWrapper = styled.div`
    display: flex;
    gap: 40px;
    margin-bottom: 30px;
`;

const Tab = styled.div`
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    padding-bottom: 8px;
    border-bottom: ${props => props.active ? '3px solid #111' : 'none'};
    color: ${props => props.active ? '#111' : '#767676'};
`;

const PinGrid = styled.div`
    width: 100%;
    column-count: 5;
    column-gap: 0px;
    
    @media (max-width: 1200px) {
        column-count: 4;
    }
    @media (max-width: 900px) {
        column-count: 3;
    }
    @media (max-width: 600px) {
        column-count: 2;
    }
`;

const NoPins = styled.div`
    text-align: center;
    font-size: 16px;
    color: #111;
    margin-top: 40px;
`;
