import styled from "styled-components";
import ThemeToggle from "../../components/common/ThemeToggle";

const Wrap = styled.div`
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.bgHeader};
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
    z-index: 1;
    position: sticky;
    top: 0px;

    .ThemeToggle {
        position: absolute;
        right: 20px;
    }
`;

const H1 = styled.h1`
    font-weight: bold;
    font-size: 1.5rem;
    letter-spacing: 0.125rem;
    color: ${props => props.theme.accentColor};
`;

const Header = () => {

    return (
        <Wrap>
            <H1>TO DO LIST</H1>
            <ThemeToggle />
        </Wrap>
    );
}

export default Header;