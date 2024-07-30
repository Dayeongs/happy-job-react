import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Protal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import moment from "moment";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";

export interface INoticeList {
    file_ext: string;
    file_name: string;
    file_size: number;
    logical_path: string;
    loginID: string;
    noti_content: string;
    noti_date: string;
    noti_seq: number;
    noti_title: string;
    phsycal_path: string;
}

export interface INoticeListJsonResponse {
    noticeCnt: number;
    noticeList: INoticeList[];
}

export const NoticeMain = () => {
    // useLocation -> {pathname: '/react/system/notice.do', search: '?searchStDate=2024-07-01&searchEdDate=2024-07-31', hash: '', state: null, key: 'tzvwcc2h'}
    const { search } = useLocation();
    const [noticeList, setNoticeList] = useState<INoticeList[]>([]);
    const [listCount, setListCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeSeq, setNoticeSeq] = useState<number>();
    const [currentParam, setCurrentParam] = useState<number | undefined>();

    // useEffect 형식
    //   useEffect(() => {}, [])
    //     - function : () => {}, 수행하고자 하는 작업
    //     - deps     : [], 배열 형태이며 배열안에는 검사하고자 하는 특정 값 또는 빈 배열
    useEffect(() => {
        searchNoticeList();
    }, [search]);

    // cpage의 값이 있을수도 있고 없을수도 있기 때문에 물음표(?)를 사용한다.
    const searchNoticeList = (cpage?: number) => {
        cpage = cpage || 1;
        const searchParam = new URLSearchParams(search);

        searchParam.append("cpage", cpage.toString());
        searchParam.append("pageSize", "5");

        axios.post("/system/noticeListJson.do", searchParam).then((res: AxiosResponse<INoticeListJsonResponse>) => {
            setNoticeList(res.data.noticeList);
            setListCount(res.data.noticeCnt);
            setCurrentParam(cpage);
        });
    };

    const handlerModal = (seq?: number) => {
        setNoticeSeq(seq);
        setModal(!modal);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchNoticeList();
    };

    return (
        <>
            <div style={{ paddingTop: 20 }}>
                <span>
                    총 갯수 : {listCount} 현재 페이지 : {currentParam}
                </span>
            </div>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {noticeList.length > 0 ? (
                        noticeList?.map((notice) => {
                            return (
                                <tr key={notice.noti_seq} onClick={() => handlerModal(notice.noti_seq)}>
                                    <StyledTd>{notice.noti_seq}</StyledTd>
                                    <StyledTd>{notice.noti_title}</StyledTd>
                                    <StyledTd>{moment(notice.noti_date).format("YYYY-MM-DD HH:mm:ss")}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={listCount}
                onChange={searchNoticeList}
                itemsCountPerPage={5}
                activePage={currentParam as number}
            ></PageNavigate>
            {modal ? (
                <Protal>
                    <NoticeModal noticeSeq={noticeSeq} setNoticeSeq={setNoticeSeq} onSuccess={postSuccess}></NoticeModal>
                </Protal>
            ) : null}
        </>
    );
};
