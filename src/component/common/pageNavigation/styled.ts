import styled from "styled-components";

export const PageNavigateStyled = styled.div`
    text-align: center;
    margin: 20px auto; /* 상하 여백 추가 */
    padding: 0 15px; /* 좌우 패딩 추가 */

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: inline-flex; /* 수평 정렬 */
    }

    li {
        margin: 0; /* 버튼 사이 여백 제거 */
        display: inline; /* 수평 정렬을 위해 inline 설정 */
    }

    a {
        display: inline-block;
        padding: 10px 15px; /* 버튼 여백 줄이기 */
        font-size: 0.875rem; /* 폰트 크기 줄이기 */
        color: black; /* 기본 글자 색상 */
        text-decoration: none;
        border: 1px solid #dee2e6; /* 기본 버튼 테두리 */
        border-radius: 0; /* 테두리 둥글기 제거 */
        background-color: #fff; /* 기본 배경 색상 */
        transition: background-color 0.2s, color 0.2s, border-color 0.2s; /* 부드러운 색상 전환 */
        box-sizing: border-box; /* 패딩과 테두리를 포함하여 요소의 크기 설정 */
        margin: -1px 0 0 -1px; /* 버튼 사이의 테두리 충돌 방지 */
    }

    a:first-child {
        border-top-left-radius: 0.25rem; /* 첫 번째 버튼의 왼쪽 상단 둥글기 */
        border-bottom-left-radius: 0.25rem; /* 첫 번째 버튼의 왼쪽 하단 둥글기 */
    }

    a:last-child {
        border-top-right-radius: 0.25rem; /* 마지막 버튼의 오른쪽 상단 둥글기 */
        border-bottom-right-radius: 0.25rem; /* 마지막 버튼의 오른쪽 하단 둥글기 */
    }

    a:hover,
    a:focus {
        background-color: #e9ecef; /* 호버 시 배경 색상 */
        color: black; /* 호버 시 글자 색상 */
        border-color: #adb5bd; /* 호버 시 테두리 색상 */
    }

    .active a {
        background-color: #007bff; /* 활성화된 버튼 배경 색상 */
        color: white; /* 활성화된 버튼 텍스트 색상 */
        border-color: #007bff; /* 활성화된 버튼 테두리 색상 */
    }

    .disabled a {
        color: #6c757d; /* 비활성화된 버튼 텍스트 색상 */
        pointer-events: none; /* 클릭 불가능 */
        background-color: #e9ecef; /* 비활성화된 버튼 배경 색상 */
        border-color: #dee2e6; /* 비활성화된 버튼 테두리 색상 */
    }
`;
