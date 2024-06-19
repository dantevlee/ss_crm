import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  Button,
  MenuItem,
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useRef } from "react";
import ClientPage from "./ClientPage";
import ArchivePage from "./ArchivePage";
import LeadsPage from "./LeadsPage";
import Dashboard from "./Dashboard";

const MainLayout = ({ setIsLoggedIn }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("SessionID");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navigateToPage = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <Box bg="black" w="3000%" p={4}>
        <Button ref={btnRef} onClick={onOpen} color="teal">
          <HamburgerIcon color="teal" />
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="teal"
            position="fixed"
            right="1rem"
          >
            Profile
          </MenuButton>
          <MenuList>
            <MenuGroup>
              <MenuItem color="black">My Account</MenuItem>
              <MenuItem color="black" onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>"Company Name"</DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              <Link onClick={() => navigateToPage("/dashboard")}>Home</Link>
              <Link onClick={() => navigateToPage("/clients")}>Clients</Link>
              <Link onClick={() => navigateToPage("/leads")}>Leads</Link>
              <Link onClick={() => navigateToPage("/archives")}>Archives</Link>
            </Stack>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/clients" element={<ClientPage />} />
        <Route path='/archives' element={<ArchivePage/>}/>
        <Route path='/leads' element={<LeadsPage/>} />
      </Routes>
      <Outlet />
    </>
  );
};

export default MainLayout;
