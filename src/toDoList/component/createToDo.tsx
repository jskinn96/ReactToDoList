/**
 * g 리액트 훅 폼 
 * g 폼 데이터 관리
*/
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { ToDoAtom, ToDoCatAtom, ToDoCatEnum, ToDoCatEnumLabel } from "../Recoil/atoms/toDoAtom";
import { useEffect } from "react";
import styled from "styled-components";
import { PlusCircle } from 'lucide-react';

interface IForm {
    toDo: string;
}

const SelectWrap = styled.div`
    display: flex;
    gap: 10px;
`;

const HiddenRadio = styled.input`
    display: none;
`;

const SelectLabel = styled.label<{ $active: boolean }>`
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    border: 2px solid ${({ $active }) => (
        $active 
        ? (props) => props.theme.bgDark
        : '#ccc'
    )};
    background-color: ${({ $active }) => (
        $active 
        ? (props) => props.theme.bgDark
        : 'transparent'
    )};
    color: ${
        ({ $active }) => (
            $active 
            ? (props) => props.theme.accentColor
            : (props) => props.theme.txtColor
        )
    };
    font-weight: 700;
    transition: 0.3s;
    &:hover {
      opacity: 0.85;
    }
`

const InputWrap = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const Input = styled.input`
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 2px solid #ccc;
    font-size: 1rem;
    &:focus {
        border-color: ${props => props.theme.accentColor};
        outline: none;
    }
`;

const AddButton = styled.button`
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background-color: ${(props) => props.theme.bgDark};
    color: ${(props) => props.theme.txtColor};
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background-color: ${(props) => props.theme.accentColor};
        color: ${(props) => props.theme.lightGray};
    }
`;

const CreateToDo = () => {

    /**
     * g reset(); 전체 리셋
     * g reset({toDo : ""}); 특정 필드만 리셋
    */
    const {handleSubmit, setValue, register}    = useForm<IForm>();
    const [toDos, setToDo]                      = useRecoilState(ToDoAtom);
    const [toDoCat, setToDoCat]                 = useRecoilState(ToDoCatAtom);

    const toDoSubmit = ({ toDo }: IForm) => {

        setToDo(arr => [...arr, {
            text: toDo,
            date: Date.now(),
            category: toDoCat,
        }]);

        setValue("toDo", "");
    }

    useEffect(() => {

        if (toDos.length > 0) localStorage.setItem('toDosData', JSON.stringify(toDos));
        
    }, [toDos]);

    return (
        <form 
            onSubmit={handleSubmit(toDoSubmit)}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
            }}
        >
            <SelectWrap>
                {
                    Object.values(ToDoCatEnum)
                    .filter(el => typeof el === "number")
                    .map((cat, idx) => {

                        return (
                            <SelectLabel
                                key={idx}
                                $active={toDoCat === cat}
                            >
                                <HiddenRadio
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={toDoCat === cat}
                                    onChange={() => setToDoCat(Number(cat) as ToDoCatEnum)}
                                />
                                {ToDoCatEnumLabel[cat]}
                            </SelectLabel>
                        );
                    })
                }
            </SelectWrap>
            <InputWrap>            
                <Input 
                    type="text" 
                    {
                        ...register("toDo", {
                                required: "u must write this",
                                validate: {
                                    noSW: (val) => val.includes("fck") ? "don't" : true
                                }
                            }
                        )
                    }
                    placeholder="What's on your mind today?"  
                />
                <AddButton>
                    <PlusCircle />
                </AddButton>
            </InputWrap>
        </form>
    );
}

export default CreateToDo;