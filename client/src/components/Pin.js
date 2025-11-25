import React from 'react'
import styled from 'styled-components'

import { useNavigate } from 'react-router-dom';

function Pin(props) {
    let {urls, id} = props;
    const navigate = useNavigate();
    
    return (
        <Wrapper onClick={() => id && navigate(`/pin/${id}`)}>
            <PinImage>
                <img src ={urls} alt = "pin"/>
            </PinImage>
        </Wrapper>
    )
}

export default Pin

const Wrapper = styled.div`
    display: inline-block;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    break-inside: avoid;
`

const PinImage = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    position: relative;
    transition: all 0.2s ease-in-out;

    img {
        display: block;
        width: 100%;
        cursor: zoom-in;
        border-radius: 16px;
        object-fit: cover;
    }

    &:hover {
        filter: brightness(0.9);
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        border-radius: 16px;
    }
`
