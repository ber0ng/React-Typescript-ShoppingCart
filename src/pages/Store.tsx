import React, { useState, useEffect } from 'react';
import { Row, Col, Button} from 'react-bootstrap'
import { StoreItemProps } from '../components/StoreItem';
import StoreItem from '../components/StoreItem';

export function Store() {
  const [data, setData] = useState<StoreItemProps[]>([]);
  const [key, setKey] = useState('');
  const [searchResults, setSearchResults] = useState<StoreItemProps[]>([]);

    useEffect(() => {
        getData();
    }, []);
    
    // get all products
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

    // search product
    const handleSearch = async () => {
      try {
        if (key.trim() === "") {
          // If the search key is empty, load all products
          setSearchResults(data); // Use the original data
        } else {
        const response = await fetch(`http://127.0.0.1:8000/api/products/search?query=${key}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseText = await response.text();
        console.log(responseText);
        // Clone the response
        const clonedResponse = new Response(responseText, response);

        // Parse the JSON from the cloned response
        const data = await clonedResponse.json();

        setSearchResults(data.results);
            console.warn(data);
        }}  catch (error) {
            console.error('Error fetching data:', error);
            setSearchResults([]); // Handle errors appropriately
          }
      };

    return (
      <>
        <h1>Store</h1>
        <div style={{ marginRight: '20px' }}>
        <input placeholder='Search product...' value={key} onChange={(e) => setKey(e.target.value)}  />
        <Button onClick={handleSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        </Button>
        </div>
        <Row md={2} xs={1} lg={3} className="g-3">
                {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                        <Col key={item.product_id}>
                            <StoreItem
                                product_id={item.product_id}
                                name={item.name}
                                new_price={item.new_price}
                                file_path={item.file_path}
                            />
                        </Col>
                    ))
                ) : (
                    // Display all products if no search results
                    data.map((item) => (
                        <Col key={item.product_id}>
                            <StoreItem
                                product_id={item.product_id}
                                name={item.name}
                                new_price={item.new_price}
                                file_path={item.file_path}
                            />
                        </Col>
                    ))
                )}
          </Row>
      </>
  )
}