import { useRecoilValue, useSetRecoilState } from "recoil";
import CreateToDo from "./component/createToDo";
import ToDo from "./component/toDo";
import { ToDoSelector, ToDoAtom } from "./Recoil";
import Header from "./component/toDoHeader";
import styled from "styled-components";
import { useEffect } from "react";

const ToDoBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Body = styled.main`
    padding: 20px;
    display: flex;
    justify-content: center;
`;

const Sect = styled.section`
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
`;

function List() {
    
    const setToDos  = useSetRecoilState(ToDoAtom);
    const toDos     = useRecoilValue(ToDoSelector);        

    useEffect(() => {

        const storedToDos = localStorage.getItem('toDosData');

        if (storedToDos) {

            try {

                const parsedToDos = JSON.parse(storedToDos);
                setToDos(parsedToDos);

            } catch (error) {

                console.error('JSON Parse Error!');
            }
        }

    }, []);
    
    return (
        <ToDoBody>
            <Header />
            <Body>
                <Sect>
                    <CreateToDo />
                    <ul
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px"
                        }}
                    >
                        {
                            toDos.map(arr => <ToDo key={arr.date} {...arr} />)
                        }
                    </ul>
                </Sect>
            </Body>
        </ToDoBody>
    );
}

export default List;