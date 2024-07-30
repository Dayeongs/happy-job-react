import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { loginInfoState } from "../../../../stores/userInfo";
import NoImage from "../../../../assets/noImage.jpg";

export interface INoticeModalProps {
    noticeSeq?: number;
    onSuccess: () => void;
    // 부모 컴포넌트에서 전달받은 setNoticeSeq 함수의 파라미터 타입을 재정의
    setNoticeSeq: (noticeSeq: undefined) => void;
}

export interface IPostResponse {
    result: "Success" | "Fail";
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
export const NoticeModal: FC<INoticeModalProps> = ({ noticeSeq, onSuccess, setNoticeSeq }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
    const [userInfo] = useRecoilState(loginInfoState);
    const title = useRef<HTMLInputElement>(null);
    const content = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("notImage");
    const [fileData, setFileData] = useState<File>();

    useEffect(() => {
        if (noticeSeq) {
            searchDetail();
        }

        // 컴포넌트가 사라질 때 실행할 작업
        return () => {
            setNoticeSeq(undefined);
        };
    }, []);

    const searchDetail = () => {
        axios.post("/system/noticeDetail.do", { noticeSeq }).then((res: AxiosResponse<INoticeDetailResponse>) => {
            if (res.data.detailValue) {
            }
            setNoticeDetail(res.data.detailValue);
            const fileExt = res.data.detailValue.file_ext;
            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(res.data.detailValue.logical_path || NoImage);
            } else {
                setImageUrl("notImage");
            }
        });
    };

    // const handlerSave = () => {
    //     axios
    //         .post("/system/noticeSave.do", {
    //             title: title.current?.value,
    //             content: content.current?.value,
    //             loginId: userInfo.loginId,
    //         })
    //         .then((res: AxiosResponse<IPostResponse>) => {
    //             if (res.data.result === "Success") {
    //                 onSuccess();
    //             }
    //         });
    // };

    const handlerSave = () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current?.value,
            content: content.current?.value,
            loginId: userInfo.loginId,
        };
        if (fileData) fileForm.append("file", fileData);
        fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
        axios.post("/system/noticeFileSaveJson.do", fileForm).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "Success") {
                onSuccess();
            }
        });
    };

    // const handlerUpdate = () => {
    //     axios
    //         .post("/system/noticeUpdate.do", {
    //             title: title.current?.value,
    //             content: content.current?.value,
    //             noticeSeq: noticeSeq,
    //         })
    //         .then((res: AxiosResponse<IPostResponse>) => {
    //             if (res.data.result === "Success") {
    //                 onSuccess();
    //             }
    //         });
    // };

    const handlerUpdate = () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current?.value,
            content: content.current?.value,
            loginId: userInfo.loginId,
            noticeSeq, // key와 value 값이 같은 경우
        };
        if (fileData) fileForm.append("file", fileData);
        fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
        axios.post("/system/noticeFileUpdateJson.do", fileForm).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "Success") {
                onSuccess();
            }
        });
    };

    const handlerDelete = () => {
        axios
            .post("/system/noticeDelete.do", {
                noticeSeq: noticeSeq,
            })
            .then((res: AxiosResponse<IPostResponse>) => {
                if (res.data.result === "Success") {
                    onSuccess();
                }
            });
    };

    // 파일 미리보기
    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        if (fileInfo?.length) {
            const fileInfoSplit = fileInfo[0].name.split(".");
            const fileExtension = fileInfoSplit[1].toLowerCase();

            if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else {
                setImageUrl("notImage");
            }
            setFileData(fileInfo[0]);
        }
    };

    const downloadFile = async () => {
        let param = new URLSearchParams();
        param.append("noticeSeq", noticeSeq?.toString() as string);

        const postAction: AxiosRequestConfig = {
            url: "/system/noticeDownload.do",
            method: "POST",
            data: param,
            responseType: "blob",
        };

        await axios(postAction).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", noticeDetail?.file_name as string);
            document.body.appendChild(link);
            link.click();

            link.remove();
        });
    };

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" defaultValue={noticeDetail?.noti_title} ref={title}></input>
                </label>
                <label>
                    내용 : <input type="text" defaultValue={noticeDetail?.noti_content} ref={content}></input>
                </label>
                파일 :<input type="file" id="fileInput" style={{ display: "none" }} onChange={handlerFile}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div>
                    {imageUrl === "notImage" ? (
                        <div style={{ paddingTop: 5 }}>
                            <label>파일명 : {fileData?.name || noticeDetail?.file_name}</label>
                        </div>
                    ) : (
                        <div style={{ paddingTop: 5 }}>
                            <label>미리보기</label>
                            <img src={imageUrl} style={{ paddingTop: 5, width: 150, height: 150 }} alt="이미지 미리보기" onClick={downloadFile} />
                        </div>
                    )}
                </div>
                <div className={"button-container"}>
                    <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? "수정" : "등록"}</button>
                    {noticeSeq ? <button onClick={handlerDelete}>삭제</button> : null}

                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
