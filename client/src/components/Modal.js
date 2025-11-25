import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    showInput = false, 
    inputValue = '', 
    onInputChange, 
    onConfirm,
    placeholder = '' 
}) => {
    if (!isOpen) return null;

    return (
        <Overlay>
            <ModalContainer>
                <Header>
                    <Title>{title}</Title>
                    <CloseButton onClick={onClose}>
                        <CloseIcon />
                    </CloseButton>
                </Header>
                <Content>
                    <Message>{message}</Message>
                    {showInput && (
                        <Input 
                            type="text" 
                            value={inputValue} 
                            onChange={(e) => onInputChange(e.target.value)}
                            placeholder={placeholder}
                            autoFocus
                        />
                    )}
                </Content>
                <Footer>
                    <Button onClick={showInput ? onConfirm : onClose}>
                        {showInput ? 'Confirm' : 'OK'}
                    </Button>
                </Footer>
            </ModalContainer>
        </Overlay>
    );
};

export default Modal;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.2s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #f5f5f5;
    }
`;

const Content = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Message = styled.p`
    margin: 0;
    color: #555;
    font-size: 16px;
    line-height: 1.5;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #e60023;
    }
`;

const Footer = styled.div`
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #eee;
`;

const Button = styled.button`
    background-color: #e60023;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 24px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #ad081b;
    }
`;
