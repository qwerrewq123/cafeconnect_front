import { NavLink } from 'react-router-dom';
import * as h from '../styles/StyledHeader.tsx';
import * as m from '../styles/StyledMypage.tsx';

import {useEffect, useRef, useState} from "react";
import { Menu, MenuHandler, MenuItem, DialogHeader, DialogBody, Option, input } from "@material-tailwind/react";
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai/react';
import { alarmsAtom, initMember, memberAtom, memberLocalAtom, tokenAtom,cartCountAtom } from '../../atoms.js';
import { useSetAtom } from 'jotai/react';
import axios from 'axios';
import {axiosInToken,url } from '../../config.js';
import ReactSelect from "react-select";
import { CartItem } from '../styledcomponent/cartlist.tsx';

const StoreHeader = ({alarms})=>{
  // 메뉴 모달을 위한 state 변수
  const [openMenu, setOpenMenu] = useState(false);
  // 알람 모달을 위한 state 변수
  const [open, setOpen] = useState(false);
  const handleOpen = () =>{
    setOpen(!open);
  }

  const navigate = useNavigate();
  // Jotai에 있는 member 가져오기
  const [member, setMember] = useAtom(memberAtom);
  // Jotai에 있는 로그인 token 가져오기
  const [token, setToken] = useAtom(tokenAtom);
  // Jotai에 있는 알람 가져오기
  const setAlarms = useSetAtom(alarmsAtom);

  const [storeList, setStoreList] = useState([]);
  const [store, setStore] = useState({storeCode:0, storeName:'', storeStatus:''});

  const inputRef = useRef(null);

  // React Select
  const [selectedStore, setSelectedStore] = useState(null); // value
  const [storeNameList, setStoreNameList] = useState([]); // 전체 아이템 리스트

  useEffect(()=>{
    selectStoreList();
    console.log(store);
  }, [])

  // 알람 체크박스 클릭 시 alarmStatus 바꾸기
  const alarmConfirm = (alarmNum)=>{
    axiosInToken(token).get(`${url}/alarmConfirm/${alarmNum}`)
        .then(res=>{
          if(res.data===true) {
            if(res.headers.authorization!=null) {
              setToken(res.headers.authorization);
            }
            // 알람 확인 시 확인한 알람은 제외하기
            setAlarms(alarms.filter(item=>item.alarmNum!==alarmNum));
          }
        })
        .catch(err=>{
          console.log(err);
          alert("잠시후 다시 시도해주세요");
        })
  }

  // 모든 가맹점 조회
  const selectStoreList = ()=>{
    axiosInToken(token).get(`${url}/selectStoreList/${member.username}`)
    .then(res=>{
      if(res.headers.authorization!=null) {
        setToken(res.headers.authorization);
      }
        console.log(res.data);
        setStoreList([...res.data]);
        setStore(res.data.find(store=>store.storeCode===member.storeCode));
        setStoreNameList(res.data.map(store=>({
          value:store.storeCode,
          label:store.storeName
        })))
    })
    .catch(err=>{
        console.log(err);
    })
  }

  //가맹점 바꾸면 알람 다시 가져오기
  const getAlarmList = (storeCode)=>{

    console.log(store);
    axiosInToken(token).post(`${url}/alarms`,{storeCode:storeCode})
      .then(res=> {
        if(res.headers.authorization!=null) {
          setToken(res.headers.authorization);
        }
        console.log(res.data)
        if(res.data.length!==0) {
          setAlarms(res.data);
        }
      })
      .catch(err=>{
        setAlarms([]);
        console.log(err);
      })
  }

  // 로그아웃
  const logout = ()=>{
    setOpenMenu(false);
    setOpen(false);

    setMember({...initMember});
    setToken('');
    setAlarms([]);

    navigate("/loginStore");
  }
  
  // 가맹점 바꾸기
  const changeStore = (value)=>{
    selectStore(value);
    console.log(value);
    console.log(store);
    setMember({...member, ['storeCode']:value.value})
    console.log(value.value);
    setStore(storeList.find(store=>store.storeCode===member.storeCode));
    getAlarmList(value.value);
  }

  // 장바구니 카운트 가져오기 
  const[cartCount,setCartCount] = useAtom(cartCountAtom);
  // 가맹점 변경될 때마다 장바구니 카운트 업데이트
    useEffect(() => {
      if (member.storeCode) {
        axiosInToken(token).get(`${url}/cartAllCount?storeCode=${member.storeCode}`)
          .then(res => {
            if(res.headers.authorization != null) {
              setToken(res.headers.authorization);
            }
            setCartCount(res.data);
          }).catch(err => {
            console.log(err);
          });
      }
    }, [member.storeCode]); // member.storeCode 변경을 바로바로 적용하기 위함

    //자동완성에서 입력한 상품명의 이름과 코드 변경 및 저장 
    const selectStore = (selectedOption) => {
        setSelectedStore(selectedOption);
    };

  return(
      <div>
        <h.Div className="navbar">
          <h.DivLogo>
            <NavLink to="/shopMain"><h.Logo src="/logo.svg"/></NavLink>
          </h.DivLogo>

          <m.DivSide>
              <m.SelectDivTop>
                <m.ReactSelectDivHeader width='150px'>
                  <m.ReactSelectHeader
                        isSearchable={false}
                        placeholder={store.storeName}
                        value={selectedStore}
                        options={storeNameList}
                        onChange={(e)=>changeStore(e)}
                    />
                </m.ReactSelectDivHeader>
              </m.SelectDivTop>
            {/* <h.SelectDivTop>
              <h.SelectInnerDivTop>
                <h.SelectBoxTop
                  label={store.storeName}
                  onChange={(e)=>changeStore(e)}
                  ref={inputRef}
                  selected={(element) =>
                    { if(element) {
                      const children = inputRef.current.children;
                      console.log(children);
                      // // 자식인 span에 텍스트 설정
                      // children[1].innerHtml = element.props.name;
                      // 처음만 라벨 보이고, 선택하면 라벨 안 보이게 하기
                      // children[1].style.setProperty('display', 'none');
                      return;
                    }}}
                >
                  {storeList.map(store=>(
                    <Option key={store.storeCode} dangerouslySetInnerHTML={{ __html: `${store.storeName}`}} value={store.storeCode} name={store.storeName}></Option>
                  ))}
                </h.SelectBoxTop>
              </h.SelectInnerDivTop>
            </h.SelectDivTop> */}
            <h.VerticalLine/>
            <h.NavLinkSide to="/logout" onClick={logout}>로그아웃</h.NavLinkSide>
          </m.DivSide>

          <h.DivMenu>
            <Menu placement="bottom-start" open={openMenu}
                  handler={setOpenMenu} allowHover offset={0}>
              <MenuHandler className="items-center justify-between">
                <h.DivMenuItem>
                  <h.DivMenuInside>
                    <h.NavLinkMenu to="/shopMain">쇼핑몰</h.NavLinkMenu>
                    <h.NavLinkMenu to="/stockOrderItemAdd">재고관리</h.NavLinkMenu>
                    <h.NavLinkMenu to="/orderList">주문관리</h.NavLinkMenu>
                    <h.NavLinkMenu to="/salesManagement">재무관리</h.NavLinkMenu>
                    <h.NavLinkMenu to="/noticeList">커뮤니티</h.NavLinkMenu>
                    <h.NavLinkMenu to="/myAlarmList">마이페이지</h.NavLinkMenu>
                  </h.DivMenuInside>
                </h.DivMenuItem>
              </MenuHandler>
              <h.MenuListOut>
                <h.MenuListDiv>
                  <MenuItem><NavLink to="/shopMain">쇼핑몰</NavLink></MenuItem>
                </h.MenuListDiv>
                <h.MenuListDiv>
                  <MenuItem><NavLink to="/stockOrderItemAdd">주문상품재고추가</NavLink></MenuItem>
                  <MenuItem><NavLink to="/stockManage">매장재고관리</NavLink></MenuItem>
                  <MenuItem><NavLink to="/stockOtherStore">타매장재고조회</NavLink></MenuItem>
                </h.MenuListDiv>
                <h.MenuListDiv>
                  <MenuItem><NavLink to="/orderList">주문내역</NavLink></MenuItem>
                </h.MenuListDiv>
                <h.MenuListDiv>
                  <MenuItem><NavLink to="/salesWrite">매출입력</NavLink></MenuItem>
                  <MenuItem><NavLink to="/salesAnalysis">매출분석</NavLink></MenuItem>
                  <MenuItem><NavLink to="/expenseList">지출내역</NavLink></MenuItem>
                </h.MenuListDiv>
                <h.MenuListDiv>
                  <MenuItem><NavLink to="/noticeList">공지사항</NavLink></MenuItem>
                  <MenuItem><NavLink to="/complainList">컴플레인 공지</NavLink></MenuItem>
                  <MenuItem><NavLink to="/askList">1:1 문의</NavLink></MenuItem>
                </h.MenuListDiv>
                <h.MenuListDiv>
                  <MenuItem><NavLink to="/myAlarmList">알림 모아보기</NavLink></MenuItem>
                  <MenuItem><NavLink to="/myStoreInfo">가맹점 정보</NavLink></MenuItem>
                  <MenuItem><NavLink to="/myStoreManage">내 가맹점 관리</NavLink></MenuItem>
                </h.MenuListDiv>
              </h.MenuListOut>
            </Menu>
          </h.DivMenu>

          <h.DivIcon>
            <h.NavLinkIcon>
              <h.Icon src="/alarm.png" onClick={handleOpen}/>
              {/* 알람 개수 표시 */}
              <h.AlarmIconDiv>
              <span>{alarms.length===0 ? 0 : alarms.length}</span>
              </h.AlarmIconDiv>
            </h.NavLinkIcon>
            <h.NavLinkIcon to="/repairRequestList"><h.Icon src="/repair.png"/></h.NavLinkIcon>
            <h.NavLinkIcon to="/wishList"><h.Icon src="/wish.png"/></h.NavLinkIcon>
            {/* 장바구니 개수 표시 */}
            <h.NavLinkIcon to="/cartList"><h.Icon src="/cart.png"/>
            <h.AlarmIconDiv>
              <span>{cartCount!==null?cartCount:0}</span>
              </h.AlarmIconDiv> 
            </h.NavLinkIcon>

          </h.DivIcon>
        </h.Div>

        {open && <m.ModalDialog>
          <DialogHeader style={{ padding:'10px 0px'}}>알림</DialogHeader>
          <DialogBody style={{padding:'0px'}}>

            {/* Jotai에 있는 알람 리스트 출력하기 */}
            {alarms.length===0 ? <m.AlarmDiv width='100%' height='130px'>알람이 없습니다.</m.AlarmDiv> :
                alarms.map((item)=>
                    <m.AlarmDiv key={item.alarmNum} width='100%' height='130px'>
                      <m.AlarmCheckboxDivHeader><m.AlarmCheckbox onChange={(e)=>alarmConfirm(item.alarmNum)}/></m.AlarmCheckboxDivHeader>
                      <m.AlarmInnerDiv>
                        <m.AlarmSpan>{item.alarmType}</m.AlarmSpan>
                        <h.VerticalLine marginRight='10px'/>
                        <m.AlarmSpan fontWeight='normal' fontColor='rgba(148, 148, 148, 1)'>{item.alarmDate}</m.AlarmSpan>
                      </m.AlarmInnerDiv>
                      <m.AlarmTextDiv><m.AlarmSpanContent>{item.alarmContent}</m.AlarmSpanContent></m.AlarmTextDiv>
                    </m.AlarmDiv>
                )
            }
          </DialogBody>
        </m.ModalDialog>
        }
      </div>
  )
}
export default StoreHeader;