import { useRef, useState } from "react";
import { Button } from "../../../common/Button/Button";
import { NoticeSearchStyled } from "./styled";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export const NoticeSearch = () => {
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const title = useRef<HTMLInputElement>(null);
    const [modal, setModal] = useRecoilState<boolean>(modalState);

    const navigate = useNavigate();

    // 1. input 데이터를 쿼리스트링으로 전달하는 방식
    const handlerSearch = () => {
        // 검색 버튼을 누르면 조회가 된다.
        // 변수명 옆에 콜론(:)을 사용하여 변수의 타입을 지정할 수 있다.
        const query: string[] = [];

        // 'title.current' is possibly 'null'. 에러 발생
        // title의 초기값을 null로 설정해서 title 값이 없을수도 있기 때문에 에러가 발생한다.
        // title이 null이 아닌 경우에 값이 출력되도록 ?를 사용한다.
        !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
        !startDate || query.push(`searchStDate=${startDate}`);
        !endDate || query.push(`searchEdDate=${endDate}`);

        // 쿼리스트링 조합
        const queryString = query.length > 0 ? `?${query.join("&")}` : ``;
        navigate(`/react/system/notice.do${queryString}`);
    };

    const handlerModal = () => {
        setModal(!modal);
    };

    return (
        <NoticeSearchStyled>
            <input ref={title}></input>
            <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
            <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
            <Button height={35} fontSize={13} onClick={handlerSearch}>
                검색
            </Button>
            <Button height={35} fontSize={13} onClick={handlerModal}>
                등록
            </Button>
        </NoticeSearchStyled>
    );
};
