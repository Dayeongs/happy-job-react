import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export interface INoticeModalProps {
    noticeSeq?: number;
}

export interface INoticeDetail {
    noti_seq: number;
    loginID: string;
    noti_title: string;
    noti_content: string;
    noti_date: string;
    file_name: string | null;
    phsycal_path: string | null;
    logical_path: string | null;
    file_size: number | null;
    file_ext: string | null;
}

export interface INoticeDetailResponse {
    detailValue: INoticeDetail;
}

/* 
    부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하는 방법
        - 부모 컴포넌트에서 자식 컴포넌트에 값을 전달할 때, 해당 값들은 'props'라는 객체에 담겨서 전달된다.
        1. props를 객체 형태로 전달받기
            - props를 객체를 통해 전달된 값에 접근할 수 있다. 
            - 'props.속성명' 형태로 값에 접근할 수 있다.
        2. 객체 구조 분해 할당을 사용하여 값 전달받기
            - 객체 구조 분해 할당을 사용하면 props 객체에서 직접 필요한 값을 추출하여 사용할 수 있다.
            - '{ 속성명 }' 형태로 전달받은 값을 바로 사용할 수 있다.

    FC (Function Component)
        - React에서 제공하는 타입으로, 함수형 컴포넌트의 타입을 정의할 때 사용한다.
        - React에서 TypeScript를 사용할 때 제네릭(<>)을 사용하여 props의 타입을 지정할 수 있다.
*/
export const NoticeModal: FC<INoticeModalProps> = ({ noticeSeq }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();

    useEffect(() => {
        searchDetail();
    }, []);

    const searchDetail = () => {
        axios.post("/system/noticeDetail.do", { noticeSeq }).then((res: AxiosResponse<INoticeDetailResponse>) => {
            setNoticeDetail(res.data.detailValue);
        });
    };
    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" defaultValue={noticeDetail?.noti_title}></input>
                </label>
                <label>
                    내용 : <input type="text" defaultValue={noticeDetail?.noti_content}></input>
                </label>
                <div className={"button-container"}>
                    <button>등록</button>
                    <button>삭제</button>

                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
