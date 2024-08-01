import { useNavigate, useParams } from "react-router-dom";
import { ComnCodeMgrDetailMainStyled } from "./styled";
import { ContentBox } from "../../../common/ContentBox/ContentBox";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ComnCodeMgrDetailModal } from "../ComnCodeMgrDetailModal/ComnCodeMgrDetailModal";

// 상세코드 목록 요청에 대한 응답
export interface IListComnDtlCodJsonResponse {
    totalCntComnDtlCod: number;
    listComnDtlCodModel: IComnDetailList[];
    pageSize: number;
    currentPageComnDtlCod: number;
}

// 상세코드 목록
export interface IComnDetailList {
    row_num: number;
    grp_cod: string;
    grp_cod_nm: string;
    dtl_cod: string;
    dtl_cod_nm: string;
    dtl_cod_eplti: string;
    use_poa: string;
    fst_enlm_dtt: string;
    fst_rgst_sst_id: string;
    fnl_mdfd_dtt: string;
}

export const ComnCodeMgrDetailMain = () => {
    const { grpCod } = useParams();
    const navigate = useNavigate();
    const [comnDetailList, setComnDetailList] = useState<IComnDetailList[]>([]);
    const [modal, setModal] = useRecoilState(modalState);
    const [detailCode, setDetailCode] = useState<string>();

    useEffect(() => {
        searchComnCodeDetail();
    }, []);

    const searchComnCodeDetail = (cpage?: number) => {
        cpage = cpage || 1;
        const postAction: AxiosRequestConfig = {
            method: "POST",
            url: "/system/listComnDtlCodJson.do",
            data: { grp_cod: grpCod, currentPage: cpage, pageSize: 5 },
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios(postAction).then((res: AxiosResponse<IListComnDtlCodJsonResponse>) => {
            setComnDetailList(res.data.listComnDtlCodModel);
        });
    };

    const handlerModal = (detailCode?: string) => {
        setModal(!modal);
        setDetailCode(detailCode);
    };

    const onPostSuccess = () => {
        setModal(!modal);
        searchComnCodeDetail();
    };

    return (
        <ComnCodeMgrDetailMainStyled>
            <ContentBox>공통코드 상세조회</ContentBox>
            <Button height={40} onClick={() => navigate(-1)}>
                뒤로가기
            </Button>
            <Button height={40} onClick={handlerModal}>
                신규등록
            </Button>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={10}>그룹코드</StyledTh>
                        <StyledTh size={10}>상세코드</StyledTh>
                        <StyledTh size={7}>상세코드명</StyledTh>
                        <StyledTh size={10}>상세코드 설명</StyledTh>
                        <StyledTh size={5}>사용여부</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {comnDetailList && comnDetailList.length > 0 ? (
                        comnDetailList.map((comnDetail) => {
                            return (
                                <tr key={comnDetail.dtl_cod} onClick={() => handlerModal(comnDetail.dtl_cod)}>
                                    <StyledTd>{comnDetail.grp_cod}</StyledTd>
                                    <StyledTd>{comnDetail.dtl_cod}</StyledTd>
                                    <StyledTd>{comnDetail.dtl_cod_nm}</StyledTd>
                                    <StyledTd>{comnDetail.dtl_cod_eplti}</StyledTd>
                                    <StyledTd>{comnDetail.use_poa}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={5}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <ComnCodeMgrDetailModal detailCode={detailCode} onPostSuccess={onPostSuccess}></ComnCodeMgrDetailModal>
        </ComnCodeMgrDetailMainStyled>
    );
};
