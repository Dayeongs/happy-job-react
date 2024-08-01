import { useRecoilState } from "recoil";
import { ComnCodeDetailTableStyled, ComnCodeMgrDetailModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { Button } from "../../../common/Button/Button";
import { FC, useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useLocation, useParams } from "react-router-dom";

export interface ISelectComnDtlCodeResponse {
    result: "SUCCESS";
    comnDtlCodModel: IComnDtlCodeModel;
}

export interface IComnDtlCodeModel {
    row_num?: number;
    grp_cod?: string;
    grp_cod_nm?: string;
    dtl_cod?: string;
    dtl_cod_nm?: string;
    dtl_cod_eplti?: string;
    use_poa?: string;
}

export interface IComnCodeMgrDetailModalProps {
    detailCode?: string;
    onPostSuccess: () => void;
}

export interface ISelectComnDtlCod {
    result: "SUCCESS";
}

// props는 읽기 전용이다. 변경이 불가능하다.
// props를 변경해야하는 경우 저장한 후에 변경해야 한다.
export const ComnCodeMgrDetailModal: FC<IComnCodeMgrDetailModalProps> = ({ detailCode, onPostSuccess }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const { grpCod } = useParams();
    const { state } = useLocation();
    const [comnDetail, setComnDetail] = useState<IComnDtlCodeModel>();

    // react-modal의 특징 : Dom에 렌더링 될때 이미 해당 컴포넌트가 등록되어 있다.
    // 의존성 배열 : 배열속에 있는 값이 변경될때마다 useEffect가 재실행된다.
    useEffect(() => {
        if (modal && detailCode) searchDetail();
    }, [detailCode]);

    const searchDetail = () => {
        const postAction: AxiosRequestConfig = {
            method: "POST",
            url: "/system/selectComnDtlCod.do",
            data: { grp_cod: grpCod, dtl_cod: detailCode },
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios(postAction).then((res: AxiosResponse<ISelectComnDtlCodeResponse>) => {
            if (res.data.result === "SUCCESS") setComnDetail(res.data.comnDtlCodModel);
        });
    };

    const handlerSave = () => {
        const postAction: AxiosRequestConfig = {
            method: "POST",
            url: "/system/saveComnDtlCodJson.do",
            data: { ...comnDetail, dtl_grp_cod: grpCod },
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios(postAction).then((res: AxiosResponse<ISelectComnDtlCod>) => {
            if (res.data.result === "SUCCESS") onPostSuccess();
        });
    };

    const handlerUpdate = () => {
        const postAction: AxiosRequestConfig = {
            method: "POST",
            url: "/system/updateComnDtlCodJson.do",
            data: { ...comnDetail, dtl_grp_cod: grpCod },
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            axios(postAction).then((res: AxiosResponse<ISelectComnDtlCod>) => {
                if (res.data.result === "SUCCESS") onPostSuccess();
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handlerDelete = () => {
        const postAction: AxiosRequestConfig = {
            method: "POST",
            url: "/system/deleteComnDtlCodJson.do",
            data: { dtl_cod: detailCode, dtl_grp_cod: grpCod },
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios(postAction).then((res: AxiosResponse<ISelectComnDtlCod>) => {
            if (res.data.result === "SUCCESS") onPostSuccess();
        });
    };

    const cleanUp = () => {
        setComnDetail(undefined);
    };

    return (
        <ComnCodeMgrDetailModalStyled isOpen={modal} ariaHideApp={false} onAfterClose={cleanUp}>
            <div className="wrap">
                <div className="header">상세 코드 관리</div>
                <ComnCodeDetailTableStyled>
                    <tbody>
                        <tr>
                            <th>그룹 코드 id</th>
                            <td>
                                <input type="text" name="grp_cod" defaultValue={grpCod} readOnly={detailCode ? true : false}></input>
                            </td>
                            <th>그룹 코드 명</th>
                            <td>
                                <input type="text" name="grp_cod_nm" defaultValue={state.grpCodNm} readOnly={detailCode ? true : false}></input>
                            </td>
                        </tr>
                        <tr>
                            <th>상세 코드 id </th>
                            <td>
                                <input
                                    type="text"
                                    defaultValue={comnDetail?.dtl_cod}
                                    onChange={(e) => setComnDetail({ ...comnDetail, dtl_cod: e.target.value })}
                                    readOnly={detailCode ? true : false}
                                ></input>
                            </td>
                            <th>상세 코드 명</th>
                            <td>
                                <input type="text" defaultValue={comnDetail?.dtl_cod_nm} onChange={(e) => setComnDetail({ ...comnDetail, dtl_cod_nm: e.target.value })}></input>
                            </td>
                        </tr>
                        <tr>
                            <th>코드 설명</th>
                            <td colSpan={3}>
                                <input type="text" defaultValue={comnDetail?.dtl_cod_eplti} onChange={(e) => setComnDetail({ ...comnDetail, dtl_cod_eplti: e.target.value })}></input>
                            </td>
                        </tr>
                        <tr>
                            <th>사용 유무 *</th>
                            <td colSpan={3}>
                                <input type="radio" name="useYn" value={"Y"} onChange={(e) => setComnDetail({ ...comnDetail, use_poa: e.target.value })} checked={comnDetail?.use_poa === "Y"}></input>
                                사용
                                <input type="radio" name="useYn" value={"N"} onChange={(e) => setComnDetail({ ...comnDetail, use_poa: e.target.value })} checked={comnDetail?.use_poa === "N"}></input>
                                미사용
                            </td>
                        </tr>
                    </tbody>
                </ComnCodeDetailTableStyled>
                <div className="btn-group">
                    <Button onClick={detailCode ? handlerUpdate : handlerSave}>{detailCode ? "수정" : "저장"}</Button>
                    {detailCode ? <Button onClick={handlerDelete}>삭제</Button> : null}
                    <Button onClick={() => setModal(!modal)}>닫기</Button>
                </div>
            </div>
        </ComnCodeMgrDetailModalStyled>
    );
};
