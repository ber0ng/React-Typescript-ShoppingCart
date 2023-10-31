import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap'
import { StoreItemProps } from '../components/StoreItem';
import StoreItem from '../components/StoreItem';



export function Store() {
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
      <>
        <h1>Store</h1>
        <Row md={2} xs={1} lg={3} className="g-3">
        {data.map((item) => (
      <Col key={item.product_id}>
        <StoreItem
          product_id={item.product_id}
          name={item.name}
          new_price={item.new_price}
          file_path={item.file_path}
        />
      </Col>
    ))}
        </Row>
      </>
    )
  }