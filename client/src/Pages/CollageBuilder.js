import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Canvas, Rect, Circle, Triangle, IText, Image as FabricImage, Polygon, Line } from 'fabric';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CREATE_PIN } from '../GraphQL/Mutation';
import { useMutation } from '@apollo/client';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BrushIcon from '@mui/icons-material/Brush';
import UndoIcon from '@mui/icons-material/Undo';
import StarIcon from '@mui/icons-material/Star';
import HexagonIcon from '@mui/icons-material/Hexagon';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import LayersIcon from '@mui/icons-material/Layers';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import InstagramIcon from '@mui/icons-material/Instagram';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Modal from '../components/Modal';

function CollageBuilder() {
    const canvasRef = useRef(null);
    const [fabricCanvas, setFabricCanvas] = useState(null);
    const [activeObject, setActiveObject] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [activeTab, setActiveTab] = useState('elements'); // elements, graphics
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const [createPin, { loading }] = useMutation(CREATE_PIN);

    const [history, setHistory] = useState([]);
    const isUndoingRef = useRef(false);

    const saveHistory = (canvas) => {
        if (isUndoingRef.current) return;
        const json = JSON.stringify(canvas.toJSON());
        setHistory(prev => [...prev, json]);
    };

    useEffect(() => {
        const initCanvas = new Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff',
        });

        setFabricCanvas(initCanvas);
        saveHistory(initCanvas);

        const updateActiveObject = () => {
            setActiveObject(initCanvas.getActiveObject());
        };

        initCanvas.on('selection:created', updateActiveObject);
        initCanvas.on('selection:updated', updateActiveObject);
        initCanvas.on('selection:cleared', () => setActiveObject(null));

        initCanvas.on('object:added', () => !isUndoingRef.current && saveHistory(initCanvas));
        initCanvas.on('object:modified', () => !isUndoingRef.current && saveHistory(initCanvas));
        initCanvas.on('object:removed', () => !isUndoingRef.current && saveHistory(initCanvas));

        initCanvas.on('mouse:wheel', function(opt) {
            var delta = opt.e.deltaY;
            var zoom = initCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            initCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        initCanvas.on('mouse:down', function(opt) {
            var evt = opt.e;
            if (evt.altKey === true) {
                this.isDragging = true;
                this.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }
        });

        initCanvas.on('mouse:move', function(opt) {
            if (this.isDragging) {
                var e = opt.e;
                var vpt = this.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
        });

        initCanvas.on('mouse:up', function(opt) {
            this.setViewportTransform(this.viewportTransform);
            this.isDragging = false;
            this.selection = true;
        });

        return () => {
            initCanvas.dispose();
        };
    }, []);

    const undo = () => {
        if (!fabricCanvas || history.length <= 1) return;
        isUndoingRef.current = true;
        const newHistory = [...history];
        newHistory.pop();
        const prevState = newHistory[newHistory.length - 1];
        setHistory(newHistory);
        
        if (prevState) {
            fabricCanvas.loadFromJSON(prevState, () => {
                fabricCanvas.renderAll();
                isUndoingRef.current = false;
                setActiveObject(null);
            });
        } else {
            fabricCanvas.clear();
            fabricCanvas.backgroundColor = '#ffffff';
            fabricCanvas.renderAll();
            isUndoingRef.current = false;
        }
    };

    const addText = () => {
        if (!fabricCanvas) return;
        const text = new IText('Double click to edit', {
            left: 100, top: 100, fontFamily: 'Arial', fill: '#333', fontSize: 24,
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
    };

    const addImageFromUrl = async (url) => {
        if (!fabricCanvas || !url) return;
        try {
            const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
            if (img.width > 400) img.scaleToWidth(400);
            fabricCanvas.add(img);
            fabricCanvas.centerObject(img);
            fabricCanvas.setActiveObject(img);
        } catch (error) {
            console.error("Error loading image:", error);
            setModalState({ isOpen: true, title: 'Error', message: 'Could not load image. Check URL or CORS headers.' });
        }
    };

    const onEmojiClick = (emojiData) => {
        if (!fabricCanvas) return;
        const emoji = new IText(emojiData.emoji, {
            left: 150,
            top: 150,
            fontSize: 100,
            selectable: true
        });
        fabricCanvas.add(emoji);
        fabricCanvas.setActiveObject(emoji);
    };

    const addShape = (type) => {
        if (!fabricCanvas) return;
        let shape;
        const commonProps = { left: 100, top: 100, fill: '#e60023' };
        
        if (type === 'rect') {
            shape = new Rect({ ...commonProps, width: 100, height: 100 });
        } else if (type === 'circle') {
            shape = new Circle({ ...commonProps, radius: 50, fill: '#0074e8' });
        } else if (type === 'triangle') {
            shape = new Triangle({ ...commonProps, width: 100, height: 100, fill: '#00a800' });
        } else if (type === 'star') {
            const points = [
                {x: 0, y: -50}, {x: 14, y: -20}, {x: 47, y: -15}, {x: 23, y: 7},
                {x: 29, y: 40}, {x: 0, y: 25}, {x: -29, y: 40}, {x: -23, y: 7},
                {x: -47, y: -15}, {x: -14, y: -20}
            ];
            shape = new Polygon(points, { ...commonProps, left: 150, top: 150, fill: '#ffcc00' });
        } else if (type === 'hexagon') {
             const points = [
                {x: 30, y: 0}, {x: 60, y: 17}, {x: 60, y: 52},
                {x: 30, y: 70}, {x: 0, y: 52}, {x: 0, y: 17}
            ];
            shape = new Polygon(points, { ...commonProps, left: 150, top: 150, fill: '#9c27b0', scaleX: 1.5, scaleY: 1.5 });
        } else if (type === 'line') {
            shape = new Line([50, 50, 200, 50], { ...commonProps, stroke: '#000', strokeWidth: 5, fill: null });
        }
        
        fabricCanvas.add(shape);
        fabricCanvas.setActiveObject(shape);
    };

    const updateProperty = (prop, value) => {
        if (!fabricCanvas || !activeObject) return;
        activeObject.set(prop, value);
        fabricCanvas.requestRenderAll();
        saveHistory(fabricCanvas);
    };

    const bringForward = () => {
        if (!fabricCanvas || !activeObject) return;
        fabricCanvas.bringObjectForward(activeObject);
        saveHistory(fabricCanvas);
    };

    const sendBackward = () => {
        if (!fabricCanvas || !activeObject) return;
        fabricCanvas.sendObjectBackwards(activeObject);
        saveHistory(fabricCanvas);
    };

    const deleteSelected = () => {
        if (!fabricCanvas) return;
        const activeObj = fabricCanvas.getActiveObject();
        if (activeObj) {
            fabricCanvas.remove(activeObj);
            setActiveObject(null);
        }
    };

    const clearCanvas = () => {
        if (!fabricCanvas) return;
        fabricCanvas.clear();
        fabricCanvas.backgroundColor = '#ffffff';
        saveHistory(fabricCanvas);
    };

    const resizeCanvas = (width, height) => {
        if (!fabricCanvas) return;
        fabricCanvas.setDimensions({ width, height });
        // Optionally zoom to fit if needed, but simple resize is fine for now
        setModalState({ isOpen: true, title: 'Canvas Resized', message: `Canvas resized to ${width}x${height}` });
    };

    const handleSavePin = async () => {
        if (!user) {
            setModalState({ isOpen: true, title: 'Login Required', message: 'Please login to save your collage' });
            return;
        }
        if (!fabricCanvas) return;
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
        const dataUrl = fabricCanvas.toDataURL({ format: 'jpeg', quality: 0.8, multiplier: 1 });

        try {
            await createPin({
                variables: {
                    title: `Collage by ${user.firstName}`,
                    description: 'Created with the Collage Builder',
                    imageUrl: dataUrl,
                    link: '',
                    userId: String(user.id)
                }
            });
            setModalState({ isOpen: true, title: 'Success', message: 'Collage saved as Pin!' });
            // navigate('/'); // Optional: stay on page or navigate
        } catch (err) {
            console.error("Error saving pin:", err);
            setModalState({ isOpen: true, title: 'Error', message: 'Error saving pin.' });
        }
    };

    return (
        <Layout>
            <Modal 
                isOpen={modalState.isOpen} 
                onClose={() => setModalState({ ...modalState, isOpen: false })} 
                title={modalState.title} 
                message={modalState.message} 
            />
            <Sidebar>
                <TabContainer>
                    <Tab active={activeTab === 'elements'} onClick={() => setActiveTab('elements')}>
                        <ViewModuleIcon /> Elements
                    </Tab>
                    <Tab active={activeTab === 'graphics'} onClick={() => setActiveTab('graphics')}>
                        <EmojiEmotionsIcon /> Graphics
                    </Tab>
                </TabContainer>

                {activeTab === 'elements' && (
                    <>
                        <SidebarSection>
                            <SectionTitle>Shapes</SectionTitle>
                            <ElementsGrid>
                                <ElementButton onClick={() => addShape('rect')}><div style={{width: 20, height: 20, background: '#e60023'}} /></ElementButton>
                                <ElementButton onClick={() => addShape('circle')}><div style={{width: 20, height: 20, borderRadius: '50%', background: '#0074e8'}} /></ElementButton>
                                <ElementButton onClick={() => addShape('triangle')}><div style={{width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid #00a800'}} /></ElementButton>
                                <ElementButton onClick={() => addShape('star')}><StarIcon style={{color: '#ffcc00'}} /></ElementButton>
                                <ElementButton onClick={() => addShape('hexagon')}><HexagonIcon style={{color: '#9c27b0'}} /></ElementButton>
                                <ElementButton onClick={() => addShape('line')}><HorizontalRuleIcon /></ElementButton>
                            </ElementsGrid>
                        </SidebarSection>
                        
                        <SidebarSection>
                            <SectionTitle>Text</SectionTitle>
                            <ActionButton onClick={addText}><TextFieldsIcon /> Add Text</ActionButton>
                        </SidebarSection>

                        <SidebarSection>
                            <SectionTitle>Image</SectionTitle>
                            <Input 
                                type="text" 
                                placeholder="Image URL..." 
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)} 
                            />
                            <ActionButton onClick={() => addImageFromUrl(imageUrlInput)} style={{marginTop: 5}}><AddPhotoAlternateIcon /> Add Image</ActionButton>
                        </SidebarSection>
                    </>
                )}

                {activeTab === 'graphics' && (
                    <SidebarSection>
                        <SectionTitle>Library</SectionTitle>
                        <EmojiPicker 
                            onEmojiClick={onEmojiClick} 
                            width="100%" 
                            height={400}
                            searchDisabled={false}
                            skinTonesDisabled={true}
                            previewConfig={{ showPreview: false }}
                        />
                    </SidebarSection>
                )}

                <SidebarSection>
                    <SectionTitle>Canvas</SectionTitle>
                    <ActionButton onClick={() => resizeCanvas(600, 600)}>
                        <InstagramIcon /> Instagram Post
                    </ActionButton>
                </SidebarSection>

                <SidebarSection>
                    <SectionTitle>Actions</SectionTitle>
                    <ActionButton onClick={undo} disabled={history.length <= 1}><UndoIcon /> Undo</ActionButton>
                    <ActionButton onClick={clearCanvas}><RestartAltIcon /> Clear All</ActionButton>
                    <ActionButton onClick={handleSavePin} disabled={loading} style={{background: '#e60023', color: 'white', marginTop: 20}}>
                        <SaveIcon /> {loading ? 'Saving...' : 'Save Pin'}
                    </ActionButton>
                </SidebarSection>
            </Sidebar>

            <MainArea>
                <CanvasContainer>
                    <canvas ref={canvasRef} />
                </CanvasContainer>
                <Instructions>Scroll to Zoom • Alt + Drag to Pan</Instructions>
            </MainArea>

            <PropertiesPanel>
                <SectionTitle>Properties</SectionTitle>
                {activeObject ? (
                    <>
                        <PropGroup>
                            <Label>Color</Label>
                            <ColorInput 
                                type="color" 
                                value={activeObject.fill || '#000000'} 
                                onChange={(e) => updateProperty('fill', e.target.value)} 
                            />
                        </PropGroup>
                        <PropGroup>
                            <Label>Opacity: {Math.round((activeObject.opacity || 1) * 100)}%</Label>
                            <RangeInput 
                                type="range" 
                                min="0" max="1" step="0.1" 
                                value={activeObject.opacity || 1} 
                                onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))} 
                            />
                        </PropGroup>
                        <PropGroup>
                            <Label>Layering</Label>
                            <Row>
                                <IconButton onClick={bringForward}><ArrowUpwardIcon /></IconButton>
                                <IconButton onClick={sendBackward}><ArrowDownwardIcon /></IconButton>
                            </Row>
                        </PropGroup>
                        <PropGroup>
                            <ActionButton onClick={deleteSelected} style={{background: '#ffebee', color: '#c62828'}}>
                                <DeleteIcon /> Delete
                            </ActionButton>
                        </PropGroup>
                    </>
                ) : (
                    <EmptyState>Select an object to edit properties</EmptyState>
                )}
            </PropertiesPanel>
        </Layout>
    );
}

