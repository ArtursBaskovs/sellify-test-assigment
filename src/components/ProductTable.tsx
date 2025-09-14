import { useEffect, useRef, useState } from "react";
import { useGetResponse } from "../api/productDataAPI";
import ShareProduct from "./ShareProduct";
import { TiArrowForward, TiDelete } from "react-icons/ti";


export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url: string;
  url: string;
}
type Pagination = {
    page: number,
    total_pages: number,
    total_items: 5
}

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<Pagination>();

    const [isActionVisible, setIsActionVisible] = useState(false);
    const [chosenProductIndex, setChosenProductIndex] = useState<number | null>(null);

    const [productToShare, setProductToShare] = useState<Product | null>(null);
    const [shareWindowIsVisible, setShareWindowIsVisible] = useState(false);

    //get product data from custom hook in async function useEffect, then set it to useState for it to Render
    const productResponseData = useGetResponse();

    //useEffects that set products and pagination data to states when data is actually recieved
    useEffect(() => {
        if (!productResponseData?.data) return;
        setProducts(productResponseData.data);
    }, [productResponseData?.data]);
    useEffect(() => {
        if (!productResponseData?.pagination) return;
        setPagination(productResponseData.pagination);
    }, []);


    //Opens small action window with a choice to share or delete a product    
    const handleActionWindow = (productIndex: number) => {
        //hide action window when same index is chosen a second time
        if (chosenProductIndex == productIndex) {
            setIsActionVisible(false);
            setChosenProductIndex(null);
            return;
        }
        //show action window and set which product's window it is
        setIsActionVisible(true);
        setChosenProductIndex(productIndex);
        
    }
    useEffect(() =>{
        console.log(chosenProductIndex);
    }, [chosenProductIndex])

    //pass product to state that will be passed to ShareProduct component
    const handleShareWindow = (id: string) => {
        if(!id) return;
        const productById = products.find(product => product._id === id);
        if(productById === undefined) {
            console.error("This product was not found: ", productById);
            return;
        }
        setProductToShare(productById);
        
        setShareWindowIsVisible(true);
    }

    const deleteProduct = (id: string) => {
        //new array without a record that needs to be removed
        const updatedProductList = products.filter(product => product._id !== id);
        setProducts(updatedProductList);

        //hide action window and reset it's value
        setIsActionVisible(false);
        setChosenProductIndex(null);
    }

    return (
        <>
        {shareWindowIsVisible && (
            <>
            <div className="blurOverlay" onClick={() => {setShareWindowIsVisible(false)}}></div>
            <ShareProduct product={productToShare}></ShareProduct>
            </>
        )}
        <div className="products-table">

            <div className="table-column-titles">
                <h2 className="product-h">Product</h2>
                <h2 className="category-h">Category</h2>
                <h2 className="price-h">Price</h2>
            </div>
            {products.map((product, index) => (
                <div key={index} className="products-table-record">

                    <div className="product-block">
                        <a href={product.url}>
                            <img src={product.image_url} alt={product.name}></img>
                        </a>
                        
                        <div className="info-column">
                            <a href={product.url}>
                                <h2>{product.name}</h2>
                            </a>
                            <span className="small-text">
                                {product.description}
                            </span>
                            
                        </div>
                    </div>

                    <div className="category-block">
                        <h2>{product.category}</h2>
                    </div>

                    <div className="price-block">
                        <h2>
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: product.currency
                            }).format(product.price)}
                        </h2>
                    </div>

                    <div className="vartical-dots-block">
                        <span role="button" className="dots-btn" onClick={() => handleActionWindow(index)}>&#8942;</span>
                        {isActionVisible && chosenProductIndex == index && (
                            <div className="dropdown-menu">
                                <button className="share-btn" onClick={() => handleShareWindow(product._id)}>
                                    <TiArrowForward size={30} className="btn-incon"/>
                                    Share
                                </button>
                                <button className="delete-btn" onClick={() => deleteProduct(product._id)}>
                                    <TiDelete size={30} className="btn-incon"/>
                                    Delete
                                </button>
                            </div>
                        )}                              
                    </div>

                </div>
            ))}


      
        </div>
        </>
    )
}
export default ProductTable;