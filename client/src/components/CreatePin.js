import React, { useState } from 'react'
import styled from 'styled-components'
import {CREATE_PIN} from '../GraphQL/Mutation'
import {useMutation} from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LinkIcon from '@mui/icons-material/Link';
import Modal from './Modal';

function CreatePin() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [link, setLink] = useState('');
    const [activeTab, setActiveTab] = useState('url'); // 'url' or 'ai'
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const [modalState, setModalState] = useState({ 
        isOpen: false, 
        title: '', 
        message: '',
        onConfirm: null 
    });

    const [createPin, { loading, error }] = useMutation(CREATE_PIN);

    const handleSave = async () => {
        if (!user) {
            setModalState({ isOpen: true, title: 'Login Required', message: 'Please login to create a pin.' });
            return;
        }
        if (!imageUrl) {
            setModalState({ isOpen: true, title: 'Missing Image', message: 'Please upload or generate an image.' });
            return;
        }
        if (!title) {
            setModalState({ isOpen: true, title: 'Missing Title', message: 'Please add a title for your pin.' });
            return;
        }

        try {
            await createPin({
                variables: {
                    title: title,
                    description: description,
                    imageUrl: imageUrl,
                    link: link,
                    userId: String(user.id)
                }
            });
            setModalState({ 
                isOpen: true, 
                title: 'Success', 
                message: 'Pin created successfully!',
                onConfirm: () => navigate('/') 
            });
        } catch (err) {
            console.error("Error creating pin:", err);
            setModalState({ isOpen: true, title: 'Error', message: 'Failed to create pin. Please try again.' });
        }
    };

    const handleGenerateImage = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: aiPrompt }),
            });
            const data = await response.json();
            if (data.imageUrl) {
                setImageUrl(data.imageUrl);
            } else {
                alert('Failed to generate image');
            }
        } catch (error) {
            console.error("Error generating image:", error);
            alert('Error generating image');
        } finally {
            setIsGenerating(false);
        }
    };

  return (
    <Wrapper>
        <Modal 
            isOpen={modalState.isOpen} 
            onClose={() => setModalState({ ...modalState, isOpen: false })} 
            title={modalState.title} 
            message={modalState.message}
            onConfirm={modalState.onConfirm}
        />
        <Container>
            <Header>
                <Title>Create Pin</Title>
                <SaveButton onClick={handleSave} disabled={loading || !imageUrl}>
                    {loading ? 'Saving...' : 'Save'}
                </SaveButton>
            </Header>
            <ContentWrapper>
                <ImageUploadSection>
                    {!imageUrl ? (
                        <>
                            <TabContainer>
                                <Tab 
                                    active={activeTab === 'url'} 
                                    onClick={() => setActiveTab('url')}
                                >
                                    <LinkIcon /> Save from URL
                                </Tab>
                                <Tab 
                                    active={activeTab === 'ai'} 
                                    onClick={() => setActiveTab('ai')}
                                >
                                    <AutoAwesomeIcon /> Generate with AI
                                </Tab>
                            </TabContainer>

                            {activeTab === 'url' ? (
                                <UploadPlaceholder>
                                    <UploadIcon>
                                        <ArrowCircleUpIcon style={{ fontSize: '40px', color: '#767676' }} />
                                    </UploadIcon>
                                    <UploadText>Paste an image URL</UploadText>
                                    <UrlInputWrapper>
                                        <input 
                                            type="text" 
                                            placeholder="https://..." 
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                        />
                                    </UrlInputWrapper>
                                </UploadPlaceholder>
                            ) : (
                                <UploadPlaceholder>
                                    <UploadIcon>
                                        <AutoAwesomeIcon style={{ fontSize: '40px', color: '#767676' }} />
                                    </UploadIcon>
                                    <UploadText>Describe what you want to see</UploadText>
                                    <UrlInputWrapper>
                                        <input 
                                            type="text" 
                                            placeholder="A futuristic city in watercolor..." 
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
                                        />
                                    </UrlInputWrapper>
                                    <GenerateButton 
                                        onClick={handleGenerateImage} 
                                        disabled={isGenerating || !aiPrompt}
                                    >
                                        {isGenerating ? 'Generating...' : 'Generate'}
                                    </GenerateButton>
                                </UploadPlaceholder>
                            )}
                        </>
                    ) : (
                        <ImagePreview>
                            <img 
                                src={imageUrl} 
                                alt="Preview" 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    setImageUrl('');
                                    alert('Invalid Image URL');
                                }}
                            />
                            <DeleteButton onClick={() => setImageUrl('')}>✕</DeleteButton>
                        </ImagePreview>
                    )}
                </ImageUploadSection>

                <FormSection>
                    <FormGroup>
                        <Label>Title</Label>
                        <StyledInput 
                            type="text" 
                            placeholder="Add a title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ fontSize: '24px', fontWeight: 'bold' }}
                        />
                    </FormGroup>

                    <UserInfo>
                        <UserAvatar>{user?.firstName?.charAt(0)}</UserAvatar>
                        <UserName>{user?.firstName} {user?.lastName}</UserName>
                    </UserInfo>

                    <FormGroup>
                        <Label>Description</Label>
                        <StyledTextArea 
                            placeholder="Add a detailed description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Link</Label>
                        <StyledInput 
                            type="text" 
                            placeholder="Add a link" 
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Board</Label>
                        <StyledSelect>
                            <option>Choose a board</option>
                            <option>My First Board</option>
                        </StyledSelect>
                    </FormGroup>
                    
                    <FormGroup>
                        <Label>Tagged topics (0)</Label>
                        <StyledInput 
                            type="text" 
                            placeholder="Search for a tag" 
                        />
                    </FormGroup>
                </FormSection>
            </ContentWrapper>
        </Container>
    </Wrapper>
  )
}

