import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { CREATE_PIN } from '../GraphQL/Mutation';
import { useMutation } from '@apollo/client';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CircleIcon from '@mui/icons-material/Circle';
import BrushIcon from '@mui/icons-material/Brush';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Modal from '../components/Modal';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001');

function LiveCanvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);
    const [tool, setTool] = useState('brush'); // brush, eraser, rect, circle, triangle, line, text
    const [snapshot, setSnapshot] = useState(null);
    const [history, setHistory] = useState([]); // Array of actions
    const [modalState, setModalState] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        showInput: false, 
        inputValue: '', 
        placeholder: '',
        onConfirm: null 
    });
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [createPin, { loading }] = useMutation(CREATE_PIN);

    useEffect(() => {
        if (!roomId) {
            if (user && user.email) {
                navigate(`/canvas/${user.email}`, { replace: true });
            } else {
                const newRoomId = `guest-${crypto.randomUUID()}`;
                navigate(`/canvas/${newRoomId}`, { replace: true });
            }
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.7;
        
        // White background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        socket.emit('join-room', roomId);

        socket.on('drawing', (data) => {
            addToHistory(data);
            drawAction(data);
        });

        socket.on('shape', (data) => {
            addToHistory(data);
            drawAction(data);
        });

        socket.on('text', (data) => {
            addToHistory(data);
            drawAction(data);
        });

        socket.on('undo', () => {
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory.pop();
                redrawCanvas(newHistory);
                return newHistory;
            });
        });

        socket.on('clear', () => {
            setHistory([]);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        return () => {
            socket.off('drawing');
            socket.off('shape');
            socket.off('text');
            socket.off('undo');
            socket.off('clear');
        };
    }, [roomId, navigate, user]);

    const addToHistory = (action) => {
        setHistory(prev => [...prev, action]);
    };

    const redrawCanvas = (actions) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        actions.forEach(action => {
            drawAction(action);
        });
    };

    const drawAction = (action) => {
        if (action.type === 'drawing') {
            drawLine(action.x0, action.y0, action.x1, action.y1, action.color, action.width, false);
        } else if (['rect', 'circle', 'triangle', 'line'].includes(action.type)) {
            drawShape(action.type, action.x, action.y, action.w, action.h, action.color, action.width, false);
        } else if (action.type === 'text') {
            drawText(action.text, action.x, action.y, action.color, action.size, false);
        }
    };

    const drawLine = (x0, y0, x1, y1, color, width, emit) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();

        if (emit) {
            const action = { type: 'drawing', roomId, x0, y0, x1, y1, color, width };
            addToHistory(action);
            socket.emit('drawing', action);
        }
    };

    const drawShape = (type, x, y, w, h, color, width, emit) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        if (type === 'rect') {
            ctx.rect(x, y, w, h);
        } else if (type === 'circle') {
            ctx.arc(x + w/2, y + h/2, Math.abs(w/2), 0, 2 * Math.PI);
        } else if (type === 'triangle') {
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + w, y + h);
            ctx.closePath();
        } else if (type === 'line') {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y + h);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        if (type !== 'triangle' && type !== 'line') ctx.closePath(); // Triangle/Line already closed or path defined

        if (emit) {
            const action = { type, roomId, x, y, w, h, color, width };
            addToHistory(action);
            socket.emit('shape', action);
        }
    };

    const drawText = (text, x, y, color, size, emit) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `${size}px Arial`;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);

        if (emit) {
            const action = { type: 'text', roomId, text, x, y, color, size };
            addToHistory(action);
            socket.emit('text', action);
        }
    };

    // Store pending text position
    const [pendingTextPos, setPendingTextPos] = useState(null);

    const handleMouseDown = (e) => {
        if (tool === 'text') {
            const { offsetX, offsetY } = e.nativeEvent;
            setPendingTextPos({ x: offsetX, y: offsetY });
            setModalState({
                isOpen: true,
                title: 'Add Text',
                message: 'Enter the text you want to add:',
                showInput: true,
                inputValue: '',
                placeholder: 'Type here...',
                onConfirm: () => { /* Handled in Modal render via state closure issue, see fix below */ }
            });
            return;
        }

        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        canvasRef.current.lastX = offsetX;
        canvasRef.current.lastY = offsetY;
        canvasRef.current.startX = offsetX;
        canvasRef.current.startY = offsetY;

        const ctx = canvasRef.current.getContext('2d');
        setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    };

    const handleModalConfirm = () => {
        if (modalState.title === 'Add Text' && pendingTextPos) {
            if (modalState.inputValue) {
                drawText(modalState.inputValue, pendingTextPos.x, pendingTextPos.y, color, lineWidth * 5, true);
            }
            setPendingTextPos(null);
        } else if (modalState.title === 'Join Room') {
            if (modalState.inputValue) {
                navigate(`/canvas/${modalState.inputValue}`);
            }
        }
        setModalState({ ...modalState, isOpen: false });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');

        if (tool === 'brush' || tool === 'eraser') {
            const drawColor = tool === 'eraser' ? '#ffffff' : color;
            drawLine(
                canvasRef.current.lastX, 
                canvasRef.current.lastY, 
                offsetX, 
                offsetY, 
                drawColor, 
                lineWidth, 
                true
            );
            canvasRef.current.lastX = offsetX;
            canvasRef.current.lastY = offsetY;
        } else {
            // Shape preview
            if (snapshot) {
                ctx.putImageData(snapshot, 0, 0);
            }
            const startX = canvasRef.current.startX;
            const startY = canvasRef.current.startY;
            const width = offsetX - startX;
            const height = offsetY - startY;
            
            drawShape(tool, startX, startY, width, height, color, lineWidth, false);
        }
    };

    const handleMouseUp = (e) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        
        if (['rect', 'circle', 'triangle', 'line'].includes(tool)) {
            const { offsetX, offsetY } = e.nativeEvent;
            const startX = canvasRef.current.startX;
            const startY = canvasRef.current.startY;
            const width = offsetX - startX;
            const height = offsetY - startY;
            
            // Final draw and emit
            drawShape(tool, startX, startY, width, height, color, lineWidth, true);
        }
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        newHistory.pop();
        setHistory(newHistory);
        redrawCanvas(newHistory);
        socket.emit('undo', roomId);
    };

    const handleClear = () => {
        setHistory([]);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear', roomId);
    };

    const handleSavePin = async () => {
        if (!user) {
            setModalState({ isOpen: true, title: 'Login Required', message: 'Please login to save your drawing' });
            return;
        }

        const canvas = canvasRef.current;
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);

        try {
            await createPin({
                variables: {
                    title: `Collaborative Art by ${user.firstName}`,
                    description: 'Created in the Live Canvas',
                    imageUrl: imageUrl,
                    link: '',
                    userId: String(user.id)
                }
            });
            setModalState({ isOpen: true, title: 'Success', message: 'Drawing saved as Pin!' });
            // navigate('/');
        } catch (err) {
            console.error("Error saving pin:", err);
            setModalState({ isOpen: true, title: 'Error', message: 'Error saving pin. Image might be too large.' });
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setModalState({ isOpen: true, title: 'Success', message: 'Link copied to clipboard!' });
    };

    const handleJoinRoom = () => {
        setModalState({
            isOpen: true,
            title: 'Join Room',
            message: 'Enter the email of the room to join:',
            showInput: true,
            inputValue: '',
            placeholder: 'user@example.com',
            onConfirm: null // Handled in handleModalConfirm
        });
    };

    return (
        <Wrapper>
            <Modal 
                isOpen={modalState.isOpen} 
                onClose={() => setModalState({ ...modalState, isOpen: false })} 
                title={modalState.title} 
                message={modalState.message}
                showInput={modalState.showInput}
                inputValue={modalState.inputValue}
                onInputChange={(val) => setModalState({ ...modalState, inputValue: val })}
                onConfirm={handleModalConfirm}
                placeholder={modalState.placeholder}
            />
            <Toolbar>
                <ToolButton active={tool === 'brush'} onClick={() => setTool('brush')}><BrushIcon /></ToolButton>
                <ToolButton active={tool === 'eraser'} onClick={() => setTool('eraser')}><AutoFixHighIcon /></ToolButton>
                
                <Divider />

                <ToolButton active={tool === 'rect'} onClick={() => setTool('rect')}><CropSquareIcon /></ToolButton>
                <ToolButton active={tool === 'circle'} onClick={() => setTool('circle')}><CircleIcon /></ToolButton>
                <ToolButton active={tool === 'triangle'} onClick={() => setTool('triangle')}><ChangeHistoryIcon /></ToolButton>
                <ToolButton active={tool === 'line'} onClick={() => setTool('line')}><HorizontalRuleIcon /></ToolButton>
                <ToolButton active={tool === 'text'} onClick={() => setTool('text')}><TextFieldsIcon /></ToolButton>

                <Divider />

                <ColorPicker type="color" value={color} onChange={(e) => setColor(e.target.value)} disabled={tool === 'eraser'} />
                <RangeInput type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
                
                <Divider />

                <ToolButton onClick={handleUndo}><UndoIcon /></ToolButton>
                <ToolButton onClick={handleClear}><DeleteIcon /></ToolButton>
                <ToolButton onClick={copyLink}><ContentCopyIcon /></ToolButton>
                <ToolButton onClick={handleJoinRoom}><GroupAddIcon /></ToolButton>
                
                <SaveButton onClick={handleSavePin} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </SaveButton>
            </Toolbar>
            <CanvasContainer>
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseOut={handleMouseUp}
                />
            </CanvasContainer>
            <Instructions>
                Share the link to invite friends! • Room ID: {roomId}
            </Instructions>
        </Wrapper>
    );
}

export default LiveCanvas;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
    padding: 20px;
`;

const Toolbar = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    background: white;
    padding: 10px 20px;
    border-radius: 50px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
`;

const ToolButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: ${props => props.active ? '#e9e9e9' : 'transparent'};
    color: ${props => props.active ? '#000' : '#555'};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #f0f0f0;
        color: #000;
    }
`;

const Divider = styled.div`
    width: 1px;
    height: 24px;
    background-color: #ddd;
    margin: 0 5px;
`;

const ColorPicker = styled.input`
    width: 30px;
    height: 30px;
    border: none;
    cursor: pointer;
    background: none;
    opacity: ${props => props.disabled ? 0.5 : 1};
`;

const RangeInput = styled.input`
    width: 80px;
    cursor: pointer;
`;

const SaveButton = styled.button`
    background: #e60023;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        background: #ad081b;
    }
    
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const CanvasContainer = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
    cursor: crosshair;
`;

const Instructions = styled.p`
    margin-top: 20px;
    color: #666;
    font-size: 14px;
`;
