import { atom } from "recoil";

/**
 * g enum(열거형)은 관련된 값들을 하나의 그룹으로 이름 붙여서 묶어놓는 타입
 * g 정해진 값들 중 하나만 사용하게 강제할 수 있는 타입
 * g "TO_DO"의 값은 숫자로 0이 되는 데, "TO_DO" = "todo" 이런 식으로 문자형 값으로 변환 가능 
*/
export enum ToDoCatEnum {
    "TO_DO",
    "DOING",
    "DONE"
}

//g enum 라벨
export const ToDoCatEnumLabel: Record<ToDoCatEnum, string> = {
    [ToDoCatEnum.TO_DO]: "To Do",
    [ToDoCatEnum.DOING]: "Doing",
    [ToDoCatEnum.DONE]: "Done",
};

export interface IToDo {
    text: string;
    date: number;
    category: ToDoCatEnum;
}

export const ToDoAtom = atom<IToDo[]>({
    key: "toDoAtomKey",
    default: []
});

export const ToDoCatAtom = atom<ToDoCatEnum>({
    key: "toDoCatAtomKey",
    default: ToDoCatEnum.TO_DO
});