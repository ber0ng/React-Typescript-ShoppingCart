import { Button, Table, Modal, Input, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { StoreItemProps } from './StoreItem';
import { ChangeEvent } from 'react';



const TableData = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<StoreItemProps | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [addData, setAddData] = useState<StoreItemProps | null>(null);
    const [data, setData] = useState<StoreItemProps[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [searchText, setSearchText] = useState("");
    

    useEffect(() => {
        getData();
    }, []);

    // get data from API
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

    //add product using api
    async function addProduct(newProductData: StoreItemProps){
        try {
            const formData = new FormData();
            formData.append('name', newProductData.name);
            formData.append('new_price', newProductData.new_price);
            // Check if a new image file is available.
            if (file) {
                formData.append('image', file);
            }

            const response = await fetch("http://127.0.0.1:8000/api/admin/product", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // Product added successfully on the backend, now update it in the frontend.
                getData(); // Refresh the data to include the newly added product
                setIsAdding(false); // Close the modal or form after adding the product.
                
            } else {
                console.error("Failed to add the product to the backend.");
            }
            
        }   catch (error) {
            console.error("Error while adding the product:", error);
        }
    }


    // update product data using API
    async function updateData(updatedData: StoreItemProps) {
        try {
            const product_idAsString = updatedData.product_id.toString();
            const updateProductUrl = `http://127.0.0.1:8000/api/admin/product/${product_idAsString}?_method=PUT`;

            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('new_price', updatedData.new_price);
            // Check if a new image file is available.
            if (file) {
                formData.append('image', file);
            }

            const response = await fetch(updateProductUrl, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // Product updated successfully on the backend, now update it in the frontend.
                setData((prevData) => {
                    return prevData.map((product) => {
                        if (product.product_id === updatedData.product_id) {
                            return updatedData; // Replace the old data with the updated data.
                        } else {
                            return product;
                        }
                    });
                });
                setIsEditing(false); // Close the modal or form after updating the product.
            } else {
                console.error("Failed to update the product on the backend.");
            }
        } catch (error) {
            console.error("Error while updating the product:", error);
        }
    }

    // delete a product
    const deleteDataRecord = async (record: StoreItemProps) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            okText: 'Yes',
            okType: 'danger',
            onOk: async () => {
                try {
                    const result = await fetch(`http://127.0.0.1:8000/api/admin/product/${record.product_id}`, {
                        method: 'DELETE', 
                    });
                    const response = await result.json();
                    console.log('API Response:', response);
                    if (response.ok) {
                        await getData();
                        setData((prevData) => prevData.filter((prod) => prod.product_id !== record.product_id));
                    } else {
                        console.error('Failed to delete product. Status:', result.status, 'Status Text:', result.statusText);
                        getData();
                    }
                } catch (error) {
                    console.error('Error while deleting product:', error);
                }
            }
        });
    }


    // load data into table columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'product_id',
            key: 'product_id',
            sorter: (data1: StoreItemProps, data2: StoreItemProps) => {
                return data1.product_id > data2.product_id;
            }
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [searchText],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder="Search product name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={() => {
                                confirm();
                            }}
                            style={{ width: 188, marginBottom: 8, display: 'block' }}
                        />
                        <Button
                            type="primary"
                            onClick={() => {
                                confirm();
                            }}
                            size="small"
                            style={{ width: 90, marginRight: 8 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={async () => {
                                setSelectedKeys([]); // Clear the search input
                                clearFilters();     // Clear the filter
                                confirm();   // Refresh the data to display all products
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </div>
                );
            },
            onFilter: (value: string, record: StoreItemProps) => {
                return record.name.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: 'Price',
            dataIndex: 'new_price',
            key: 'new_price',
        },
        {
            title: 'Image',
            dataIndex: 'file_path',
            key: 'file_path',
            render: (file_path: string) => (
                <img src={`http://127.0.0.1:8000/${file_path}`} alt=""
                    style={{ maxWidth: '100px' }} />
            )
        },
        {
            title: 'Actions',
            render: (record: StoreItemProps) => {
                return <>
                    <EditOutlined onClick={() => {
                        editDataRecord(record);
                    }} />
                    <DeleteOutlined onClick={() => {
                        deleteDataRecord(record);
                    }} style={{ color: "red", marginLeft: 12 }} />
                </>
            }
        }
    ];

    // edit a product
    const editDataRecord = (record: StoreItemProps) => {
        setIsEditing(true);
        setEditData({ ...record });
    }

    // modal for edit
    const resetEdit = () => {
        setIsEditing(false);
        setEditData(null);
    }

    // modal for add
    const resetAdd = () => {
        setIsAdding(false);
        setAddData(null);
    }

    

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]; // Get the first selected file
        if (selectedFile) {
            setFile(selectedFile);
            // Update the `editData` with the selected file
            setEditData((prevData: StoreItemProps | null) => ({
            ...prevData!,
            file_path: selectedFile.name, // Use the file name or the desired string property of the file
            }));
        } else {
            setFile(null);
        }
    };

    return (
        <div>
            <Button onClick={() => setIsAdding(true)}>Add Product</Button>
            <Input.Search style={{display: 'inline-block', paddingLeft: '20px', width: '200px'}} placeholder='Search here..' 
                onSearch={(value) => {
                    setSearchText(value);
                }}
            />
            <Table
                columns={columns}
                dataSource={data.map(item => ({
                    ...item,
                    key: item.product_id.toString()
                }))}
            >
            </Table>
            <Modal
                title='Add Product' 
                open={isAdding} 
                okText='Save'
                onCancel={() => {
                    resetAdd();
                }}
                onOk={() => {
                    if (isAdding) {
                        // Handle add product form submission
                        // Call addProduct with the form values
                        if (addData !== null) {
                            addProduct(addData); // Pass the addData as an argument to addProduct
                            resetAdd();
                        }
                    } else if (addData !== null) {
                        updateData(addData);
                        resetAdd();
                    }
                }}
            >
                <Form>
                    <Form.Item label="Product Name">
                        <input
                            type="text"
                            value={addData?.name}
                            onChange={(e) => {
                                setAddData((pre: StoreItemProps | null) => ({
                                    ...pre!,
                                    name: e.target.value,
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Price">
                        <input
                            type="text"
                            value={addData?.new_price}
                            onChange={(e) => {
                                setAddData((pre: StoreItemProps | null) => ({
                                    ...pre!,
                                    new_price: e.target.value,
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Image" name="new_image">
                        <input type="file" onChange={handleFileUpload} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title='Edit Product'
                open={isEditing}
                okText='Save'
                onCancel={() => {
                    resetEdit();
                }}
                onOk={() => {
                    if (editData !== null) {
                        updateData(editData); // Pass the editData as an argument to updateData
                        resetEdit();
                    }
                }}
            >
                <Form>
                    <Form.Item label="Product Name">
                        <input
                            type="text"
                            value={editData?.name}
                            onChange={(e) => {
                                setEditData((pre: StoreItemProps | null) => ({
                                    ...pre!,
                                    name: e.target.value,
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Price">
                        <input
                            type="text"
                            value={editData?.new_price}
                            onChange={(e) => {
                                setEditData((pre: StoreItemProps | null) => ({
                                    ...pre!,
                                    new_price: e.target.value,
                                }));
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Image" name="new_image">
                        <input type="file" onChange={handleFileUpload} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default TableData;
