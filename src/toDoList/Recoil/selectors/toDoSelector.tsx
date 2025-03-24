import { selector } from "recoil";
import { ToDoAtom, ToDoCatAtom } from "../atoms/toDoAtom";

//g atom의 상태를 계산하거나 파생된 값을 만들기 위한 함수형 상태
export const ToDoSelector = selector({
    key: "toDoSelectorKey",
    get: ({ get }) => {

        const toDos = get(ToDoAtom);
        const cat   = get(ToDoCatAtom);

        return toDos.filter(toDo => toDo.category === cat);
    }
});