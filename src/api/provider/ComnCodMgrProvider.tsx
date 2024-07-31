import { FC, useState, createContext } from "react";

// 2. 타입을 정하기 위해 인터페이스 생성
interface Context {
    searchKeyword: object;
    setSearchKeyword: (keyword: object) => void;
}

// 1. 초기값 생성
const defaultValue: Context = {
    searchKeyword: {},
    setSearchKeyword: () => {},
};

export const ComnCodContext = createContext(defaultValue);

// ReactNode    : 모든 컴포넌트, 타입들의 최상위 타입 (모든 타입 보장)
// ReactElement : 컴포넌트만 보장해주는 타입 (string 같은 타입은 보장해주지 않음, 컴포넌트만!)
export const ComnCodProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    return <ComnCodContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</ComnCodContext.Provider>;
};