export default CreatePin

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: #e9e9e9;
    padding: 20px;
`

const Container = styled.div`
    background-color: white;
    width: 880px;
    min-height: 650px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    padding: 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
`

const Title = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #111;
`

const SaveButton = styled.button`
    background-color: #e60023;
    color: white;
    border: none;
    border-radius: 24px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #ad081b;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`

const ContentWrapper = styled.div`
    display: flex;
    gap: 40px;
    height: 100%;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const ImageUploadSection = styled.div`
    flex: 1;
    background-color: #efefef;
    border-radius: 16px;
    min-height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
`

const TabContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background-color: white;
    padding: 4px;
    border-radius: 24px;
`

const Tab = styled.div`
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: ${props => props.active ? '#111' : 'transparent'};
    color: ${props => props.active ? 'white' : '#111'};
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.active ? '#111' : '#f0f0f0'};
    }
`

const UploadPlaceholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    width: 100%;
    max-width: 300px;
`

const UploadIcon = styled.div`
    margin-bottom: 10px;
`

const UploadText = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #111;
`

const UrlInputWrapper = styled.div`
    width: 100%;
    
    input {
        width: 100%;
        padding: 12px 16px;
        border-radius: 24px;
        border: 1px solid #dadada;
        background-color: #e9e9e9;
        font-size: 16px;
        outline: none;
        text-align: center;
        
        &:focus {
            background-color: white;
            box-shadow: 0 0 0 4px rgba(0, 132, 255, 0.2);
        }
    }
`

const GenerateButton = styled.button`
    background-color: #111;
    color: white;
    border: none;
    border-radius: 24px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    
    &:hover {
        background-color: #333;
    }
    
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`

const ImagePreview = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 16px;
    }
`

const DeleteButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    font-size: 20px;
    
    &:hover {
        background-color: #f0f0f0;
    }
`

const FormSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Label = styled.label`
    font-size: 12px;
    color: #6e6e6e;
`

const StyledInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    border-radius: 16px;
    border: 2px solid #dadada;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
        border-color: #0074e8;
    }
    
    &::placeholder {
        color: #767676;
    }
`

const StyledTextArea = styled.textarea`
    width: 100%;
    padding: 12px 16px;
    border-radius: 16px;
    border: 2px solid #dadada;
    font-size: 16px;
    outline: none;
    resize: none;
    font-family: inherit;
    transition: border-color 0.2s;
    
    &:focus {
        border-color: #0074e8;
    }
`

const StyledSelect = styled.select`
    width: 100%;
    padding: 12px 16px;
    border-radius: 16px;
    border: 2px solid #dadada;
    font-size: 16px;
    outline: none;
    background-color: white;
    cursor: pointer;
    
    &:focus {
        border-color: #0074e8;
    }
`

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 10px 0;
`

const UserAvatar = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 20px;
    color: #111;
`

const UserName = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: #111;
`
