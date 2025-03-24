//g atom들을 모아서 써줄 때, 파일 전체(인터페이스 + 아톰)를 내보내고 싶다면 나눠서 내보낼게 아니라 *를 써주는 게 오류가 없음
export * from "./atoms/toDoAtom";
export { ToDoSelector } from "./selectors/toDoSelector";