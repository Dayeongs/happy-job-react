import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ComnCodMgrMain } from "../component/page/ComnCodMgr/ComnCodMgrMain/ComnCodMgrMain";
import { ComnCodSearch } from "../component/page/ComnCodMgr/ComnCodSearch/ComnCodSearch";
import { ComnCodProvider } from "../api/provider/ComnCodMgrProvider";

export const ComnCodMgr = () => {
    return (
        <>
            <ComnCodProvider>
                {/* 이 안에 있는 자식 컴포넌트들은 ComnCodContext에 저장된 state를 자유롭게 사용이 가능하다. */}
                <ContentBox>공통코드 관리</ContentBox>
                <ComnCodMgrMain />
                <ComnCodSearch />
            </ComnCodProvider>
        </>
    );
};
