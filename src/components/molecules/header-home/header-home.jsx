import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserPhoto from "../../atoms/user-photo/user-photo";
import {
  HeaderContainer,
  LogoX,
  ContainerPhoto,
  ContainerLogo,
  ContainerLogout,
} from "./styles";
import Button from "../../atoms/button/button";
import { AuthContext } from "../../../contexts/auth";

function HeaderHome({ buttonText }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleButtonClick = () => {
    if (buttonText === "Sair") {
      handleLogout();
    } else {
      navigate(-1);
    }
  };

  return (
    <HeaderContainer>
      <ContainerPhoto>
        <UserPhoto />
      </ContainerPhoto>

      <ContainerLogo>
        <LogoX />
      </ContainerLogo>

      <ContainerLogout>
        <Button
          $border="1px solid white"
          $backgroundColor="black"
          color="#00acee"
          $text={buttonText}
          onClick={handleButtonClick}
        />
      </ContainerLogout>
    </HeaderContainer>
  );
}

export default HeaderHome;
