/**
 * g 리액트 훅 폼 
 * g 폼 데이터 관리
*/
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { ToDoAtom, ToDoCatAtom, ToDoCatEnum, ToDoCatEnumLabel, CustomCatAtom, IsDelToDoAtom } from "../Recoil/atoms/toDoAtom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PlusCircle, Trash2 } from 'lucide-react';
import { ThemeAtom } from "../../recoil";
import Swal from "sweetalert2";

interface IForm {
    toDo: string;
}

const SelectWrap = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    .addCatBtn {
        cursor: pointer;
        width: 32px;
        height: 32px;
        &:hover {
            color: ${({theme}) => theme.accentColor};
        }
    }
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
    position: relative; 

    &:hover {
        opacity: 0.85;
        color: ${({theme}) => theme.accentColor};
    }
    
    > span {
        display: ${({$active}) => $active ? 'block' : 'none'};
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

const DeleteCatIcon = styled.span`
    display: none;
    transition: opacity 0.2s ease;
    position: absolute;
    right: 7px;
    top: 2px;

    &:hover {
        color: #ff6666;
    } 
`;


const CreateToDo = () => {

    /**
     * g reset(); 전체 리셋
     * g reset({toDo : ""}); 특정 필드만 리셋
    */
    const {handleSubmit, setValue, register}    = useForm<IForm>();
    const [toDos, setToDos]                     = useRecoilState(ToDoAtom);
    const [toDoCat, setToDoCat]                 = useRecoilState(ToDoCatAtom);
    const [customCat, setCustomCat]             = useRecoilState(CustomCatAtom);
    const selectTheme                           = useRecoilValue(ThemeAtom);
    const isDelToDo                             = useRecoilValue(IsDelToDoAtom);
    const [isDelCat, setIsDelCat]               = useState(false);

    const toDoSubmit = ({ toDo }: IForm) => {

        setToDos(arr => [...arr, {
            text: toDo,
            date: Date.now(),
            category: toDoCat,
        }]);

        setValue("toDo", "");
    }

    const addCustomCat= async () => {

        const newCatPrompt = await Swal.fire({
            title: "How should we call it?",
            input: "text",
            inputPlaceholder: "Give your new category a name",
            showCancelButton: true,
            confirmButtonText: "save",
            cancelButtonText: "cancel",
            theme: selectTheme,
        });

        const newCat = newCatPrompt.value;
        
        if (newCat) {
            
            if (customCat.includes(newCat)) {

                Swal.fire({
                    title: `"${newCat}" already exists.`,
                    text: "Please choose a different name.",
                    confirmButtonText: 'OK',
                    theme: selectTheme,
                 });

            } else setCustomCat(tmpCat => [...tmpCat, newCat]);
        }
    };

    const deleteCustomCat = async () => {

        const confirm = await Swal.fire({
            title: "Are you sure you want to delete this category?",
            text: "All tasks under this category will be deleted as well",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            theme: selectTheme,
        });

        if (confirm.isConfirmed) {

            setToDos(tmpToDos => tmpToDos.filter(val => val.category !== toDoCat));
            setCustomCat(tmpCats => tmpCats.filter(val => val !== toDoCat));
            setToDoCat(ToDoCatEnum.TO_DO);
            if (!isDelCat) setIsDelCat(true);
        }
    };

    useEffect(() => {

        if (
            toDos.length > 0
            || isDelToDo
        ) localStorage.setItem('toDosData', JSON.stringify(toDos));
        
    }, [toDos]);

    useEffect(() => {

        if (
            customCat.length > 0
            || isDelCat
        ) localStorage.setItem('customCatData', JSON.stringify(customCat));

    }, [customCat]);

    useEffect(() => {

        const storedCustomCat = localStorage.getItem('customCatData');

        if (storedCustomCat) {

            try {

                const parsedCustomCat = JSON.parse(storedCustomCat);
                setCustomCat(parsedCustomCat);

            } catch (error) {

                console.error('JSON Parse Error!');
            }
        }

    }, []);

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
                {
                    customCat.map((cat, idx) => (
                        <SelectLabel
                            key={idx}
                            $active={toDoCat === cat}
                        >
                            <HiddenRadio
                                type="radio"
                                name="category"
                                value={cat}
                                checked={toDoCat === cat}
                                onChange={() => setToDoCat(cat as string)}
                            />
                            {cat}
                            <DeleteCatIcon onClick={deleteCustomCat}>
                                <Trash2 size={16} />
                            </DeleteCatIcon>
                        </SelectLabel>
                    ))
                }
                <PlusCircle
                    className="addCatBtn"
                    onClick={addCustomCat}
                />
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