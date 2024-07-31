import { useContext, useState } from "react";
import { Button } from "../../../common/Button/Button";
import { ComnCodSearchStyled } from "./styled";
import { ComnCodContext } from "../../../../api/provider/ComnCodMgrProvider";

export const ComnCodSearch = () => {
    const { setSearchKeyword } = useContext(ComnCodContext);
    const [input, setInput] = useState<{
        oname: string;
        sname: string;
    }>({
        oname: "",
        sname: "",
    });

    const handlerSearch = () => {
        setSearchKeyword(input);
    };

    return (
        <ComnCodSearchStyled>
            {/* 배열은 주소값이 저장되기 때문에 배열의 값이 바뀌어도 useState는 알지 못한다. ...을 사용하여 새로운 배열을 만들고 값을 복사한다. */}
            <select onChange={(e) => setInput({ ...input, oname: e.currentTarget.value })}>
                <option value={"grp_cod"}>그룹코드</option>
                <option value={"grp_cod_nm"}>그룹코드명</option>
            </select>
            <input onChange={(e) => setInput({ ...input, sname: e.target.value })}></input>
            <Button paddingtop={5} paddingbottom={5} onClick={handlerSearch}>
                검색
            </Button>
        </ComnCodSearchStyled>
    );
};
