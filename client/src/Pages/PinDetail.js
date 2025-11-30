import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PIN_DETAILS, GET_SAVED_PINS, IS_FOLLOWING, GET_FOLLOWER_COUNT } from '../GraphQL/Queries';
import { SAVE_PIN, FOLLOW_USER, UNFOLLOW_USER } from '../GraphQL/Mutation';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '../components/Modal';
import { useState } from 'react';

function PinDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [savePin, { loading: saving }] = useMutation(SAVE_PIN);
    const [followUser, { loading: following }] = useMutation(FOLLOW_USER);
    const [unfollowUser, { loading: unfollowing }] = useMutation(UNFOLLOW_USER);
    const [modalState, setModalState] = useState({ 
        isOpen: false, 
        title: '', 
        message: '' 
    });

    const { data: savedData, refetch: refetchSaved } = useQuery(GET_SAVED_PINS, {
        variables: { googleId: user?.googleId },
        skip: !user || !user.googleId,
    });

    const { data, loading, error } = useQuery(GET_PIN_DETAILS, {
        variables: { id }
    });

    const pin = data?.getPin;
    const creatorId = pin?.user?.id;

    const { data: followData, refetch: refetchFollow } = useQuery(IS_FOLLOWING, {
        variables: { 
            followerId: user?.id, 
            followingId: creatorId 
        },
        skip: !user || !user.id || !creatorId || user.id === creatorId,
    });

    const { data: followerCountData, refetch: refetchFollowerCount } = useQuery(GET_FOLLOWER_COUNT, {
        variables: { userId: creatorId },
        skip: !creatorId,
    });

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>Loading...</div>;
    if (error) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>Error loading pin</div>;
    if (!data?.getPin) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>Pin not found</div>;

    const isSaved = savedData?.getSavedPins?.some(p => p.imageUrl === pin?.imageUrl);
    const isFollowing = followData?.isFollowing || false;
    const followerCount = followerCountData?.getFollowerCount || 0;
    const isOwnPin = user?.id?.toString() === creatorId?.toString();

    const handleSavePin = async () => {
        console.log("handleSavePin called");
        console.log("User:", user);
        console.log("isSaved:", isSaved);
        
        if (!user) {
            console.log("User not logged in, showing modal");
            setModalState({ isOpen: true, title: 'Login Required', message: 'Please login to save pins.' });
            return;
        }
        if (!user.googleId) {
            console.error("User missing googleId:", user);
            setModalState({ isOpen: true, title: 'Error', message: 'User account missing Google ID. Cannot save.' });
            return;
        }
        if (isSaved) {
            console.log("Pin already saved, returning");
            return;
        }

        try {
            console.log("Attempting to save pin with variables:", { googleId: user.googleId, imageUrl: pin.imageUrl });
            await savePin({
                variables: {
                    googleId: user.googleId,
                    imageUrl: pin.imageUrl
                }
            });
            await refetchSaved();
            setModalState({ isOpen: true, title: 'Success', message: 'Pin saved to your profile!' });
        } catch (err) {
            console.error("Error saving pin:", err);
            setModalState({ isOpen: true, title: 'Error', message: 'Failed to save pin.' });
        }
    };

    const handleFollow = async () => {
        if (!user) {
            setModalState({ isOpen: true, title: 'Login Required', message: 'Please login to follow users.' });
            return;
        }
        if (!user.id) {
            setModalState({ isOpen: true, title: 'Error', message: 'User account missing ID. Cannot follow.' });
            return;
        }
        if (isOwnPin) {
            return; // Can't follow yourself
        }

        try {
            if (isFollowing) {
                await unfollowUser({
                    variables: {
                        followerId: user.id,
                        followingId: creatorId
                    }
                });
            } else {
                await followUser({
                    variables: {
                        followerId: user.id,
                        followingId: creatorId
                    }
                });
            }
            await refetchFollow();
            await refetchFollowerCount();
        } catch (err) {
            console.error("Error following/unfollowing user:", err);
            setModalState({ isOpen: true, title: 'Error', message: err.message || 'Failed to follow/unfollow user.' });
        }
    };

    return (
        <Wrapper>
            <Modal 
                isOpen={modalState.isOpen} 
                onClose={() => setModalState({ ...modalState, isOpen: false })} 
                title={modalState.title} 
                message={modalState.message} 
            />
            <BackButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </BackButton>
            <Container>
                <ImageSection>
                    <img src={pin.imageUrl} alt={pin.title} />
                </ImageSection>
                <InfoSection>
                    <Header>
                        <Icons>
                            {/* Placeholder icons */}
                            <Icon>...</Icon>
                            <Icon>↑</Icon>
                        </Icons>
                        <SaveButton onClick={handleSavePin} disabled={saving || isSaved} isSaved={isSaved}>
                            {isSaved ? 'Saved' : saving ? 'Saving...' : 'Save'}
                        </SaveButton>
                    </Header>
                    
                    <Title>{pin.title}</Title>
                    <Description>{pin.description}</Description>
                    
                    {pin.link && (
                        <Link href={pin.link} target="_blank" rel="noopener noreferrer">
                            {pin.link}
                        </Link>
                    )}

                    <CreatorInfo>
                        <Avatar 
                            src={pin.user?.avatar} 
                            alt={pin.user?.firstName}
                            sx={{ width: 48, height: 48, bgcolor: '#efefef', color: '#333', fontWeight: 'bold' }}
                        >
                            {pin.user?.firstName?.charAt(0)}
                        </Avatar>
                        <CreatorDetails>
                            <CreatorName>{pin.user?.firstName} {pin.user?.lastName}</CreatorName>
                            <CreatorFollowers>{followerCount} {followerCount === 1 ? 'follower' : 'followers'}</CreatorFollowers>
                        </CreatorDetails>
                        {!isOwnPin && (
                            <FollowButton 
                                onClick={handleFollow} 
                                disabled={following || unfollowing}
                                isFollowing={isFollowing}
                            >
                                {following || unfollowing ? '...' : isFollowing ? 'Following' : 'Follow'}
                            </FollowButton>
                        )}
                    </CreatorInfo>

                    <CommentsSection>
                        <h3>Comments</h3>
                        <p>No comments yet! Add one to start the conversation.</p>
                    </CommentsSection>
                </InfoSection>
            </Container>
        </Wrapper>
    );
}

