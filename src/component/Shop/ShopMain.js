//import {Carousel} from "flowbite-react";
import { useState ,useEffect} from 'react';
import { Carousel } from "@material-tailwind/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import * as s from '../styledcomponent/shopmain.tsx'
import { useAtomValue } from 'jotai/react';
import { tokenAtom, memberAtom } from '../../atoms';
import { axiosInToken } from '../../config.js';

function ShopMain() {
  
  const token = useAtomValue(tokenAtom);
  const store = useAtomValue(memberAtom);
  const [items,setItems] = useState({});
  const [quantity, setQuantity] = useState({});

  useEffect(()=>{
    getMajorItems();
  },[token]);

  const getMajorItems=()=>{
    axiosInToken(token).get('shopMain')
    .then(res=>{
      setItems(res.data.allCategory)
    })
    
  }


  const handleQuantityChange = (itemCode, change) => {
    setQuantity(prev => ({
      ...prev,
      [itemCode]: Math.max(1, (prev[itemCode] || 1) + change)
    }));
  };

  const handleAddToCart = (e, itemCode) => {
    const sendQuantity = quantity[itemCode] || 1;
    e.stopPropagation();
    axiosInToken(token)
    .get(`addCart?storeCode=${store.storeCode}&itemCode=${itemCode}&cartItemCount=${sendQuantity}`)
    .then(res => {
      if (res.data != null) {
        alert('장바구니에 등록되었습니다.');
      }
    }).catch(err => {
      console.log(err);
      alert('장바구니 등록에 실패했습니다.');
    });
  };

  const renderProductSection = (category) => (
 
    <s.ShopMainContent key={category}>
    <s.ShopMainTitle>
      {category}
      <s.ShopMaintTitlePlus>+</s.ShopMaintTitlePlus>
    </s.ShopMainTitle>
    <s.ShopMainItemList>
      <s.ItemListUl>
        {items[category]?.map((item) => (
          <s.ItemListLi key={item.itemCode}>
            <s.ItemListImg>
              {/* 이미지 경로대로 업데이트하기 */}
              <img src='/image/item3.jpg' alt={item.itemNum} /> 
              {store.roles==='ROLE_STORE' &&
              <s.HoverControls className="hover-controls">
                <s.QuantityControl>
                  <s.QuantityButton onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item.itemCode, -1);
                            }}>-</s.QuantityButton>
                  <s.QuantityDisplay>{quantity[item.itemCode] || 1}</s.QuantityDisplay>
                  <s.QuantityButton onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item.itemCode, 1);
                            }}>+</s.QuantityButton>
                </s.QuantityControl>
                <s.CartButton onClick={(e) => handleAddToCart(e,item.itemCode)}>
                  <ShoppingCartIcon className="h-6 w-6" />
                </s.CartButton>
              </s.HoverControls>
            }
            </s.ItemListImg>
            <s.ItemListA to={`/shopItemDetail/${item.itemCode}`}>
              <s.ItemListTextBox>
                <s.ItemTitle>{item.itemName}</s.ItemTitle>
                <s.ItemPrice>{item.itemPrice?.toLocaleString()}원</s.ItemPrice>
                {item.itemStorage && (
                  <s.ItemStorageLabelP>
                    <s.ItemStorageType storageWay={item.itemStorage}>
                      {item.itemStorage}
                    </s.ItemStorageType>
                  </s.ItemStorageLabelP>
                )}
              </s.ItemListTextBox>
            </s.ItemListA>
          </s.ItemListLi>
        ))}
      </s.ItemListUl>
    </s.ShopMainItemList>
  </s.ShopMainContent>
);

  const bannerImages = [
    {
      id: 1,
      imageUrl: "/image/cafe1.jpg"
    },
    {
      id: 2,
      imageUrl: "/image/cafe2.jpg"
    },
    {
      id: 3,
      imageUrl: "/image/cafe3.jpg"
    }

  ];
 
  return (
    <s.ShopMainWrapper>
          <div className="h-[480px] mt-16">
      <Carousel
        className="rounded-xl"
        autoplay={true}
        autoplayDelay={4000}  // 3초마다 슬라이드 (시간은 밀리초 단위)
        loop={true}  // 마지막 슬라이드에서 처음으로 돌아가기
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                  }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        
        {/* 배너 이미지 */}
        {bannerImages.map((banner) => (
          <img key={banner.id}
            src={banner.imageUrl}
            alt="testing"
            className="w-full h-full object-cover"
          />
        ))}
      </Carousel>
      </div>
      <s.ShopMainContainer>

      {/* 상품 목록 시작*/}

      {renderProductSection("커피자재")}
      {renderProductSection("분말가공")}
      {renderProductSection("유가공품")}
      {/* 상품 목록 끝 */}
    </s.ShopMainContainer>
    </s.ShopMainWrapper>  
  )
}
export default ShopMain;