export default CollageBuilder;

const Layout = styled.div`
    display: flex;
    height: calc(100vh - 80px);
    background-color: #f0f0f0;
    overflow: hidden;
`;

const Sidebar = styled.div`
    width: 320px;
    background: white;
    padding: 20px;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
`;

const MainArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #e9e9e9;
    position: relative;
`;

const PropertiesPanel = styled.div`
    width: 250px;
    background: white;
    padding: 20px;
    border-left: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const SidebarSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SectionTitle = styled.h3`
    font-size: 14px;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
`;

const ElementsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
`;

const ElementButton = styled.button`
    aspect-ratio: 1;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #e0e0e0;
        transform: translateY(-2px);
    }
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    color: #333;
    width: 100%;

    &:hover {
        background: #e0e0e0;
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Input = styled.input`
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 100%;
`;

const CanvasContainer = styled.div`
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border-radius: 4px;
    overflow: hidden;
    background: white;
`;

const Instructions = styled.div`
    margin-top: 10px;
    color: #666;
    font-size: 12px;
    background: rgba(255,255,255,0.8);
    padding: 4px 8px;
    border-radius: 4px;
`;

const PropGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 12px;
    color: #666;
`;

const ColorInput = styled.input`
    width: 100%;
    height: 40px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
`;

const RangeInput = styled.input`
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    gap: 10px;
`;

const IconButton = styled.button`
    flex: 1;
    padding: 8px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;

    &:hover {
        background: #e0e0e0;
    }
`;

const EmptyState = styled.div`
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
`;

const Tab = styled.div`
    flex: 1;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    font-weight: 600;
    color: ${props => props.active ? '#e60023' : '#555'};
    border-bottom: 2px solid ${props => props.active ? '#e60023' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 14px;

    &:hover {
        background: #f9f9f9;
    }
`;
