'use client'

import { ProductServices } from "@/services/products/products.services";
import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types";

const productContext = createContext<Product[]>([])

export function ProductsProvider({children}: { children: React.ReactNode }){
    const [ products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        async function ProductRequestService(){
           await ProductServices.getAllListProducts()
            .then(response => setProducts(response.data))
            .catch( error => { console.error(error) } )
        }
        ProductRequestService()
    }, [])

    return(
        <productContext.Provider value={products}>
            {children}
        </productContext.Provider>
    )
}

export function useProduct(){
    return useContext(productContext)
}
