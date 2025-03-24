import styled from "styled-components";
import { CustomCatAtom, IsDelToDoAtom, IToDo, ToDoCatEnum, ToDoCatEnumLabel } from "../Recoil";
import { setTimestamp } from "../../utils/common";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ToDoAtom } from "../Recoil";
import { useState } from "react";
import Swal from 'sweetalert2';
import { ThemeAtom } from "../../recoil";

const Card = styled.li`
    background:   ${({ theme }) => theme.cardBg};
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 10px ${({ theme }) => theme.cardShadow};
    transition: box-shadow 0.2s ease;
    &:hover {
        box-shadow: 0 6px 16px ${({ theme }) => theme.cardHoverShadow};
    }
`;

const Title = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
    margin-bottom: 6px;
`;

const Time = styled.div`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
`;

const StatusGroup = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
`;

const StatusButton = styled.button`
    background: transparent;
    color: ${({ theme }) => theme.textPrimary};
    border: 1px solid ${({ theme }) => theme.statusBorder};
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
        background: ${({ theme }) => theme.statusHoverBg};
        color: ${({ theme }) => theme.statusHoverText};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

const ActionButton = styled.button`
    font-size: 0.85rem;
    color: ${({ theme }) => theme.actionText};
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
        color: ${({ theme }) => theme.actionHoverText};
    }
`;

const EditInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 2px solid #ccc;
    font-size: 1rem;
    margin-bottom: 8px;
    &:focus {
        border-color: ${props => props.theme.accentColor};
        outline: none;
    }
`;

const DisabledOverlay = styled.div`
    margin-top: 8px;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.statusBorder};
    font-weight: 500;
    text-align: right;
    opacity: 0.9;
`;

const ToDo = ({ text, date, category }: IToDo) => {

    const setToDos                      = useSetRecoilState(ToDoAtom);
    const [isEditing, setIsEditing]     = useState(false);
    const [editedTitle, setEditedTitle] = useState(text);
    const customCat                     = useRecoilValue(CustomCatAtom);
    const selectTheme                   = useRecoilValue(ThemeAtom);
    const [isDelToDo, setIsDelToDo]                = useRecoilState(IsDelToDoAtom);

    const setCat = (newCat: ToDoCatEnum | string) => {

        //g 배열 값을 새로운 상수로 민들어 전달...기존 값은 불변성을 유지해야 하기에 새로운 배열을 만들어 전달한다.
        setToDos((toDos) => {

            const targetIdx = toDos.findIndex(toDo => toDo.date === date);

            const beforeToDo    = toDos.slice(0, targetIdx);
            const afterToDo     = toDos.slice(targetIdx + 1);
            const newToDo       = {text, date, category: newCat as ToDoCatEnum | string};
            
            const newToDos = [...beforeToDo, newToDo, ...afterToDo];

            return newToDos;
        });
    }

    const deleteToDo = async (date: IToDo['date']) => {

        const confirm = await Swal.fire({
            title: "Are you sure you want to delete this to-do?",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            theme: selectTheme,
        });

        if (confirm.isConfirmed) {

            setToDos(toDos => toDos.filter(toDo => toDo.date !== date));
            if (!isDelToDo) setIsDelToDo(true);
        }
    }

    const handleEditComplete = () => {
        
        setToDos((toDos) => {

            const targetIdx = toDos.findIndex(toDo => toDo.date === date);

            const beforeToDo    = toDos.slice(0, targetIdx);
            const afterToDo     = toDos.slice(targetIdx + 1);
            const newToDo       = {text: editedTitle, date, category};
            
            const newToDos = [...beforeToDo, newToDo, ...afterToDo];

            return newToDos;
        });

        setIsEditing(false);
    };

    const timeSTP = setTimestamp(date);
    
    return (
        <Card>
            {isEditing ? (
                <>
                    <EditInput
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="edit-input"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditComplete(); // 원하는 동작
                        }}
                    />
                    <ButtonGroup>
                        <ActionButton onClick={() => handleEditComplete()}>
                            ✅ Done
                        </ActionButton>
                    </ButtonGroup>
                    <DisabledOverlay>Editing Mode</DisabledOverlay>
                </>
            ) : (
                <>            
                    <Title>{text}</Title>
                    <Time>{timeSTP}</Time>
                    <StatusGroup>
                        {
                            Object.values(ToDoCatEnum)
                            .filter(val => typeof val === "number")
                            .map(val => (
                                category !== val && (
                                    <StatusButton 
                                        key={val} 
                                        value={val} 
                                        onClick={() => setCat(val)}
                                    >
                                        {ToDoCatEnumLabel[val]}
                                    </StatusButton>
                                )
                            ))
                        }
                        {
                            customCat.map((cat, idx) => (
                                category !== cat && (
                                    <StatusButton
                                        key={idx}
                                        value={cat}
                                        onClick={() => setCat(cat)}
                                    >
                                        {cat}
                                    </StatusButton>
                                )
                            ))
                        }
                    </StatusGroup>
                    <ButtonGroup>
                        <ActionButton onClick={() => setIsEditing(true)}>✏️ Edit</ActionButton>
                        <ActionButton onClick={() => deleteToDo(date)}>🗑️ Delete</ActionButton>
                    </ButtonGroup>
                </>
            )}
        </Card>
    );
}

export default ToDo;