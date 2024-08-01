import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { ComnCodMgrMainStyled } from "./styled";
import { useContext, useEffect, useState } from "react";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import fomatDate from "../../../../common/formatDate";
import { ComnCodContext } from "../../../../api/provider/ComnCodMgrProvider";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import { ComnCodMgrModal } from "../ComnCodMgrModal/ComnCodMgrModal";
import { useNavigate } from "react-router-dom";
import { postComnCodMgrApi } from "../../../../api/postComnCodMgrApi";
import { ComnCodMgrApi } from "../../../../api/api";

export interface IComnCodList {
    row_num: number;
    grp_cod: string;
    grp_cod_nm: string;
    grp_cod_eplti: string;
    use_poa: string;
    fst_enlm_dtt: number;
    reg_date: string | null;
    detailcnt: number;
}

export interface ISearchComnCod {
    totalCount: number;
    listComnGrpCod: IComnCodList[];
}

export const ComnCodMgrMain = () => {
    const [comnCodList, setComnCodList] = useState<IComnCodList[]>([]);
    const [totalCnt, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const { searchKeyword } = useContext(ComnCodContext);
    const [modal, setModal] = useRecoilState(modalState);
    const [grpCod, setGrpCod] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        searchComnCod();
    }, [searchKeyword]);

    // 검색 화면
    const searchComnCod = async (cpage?: number) => {
        cpage = cpage || 1;

        // axios.post('system/listComnGrpCodJson.do', { currentPage: cpage, pageSize: 5 });
        // const postAction: AxiosRequestConfig = {
        //     method: "POST",
        //     url: "/system/listComnGrpCodJson.do",
        //     data: { ...searchKeyword, currentPage: cpage, pageSize: 5 },
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // };

        // axios(postAction).then((res: AxiosResponse<ISearchComnCod>) => {
        //     setComnCodList(res.data.listComnGrpCod);
        //     setTotalCnt(res.data.totalCount);
        //     setCurrentPage(cpage);
        // });

        const postSearchComnCod = await postComnCodMgrApi<ISearchComnCod>(ComnCodMgrApi.listComnGrpCodJson, {
            ...searchKeyword,
            currentPage: cpage,
            pageSize: 5,
        });

        if (postSearchComnCod) {
            setComnCodList(postSearchComnCod.listComnGrpCod);
            setTotalCnt(postSearchComnCod.totalCount);
            setCurrentPage(cpage);
        }
    };

    const onPostSuccess = () => {
        setModal(!modal);
        searchComnCod(currentPage);
    };

    const handlerModal = (grpCod: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation(); // tr을 눌렀을 때 발생하는 이벤트 제거
        setGrpCod(grpCod);
        setModal(!modal);
    };

    return (
        <ComnCodMgrMainStyled>
            <Button
                onClick={() => {
                    setModal(!modal);
                }}
                height={40}
            >
                신규등록
            </Button>
            <StyledTable>
                <colgroup>
                    <col width="20%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="7%" />
                    <col width="10%" />
                    <col width="5%" />
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={10}>그룹코드</StyledTh>
                        <StyledTh size={5}>그룹코드명</StyledTh>
                        <StyledTh size={10}>그룹코드 설명</StyledTh>
                        <StyledTh size={5}>사용여부</StyledTh>
                        <StyledTh size={7}>등록일</StyledTh>
                        <StyledTh size={3}>비고</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {comnCodList?.length > 0 ? (
                        comnCodList.map((a) => {
                            return (
                                // 해당 컴포넌트의 tr에 대한 식별할만한 유니크한 key 값이 필요하다.
                                <tr
                                    key={a.grp_cod}
                                    onClick={() => {
                                        navigate(a.grp_cod, { state: { grpCodNm: a.grp_cod_nm } });
                                    }}
                                >
                                    <StyledTd>{a.grp_cod}</StyledTd>
                                    <StyledTd>{a.grp_cod_nm}</StyledTd>
                                    <StyledTd>{a.grp_cod_eplti}</StyledTd>
                                    <StyledTd>{a.use_poa}</StyledTd>
                                    <StyledTd>{fomatDate(a.fst_enlm_dtt)}</StyledTd>
                                    <StyledTd>
                                        <a
                                            onClick={(e) => {
                                                handlerModal(a.grp_cod, e);
                                            }}
                                        >
                                            수정
                                        </a>
                                    </StyledTd>
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
            <PageNavigate totalItemsCount={totalCnt} onChange={searchComnCod} itemsCountPerPage={5} activePage={currentPage as number}></PageNavigate>
            {/* {modal ? <ComnCodMgrModal></ComnCodMgrModal> : null} */}
            <ComnCodMgrModal onPostSuccess={onPostSuccess} grpCod={grpCod} setGrpCod={setGrpCod}></ComnCodMgrModal>
        </ComnCodMgrMainStyled>
    );
};

// Recoil(프로젝트의 최상단에 위치시켜 상태공유)과 Context Api를 사용한 컴포넌트 상태관리
