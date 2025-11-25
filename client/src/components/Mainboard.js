import React from 'react'
import styled from 'styled-components'
import Pin from '../components/Pin'
import {useEffect, useState} from 'react'
import {useQuery} from '@apollo/client'
import {GET_MY_PINS, GET_LATEST_PINS, GET_SAVED_PINS} from '../GraphQL/Queries'


import { useLocation } from 'react-router-dom';

function Mainboard() {
    const {data} = useQuery(GET_LATEST_PINS);
    const [latestPin, setLatestPin] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    useEffect(() => {
        if(data)
            setLatestPin(data.latestPins);
      },[data]);

    const filteredPins = latestPin.filter(pin => {
        if (!searchQuery) return true;
        return (pin.title && pin.title.toLowerCase().includes(searchQuery)) ||
               (pin.description && pin.description.toLowerCase().includes(searchQuery));
    });

    return (
        <Wrapper>
            <Container>
                {
                    filteredPins.map((pin, index) => {
                        const urls= pin.imageUrl;
                        return(<Pin key={index} urls={urls} id={pin.id} />)
                    })
                }
            </Container>
        </Wrapper>
    )
}

export default Mainboard

const Wrapper = styled.div`
    background-color: white;
    display:flex;
    justify-content: center;
    height: 100%;
    width:100%;
    margin-top:15px;
`

const Container = styled.div`
    background-color: white;
    column-count: 5;
    column-gap: 0px;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 10px;

    @media (max-width: 1200px) {
        column-count: 4;
    }
    @media (max-width: 992px) {
        column-count: 3;
    }
    @media (max-width: 768px) {
        column-count: 2;
    }
    @media (max-width: 480px) {
        column-count: 2;
        padding: 0 5px;
    }
`