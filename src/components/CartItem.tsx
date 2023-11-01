import { useShoppingCart } from "../context/ShoppingCartContext"
import React, { useState, useEffect } from 'react';
import { StoreItemProps } from "./StoreItem";
import { Button, Stack } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";

type CartItemProps = {
    product_id: number
    quantity: number
}

export function CartItem ({product_id, quantity}: CartItemProps){
    
    const {removeFromCart} = useShoppingCart();
    
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
    const item = data.find((item) => item.product_id === product_id);
    if (!item) {
        return null; // Handle the case where the item is not found
    }
    
    return(
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img src={"http://127.0.0.1:8000/" + item.file_path} style={{width: "125px", height:"75px", flexBasis: "fit-content"}} />
            <div className="me-auto">
                <div>
                    {item.name}{" "}
                    {quantity > 1 && (
                        <span className="text-muted" style={{ fontSize: ".65rem" }}>
                        x{quantity}
                        </span>
                    )}
                </div>
                <div className="text-muted" style={{fontSize: ".75rem"}}>
                    {formatCurrency(parseFloat(item.new_price))}
                </div>
            </div>
            <div>
                {formatCurrency(parseFloat(item.new_price) * quantity)}
            </div>
            <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.product_id)}>&times;</Button>
        </Stack>
    )
}