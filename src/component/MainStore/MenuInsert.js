import * as m from "../styles/StyledMain.tsx";
import styles from "../styles/MenuInsert.module.css";
import upload_file from "../assets/img/upload-files-4ee86225-svg.svg";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import * as s from "../styles/StyledStore.tsx";
import { Option, Select } from "@material-tailwind/react";
import { useNavigate } from "react-router";
import thumb from "../assets/img/product-thumb-1-bfdce747-webp@2x.png";
import axios from "axios";
import { axiosInToken } from "../../config.js";
import { tokenAtom, memberAtom } from "../../atoms";
import { useAtomValue,useAtom } from "jotai/react";
import logo from "../assets/img/logo.svg";
function MenuInsert() {
  const [token,setToken] = useAtom(tokenAtom);
  const [menu, setMenu] = useState({
    menuName: "",
    menuPrice: "",
    menuCapacity: "",
    caffeine: "",
    calories: "",
    carbohydrate: "",
    sugar: "",
    natrium: "",
    fat: "",
    protein: "",
    menuStatus: "",
    menuCategoryName: "",
  });
  const [capacityUnit, setCapacityUnit] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const handleInput = (e) => {
    setMenu({
      ...menu,
      [e.target.name]: e.target.value,
    });
  };

  const imageInput = useRef();

  const handleUploadImage = (e) => {
    imageInput.current.click();
  };

  const handleImageInput = (e) => {
    if(!e.target.files[0]){
      return;
    }
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  const handleMenuStatusSelectbox = (value) => {
    setMenu({
      ...menu,
      menuStatus: value,
    });
  };
  const handleCategoryeSelectbox = (value) => {
    setMenu({
      ...menu,
      menuCategoryName: value,
    });
  };

  const fetchMenuCategory = async () => {
    try {
      const response = await axiosInToken(token).get(
        `http://localhost:8080/menuCategoryCopy`
      );
      setCategoryList(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const checkProperties = () => {
    if (
      menu.menuName !== "" &&
      menu.menuPrice !== "" &&
      menu.menuCapacity !== "" &&
      // menu.caffeine !== "" &&
      // menu.calories !== "" &&
      // menu.carbohydrate !== "" &&
      // menu.sugar !== "" &&
      // menu.natrium !== "" !== "" &&
      // menu.fat !== "" &&
      // menu.protein !== "" &&
      menu.menuStatus !== "" &&
      menu.menuCategoryName !== ""
    ) {
      return true;
    }
    return false;
  };
  const handleUpload = async () => {
    const formData = new FormData();
    if (!file) {
      alert("이미지를 등록하세요");
      return;
    }
    formData.append("file", file);
    if (!checkProperties()) {
      alert("등록되지 않은 항목이 존재합니다");
      return;
    }
    const itemSaveForm = {
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      menuCapacity: menu.menuCapacity + capacityUnit,
      caffeine: menu.caffeine,
      calories: menu.calories,
      carbohydrate: menu.carbohydrate,
      sugar: menu.sugar,
      natrium: menu.natrium,
      fat: menu.fat,
      protein: menu.protein,
      menuStatus: menu.menuStatus,
      menuCategoryName: menu.menuCategoryName,
    };
    const json = JSON.stringify(itemSaveForm);
    const blob = new Blob([json], {
      type: "application/json",
    });
    formData.append("menuSaveForm", blob);
    console.log(blob);
    try {
      const response = await axiosInToken(token).post(
        "http://localhost:8080/addMenu",
        formData
      );
      alert("업로드 성공");

      navigate(`/mainMenuDetail/${response.data.code}`);
    } catch (error) {
      console.log(error);
      alert("업로드 실패");
      navigate("/mainMenuList");
    }
  };
  const handleSubmit = () => {
    handleUpload();
  };
  useEffect(() => {
    if(token){
      fetchMenuCategory();
    }
    
  }, [token]);

  return (
    <>
      <m.CarouselDiv>
        <input type="hidden" id="anPageName" name="page" value="MenuInsert" />
        <div className={styles["container-center-horizontal"]}>
          <div className={`${styles["MenuInsert"]} ${styles["screen"]}`}>
            <div className={styles["background"]}>
              <div
                className={`${styles["heading-4-create-products"]} ${styles["valign-text-middle"]}`}
              >
                메뉴 등록
              </div>
              <div className={styles["overlap-group2"]}>
                <div className={styles["form"]}>
                  <div className={`${styles["flex-col"]} ${styles["flex"]}`}>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        메뉴명
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="메뉴명을 입력하세요"
                        name="menuName"
                        value={menu.menuName}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        가격(원)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="가격을 입력하세요(단위 생략)"
                        name="menuPrice"
                        value={menu.menuPrice}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        용량
                      </div>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <s.InputStyle
                          width="220px"
                          type="text"
                          placeholder="용량을 입력하세요"
                          name="menuCapacity"
                          value={menu.menuCapacity}
                          onChange={handleInput}
                        />
                        <div className="select-wrap" style={{ width: "100px" }}>
                          <Select
                            label="용량단위"
                            onChange={(e) => setCapacityUnit(e)}
                          >
                            <Option value="">용량 단위를 선택하세요</Option>
                            <Option value="kg">kg</Option>
                            <Option value="g">g</Option>
                            <Option value="ml">ml</Option>
                            <Option value="L">L</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        카페인 함유량(mg)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="카페인 함유량을 입력하세요(단위 생략)"
                        name="caffeine"
                        value={menu.caffeine}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        지방 함유량(g)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="지방 함유량을 입력하세요(단위 생략)"
                        name="fat"
                        value={menu.fat}
                        onChange={handleInput}
                      />
                    </div>
                    <div
                      className={`${styles["input-1"]} ${styles["input-3"]}`}
                    >
                      <div
                        className={`${styles["label-1"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        이미지 등록
                      </div>
                      <div
                        className={styles["border-1"]}
                        
                      >
                        <img
                          className={styles["product-thumb-1bfdce747webp"]}
                          src={imageUrl === null ? logo : imageUrl}
                          style={{
                            width: "224px",
                            height: "204px",
                            marginRight: "100px",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                          alt="image"
                        ></img>
                      </div>
                      <div
                        className={styles["product-thumb-1bfdce747webp"]}
                        style={{
                          marginRight: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          backgroundColor: "#54473f",
                          marginTop: "10px",
                          borderRadius: "5px",
                          color: "white",
                          fontSize:"14px",
                          height:"30px"
                        }}
                        alt="image"
                        onClick={handleUploadImage}
                      >
                        업로드
                      </div>
                    </div>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={imageInput}
                      onChange={handleImageInput}
                    ></input>
                  </div>
                  <div className={styles["container-container"]}>
                    <div className={styles["container-3"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        카테고리
                      </div>
                      <div
                        className="select-wrap"
                        style={{ width: "440px", marginBottom: "20px" }}
                      >
                        <s.ButtonInnerDiv
                          className="w-16"
                          style={{ width: "440px", marginBottom: "20px" }}
                        >
                          <div
                            className="select-wrap"
                            style={{ width: "440px" }}
                          >
                            <Select
                              label="대분류"
                              onChange={handleCategoryeSelectbox}
                            >
                              {categoryList.map((category, index) => (
                                <Option
                                  key={index}
                                  value={category.categoryValue}
                                >
                                  {category.categoryName}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </s.ButtonInnerDiv>
                      </div>
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        열량(kcal)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="열량을 입력하세요(단위 생략)"
                        name="calories"
                        value={menu.calories}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        탄수화물 함유량(g)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="탄수화물 함유량을 입력하세요(단위 생략)"
                        name="carbohydrate"
                        value={menu.carbohydrate}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        나트륨 함유량(mg)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="나트륨 함유량을 입력하세요(단위 생략)"
                        name="natrium"
                        value={menu.natrium}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        단백질 함유량(g)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="단백질 함유량을 입력하세요(단위 생략)"
                        name="protein"
                        value={menu.protein}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        당류&nbsp;&nbsp;함유량(g)
                      </div>
                      <s.InputStyle
                        width="440px"
                        type="text"
                        placeholder="당류 함유량을 입력하세요(단위 생략)"
                        name="sugar"
                        value={menu.sugar}
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles["container"]}>
                      <div
                        className={`${styles["label"]} ${styles["valign-text-middle"]} ${styles["notosanskr-bold-black-16px"]}`}
                      >
                        상태
                      </div>
                      <div
                        className="select-wrap"
                        style={{ width: "440px", marginBottom: "20px" }}
                      >
                        <Select
                          label="메뉴 상태"
                          onChange={handleMenuStatusSelectbox}
                        >
                          <Option value="">메뉴 상태를 입력하세요</Option>
                          <Option value="normal">일반</Option>
                          <Option value="signature">시그니처</Option>
                          <Option value="best">베스트</Option>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={styles["small-btn_brown"]}
                  style={{ cursor: "pointer" }}
                  onClick={handleSubmit}
                >
                  <div
                    className={`${styles["text-20"]} ${styles["valign-text-middle"]} ${styles["themewagongithubiosemanticheading-6"]}`}
                  >
                    메뉴 등록
                  </div>
                </div>
              </div>
            </div>
            <footer className={styles["footer"]}>
              <div className={styles["footer-contents"]}>
                <div className={`${styles["flex-row"]} ${styles["flex"]}`}>
                  <div
                    className={`${styles["flex-col-1"]} ${styles["flex-col-3"]}`}
                  >
                    <div className={styles["overlap-group-1"]}>
                      <p
                        className={`${styles["x"]} ${styles["valign-text-middle"]} ${styles["notosanskr-light-coconut-12px"]}`}
                      >
                        상호명 : ㈜더블유컨셉코리아 ㅣ 대표자 : 이주철 ㅣ 주소 :
                        서울특별시 강남구 테헤란로 231, EAST동 20층(역삼동,
                        센터필드)
                        <br />
                        사업자등록번호 : 211-88-19183 ㅣ 통신판매업신고 :
                        제2009호-서울강남-00847호
                      </p>
                      <div
                        className={`${styles["text-21"]} ${styles["valign-text-middle"]}`}
                      >
                        사업자정보확인
                      </div>
                      <p
                        className={`${styles["text-22"]} ${styles["valign-text-middle"]} ${styles["notosanskr-light-coconut-12px"]}`}
                      >
                        │ 개인정보보호책임자 : 허선희 │ 호스팅서비스 : ㈜
                        더블유컨셉코리아
                      </p>
                    </div>
                    <p
                      className={`${styles["copyright"]} ${styles["valign-text-middle"]} ${styles["notosanskr-light-coconut-12px"]}`}
                    >
                      COPYRIGHT ⓒ ㈜더블유컨셉코리아 ALL RIGHTS RESERVED
                    </p>
                  </div>
                  <div className={styles["vertical-divider-1"]}></div>
                </div>
                <div
                  className={`${styles["flex-col-2"]} ${styles["flex-col-3"]}`}
                >
                  <p
                    className={`${styles["heading-3"]} ${styles["valign-text-middle"]}`}
                  >
                    <span>
                      <span className={styles["span0-1"]}>
                        소비자피해보상보험
                        <br />
                      </span>
                      <span className={styles["span1-2"]}>
                        고객님은 안전거래를 위해 현금 결제 시, Wconcept 에서
                        가입한
                        <br />
                        소비자피해보상보험 서비스를 이용하실 수 있습니다.
                      </span>
                    </span>
                  </p>
                  <div className={styles["text-container"]}>
                    <div
                      className={`${styles["text-23"]} ${styles["valign-text-middle"]} ${styles["notosanskr-light-coconut-12px"]}`}
                    >
                      보상대상 : 미배송/반품, 환불거부/쇼핑몰부도
                    </div>
                    <div
                      className={`${styles["text-24"]} ${styles["valign-text-middle"]}`}
                    >
                      서비스 가입사실 확인
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </m.CarouselDiv>
    </>
  );
}

export default MenuInsert;
