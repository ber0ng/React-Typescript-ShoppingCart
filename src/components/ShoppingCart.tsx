import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import React, { useState, useEffect } from 'react';
import { StoreItemProps } from "./StoreItem";

type ShoppingCartProps = {
    isOpen: boolean
}

export function ShoppingCart({isOpen}: ShoppingCartProps){

    const {closeCart, cartItems} = useShoppingCart();

    const [data, setData] = useState<StoreItemProps[]>([]);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const result = await fetch("http://127.0.0.1:8000/api/products");
            const response = await result.json();
            if (response && Array.isArray(response.result)) {
                setData(response.result);
            } else {
                console.error('API response structure is not as expected:', response);
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    }

    return (
        <Offcanvas show={isOpen} placement="end" onHide={closeCart}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item => (
                        <CartItem key={item.product_id} {...item} /> 
                    ))}
                    <div className="ms-auto fw-bold fs-5">
                    Total{" "}
                        {formatCurrency(
                        cartItems.reduce((total, cartItem) => {
                            const item = data.find(i => i.product_id === cartItem.product_id)
                            return total + (item?.new_price ? parseFloat(item.new_price) : 0) * cartItem.quantity
                        }, 0)
                        )}
                    </div>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    )
}