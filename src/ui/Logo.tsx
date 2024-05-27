import styled from "styled-components";
import useDarkMode from "../context/useDarkMode.hooks";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

export default function Logo() {
  const [isDarkMode] = useDarkMode();

  return (
    <StyledLogo>
      <Img src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"} alt="Logo" />
    </StyledLogo>
  );
}
