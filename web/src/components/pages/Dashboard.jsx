import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  Button,
  MenuItem,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("SessionID");
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          colorScheme="teal"
          position="fixed"
          top="1rem"
          right="1rem"
        >
          Profile
        </MenuButton>
        <MenuList>
          <MenuGroup>
            <MenuItem>My Account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default Dashboard;
