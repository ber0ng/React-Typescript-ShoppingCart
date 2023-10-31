import React, { useEffect, useState } from 'react';

import { Card, Button } from 'react-bootstrap'
import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';

export type StoreItemProps = {
    product_id: number
    name: string
    new_price: string
    file_path: string
}

export default function StoreItem({product_id}: StoreItemProps) {

    const {getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart} = useShoppingCart();
    
    const [data, setData] = useState<StoreItemProps[]>([]);

    const quantity = getItemQuantity(product_id)

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
      

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={"http://127.0.0.1:8000/" + item.file_path}
        height="200px"
        style={{flexBasis: "fit-content"}}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-2" style={{ fontSize: '14px !important' }}>{item.name}</span>
          <span className="ms-2 text-muted" style={{ fontSize: '14px !important' }}>{formatCurrency(parseFloat(item.new_price))}</span>
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? (
            <Button className="w-100" onClick={()=> increaseCartQuantity(product_id)}>
              + Add To Cart
            </Button>
          ) : (
            <div
              className="d-flex align-items-center flex-column"
              style={{ gap: ".5rem" }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: ".5rem" }}
              >
                <Button onClick={()=> decreaseCartQuantity(product_id)}>-</Button>
                <div>
                  <span className="fs-3">{quantity}</span> in cart
                </div>
                <Button onClick={()=> increaseCartQuantity(product_id)}>+</Button>
              </div>
              <Button
                onClick={()=> removeFromCart(product_id)}
                variant="danger"
                size="sm"
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
