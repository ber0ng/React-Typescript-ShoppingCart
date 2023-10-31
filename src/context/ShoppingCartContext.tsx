import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    getItemQuantity: (product_id: number) => number
    increaseCartQuantity: (product_id: number) => void
    decreaseCartQuantity: (product_id: number) => void
    removeFromCart: (product_id: number) => void
    openCart: ()=> void
    closeCart: ()=> void
    cartQuantity: number
    cartItems: CartItem[]
}

type CartItem = {
    product_id: number
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}


export function ShoppingCartProvider({children}: ShoppingCartProviderProps){
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function getItemQuantity (product_id: number){
        return cartItems.find(item=>item.product_id === product_id)?.quantity || 0
    }

    function increaseCartQuantity (product_id: number){
        setCartItems((currItems) => {
            if (currItems.find((item) => item.product_id === product_id) === undefined) {
              return [...currItems, { product_id, quantity: 1 }];
            } else {
              return currItems.map((item) => {
                if (item.product_id === product_id) {
                  return { ...item, quantity: item.quantity + 1 };
                } else {
                  return item;
                }
              });
            }
        });
    }

    function removeFromCart(product_id: number){
        setCartItems(currItems => {
            return currItems.filter(item=> item.product_id !== product_id)
        })
    }

    function decreaseCartQuantity (product_id: number){
        setCartItems(currItems => {
            if(currItems.find(item => item.product_id === product_id)?.quantity === 1){
                return currItems.filter(item => item.product_id !== product_id)
            } else {
                return currItems.map(item => {
                    if(item.product_id === product_id){
                        return {...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }



    return (
        <ShoppingCartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, cartQuantity, openCart, closeCart}}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}