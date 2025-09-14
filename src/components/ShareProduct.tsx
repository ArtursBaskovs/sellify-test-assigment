import { useEffect, useState } from "react";
import type { Product } from "./ProductTable";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { BiLink } from "react-icons/bi";

type ShareProductProps = {
    product: Product | null;
}
const ShareProduct: React.FC<ShareProductProps> = ({product}) => {
    const [productToShare, setProductToShare] = useState<Product | null>(null);
    
    //when i recieve product date from parent component I set it in this component
    useEffect(() =>{
        if(product == null) return;
        setProductToShare(product);
        console.log("Share: ", product);
    }, [product]);

    return (
        <>
        
        <div className="share-product-window above-blurOverlay">

            <div className="center-title">
                <h2>Share your product!</h2>
            </div>
            

            <div className="product-to-share">
                <img src={productToShare?.image_url} alt={productToShare?.name} />

                <div className="info-column-share">
                    <h2 className="blue-title">
                        {productToShare?.name}
                    </h2>
                    <span className="small-text">
                        {productToShare?.description}
                    </span>
                </div>

            </div>

            <div className="share-btn-container">
                <button className="share-btn purple-btn">
                    <FaFacebook></FaFacebook>
                    Share
                </button>
                <button className="share-btn blue-btn">
                    <FaTwitter></FaTwitter>
                    Tweet
                </button>
                <button className="share-btn purple-btn">
                    <BiLink></BiLink>
                    Copy link
                </button>
            </div>            
        </div>
        </>
    )
}
export default ShareProduct;