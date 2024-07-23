import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  Button,
  MenuItem,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Link,
  useDisclosure,
  Stack,
  Icon,
  Flex,
  Box,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ClientPage from "./ClientPage";
import ArchivePage from "./ArchivePage";
import LeadsPage from "./LeadsPage";
import Dashboard from "./Dashboard";
import "../App.css";
import {
  FaCalendarAlt,
  FaFolderOpen,
  FaHome,
  FaHouseUser,
} from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { IoArchive, IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import SettingsPage from "./SettingsPage";
import CalendarPage from "./CalendarPage";
import UserFilesPage from "./UserFilesPage";
import axios from "axios";

const MainLayout = ({ setIsLoggedIn }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState([])
  const btnRef = useRef();
  const navigate = useNavigate();
  const token = Cookies.get("SessionID");

  const fetchCurrentUser = async () => {
    try{
      const response = await axios.get("http://localhost:3000/api/users/current", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.status === 200) {
        setCurrentUser(response.data);
      }
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);


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
      <Box
        bg="blue.500"
        height="75px"
        width="100%"
        position="fixed"
        top="0"
        zIndex="999"
      >
        <Flex align="center">
          <HamburgerIcon
            cursor="pointer"
            ref={btnRef}
            onClick={onOpen}
            color="white"
            boxSize={8}
            marginLeft={8}
            marginTop={6}
          />

          <Text
            as="a"
            href="/dashboard"
            cursor="pointer"
            _hover={{ textDecoration: "none"}}
            fontSize='x-large' marginStart='35px' 
            marginTop={5} 
            color="white"
          >
            {currentUser.company_name ? currentUser.company_name : ""}
          </Text>
        </Flex>
        <Flex align="center">
          <Menu>
            <MenuButton
              _hover={{ backgroundColor: "gray.300", shadow: "lg" }}
              backgroundColor="blue.500"
              marginTop="-40px"
              as={Button}
              position="absolute"
              right="1rem"
            >
              <Avatar size="lg" bg="blue.500" />
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem
                  color="black"
                  onClick={() => navigateToPage("/settings")}
                >
                  <Flex align="center">
                    <Icon boxSize={5} as={IoSettingsOutline} marginRight={2} />
                    <Text fontWeight="bold">Settings</Text>
                  </Flex>
                </MenuItem>
                <MenuItem color="black" onClick={handleLogout}>
                  <Flex align="center">
                    <Icon boxSize={5} as={MdLogout} marginRight={2} />
                    <Text fontWeight="bold">Logout</Text>
                  </Flex>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="gray.300">
          <DrawerHeader fontSize="x-large">{currentUser.company_name ? currentUser.company_name : ""}</DrawerHeader>
          <DrawerBody overflowX="hidden">
            <Stack spacing={4}>
              <Link onClick={() => navigateToPage("/dashboard")}>
                <Flex align="center">
                  <Icon boxSize={5} as={FaHouseUser} marginRight={2} />
                  <Text fontSize={20}>Home</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/clients")}>
                <Flex align="center">
                  <Icon boxSize={5} as={IoMdPerson} marginRight={2} />
                  <Text fontSize={20}>Clients</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/leads")}>
                <Flex align="center">
                  <Icon boxSize={5} as={BsFillPersonPlusFill} marginRight={2} />
                  <Text fontSize={20}>Leads</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/archives")}>
                <Flex align="center">
                  <Icon boxSize={5} as={IoArchive} marginRight={2} />
                  <Text fontSize={20}>Archives</Text>
                </Flex>
              </Link>
              <Divider borderColor="black" marginTop="20px" />
              <Flex align="center">
                <Text marginTop={2} fontSize={25}>
                  For You
                </Text>
              </Flex>
              <Link onClick={() => navigateToPage("/user-files")}>
                <Flex align="center">
                  <Icon boxSize={5} as={FaFolderOpen} marginRight={2} />
                  <Text fontSize={20}>My Files</Text>
                </Flex>
              </Link>
              <Link onClick={() => navigateToPage("/calendar")}>
                <Flex align="center">
                  <Icon boxSize={5} as={FaCalendarAlt} marginRight={2} />
                  <Text fontSize={20}>My Calerdar</Text>
                </Flex>
              </Link>
            </Stack>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/archives" element={<ArchivePage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/user-files" element={<UserFilesPage />} />
      </Routes>
      <Outlet />
    </>
  );
};

export default MainLayout;
