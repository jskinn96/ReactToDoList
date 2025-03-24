import { useRecoilState } from "recoil"
import { ThemeAtom } from "../../recoil";
import styled from "styled-components";
import { Moon, Sun } from "lucide-react";

const SwitchWrap = styled.label`
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
    input {
        display: none;
    }
    input:checked + .HTSwitchSlider::before {
        transform: translateX(22px);
    }
`;

const SwitchSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #A0AEC0;
    border-radius: 34px;
    transition: .3s;
    &::before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 5px;
        bottom: 3px;
        background-color: ${props => props.theme.bgDarkColor};
        border-radius: 50%;
        transition: 0.4s;
    }
    .HTSIcon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
    }
    .HTSIcon.sun {
        left: 6px;
        color: ${props => props.theme.yellowColor};
    }
    .HTSIcon.moon {
        right: 6px;
        color: ${props => props.theme.accentColor};
    }
`;


const ThemeToggle = () => {

    const [themeMode, setThemeMode] = useRecoilState(ThemeAtom);

    return (
        <SwitchWrap
            className="ThemeToggle"
        >
            <input
            type="checkbox"
            checked={themeMode === "dark"}
            onChange={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
            />
            <SwitchSlider
            className="HTSwitchSlider">
                {
                    themeMode === "dark" 
                    ? <Moon className="HTSIcon moon" /> 
                    : <Sun className="HTSIcon sun" />
                }
            </SwitchSlider>
        </SwitchWrap>
    );
}

export default ThemeToggle;