export default PinDetail;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: white;
    min-height: 100vh;
    position: relative;
`;

const BackButton = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: transparent;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const Container = styled.div`
    display: flex;
    background-color: white;
    border-radius: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    width: 100%;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
        box-shadow: none;
    }
`;

const ImageSection = styled.div`
    flex: 1;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
        width: 100%;
        height: auto;
        display: block;
        max-height: 80vh;
        object-fit: contain;
    }
`;

const InfoSection = styled.div`
    flex: 1;
    padding: 32px;
    display: flex;
    flex-direction: column;
    max-width: 500px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Icons = styled.div`
    display: flex;
    gap: 10px;
`;

const Icon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
        background-color: #f0f0f0;
    }
`;

const SaveButton = styled.button`
    background-color: ${props => props.isSaved ? '#111' : '#e60023'};
    color: white;
    border: none;
    border-radius: 24px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    
    &:hover {
        background-color: #ad081b;
    }
`;

const Title = styled.h1`
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #111;
`;

const Description = styled.p`
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
    line-height: 1.5;
`;

const Link = styled.a`
    font-size: 14px;
    color: #111;
    text-decoration: underline;
    margin-bottom: 20px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CreatorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    margin-bottom: 40px;
`;

const CreatorDetails = styled.div`
    flex: 1;
`;

const CreatorName = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: #111;
`;

const CreatorFollowers = styled.div`
    font-size: 14px;
    color: #767676;
`;

const FollowButton = styled.button`
    background-color: ${props => props.isFollowing ? '#111' : '#efefef'};
    color: ${props => props.isFollowing ? 'white' : '#111'};
    border: none;
    border-radius: 24px;
    padding: 12px 20px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: ${props => props.isFollowing ? '#333' : '#e2e2e2'};
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CommentsSection = styled.div`
    margin-top: auto;
    
    h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    
    p {
        color: #767676;
    }
`;
